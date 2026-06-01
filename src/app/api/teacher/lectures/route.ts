import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Batch from "@/models/Batch";
import Course from "@/models/Course";
import Topic from "@/models/Topic";
import LectureTracking from "@/models/LectureTracking";
import SyllabusProgress from "@/models/SyllabusProgress";
import { getUserFromAuth } from "@/lib/api-auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    const dbUser = await getUserFromAuth(req);

    if (!dbUser || dbUser.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teacherId = dbUser._id;
    const body = await req.json();
    const { batchId, topicId, lectureTitle, summary, homework, recordingLink, durationHours, completed = true, customTopic } = body;

    if (!batchId || (!topicId && !customTopic)) {
      return NextResponse.json({ error: "batchId and topicId or customTopic are required" }, { status: 400 });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    if (batch.assignedTeacher?.toString() !== teacherId.toString()) {
      return NextResponse.json({ error: "Not authorized for this batch" }, { status: 403 });
    }

    const course = await Course.findById(batch.courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found for batch" }, { status: 404 });
    }

    let topic = null;
    if (topicId) {
      topic = await Topic.findById(topicId);
      if (!topic) {
        return NextResponse.json({ error: "Topic not found" }, { status: 404 });
      }
    }

    const lectureTitleText = lectureTitle || topic?.title || customTopic || "Lecture update";

    await LectureTracking.create({
      batchId: batch._id,
      courseId: course._id,
      moduleId: topic?.moduleId,
      topicId: topic?._id,
      teacherId,
      lectureTitle: lectureTitleText,
      summary,
      homework,
      recordingLink,
      durationHours: durationHours ? Number(durationHours) : 0,
      completed,
      lectureDate: new Date(),
    });

    if (topic && completed) {
const progressIndex = batch.syllabusProgress.findIndex(
  (p: any) => p.topicId?.toString() === topic._id.toString()
);      if (progressIndex >= 0) {
        batch.syllabusProgress[progressIndex].completed = true;
        batch.syllabusProgress[progressIndex].completedAt = new Date();
      } else {
        batch.syllabusProgress.push({
          topicId: topic._id,
          completed: true,
          completedAt: new Date(),
        });
      }
    }

    batch.lastLectureAt = new Date();
    await batch.save();

    const totalTopics = await Topic.countDocuments({ courseId: course._id });
const completedTopics = batch.syllabusProgress.filter(
  (item: any) => item.completed
).length;    const completionPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    const overdueDays = Math.max(0, Math.floor((Date.now() - batch.lastLectureAt.getTime()) / (1000 * 60 * 60 * 24)));

    await SyllabusProgress.findOneAndUpdate(
      { batchId: batch._id },
      {
        batchId: batch._id,
        courseId: course._id,
        teacherId,
        totalTopics,
        completedTopics,
        completionPercent,
        lastUpdateAt: batch.lastLectureAt,
        overdueDays,
      },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, batchId: batch._id, completionPercent }, { status: 200 });
  } catch (error: any) {
    console.error("Teacher lecture post error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
