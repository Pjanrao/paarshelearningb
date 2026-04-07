import { connectDB } from "@/lib/db";
import Question from "@/models/Question";
import PracticeTest from "@/models/PracticeTest";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB();
    const question = await Question.findById(id);

    if (!question) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch question", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB();
    const data = await req.json();

    const question = await Question.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!question) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(question);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update question", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB();

    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      return NextResponse.json(
        { message: "Question not found" },
        { status: 404 }
      );
    }

    // Decrement totalQuestions in PracticeTest
    await PracticeTest.findByIdAndUpdate(question.testId, {
      $inc: { totalQuestions: -1 },
    });

    return NextResponse.json({ message: "Question deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete question", error: error.message },
      { status: 500 }
    );
  }
}
