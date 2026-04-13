import { connectDB } from "@/lib/db";
import TestAttempt from "@/models/TestAttempt";
import PracticeTest from "@/models/PracticeTest";
import Question from "@/models/Question";
import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/api-auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    
    const authUser = await getAuthUser();

    if (!authUser) {
      return NextResponse.json({ message: "Unauthorized: Invalid or missing token" }, { status: 401 });
    }

    const studentId = authUser.id;
    const { testId } = await req.json();

    const test = await PracticeTest.findById(testId);
    if (!test) {
      return NextResponse.json({ message: "Test not found" }, { status: 404 });
    }

    // Get all questions for this test to calculate total marks
    const questions = await Question.find({ testId });
    const totalMarks = questions.reduce((sum, q) => sum + (q.marks || 1), 0);

    const attempt = await TestAttempt.create({
      userId: studentId,
      testId,
      totalMarks,
      startedAt: new Date(),
      status: "completed", // We'll update this if needed, but "completed" is the default for a finished attempt
      answers: [], // Initialize empty answers
    });

    return NextResponse.json(attempt, { status: 201 });
  } catch (error: any) {
    console.error("START ATTEMPT ERROR:", error);
    return NextResponse.json(
      { message: "Failed to start attempt", error: error.message },
      { status: 500 }
    );
  }
}
