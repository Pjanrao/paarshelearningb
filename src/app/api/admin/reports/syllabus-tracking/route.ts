import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Batch from "@/models/Batch";
import Course from "@/models/Course";
import LectureTracking from "@/models/LectureTracking";
import User from "@/models/User";
import Topic from "@/models/Topic";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const batches = await Batch.find()
      .populate("courseId", "name")
      .populate("assignedTeacher", "name")
      .lean();

    const batchIds = batches.map((batch) => batch._id);
    const courseIds = batches.map((batch) => batch.courseId?._id).filter(Boolean);

    const lectureStats = await LectureTracking.aggregate([
      { $match: { batchId: { $in: batchIds } } },
      {
        $group: {
          _id: "$batchId",
          lecturesTaken: { $sum: 1 },
          lastLectureAt: { $max: "$lectureDate" },
        },
      },
    ]);

    const courseTopicCounts = await Topic.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      { $group: { _id: "$courseId", totalTopics: { $sum: 1 } } },
    ]);

    const topicCountMap = courseTopicCounts.reduce((acc: any, item: any) => {
      acc[item._id.toString()] = item.totalTopics;
      return acc;
    }, {});

    const batchSummaries = batches.map((batch) => {
      const topicCount = topicCountMap[batch.courseId?._id.toString()] || 0;
      const completedTopics = Array.isArray(batch.syllabusProgress)
        ? batch.syllabusProgress.filter((p: any) => p.completed).length
        : 0;
      const lectures = lectureStats.find((stat) => stat._id.toString() === batch._id.toString());
      const progress = topicCount > 0 ? Math.round((completedTopics / topicCount) * 100) : 0;
      const lastLectureAt = lectures?.lastLectureAt || batch.updatedAt;
      const overdueDays = lastLectureAt ? Math.floor((Date.now() - new Date(lastLectureAt).getTime()) / (1000 * 60 * 60 * 24)) : 0;

      return {
        id: batch._id,
        name: batch.name,
        course: batch.courseId?.name || "Unknown",
        teacher: batch.assignedTeacher?.name || "Unassigned",
        progress,
        completedTopics,
        pendingTopics: Math.max(topicCount - completedTopics, 0),
        lecturesTaken: lectures?.lecturesTaken || 0,
        duration: batch.duration || "TBD",
        startDate: batch.startDate ? new Date(batch.startDate).toLocaleDateString() : "TBD",
        status: batch.status || "Active",
        lastLectureAt,
        overdueDays,
      };
    });

    const teacherProductivityRaw = await LectureTracking.aggregate([
      { $match: { batchId: { $in: batchIds } } },
      {
        $group: {
          _id: "$teacherId",
          lecturesTaken: { $sum: 1 },
          totalHours: { $sum: { $ifNull: ["$durationHours", 0] } },
        },
      },
    ]);

    const teacherIds = teacherProductivityRaw.map((item) => item._id).filter(Boolean);
    const teachers = await User.find({ _id: { $in: teacherIds } }).select("name").lean();
    const teacherNameMap = teachers.reduce((acc: any, teacher: any) => {
      acc[teacher._id.toString()] = teacher.name;
      return acc;
    }, {});

    const lectureEntriesForTeachers = await LectureTracking.find({ teacherId: { $in: teacherIds } }).select("teacherId batchId").lean();
    const activeBatchesByTeacher = lectureEntriesForTeachers.reduce((acc: Record<string, Set<string>>, entry: any) => {
      const teacherId = entry.teacherId?.toString();
      const batchId = entry.batchId?.toString();
      if (!teacherId || !batchId) return acc;
      if (!acc[teacherId]) acc[teacherId] = new Set();
      acc[teacherId].add(batchId);
      return acc;
    }, {});

    const teacherProductivity = teacherProductivityRaw.map((item: any) => ({
      name: teacherNameMap[item._id.toString()] || "Unknown",
      activeBatches: activeBatchesByTeacher[item._id?.toString()]?.size || 0,
      totalHours: `${item.totalHours || 0} hrs`,
      completedSyllabusRate: "TBD",
    }));

    const recentActivityData = await LectureTracking.find()
      .sort({ lectureDate: -1 })
      .limit(10)
      .populate("teacherId", "name")
      .populate("batchId", "name")
      .lean();

    const recentActivity = recentActivityData.map((activity) => ({
      teacher: activity.teacherId?.name || "Unknown",
      action: `${activity.completed ? "Completed" : "Updated"} '${activity.lectureTitle || "Lecture"}'`,
      batch: activity.batchId?.name || "Unknown",
      time: activity.lectureDate ? new Date(activity.lectureDate).toLocaleString() : "Unknown",
      duration: `${activity.durationHours || 0} hrs`,
    }));

    return NextResponse.json({ batchSummaries, teacherProductivity, recentActivity }, { status: 200 });
  } catch (error: any) {
    console.error("Syllabus tracking admin error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
