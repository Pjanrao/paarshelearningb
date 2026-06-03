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

    if (!batch.syllabusProgress) {
      batch.syllabusProgress = [];
    }

    if (topic && completed) {
      const progressIndex = batch.syllabusProgress.findIndex(
        (p: any) => p.topicId?.toString() === topic._id.toString()
      );
      if (progressIndex >= 0) {
        batch.syllabusProgress[progressIndex].completed = true;
        batch.syllabusProgress[progressIndex].completedAt = new Date();
        batch.syllabusProgress[progressIndex].teacherId = teacherId;
        batch.syllabusProgress[progressIndex].updatedAt = new Date();
      } else {
        batch.syllabusProgress.push({
          topicId: topic._id,
          teacherId,
          completed: true,
          completedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    batch.lastLectureAt = new Date();
    batch.markModified("syllabusProgress");
    await batch.save();

    // compute total units (count subtopics as individual units)
    const topicDocs = await Topic.find({ courseId: course._id }).select("subtopics").lean();
    let totalUnits = 0;
    if (topicDocs && topicDocs.length > 0) {
      totalUnits = topicDocs.reduce((sum: number, t: any) => {
        const subs = t.subtopics || [];
        return sum + (subs.length > 0 ? subs.length : 1);
      }, 0);
    } else if (course && Array.isArray(course.syllabus) && course.syllabus.length > 0) {
      totalUnits = (course.syllabus || []).reduce((sum: number, s: any) => sum + (s.subtopics?.length > 0 ? s.subtopics.length : 1), 0);
    }

    // compute completed units from batch.syllabusProgress
    let completedUnits = 0;
    (batch.syllabusProgress || []).forEach((p: any) => {
      if (p.completedSubtopics && p.completedSubtopics.length > 0) {
        completedUnits += p.completedSubtopics.length;
      } else if (p.completed) {
        completedUnits += 1;
      }
    });

    const completionPercent = totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0;
    const overdueDays = Math.max(0, Math.floor((Date.now() - batch.lastLectureAt.getTime()) / (1000 * 60 * 60 * 24)));

    const entries = (batch.syllabusProgress || []).map((p: any) => ({
      topicId: p.topicId,
      completed: !!p.completed,
      completedAt: p.completedAt,
      completedSubtopics: p.completedSubtopics || [],
      updatedAt: p.updatedAt || p.createdAt || new Date(),
    }));

    await SyllabusProgress.findOneAndUpdate(
      { batchId: batch._id, teacherId },
      {
        batchId: batch._id,
        courseId: course._id,
        teacherId,
        totalTopics: totalUnits,
        completedTopics: completedUnits,
        completionPercent,
        lastUpdateAt: batch.lastLectureAt,
        overdueDays,
        entries,
      },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({ success: true, batchId: batch._id, completionPercent }, { status: 200 });
  } catch (error: any) {
    console.error("Teacher lecture post error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
