import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Batch from "@/models/Batch";
import Course from "@/models/Course";
import Topic from "@/models/Topic";
import LectureTracking from "@/models/LectureTracking";
import { getUserFromAuth } from "@/lib/api-auth";

export async function GET(req: Request) {
    try {
        await connectDB();
        const dbUser = await getUserFromAuth(req);

        if (!dbUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (dbUser.role !== "teacher") {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        const teacherId = dbUser._id;
        const batches = await Batch.find({ assignedTeacher: teacherId })
            .populate({
                path: "courseId",
                model: Course,
                select: "name thumbnail syllabus modules"
            })
            .populate("students", "name email avatar")
            .sort({ createdAt: -1 })
            .lean();

        const batchIds = batches.map((batch) => batch._id);
        const courseIds = batches.map((batch) => batch.courseId?._id).filter(Boolean);

        const topicCounts = await Topic.aggregate([
            { $match: { courseId: { $in: courseIds } } },
            { $group: { _id: "$courseId", count: { $sum: 1 } } },
        ]);

        const lectureCounts = await LectureTracking.aggregate([
            { $match: { batchId: { $in: batchIds } } },
            { $group: { _id: "$batchId", count: { $sum: 1 } } },
        ]);

        const topicCountMap = topicCounts.reduce((acc: any, item: any) => {
            acc[item._id.toString()] = item.count;
            return acc;
        }, {});

        const lectureCountMap = lectureCounts.reduce((acc: any, item: any) => {
            acc[item._id.toString()] = item.count;
            return acc;
        }, {});

        const enhancedBatches = batches.map((batch) => {
            const totalTopics = topicCountMap[batch.courseId?._id?.toString() || ""] || 0;
            const completedTopics = Array.isArray(batch.syllabusProgress)
                ? batch.syllabusProgress.filter((p: any) => p.completed).length
                : 0;
            const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
            return {
                ...batch,
                totalTopics,
                completedTopics,
                pendingTopics: Math.max(totalTopics - completedTopics, 0),
                progress,
                lecturesTaken: lectureCountMap[batch._id.toString()] || 0,
            };
        });

        return NextResponse.json({ batches: enhancedBatches }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching teacher batches:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
