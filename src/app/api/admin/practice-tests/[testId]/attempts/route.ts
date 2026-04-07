import { connectDB } from "@/lib/db";
import TestAttempt from "@/models/TestAttempt";
import User from "@/models/User";
import Batch from "@/models/Batch";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ testId: string }> }
) {
  const { testId } = await params;
  try {
    await connectDB();

    // Find all attempts for this test, and populate the userId with name and email
    const attempts = await TestAttempt.find({ testId: testId })
      .populate({
        path: "userId",
        select: "name email contact status",
      })
      .sort({ createdAt: -1 })
      .lean();

    // Map through the attempts and fetch the batch for each student
    const populatedAttempts = await Promise.all(
      attempts.map(async (attempt: any) => {
        let batchName = "Not Assigned";
        
        // Find which batch the student is enrolled in
        if (attempt.userId && attempt.userId._id) {
          const studentBatch = await Batch.findOne({
            students: attempt.userId._id,
          }).select("name");

          if (studentBatch) {
            batchName = studentBatch.name;
          }
        }

        return {
          ...attempt,
          userId: {
            ...attempt.userId,
            batchName,
          },
        };
      })
    );

    return NextResponse.json(populatedAttempts);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch test logs", error: error.message },
      { status: 500 }
    );
  }
}
