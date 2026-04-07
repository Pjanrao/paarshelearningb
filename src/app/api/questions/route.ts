import { connectDB } from "@/lib/db";
import Question from "@/models/Question";
import PracticeTest from "@/models/PracticeTest";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const testId = searchParams.get("testId");

    const query: any = {};
    if (testId) {
      query.testId = testId;
    }

    const questions = await Question.find(query).sort({ createdAt: 1 });

    return NextResponse.json(questions);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch questions", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    const question = await Question.create(data);

    // Update totalQuestions in PracticeTest
    await PracticeTest.findByIdAndUpdate(data.testId, {
      $inc: { totalQuestions: 1 },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to add question", error: error.message },
      { status: 500 }
    );
  }
}
