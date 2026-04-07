import { connectDB } from "@/lib/db";
import TestAttempt from "@/models/TestAttempt";
import PracticeTest from "@/models/PracticeTest";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  try {
    await connectDB();

    const attempts = await TestAttempt.find({ userId })
      .populate("testId", "name duration")
      .sort({ createdAt: -1 });

    return NextResponse.json(attempts);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch attempts", error: error.message },
      { status: 500 }
    );
  }
}
