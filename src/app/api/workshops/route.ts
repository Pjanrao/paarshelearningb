import { connectDB } from "@/lib/db";
import Workshop from "@/models/Workshop";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET ALL WORKSHOPS
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "active";

    const query: any = {};
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (status !== "all") {
      query.status = status;
    }

    const workshops = await Workshop.find(query).sort({ createdAt: -1 });

    return NextResponse.json(workshops);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch workshops", error: error.message },
      { status: 500 }
    );
  }
}

// CREATE OR UPDATE WORKSHOP
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    let id = body._id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      id = new mongoose.Types.ObjectId();
    }

    const workshop = await Workshop.findByIdAndUpdate(
      id,
      { ...body, _id: id },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json(workshop, { status: 201 });
  } catch (error: any) {
    console.error("WORKSHOP UPSERT ERROR:", error);
    return NextResponse.json(
      { message: "Workshop operation failed", error: error.message },
      { status: 500 }
    );
  }
}
