import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subcategory from "@/models/Subcategory";

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
        { error: "Subcategory ID is required" },
        { status: 400 }
      );
    }

    const deleted = await Subcategory.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Subcategory not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Subcategory deleted successfully",
    });

  } catch (error: any) {
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
        { error: "Subcategory ID is required" },
        { status: 400 }
      );
    }

    const updated = await Subcategory.findByIdAndUpdate(
      id,
      body,
      { new: true }
    ).populate("category", "name"); // ✅ keep your populate

    if (!updated) {
      return NextResponse.json(
        { error: "Subcategory not found" },
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