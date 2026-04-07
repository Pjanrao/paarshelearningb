import { connectDB } from "@/lib/db";
import PracticeTest from "@/models/PracticeTest";
import "@/models/Course";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await connectDB();
    const test = await PracticeTest.findById(id).populate(
      "courseIds",
      "name"
    );

    if (!test) {
      return NextResponse.json({ message: "Test not found" }, { status: 404 });
    }

    return NextResponse.json(test);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch test", error: error.message },
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

    const test = await PracticeTest.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!test) {
      return NextResponse.json({ message: "Test not found" }, { status: 404 });
    }

    return NextResponse.json(test);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update test", error: error.message },
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

    const test = await PracticeTest.findByIdAndDelete(id);

    if (!test) {
      return NextResponse.json({ message: "Test not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Test deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete test", error: error.message },
      { status: 500 }
    );
  }
}
