import { NextResponse } from "next/server";
import CollegeModel from "@/models/EntranceExam/College.model";
import TestModel from "@/models/EntranceExam/Test.model";
import TestSessionModel from "@/models/EntranceExam/TestSession.model";
import _db from "@/utils/db";
import { authMiddleware } from "@/middlewares/auth";

export const GET = authMiddleware(async function (request: Request) {
    try {
        await _db();
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get("sessionId");
        const testId = searchParams.get("testId");
        const collegeId = searchParams.get("collegeId");

        if (!sessionId || !testId || !collegeId) {
            return NextResponse.json(
                { success: false, error: "Session ID, test ID, and college ID are required" },
                { status: 400 }
            );
        }

        const college = await CollegeModel.findOne({ _id: collegeId, testIds: testId });
        if (!college) {
            return NextResponse.json(
                { success: false, error: "Invalid test link or college" },
                { status: 400 }
            );
        }

        const test = await TestModel.findOne({ testId, college: collegeId });
        if (!test) {
            return NextResponse.json(
                { success: false, error: "Invalid test" },
                { status: 400 }
            );
        }

        const session = await TestSessionModel.findById(sessionId)
            .populate("college", "name")
            .lean()
            .exec() as any;

        if (!session || !["pending", "active"].includes(session.status)) {
            return NextResponse.json(
                { success: false, error: "Invalid or inactive test session" },
                { status: 400 }
            );
        }

        const testDetails = {
            name: `Entrance Exam - ${college.name}`,
            college: college.name,
            duration: test.testDuration,
            totalQuestions: test.testSettings.questionsPerTest,
            passingScore: test.testSettings.passingScore,
            allowRetake: test.testSettings.allowRetake,
            instructions: [
                "Read each question carefully.",
                "Navigate using the provided controls.",
                "Mark questions for review if unsure.",
                "Submit when ready.",
            ],
            rules: [
                "No external resources allowed.",
                "Stable internet connection required.",
                "Complete within the allotted time.",
                "Single submission per question.",
            ],
        };

        return NextResponse.json({
            success: true,
            message: "Test instructions fetched successfully",
            data: {
                session: {
                    sessionId: session._id.toString(),
                    status: session.status,
                    duration: session.duration,
                },
                testDetails,
                hasExpiry: test.hasExpiry,
                startTime: test.startTime,
                endTime: test.endTime,
            },
        });
    } catch (error: unknown) {
        console.error("Get test instructions error:", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Something went wrong" },
            { status: 500 }
        );
    }
}, ["entrance_student"]);
