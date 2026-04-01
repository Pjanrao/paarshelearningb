import { NextResponse } from "next/server";
import Question from "@/models/EntranceExam/Question.model";
import _db from "@/utils/db";

export async function GET() {
    try {
        await _db();
        const questions = await Question.find({}).sort({ createdAt: -1 });
        return NextResponse.json(questions);
    } catch (error: unknown) {
        console.error("Error fetching questions:", error);
        return NextResponse.json(
            { message: "Error fetching questions", error: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
} 
