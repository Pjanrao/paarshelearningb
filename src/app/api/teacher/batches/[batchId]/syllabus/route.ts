import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Batch from "@/models/Batch";
import Course from "@/models/Course";
import Module from "@/models/Module";
import Topic from "@/models/Topic";
import LectureTracking from "@/models/LectureTracking";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ batchId: string }> }) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.id || (session.user as any).role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { batchId } = await params;
    const batch = await Batch.findById(batchId)
      .populate({ path: "courseId", model: Course, select: "name modules" })
      .lean();

    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    if (batch.assignedTeacher?.toString() !== (session!.user as any).id) {
      return NextResponse.json({ error: "Not authorized for this batch" }, { status: 403 });
    }

    const courseId = batch.courseId?._id;
    if (!courseId) {
      return NextResponse.json({ error: "Course not linked to batch" }, { status: 400 });
    }

    const modules = await Module.find({ courseId })
      .sort({ sequence: 1, createdAt: 1 })
      .lean();

    const moduleIds = modules.map((m) => m._id);
    const topics = await Topic.find({ moduleId: { $in: moduleIds } })
      .sort({ sequence: 1, createdAt: 1 })
      .lean();

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
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.id || (session.user as any).role !== "teacher") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { batchId } = await params;
    const { topicId, completed } = await req.json();

    if (!topicId) {
      return NextResponse.json({ error: "Topic ID is required" }, { status: 400 });
    }

    const batch = await Batch.findById(batchId);
    if (!batch) {
      return NextResponse.json({ error: "Batch not found" }, { status: 404 });
    }

    if (batch.assignedTeacher?.toString() !== (session!.user as any).id) {
      return NextResponse.json({ error: "Not authorized for this batch" }, { status: 403 });
    }

    if (!batch.syllabusProgress) {
      batch.syllabusProgress = [];
    }

    const topicIndex = batch.syllabusProgress.findIndex((p: any) => p.topicId?.toString() === topicId);

    if (topicIndex >= 0) {
      batch.syllabusProgress[topicIndex].completed = completed;
      if (completed) {
        batch.syllabusProgress[topicIndex].completedAt = new Date();
      }
    } else {
      batch.syllabusProgress.push({
        topicId,
        completed,
        completedAt: completed ? new Date() : undefined,
      });
    }

    await batch.save();

    return NextResponse.json({ success: true, syllabusProgress: batch.syllabusProgress }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating syllabus progress:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
