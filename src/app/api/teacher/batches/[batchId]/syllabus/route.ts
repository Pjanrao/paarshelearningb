import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Batch from "@/models/Batch";
import Course from "@/models/Course";
import Module from "@/models/Module";
import Topic from "@/models/Topic";
import LectureTracking from "@/models/LectureTracking";
import { getUserFromAuth } from "@/lib/api-auth";

export async function GET(req: Request, { params }: { params: Promise<{ batchId: string }> }) {
  try {
    await connectDB();
    const dbUser = await getUserFromAuth(req);

    if (!dbUser || dbUser.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { batchId } = await params;
    const batch = await Batch.findById(batchId)
      .populate({ path: "courseId", model: Course, select: "name modules syllabus" })
      .lean();

    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    if (batch.assignedTeacher?.toString() !== dbUser._id.toString()) {
      return NextResponse.json({ error: "Not authorized for this batch" }, { status: 403 });
    }

    const courseId = batch.courseId?._id;
    if (!courseId) {
      return NextResponse.json({ error: "Course not linked to batch" }, { status: 400 });
    }

    let modules = await Module.find({ courseId })
      .sort({ sequence: 1, createdAt: 1 })
      .lean();

    const moduleIds = modules.map((m) => m._id);
    let topics = await Topic.find({ moduleId: { $in: moduleIds } })
      .sort({ sequence: 1, createdAt: 1 })
      .lean();

    // Fallback if the course syllabus is populated directly in the Course model (embedded array),
    // and no standalone Modules/Topics exist.
    if (modules.length === 0 && batch.courseId?.syllabus?.length > 0) {
      modules = [{ _id: "embedded_module", title: "Course Syllabus", sequence: 1 }];
      topics = batch.courseId.syllabus.map((s: any, idx: number) => ({
        _id: s._id,
        moduleId: "embedded_module",
        title: s.title,
        description: s.description,
        sequence: idx + 1,
        subtopics: s.subtopics || []
      }));
    }

    const progressMap = (batch.syllabusProgress || []).reduce((map: any, item: any) => {
      map[item.topicId?.toString()] = item;
      return map;
    }, {});

    const lectures = await LectureTracking.find({ batchId: batch._id })
      .sort({ lectureDate: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ batch, modules, topics, progressMap, lectures }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching batch syllabus:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ batchId: string }> }) {
  try {
    await connectDB();
    const dbUser = await getUserFromAuth(req);

    if (!dbUser || dbUser.role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { batchId } = await params;
    const payload = await req.json();
    const { topicId } = payload;

    if (!topicId) {
      return NextResponse.json({ error: "Topic ID is required" }, { status: 400 });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    if (batch.assignedTeacher?.toString() !== dbUser._id.toString()) {
      return NextResponse.json({ error: "Not authorized for this batch" }, { status: 403 });
    }

    if (!batch.syllabusProgress) {
      batch.syllabusProgress = [];
    }

    let topicIndex = batch.syllabusProgress.findIndex((p: any) => p.topicId?.toString() === topicId);

    if (topicIndex < 0) {
      batch.syllabusProgress.push({
        topicId,
        completed: false,
        completedSubtopics: []
      });
      topicIndex = batch.syllabusProgress.length - 1;
    }

    if (payload.hasOwnProperty("completed")) {
      batch.syllabusProgress[topicIndex].completed = payload.completed;
      batch.syllabusProgress[topicIndex].completedAt = payload.completed ? new Date() : undefined;
    }

    if (payload.hasOwnProperty("subtopicId")) {
      let arr = batch.syllabusProgress[topicIndex].completedSubtopics || [];
      if (payload.subtopicCompleted) {
        if (!arr.includes(payload.subtopicId)) arr.push(payload.subtopicId);
      } else {
        arr = arr.filter((id: string) => id !== payload.subtopicId);
      }
      batch.syllabusProgress[topicIndex].completedSubtopics = arr;
    }

    if (payload.hasOwnProperty("completedSubtopicsArr")) {
      batch.syllabusProgress[topicIndex].completedSubtopics = payload.completedSubtopicsArr;
    }

    await batch.save();

    return NextResponse.json({ success: true, syllabusProgress: batch.syllabusProgress }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating syllabus progress:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
