import { connectDB } from "@/lib/db";
import TestAttempt from "@/models/TestAttempt";
import PracticeTest from "@/models/PracticeTest";
import Question from "@/models/Question";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    await connectDB();
    
    // 1. Get raw cookie from header
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
        cookieHeader.split(";").map((c: string) => {
            const [name, ...rest] = c.trim().split("=");
            return [name, rest.join("=")];
        })
    );

    const token = cookies["token"];
    let studentId: string | null = null;

    if (token) {
        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
            studentId = decoded.id;
        } catch (err) {
            console.error("DEBUG [Start Attempt]: JWT Verification Failed:", err);
        }
    }

    if (!studentId) {
      return NextResponse.json({ message: "Unauthorized: Invalid or missing custom token" }, { status: 401 });
    }

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
    return NextResponse.json(
      { message: "Failed to start attempt", error: error.message },
      { status: 500 }
    );
  }
}
