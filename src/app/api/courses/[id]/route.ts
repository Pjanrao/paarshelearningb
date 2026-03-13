import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
export const dynamic = "force-dynamic";

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
    } else {
      course = await Course.findOne({ slug: id })
        .populate("category")
        .populate("subcategory")
        .populate("instructor");
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

    let syllabusPdfUrl = "";
    let thumbnailUrl = "";
    let introVideoUrl = "";

    // =============================
    // PDF Upload
    // =============================
    if (syllabusPdf && syllabusPdf.size > 0) {
      const buffer = Buffer.from(await syllabusPdf.arrayBuffer());

      const result: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "raw", folder: "courses/pdfs" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      syllabusPdfUrl = result.secure_url;
    }

    // =============================
    // Thumbnail Upload
    // =============================
    if (thumbnail && thumbnail.size > 0) {
      const buffer = Buffer.from(await thumbnail.arrayBuffer());

      const result: any = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: "courses/images" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(buffer);
      });

      thumbnailUrl = result.secure_url;
    }

    // =============================
    // Video Upload
    // =============================
    if (introVideo && introVideo.size > 0) {
      const buffer = Buffer.from(await introVideo.arrayBuffer());

      const result: any = await cloudinary.uploader.upload_large(
        `data:${introVideo.type};base64,${buffer.toString("base64")}`,
        {
          resource_type: "video",
          folder: "courses/videos",
        }
      );

      introVideoUrl = result.secure_url;
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

    await Course.findByIdAndDelete(id);

    return NextResponse.json({
      message: "Deleted successfully",
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