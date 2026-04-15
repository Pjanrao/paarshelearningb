import { connectDB } from "@/lib/db";
import Workshop from "@/models/Workshop";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

// GET SINGLE WORKSHOP
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const workshop = await Workshop.findById(id);

    if (!workshop) {
      return NextResponse.json(
        { message: "Workshop not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(workshop);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch workshop", error: error.message },
      { status: 500 }
    );
  }
}

// UPDATE WORKSHOP
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const workshop = await Workshop.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!workshop) {
      return NextResponse.json(
        { message: "Workshop not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(workshop);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to update workshop", error: error.message },
      { status: 500 }
    );
  }
}

// DELETE WORKSHOP
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const workshop = await Workshop.findByIdAndDelete(id);

    if (!workshop) {
      return NextResponse.json(
        { message: "Workshop not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Workshop deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to delete workshop", error: error.message },
      { status: 500 }
    );
  }
}
