import { connectDB } from "@/lib/db";
import TestAttempt from "@/models/TestAttempt";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { attemptId: string } }
) {
  try {
    await connectDB();
    const { attemptId } = params;

    const deletedAttempt = await TestAttempt.findByIdAndDelete(attemptId);

    if (!deletedAttempt) {
      return NextResponse.json(
        { message: "Attempt not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Attempt deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete attempt", error: error.message },
      { status: 500 }
    );
  }
}
