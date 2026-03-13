import { NextResponse } from "next/server";
import TestSessionModel from "@/models/EntranceExam/TestSession.model";
import _db from "@/utils/db";
import { authMiddleware } from "@/middlewares/auth";

export const PATCH = authMiddleware(
    async function (request: Request, { params }: { params: Promise<{ sessionId: string }> }) {
        try {
            await _db();
            const { sessionId } = await params;
            const { questionId, selectedAnswer } = await request.json();

            if (!questionId || selectedAnswer === undefined) {
                return NextResponse.json(
                    {
                        success: false,
                        error: "Question ID and selected answer are required",
                    },
                    { status: 400 },
                );
            }

            const session = await TestSessionModel.findById(sessionId);
            if (!session) {
                return NextResponse.json(
                    { success: false, error: "Session not found" },
                    { status: 404 },
                );
            }

            if (session.status !== "active") {
                return NextResponse.json(
                    { success: false, error: "Session is not active" },
                    { status: 400 },
                );
            }

            const questionIndex = session.questions.findIndex(
                (q: { question: { toString: () => string } }) => q.question.toString() === questionId,
            );
            if (questionIndex === -1) {
                session.questions.push({
                    question: questionId,
                    selectedAnswer,
                    isCorrect: false,
                    timeSpent: 0,
                });
            } else {
                session.questions[questionIndex].selectedAnswer = selectedAnswer;
            }

            await session.save();

            return NextResponse.json({
                success: true,
                message: "Answer saved successfully",
            });
        } catch (error: unknown) {
            console.error("Save answer error:", error);
            return NextResponse.json(
                { success: false, error: error instanceof Error ? error.message : "Something went wrong" },
                { status: 500 },
            );
        }
    },
    ["entrance_student"],
);
