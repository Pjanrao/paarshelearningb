import { connectDB } from "@/lib/db";
import PracticeTest from "@/models/PracticeTest";
import "@/models/Course"; // Ensure Course is registered for population
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const courseId = searchParams.get("courseId") || "";
    const status = searchParams.get("status") || "";

    const query: any = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (courseId) {
      query.courseIds = courseId;
    }

    if (status) {
      query.status = status;
    }

    const total = await PracticeTest.countDocuments(query);
    const tests = await PracticeTest.find(query)
      .populate("courseIds", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      tests,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch tests", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();

    const test = await PracticeTest.create(data);

    return NextResponse.json(test, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to create test", error: error.message },
      { status: 500 }
    );
  }
}
