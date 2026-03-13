import { NextResponse } from "next/server";
import { calculateScore } from "@/utils/EntranceExam/calculateTestScore";
import TestSession from "@/models/EntranceExam/TestSession.model";
import Question from "@/models/EntranceExam/Question.model";

import _db from "@/utils/db";

export async function POST(request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
    await _db();
    try {
        const { sessionId } = await params;
        const { answers } = await request.json();

        const session = await TestSession.findById(sessionId)
            .populate({
                path: "questions.question",
                model: Question,
                select: "question options explanation category"
            });

        if (!session) {
            return NextResponse.json(
                { error: "Test session not found" },
                { status: 404 }
            );
        }

        if (session.status === "completed") {
            return NextResponse.json(
                { error: "Test has already been submitted" },
                { status: 400 }
            );
        }

        const result = calculateScore(session.questions, answers as any);

        session.score = result.score;
        session.percentage = result.percentage;
        session.answers = answers;
        session.status = "completed";
        session.submittedAt = new Date();

        await session.save();

        return NextResponse.json({
            score: result.score,
            percentage: result.percentage,
            totalQuestions: result.totalQuestions,
            correctedAnswers: result.correctedAnswers
        });
    } catch (error: unknown) {
        console.error("Error submitting test:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to submit test" },
            { status: 500 }
        );
    }
}
