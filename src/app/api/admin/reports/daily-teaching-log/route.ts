import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import TeacherDailyLog from "@/models/TeacherDailyLog";
import Batch from "@/models/Batch";
export async function GET(req: Request) {
  try {
    await connectDB();

    const logs = await TeacherDailyLog.find()
      .sort({ logDate: -1 })
      .populate("teacherId", "name")
      .populate({
        path: "batchId",
        select: "name courseId",
        populate: {
          path: "courseId",
          select: "name",
        },
      })
      .lean();

    const batchMap = new Map<string, any>();
    const courseMap = new Map<string, any>();
    const teacherMap = new Map<string, any>();

    logs.forEach((log: any) => {
      const batch = log.batchId;
      const course = batch?.courseId;
      const teacher = log.teacherId;
      const batchId = batch?._id?.toString() || "unknown-batch";
      const courseId = course?._id?.toString() || "unknown-course";
      const teacherId = teacher?._id?.toString() || "unknown-teacher";
      const logDate = log.logDate ? new Date(log.logDate).toLocaleDateString() : "Unknown";
      const note = String(log.notes || "");

      const batchEntry = batchMap.get(batchId) || {
        batchId,
        batchName: batch?.name || "Unknown Batch",
        courseName: course?.name || "Unknown Course",
        teacherName: teacher?.name || "Unknown",
        totalLogs: 0,
        lastLogDate: logDate,
        latestNote: note,
      };
      batchEntry.totalLogs += 1;
      if (new Date(log.logDate || 0).getTime() > new Date(batchEntry.lastLogDate || 0).getTime()) {
        batchEntry.lastLogDate = logDate;
        batchEntry.latestNote = note;
      }
      batchMap.set(batchId, batchEntry);

      const courseEntry = courseMap.get(courseId) || {
        courseId,
        courseName: course?.name || "Unknown Course",
        totalLogs: 0,
        batchSet: new Set<string>(),
        teacherSet: new Set<string>(),
        lastLogDate: logDate,
      };
      courseEntry.totalLogs += 1;
      courseEntry.batchSet.add(batchId);
      courseEntry.teacherSet.add(teacherId);
      if (new Date(log.logDate || 0).getTime() > new Date(courseEntry.lastLogDate || 0).getTime()) {
        courseEntry.lastLogDate = logDate;
      }
      courseMap.set(courseId, courseEntry);

      const teacherEntry = teacherMap.get(teacherId) || {
        teacherId,
        teacherName: teacher?.name || "Unknown",
        totalLogs: 0,
        batchSet: new Set<string>(),
        lastLogDate: logDate,
        lastBatchName: batch?.name || "Unknown Batch",
      };
      teacherEntry.totalLogs += 1;
      teacherEntry.batchSet.add(batchId);
      if (new Date(log.logDate || 0).getTime() > new Date(teacherEntry.lastLogDate || 0).getTime()) {
        teacherEntry.lastLogDate = logDate;
        teacherEntry.lastBatchName = batch?.name || teacherEntry.lastBatchName;
      }
      teacherMap.set(teacherId, teacherEntry);
      logs.forEach((log: any) => {
        console.log("Batch:", log.batchId);
      });
    });

    const batchWise = Array.from(batchMap.values()).sort((a, b) => new Date(b.lastLogDate).getTime() - new Date(a.lastLogDate).getTime());
    const courseWise = Array.from(courseMap.values()).map((item) => ({
      courseId: item.courseId,
      courseName: item.courseName,
      totalLogs: item.totalLogs,
      batchCount: item.batchSet.size,
      teacherCount: item.teacherSet.size,
      lastLogDate: item.lastLogDate,
    })).sort((a, b) => new Date(b.lastLogDate).getTime() - new Date(a.lastLogDate).getTime());
    const teacherWise = Array.from(teacherMap.values()).map((item) => ({
      teacherId: item.teacherId,
      teacherName: item.teacherName,
      totalLogs: item.totalLogs,
      batchCount: item.batchSet.size,
      lastLogDate: item.lastLogDate,
      lastBatchName: item.lastBatchName,
    })).sort((a, b) => new Date(b.lastLogDate).getTime() - new Date(a.lastLogDate).getTime());

    const recentLogs = logs.slice(0, 20).map((log: any) => ({
      logId: log._id?.toString(),
      teacher: log.teacherId?.name || "Unknown",
      batch: log.batchId?.name || "Unknown Batch",
      course: log.batchId?.courseId?.name || "Unknown Course",
      logDate: log.logDate ? new Date(log.logDate).toLocaleDateString() : "Unknown",
      notes: String(log.notes || ""),
    }));

    return NextResponse.json(
      {
        batchWise,
        courseWise,
        teacherWise,
        recentLogs,
        summary: {
          totalLogs: logs.length,
          totalBatches: batchMap.size,
          totalCourses: courseMap.size,
          totalTeachers: teacherMap.size,
        },
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error: any) {
    console.error("Daily teaching log admin error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
