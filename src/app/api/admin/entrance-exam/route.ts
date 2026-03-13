import { NextResponse } from "next/server";
import TestSessionModel from "@/models/EntranceExam/TestSession.model";
import QuestionModel from "@/models/EntranceExam/Question.model";
import _db from "@/utils/db";
import { authMiddleware } from "@/middlewares/auth";

export const GET = authMiddleware(async function (request: Request) {
  try {
    await _db();
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const testId = searchParams.get("testId");
    const collegeId = searchParams.get("collegeId");

    if (!sessionId || !testId || !collegeId) {
      return NextResponse.json(
        { success: false, error: "Session ID, test ID, and college ID are required" },
        { status: 400 }
      );
    }

    // Get the test session and populate the questions
    const session = await TestSessionModel.findById(sessionId).populate({
      path: "questions.question",
      model: QuestionModel,
      select: "question options category explanation"
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Test session not found" },
        { status: 404 }
      );
    }

    const testDetails = {
      name: "Entrance Exam",
      college: "Entrance College",
      duration: session.duration,
      totalQuestions: session.questions.length,
      passingScore: 60,
      allowRetake: false,
      instructions: [
        "Read each question carefully.",
        "Navigate using the provided controls.",
        "Mark questions for review if unsure.",
        "Submit when ready.",
      ],
      rules: [
        "No external resources allowed.",
        "Stable internet connection required.",
        "Complete within the allotted time.",
      ],
    };

    // Format questions for the frontend
    const formattedQuestions = session.questions.map((q: any) => {
      const questionData = (q.question as any);
      return {
        _id: questionData?._id?.toString() || q.id,
        question: questionData?.question || '',
        options: questionData?.options || [],
        selectedAnswer: q.selectedAnswer,
        timeSpent: q.timeSpent
      };
    });

    return NextResponse.json({
      success: true,
      message: "Entrance Exam information fetched successfully",
      data: {
        session: {
          sessionId: session._id,
          startTime: session.startTime,
          duration: session.duration,
          status: session.status,
        },
        testDetails,
        questions: formattedQuestions,
      },
    });
  } catch (error: unknown) {
    console.error("Get test info error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Something went wrong" },
      { status: 500 }
    );
  }
}, ["entrance_student"]);
