import { connectDB } from "@/lib/db";
import TestAttempt from "@/models/TestAttempt";
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
            console.error("DEBUG [Submit Attempt]: JWT Verification Failed:", err);
        }
    }

    if (!studentId) {
      return NextResponse.json({ message: "Unauthorized: Invalid or missing custom token" }, { status: 401 });
    }

    const { attemptId, answers } = await req.json();

    const attempt = await TestAttempt.findById(attemptId);
    if (!attempt) {
      return NextResponse.json({ message: "Attempt not found" }, { status: 404 });
    }

    // Verify ownership
    if (attempt.userId.toString() !== studentId) {
      return NextResponse.json({ message: "Unauthorized: You do not own this attempt" }, { status: 403 });
    }

    // Get all questions for this test to calculate score
    const questions = await Question.find({ testId: attempt.testId });
    const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

    let score = 0;
    const finalAnswers = answers.map((ans: any) => {
      const question = questionMap.get(ans.questionId);
      const isCorrect = question ? question.correctAnswer === ans.selectedOption : false;
      if (isCorrect) {
        score += (question?.marks || 1);
      }
      return {
        ...ans,
        isCorrect,
      };
    });

    attempt.answers = finalAnswers;
    attempt.score = score;
    attempt.submittedAt = new Date();
    attempt.status = "completed";

    await attempt.save();

    return NextResponse.json(attempt);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to submit attempt", error: error.message },
      { status: 500 }
    );
  }
}
