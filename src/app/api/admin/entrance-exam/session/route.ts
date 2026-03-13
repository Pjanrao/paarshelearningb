import { NextResponse } from "next/server";
import TestSessionModel from "@/models/EntranceExam/TestSession.model";
import StudentModel from "@/models/EntranceExam/Student.model";
import CollegeModel from "@/models/EntranceExam/College.model";
import TestModel from "@/models/EntranceExam/Test.model";
import QuestionModel from "@/models/EntranceExam/Question.model";
import _db from "@/utils/db";
import { authMiddleware } from "@/middlewares/auth";

export const POST = authMiddleware(async function (request: Request) {
    try {
        await _db();
        const payload = await request.json();
        console.log("SESSION_DEBUG: Handler reached");
        console.log("SESSION_DEBUG: Auth Header:", request.headers.get("authorization"));
        console.log("SESSION_DEBUG: Payload:", JSON.stringify(payload, null, 2));
        const { studentId, testId, collegeId, batchName } = payload;

        if (!studentId || !testId || !collegeId) {
            console.log("Session creation failed: Missing core identification fields", { studentId, testId, collegeId });
            return NextResponse.json(
                { success: false, error: "Student ID, test ID, and college ID are required" },
                { status: 400 }
            );
        }

        const college = await CollegeModel.findById(collegeId);
        if (!college) {
            return NextResponse.json(
                { success: false, error: "College not found" },
                { status: 400 }
            );
        }

        const test = await TestModel.findOne({ testId, college: collegeId });
        if (!test) {
            console.log("Session creation failed: Test not found for these IDs", { testId, collegeId });
            return NextResponse.json(
                { success: false, error: "Exam details not found for this college." },
                { status: 400 }
            );
        }

        // Use batchName from test if not provided in payload
        const effectiveBatchName = batchName || test.batchName;

        if (!effectiveBatchName) {
            console.log("Session creation failed: No batch name found");
            return NextResponse.json(
                { success: false, error: "Batch name is required to start the session." },
                { status: 400 }
            );
        }

        const currentDate = new Date();

        const formatDateTime = (date: Date | string) => {
            return new Date(date).toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short'
            });
        };

        if (test.hasExpiry) {
            if (!test.startTime || !test.endTime) {
                console.log("Session 403: Schedule not configured", { startTime: test.startTime, endTime: test.endTime });
                return NextResponse.json(
                    {
                        success: false,
                        error: "Test schedule is not properly configured. Please contact your administrator."
                    },
                    { status: 403 }
                );
            }

            const startTime = new Date(test.startTime);
            const endTime = new Date(test.endTime);

            if (currentDate < startTime) {
                console.log("Session 403: Test not started yet", { now: currentDate, startTime });
                return NextResponse.json(
                    {
                        success: false,
                        error: `This test is scheduled to begin on ${formatDateTime(startTime)}. Please return at the scheduled time.`
                    },
                    { status: 403 }
                );
            }

            if (currentDate > endTime) {
                console.log("Session 403: Test window closed", { now: currentDate, endTime });
                return NextResponse.json(
                    {
                        success: false,
                        error: `This test ended on ${formatDateTime(endTime)}. The test window has closed.`
                    },
                    { status: 403 }
                );
            }

            const minutesUntilEnd = Math.floor((endTime.getTime() - currentDate.getTime()) / (1000 * 60));
            const MIN_START_BUFFER = 5; // minimum minutes needed to allow starting
            if (minutesUntilEnd < MIN_START_BUFFER) {
                console.log("Session 403: Insufficient time remaining", { minutesUntilEnd, testDuration: test.testDuration });
                return NextResponse.json(
                    {
                        success: false,
                        error: `This test window closes in ${minutesUntilEnd} minute(s). There is not enough time to start the test now.`
                    },
                    { status: 403 }
                );
            }
        }

        const student = await StudentModel.findById(studentId);
        if (!student) {
            console.log("Session 403: Student not found", { studentId });
            return NextResponse.json(
                { success: false, error: "Student account not found." },
                { status: 403 }
            );
        }

        if (student.college.toString() !== collegeId) {
            console.log("Session 403: Student/College mismatch", {
                studentId,
                studentCollege: student.college.toString(),
                payloadCollegeId: collegeId
            });
            return NextResponse.json(
                { success: false, error: "Unauthorized: Student/College mismatch." },
                { status: 403 }
            );
        }

        const existingSession = await TestSessionModel.findOne({
            student: studentId,
            college: collegeId,
            testId,
        });

        if (existingSession) {
            if (existingSession.status === "completed" && !test.testSettings.allowRetake) {
                console.log("Session 403: Retake not allowed", { studentId, status: existingSession.status });
                return NextResponse.json(
                    {
                        success: false,
                        error: "You have already completed this test. Retakes are not allowed for this assessment.",
                    },
                    { status: 403 }
                );
            }

            if (existingSession.status === "pending" || existingSession.status === "active") {
                return NextResponse.json(
                    {
                        success: true,
                        message: "Existing test session found",
                        data: { sessionId: existingSession._id },
                    },
                    { status: 200 }
                );
            }
        }

        const questions = await QuestionModel.aggregate([
            { $match: { isActive: true } },
            { $sample: { size: test.testSettings.questionsPerTest } },
        ]);

        if (!questions || questions.length === 0) {
            return NextResponse.json(
                { success: false, error: "No active questions available" },
                { status: 400 }
            );
        }

        const session = new TestSessionModel({
            student: studentId,
            college: collegeId,
            testId,
            batchName: effectiveBatchName,
            test: test._id,
            duration: test.testDuration,
            status: "pending",
            passingPercentage: test.testSettings.passingScore,
            questions: questions.map((q: { _id: string }) => ({
                question: q._id,
                selectedAnswer: -1,
                isCorrect: false,
                timeSpent: 0,
            })),
            ipAddress: request.headers.get("x-forwarded-for") || "unknown",
            userAgent: request.headers.get("user-agent") || "unknown",
            browserInfo: { name: "unknown", version: "unknown", platform: "unknown" },
        });
        await session.save();

        return NextResponse.json({
            success: true,
            message: "Test session created successfully",
            data: {
                sessionId: session._id,
            },
        });
    } catch (error: unknown) {
        console.error("Create test session error:", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Something went wrong" },
            { status: 500 }
        );
    }
}, ["entrance_student"]);
