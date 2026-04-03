import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
export const dynamic = "force-dynamic";

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// GET SINGLE COURSE
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  const { id } = await params;
  console.log("UPDATE API HIT", id);
  try {
    await connectDB();

    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    let course;
    if (isObjectId) {
      course = await Course.findById(id)
        .populate("category")
        .populate("subcategory")
        .populate("instructor");
    }

    // ✅ 2. If not found → match slug from name
    if (!course) {
      const courses = await Course.find()
        .populate("category")
        .populate("subcategory")
        .populate("instructor");

      course = courses.find(
        (c: any) => generateSlug(c.name) === id
      );
    }

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

// UPDATE COURSE
// UPDATE COURSE
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const formData = await req.formData();

    const objectIdFields = ["category", "subcategory", "instructor"];

    const syllabusPdf = formData.get("syllabusPdf") as File | null;
    const thumbnail = formData.get("thumbnail") as File | null;
    const introVideo = formData.get("introVideo") as File | null;

    // Fetch existing course for file cleanup
    const existingCourse = await Course.findById(id);
    if (!existingCourse) {
      return NextResponse.json({ message: "Course not found" }, { status: 404 });
    }

    let syllabusPdfUrl = "";
    let thumbnailUrl = "";
    let introVideoUrl = "";

    // Helper function to save file locally and delete old one
    const saveLocalFile = async (file: File, folder: string, oldRelativePath?: string) => {
      // 1. Delete old file if exists
      if (oldRelativePath && oldRelativePath.startsWith("/uploads")) {
        const fullOldPath = path.join(process.cwd(), "public", oldRelativePath);
        try {
          if (fs.existsSync(fullOldPath)) {
            await fs.promises.unlink(fullOldPath);
          }
        } catch (err) {
          console.error(`Error deleting old file ${fullOldPath}:`, err);
        }
      }

      // 2. Save new file
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
      const relativePath = `/uploads/courses/${folder}/${filename}`;
      const fullPath = path.join(process.cwd(), "public", relativePath);
      
      // Ensure directory exists
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      await fs.promises.writeFile(fullPath, buffer);
      return relativePath;
    };

    // =============================
    // PDF Upload
    // =============================
    if (syllabusPdf && syllabusPdf.size > 0) {
      syllabusPdfUrl = await saveLocalFile(syllabusPdf, "pdfs", existingCourse.syllabusPdf);
    }

    // =============================
    // Thumbnail Upload
    // =============================
    if (thumbnail && thumbnail.size > 0) {
      thumbnailUrl = await saveLocalFile(thumbnail, "images", existingCourse.thumbnail);
    }

    // =============================
    // Video Upload
    // =============================
    if (introVideo && introVideo.size > 0) {
      introVideoUrl = await saveLocalFile(introVideo, "videos", existingCourse.introVideo);
    }

    // =============================
    // Parse Form Fields
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

    for (const [key, value] of formData.entries()) {

      if (
        key === "syllabusPdf" ||
        key === "thumbnail" ||
        key === "introVideo"
      ) {
        continue;
      }

      if (jsonFields.includes(key)) {
        data[key] = JSON.parse(value as string);
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
    // Attach Uploaded URLs
    // =============================
    if (syllabusPdfUrl) data.syllabusPdf = syllabusPdfUrl;
    if (thumbnailUrl) data.thumbnail = thumbnailUrl;
    if (introVideoUrl) data.introVideo = introVideoUrl;

    // =============================
    // Update Course
    // =============================
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      data,
      { new: true }
    );

    return NextResponse.json(updatedCourse);

  } catch (error: any) {
    console.error("COURSE UPDATE ERROR:", error);

    return NextResponse.json(
      {
        message: "Error updating course",
        error: error.message,
      },
      { status: 500 }
    );
  }
}


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

    // Delete associated files
    const filesToDelete = [course.thumbnail, course.syllabusPdf, course.introVideo];
    for (const fileRelPath of filesToDelete) {
      if (fileRelPath && fileRelPath.startsWith("/uploads")) {
        const fullPath = path.join(process.cwd(), "public", fileRelPath);
        try {
          if (fs.existsSync(fullPath)) {
            await fs.promises.unlink(fullPath);
          }
        } catch (err) {
          console.error(`Error deleting file ${fullPath}:`, err);
        }
      }
    }

    await Course.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Deleted successfully and files cleared",
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error deleting course",
        error: error.message,
      },
      { status: 500 }
    );
  }
}