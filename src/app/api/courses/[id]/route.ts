import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import { coursesData } from "@/data/coursesData";

export const dynamic = "force-dynamic";

// =============================
// GET SINGLE COURSE
// =============================
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    await connectDB();

    let course;


    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    if (isObjectId) {
      course = await Course.findById(id);
    } else {
      course = await Course.findOne({ slug: id });
    }


    if (!course) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    // const course = await Course.findById(id)
    await course.populate("category");
    await course.populate("subcategory");
    await course.populate("instructor");


    if (!course) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(course);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error fetching course", error: error.message },
      { status: 500 }
    );
  }
}

// =============================
// UPDATE COURSE
// =============================
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const formData = await req.formData();

    const syllabusPdf = formData.get("syllabusPdf") as File | null;
    const thumbnail = formData.get("thumbnail") as File | null;
    const introVideo = formData.get("introVideo") as File | null;

    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    let syllabusPdfUrl = "";
    let thumbnailUrl = "";
    let introVideoUrl = "";

    // =============================
    // FILE SAVE FUNCTION
    // =============================
    const saveLocalFile = async (
      file: File,
      subfolder: string,
      oldRelativePath?: string
    ) => {
      try {
        // =============================
        // DELETE OLD FILE
        // =============================
        if (oldRelativePath && oldRelativePath.startsWith("/uploads")) {
          const oldFullPath = path.join("/var/www", oldRelativePath);

          try {
            if (fs.existsSync(oldFullPath)) {
              await fs.promises.unlink(oldFullPath);
            }
          } catch (err) {
            console.error("Error deleting old file:", err);
          }
        }

        // =============================
        // SAVE NEW FILE
        // =============================
        const buffer = Buffer.from(await file.arrayBuffer());

        // ✅ SAFE filename (NO REGEX ISSUE)
        const sanitizedFileName =
          Date.now() + "-" + file.name.replaceAll(" ", "_");

        const relativePath = `/uploads/courses/${id}/${subfolder}/${sanitizedFileName}`;
        const fullPath = path.join("/var/www", relativePath);

        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        await fs.promises.writeFile(fullPath, buffer);

        return relativePath;
      } catch (err) {
        console.error(`Error saving ${subfolder}:`, err);
        throw err;
      }
    };

    // =============================
    // HANDLE FILE UPLOADS
    // =============================
    if (syllabusPdf && syllabusPdf.size > 0) {
      syllabusPdfUrl = await saveLocalFile(
        syllabusPdf,
        "pdfs",
        existingCourse.syllabusPdf
      );
    }

    if (thumbnail && thumbnail.size > 0) {
      thumbnailUrl = await saveLocalFile(
        thumbnail,
        "images",
        existingCourse.thumbnail
      );
    }

    if (introVideo && introVideo.size > 0) {
      introVideoUrl = await saveLocalFile(
        introVideo,
        "intro",
        existingCourse.introVideo
      );
    }

    // =============================
    // PARSE FORM DATA
    // =============================
    const data: any = {};

    const jsonFields = [
      "languages",
      "popularTags",
      "syllabus",
      "benefits",
      "whyJoin",
      "testimonials",
    ];

    const objectIdFields = ["category", "subcategory", "instructor"];

    for (const [key, value] of formData.entries()) {
      if (["syllabusPdf", "thumbnail", "introVideo"].includes(key)) continue;

      if (jsonFields.includes(key)) {
        try {
          data[key] = JSON.parse(value as string);
        } catch {
          data[key] = [];
        }
        continue;
      }

      if (objectIdFields.includes(key)) {
        if (!value || value === "") continue;
        data[key] = value;
        continue;
      }

      data[key] = value;
    }

    // =============================
    // ATTACH FILE URLS
    // =============================
    if (syllabusPdfUrl) data.syllabusPdf = syllabusPdfUrl;
    if (thumbnailUrl) data.thumbnail = thumbnailUrl;
    if (introVideoUrl) data.introVideo = introVideoUrl;

    // =============================
    // UPDATE DB
    // =============================
    const updatedCourse = await Course.findByIdAndUpdate(id, data, {
      new: true,
    });

    return NextResponse.json(updatedCourse);
  } catch (error: any) {
    console.error("COURSE UPDATE ERROR:", error);

    return NextResponse.json(
      {
        message: error.message || "Error updating course",
      },
      { status: 500 }
    );
  }
}

// =============================
// DELETE COURSE
// =============================
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    // =============================
    // DELETE FILES
    // =============================
    const filesToDelete = [
      course.thumbnail,
      course.syllabusPdf,
      course.introVideo,
    ];

    for (const fileRelPath of filesToDelete) {
      if (fileRelPath && fileRelPath.startsWith("/uploads")) {
        const fullPath = path.join("/var/www", fileRelPath);

        try {
          if (fs.existsSync(fullPath)) {
            await fs.promises.unlink(fullPath);
          }
        } catch (err) {
          console.error("Error deleting file:", err);
        }
      }
    }

    await Course.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Deleted successfully and files removed",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || "Error deleting course",
      },
      { status: 500 }
    );
  }
}