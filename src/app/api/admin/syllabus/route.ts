import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import Module from "@/models/Module";
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

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    if (!courseId) {
      return NextResponse.json({ error: "courseId is required" }, { status: 400 });
    }

    const course = await Course.findById(courseId).lean();
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const modules = await Module.find({ courseId: course._id })
      .sort({ sequence: 1, createdAt: 1 })
      .lean();

    const moduleIds = modules.map((m) => m._id);
    const topics = await Topic.find({ moduleId: { $in: moduleIds } })
      .sort({ sequence: 1, createdAt: 1 })
      .lean();

    return NextResponse.json({ course, modules, topics }, { status: 200 });
  } catch (error: any) {
    console.error("Admin syllabus fetch error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);

    if (!session || !(session.user as any)?.id || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { courseId, modules } = body;

    if (!courseId || !Array.isArray(modules)) {
      return NextResponse.json({ error: "courseId and modules are required" }, { status: 400 });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const savedModuleIds: any[] = [];

    for (const moduleData of modules) {
      const modulePayload: any = {
        courseId: course._id,
        title: moduleData.title,
        description: moduleData.description,
        sequence: moduleData.sequence || 1,
      };

      let moduleDoc;
      if (moduleData._id) {
        moduleDoc = await Module.findByIdAndUpdate(moduleData._id, modulePayload, {
          new: true,
          upsert: true,
          runValidators: true,
        });
      } else {
        moduleDoc = await Module.create(modulePayload);
      }

      const topicIds: any[] = [];

      if (Array.isArray(moduleData.topics)) {
        for (const topicData of moduleData.topics) {
          const topicPayload: any = {
            courseId: course._id,
            moduleId: moduleDoc._id,
            title: topicData.title,
            description: topicData.description,
            sequence: topicData.sequence || 1,
            estimatedDuration: topicData.estimatedDuration || "",
          };

          let topicDoc;
          if (topicData._id) {
            topicDoc = await Topic.findByIdAndUpdate(topicData._id, topicPayload, {
              new: true,
              upsert: true,
              runValidators: true,
            });
          } else {
            topicDoc = await Topic.create(topicPayload);
          }

          if (topicDoc) {
            topicIds.push(topicDoc._id);
          }
        }
      }

      moduleDoc.topics = topicIds;
      await moduleDoc.save();
      savedModuleIds.push(moduleDoc._id);
    }

    course.modules = savedModuleIds;
    await course.save();

    return NextResponse.json({ success: true, courseId: course._id, modules: savedModuleIds }, { status: 200 });
  } catch (error: any) {
    console.error("Admin syllabus save error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
