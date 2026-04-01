import { NextResponse } from "next/server";
import Question from "@/models/EntranceExam/Question.model";
import _db from "@/utils/db";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await _db();
        const { id } = await params;

        const deletedQuestion = await Question.findByIdAndDelete(id);

        if (!deletedQuestion) {
            return NextResponse.json(
                { message: "Question not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Question deleted successfully"
        });
    } catch (error: unknown) {
        console.error("Error deleting question:", error);
        return NextResponse.json(
            { message: "Error deleting question", error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await _db();
        const { id } = await params;
        const data = await req.json();

        if (!data.question || !data.options || !data.category || !data.correctAnswer) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const correctOptions = (data.options as { text: string; isCorrect: boolean }[]).filter(opt => opt.isCorrect);
        if (correctOptions.length !== 1) {
            return NextResponse.json(
                { message: "Exactly one option must be marked as correct" },
                { status: 400 }
            );
        }

        const correctOption = correctOptions[0];
        if (correctOption.text !== data.correctAnswer) {
            return NextResponse.json(
                { message: "correctAnswer must match the text of the correct option" },
                { status: 400 }
            );
        }

        const updatedQuestion = await Question.findByIdAndUpdate(
            id,
            {
                question: data.question,
                options: data.options,
                correctAnswer: data.correctAnswer,
                category: data.category,
                explanation: data.explanation,
                isActive: true
            },
            { new: true, runValidators: true }
        );

        if (!updatedQuestion) {
            return NextResponse.json(
                { message: "Question not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: updatedQuestion,
            message: "Question updated successfully"
        });
    } catch (error: unknown) {
        console.error("Error updating question:", error);
        return NextResponse.json(
            { message: "Error updating question", error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
} 
