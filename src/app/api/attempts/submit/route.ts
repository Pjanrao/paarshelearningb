import { connectDB } from "@/lib/db";
import TestAttempt from "@/models/TestAttempt";
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
    console.error("SUBMIT ATTEMPT ERROR:", error);
    return NextResponse.json(
      { message: "Failed to submit attempt", error: error.message },
      { status: 500 }
    );
  }
}
