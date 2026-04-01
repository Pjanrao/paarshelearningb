import { NextResponse } from "next/server";
import TestSessionModel from "@/models/EntranceExam/TestSession.model";
import CollegeModel from "@/models/EntranceExam/College.model";
import TestModel from "@/models/EntranceExam/Test.model";
import QuestionModel from "@/models/EntranceExam/Question.model";
import _db from "@/utils/db";
import { authMiddleware } from "@/middlewares/auth";

export const POST = authMiddleware(async function (request: Request) {
    try {
        await _db();
        const { sessionId, testId, collegeId } = await request.json();

        if (!sessionId || !testId || !collegeId) {
            console.error("START_DEBUG: Missing fields", { sessionId, testId, collegeId });
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

        const session = await TestSessionModel.findById(sessionId).populate({
            path: "questions.question",
            model: QuestionModel,
            select: "question options category explanation"
        });

        if (!session || session.status !== "pending") {
            console.error("START_DEBUG: Invalid session status", { status: session?.status });
            return NextResponse.json(
                { success: false, error: "Invalid or already started test session" },
                { status: 400 }
            );
        }
        console.log("START_DEBUG: Session found and pending, starting now.");

        session.status = "active";
        session.startTime = new Date();
        await session.save();

        const questions = session.questions.map((q: any) => {
            const questionData = q.question as any;
            return {
                _id: questionData._id?.toString() || q.id,
                question: questionData.question,
                options: questionData.options,
                selectedAnswer: q.selectedAnswer,
                timeSpent: q.timeSpent,
            };
        });

        return NextResponse.json({
            success: true,
            message: "Test session started successfully",
            data: {
                session: {
                    sessionId: session._id.toString(),
                    startTime: session.startTime,
                    duration: session.duration,
                    status: session.status,
                },
                questions,
            },
        });
    } catch (error: unknown) {
        console.error("Start test session error:", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Something went wrong" },
            { status: 500 }
        );
    }
}, ["entrance_student"]);
