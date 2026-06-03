import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Batch from "@/models/Batch";
import LectureTracking from "@/models/LectureTracking";
import User from "@/models/User";
import Topic from "@/models/Topic";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await connectDB();

    // const session = await getServerSession(authOptions);
    // if (!session || !(session.user as any)?.id || (session.user as any).role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const batches = await Batch.find()
      .populate("courseId", "name syllabus")
      .populate("assignedTeacher", "name _id")
      .populate({
        path: "syllabusProgress.teacherId",
        model: "User",
        select: "name",
        strictPopulate: false,
      })
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
      {
        $project: {
          courseId: 1,
          units: {
            $cond: {
              if: { $gt: [{ $size: { $ifNull: ["$subtopics", []] } }, 0] },
              then: { $size: "$subtopics" },
              else: 1,
            },
          },
        },
      },
      { $group: { _id: "$courseId", totalTopics: { $sum: "$units" } } },
    ]);

    const allTopics = await Topic.find({ courseId: { $in: courseIds } }).lean();
    const topicMap = allTopics.reduce((map: any, topic: any) => {
      map[topic._id.toString()] = topic;
      return map;
    }, {} as Record<string, any>);

    const topicCountMap = courseTopicCounts.reduce((acc: any, item: any) => {
      acc[item._id.toString()] = item.totalTopics;
      return acc;
    }, {} as Record<string, number>);

    const batchSummaries = batches.map((batch) => {
      const courseId = batch.courseId?._id?.toString();
      const courseSyllabusCount = (batch.courseId?.syllabus || []).reduce(
        (sum: number, syllabusItem: any) => sum + (syllabusItem.subtopics?.length > 0 ? syllabusItem.subtopics.length : 1),
        0
      );

      const topicCount = courseId ? topicCountMap[courseId] || courseSyllabusCount : courseSyllabusCount;
      const entries = batch.syllabusProgress || [];
      const completedTopics = entries.reduce((sum: number, entry: any) => {
        if (entry.completedSubtopics && entry.completedSubtopics.length > 0) {
          return sum + entry.completedSubtopics.length;
        }
        return sum + (entry.completed ? 1 : 0);
      }, 0);
      const progress = topicCount > 0 ? Math.round((completedTopics / topicCount) * 100) : 0;
      
      let lastUpdateDate = batch.updatedAt;
      entries.forEach((e: any) => {
        if (e.updatedAt && new Date(e.updatedAt) > new Date(lastUpdateDate)) {
           lastUpdateDate = e.updatedAt;
        }
      });
      
      const lastLectureAt = lectureStats.find((stat) => stat._id.toString() === batch._id.toString())?.lastLectureAt || batch.lastLectureAt || lastUpdateDate;
      const overdueDays = lastLectureAt
        ? Math.floor((Date.now() - new Date(lastLectureAt).getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      const topicDetails = entries.map((progress: any) => {
        let topicTitle = "Unknown Topic";
        let subtopicTitles: string[] = [];

        const topicDoc = topicMap[progress.topicId?.toString()];
        if (topicDoc) {
          topicTitle = topicDoc.title;
          subtopicTitles = (progress.completedSubtopics || []).map((subId: string) => {
            const sub = (topicDoc.subtopics || []).find((s: any) => s._id?.toString() === subId?.toString());
            return sub ? sub.title : subId;
          });
        } else {
          const embeddedTopic = (batch.courseId?.syllabus || []).find((item: any) => item._id?.toString() === progress.topicId?.toString());
          if (embeddedTopic) {
            topicTitle = embeddedTopic.title;
            subtopicTitles = (progress.completedSubtopics || []).map((subId: string) => {
              const sub = (embeddedTopic.subtopics || []).find((s: any) => s._id?.toString() === subId?.toString());
              return sub ? sub.title : subId;
            });
          }
        }

        return {
          topicId: progress.topicId,
          topicTitle,
          subtopicTitles,
          completed: !!progress.completed,
          completedAt: progress.completedAt,
          completedBy: batch.assignedTeacher?.name || "Unknown",
          completedSubtopics: progress.completedSubtopics || [],
          updatedAt: progress.updatedAt,
        };
      });

      return {
        id: batch._id,
        name: batch.name,
        course: batch.courseId?.name || "Unknown",
        courseId: batch.courseId?._id,
        teacher: batch.assignedTeacher?.name || "Unassigned",
        teacherId: batch.assignedTeacher?._id,
        progress,
        completedTopics,
        pendingTopics: Math.max(topicCount - completedTopics, 0),
        totalTopics: topicCount,
        lecturesTaken: lectureStats.find((stat) => stat._id.toString() === batch._id.toString())?.lecturesTaken || 0,
        duration: batch.duration || "TBD",
        startDate: batch.startDate ? new Date(batch.startDate).toLocaleDateString() : "TBD",
        endDate: batch.endDate ? new Date(batch.endDate).toLocaleDateString() : "TBD",
        status: batch.status || "Active",
        lastLectureAt: lastLectureAt ? new Date(lastLectureAt).toLocaleString() : "Never",
        overdueDays,
        topicDetails,
      };
    });

    const teacherProductivity = await Promise.all(
      Array.from(new Set(batchSummaries.map((batch) => batch.teacherId?.toString()).filter(Boolean))).map(async (teacherId) => {
        const teacherBatches = batchSummaries.filter((batch) => batch.teacherId?.toString() === teacherId);
        const teacher = await User.findById(teacherId).select("name").lean();

        const totalTopicsAcross = teacherBatches.reduce((sum, batch) => sum + (batch.totalTopics || 0), 0);
        const totalCompletedAcross = teacherBatches.reduce((sum, batch) => sum + (batch.completedTopics || 0), 0);
        const lectureCount = await LectureTracking.countDocuments({ teacherId });
        const totalHours = await LectureTracking.aggregate([
          { $match: { teacherId: new (require("mongoose")).Types.ObjectId(teacherId) } },
          { $group: { _id: null, total: { $sum: { $ifNull: ["$durationHours", 0] } } } },
        ]);

        const completionRate = totalTopicsAcross > 0 ? Math.round((totalCompletedAcross / totalTopicsAcross) * 100) : 0;

        return {
          teacherId,
          name: teacher?.name || "Unknown",
          activeBatches: teacherBatches.length,
          totalTopics: totalTopicsAcross,
          completedTopics: totalCompletedAcross,
          pendingTopics: Math.max(totalTopicsAcross - totalCompletedAcross, 0),
          completionRate,
          lecturesTaken: lectureCount,
          totalHours: totalHours[0]?.total || 0,
          batchDetails: teacherBatches.map((batch) => ({
            batchId: batch.id,
            batchName: batch.name,
            courseName: batch.course,
            progress: batch.progress,
          })),
        };
      })
    );

    const recentActivityData = await LectureTracking.find()
      .sort({ lectureDate: -1 })
      .limit(20)
      .populate("teacherId", "name")
      .populate("batchId", "name")
      .lean();

    const recentActivity = recentActivityData.map((activity) => ({
      teacher: activity.teacherId?.name || "Unknown",
      action: `${activity.completed ? "Completed" : "Updated"} '${activity.lectureTitle || "Lecture"}'`,
      batch: activity.batchId?.name || "Unknown",
      time: activity.lectureDate ? new Date(activity.lectureDate).toLocaleDateString() : "Unknown",
      duration: `${activity.durationHours || 0} hrs`,
    }));

    const courseSummaries = Array.from(new Set(batchSummaries.map((batch) => batch.courseId?.toString()).filter(Boolean))).map((courseId) => {
      const courseBatches = batchSummaries.filter((batch) => batch.courseId?.toString() === courseId);
      const courseName = courseBatches[0]?.course || "Unknown Course";
      const totalBatchCount = courseBatches.length;
      const activeInstructors = new Set(courseBatches.map((batch) => batch.teacherId?.toString()).filter(Boolean)).size;
      const totalTopicsAcross = courseBatches.reduce((sum, batch) => sum + (batch.totalTopics || 0), 0);
      const totalCompletedAcross = courseBatches.reduce((sum, batch) => sum + (batch.completedTopics || 0), 0);
      const averageCompletion = totalTopicsAcross > 0 ? Math.round((totalCompletedAcross / totalTopicsAcross) * 100) : 0;

      return {
        courseId,
        courseName,
        totalBatches: totalBatchCount,
        activeInstructors,
        averageCompletion,
      };
    });

    return NextResponse.json(
      {
        batchSummaries,
        teacherProductivity,
        courseSummaries,
        recentActivity,
        summary: {
          totalBatches: batchSummaries.length,
          totalTeachers: teacherProductivity.length,
          averageCompletion:
            batchSummaries.length > 0
              ? Math.round(batchSummaries.reduce((sum, batch) => sum + batch.progress, 0) / batchSummaries.length)
              : 0,
        },
      },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error: any) {
    console.error("Syllabus tracking admin error:", error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: { "Cache-Control": "no-store" } });
  }
}
