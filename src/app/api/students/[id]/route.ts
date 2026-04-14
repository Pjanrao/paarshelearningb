import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

import TestAttempt from "@/models/TestAttempt";
import Batch from "@/models/Batch";

/* ================= DELETE ================= */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    // 1. Remove student from all batches
    await Batch.updateMany(
      { students: id },
      { $pull: { students: id } }
    );

    // 2. Delete all test attempts associated with the student (using userId as per model)
    await TestAttempt.deleteMany({ userId: id });

    // 3. Hard delete the user record
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Student and associated data deleted successfully",
    });

  } catch (error: any) {
    console.error("Error in student deletion:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/* ================= PUT (UPDATE) ================= */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    const updated = await User.findByIdAndUpdate(
      id,
      body,
      { new: true, select: "-password" }
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}