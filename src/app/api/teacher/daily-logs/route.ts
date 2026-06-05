import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Batch from "@/models/Batch";
import TeacherDailyLog from "@/models/TeacherDailyLog";
import { getUserFromAuth } from "@/lib/api-auth";

export async function GET(req: Request) {
  try {
    await connectDB();
    const dbUser = await getUserFromAuth(req);

    if (!dbUser || dbUser.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const batchId = url.searchParams.get("batchId");
    const page = Number(url.searchParams.get("page") || "1");
    const limit = Number(url.searchParams.get("limit") || "10");
    const skip = Math.max(0, (page - 1) * limit);

    const query: any = { teacherId: dbUser._id };
    if (batchId) query.batchId = batchId;

    const total = await TeacherDailyLog.countDocuments(query);
    const logs = await TeacherDailyLog.find(query).sort({ logDate: -1 }).skip(skip).limit(limit).lean();

    return NextResponse.json({ logs, total, page, limit }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch teacher daily logs error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const dbUser = await getUserFromAuth(req);

    if (!dbUser || dbUser.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { batchId, logDate, notes } = body;

    if (!batchId || !logDate || !notes) {
      return NextResponse.json(
        { error: "batchId, logDate, and notes are required" },
        { status: 400 }
      );
    }

    const parsedDate = new Date(logDate);
    if (Number.isNaN(parsedDate.getTime())) {
      return NextResponse.json({ error: "Invalid logDate" }, { status: 400 });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    if (batch.assignedTeacher?.toString() !== dbUser._id.toString()) {
      return NextResponse.json({ error: "Not authorized for this batch" }, { status: 403 });
    }

    const log = await TeacherDailyLog.create({
      teacherId: dbUser._id,
      batchId: batch._id,
      logDate: parsedDate,
      notes: String(notes).trim(),
    });

    return NextResponse.json({ success: true, log }, { status: 201 });
  } catch (error: any) {
    console.error("Teacher daily log creation error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const dbUser = await getUserFromAuth(req);

    if (!dbUser || dbUser.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { logId, logDate, notes } = body;
    if (!logId || (!logDate && !notes)) {
      return NextResponse.json({ error: "logId and at least one of logDate or notes is required" }, { status: 400 });
    }

    const log = await TeacherDailyLog.findById(logId);
    if (!log) return NextResponse.json({ error: "Log not found" }, { status: 404 });
    if (log.teacherId.toString() !== dbUser._id.toString()) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    if (logDate) {
      const pd = new Date(logDate);
      if (Number.isNaN(pd.getTime())) return NextResponse.json({ error: "Invalid logDate" }, { status: 400 });
      log.logDate = pd;
    }
    if (notes !== undefined) log.notes = String(notes).trim();

    await log.save();
    return NextResponse.json({ success: true, log }, { status: 200 });
  } catch (error: any) {
    console.error("Update daily log error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const dbUser = await getUserFromAuth(req);

    if (!dbUser || dbUser.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { logId } = body;
    if (!logId) return NextResponse.json({ error: "logId is required" }, { status: 400 });

    const log = await TeacherDailyLog.findById(logId);
    if (!log) return NextResponse.json({ error: "Log not found" }, { status: 404 });
    if (log.teacherId.toString() !== dbUser._id.toString()) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    await TeacherDailyLog.deleteOne({ _id: logId });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Delete daily log error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
