import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import "@/models/Category";
import "@/models/Subcategory";
import "@/models/Teachers";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

export const runtime = "nodejs";

export const dynamic = "force-dynamic";

// GET ALL COURSES
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "";
    const featured = searchParams.get("featured");

    const query: any = {};

    // 🔍 Search by course name
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
      ];
    }

    if (featured === "true") {
      query.featured = true;
    }

    // 📂 Filter by category
    if (category && category !== "all") {
      query.category = category;
    }

    // 🔃 Sorting
    let sortOption: any = { createdAt: -1 };

    if (sort === "price_asc") sortOption = { fee: 1 };
    if (sort === "price_desc") sortOption = { fee: -1 };
    if (sort === "date_asc") sortOption = { createdAt: 1 };
    if (sort === "date_desc") sortOption = { createdAt: -1 };

    const total = await Course.countDocuments(query);

    const courses = await Course.find(query)
      .populate("category")
      .populate("subcategory")
      .populate("instructor")
      .sort(sortOption)
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      courses,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });

  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch courses", error: error.message },
      { status: 500 }

    );
  }
}

const generateSlug = (text: string) => {
  if (!text) return "course";

  return text
    .toLowerCase()
    .trim()
    .split(" ")
    .slice(0, 5) // limit words
    .join(" ")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

const generateUniqueSlug = async (name: string, excludeId?: string) => {
  let baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;

  while (
    await Course.findOne({
      slug,
      _id: { $ne: excludeId }, // ignore current course (important for update)
    })
  ) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};
// CREATE/UPDATE COURSE
export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();

    // 1. Get or Generate ID
    let courseId = formData.get("_id") as string;
    if (!courseId) {
      courseId = new mongoose.Types.ObjectId().toString();
    }

    // ===== GET FILES =====
    const syllabusPdf = formData.get("syllabusPdf") as File | null;
    const thumbnail = formData.get("thumbnail") as File | null;
    const introVideo = formData.get("introVideo") as File | null;

    let syllabusPdfUrl = "";
    let thumbnailUrl = "";
    let introVideoUrl = "";

    // Helper function to save file locally with courseId structure
    const saveLocalFile = async (file: File, subfolder: string) => {
      try {
        // 🔥 FILE SIZE VALIDATION (ADD HERE)
        if (file.size > 100 * 1024 * 1024) {
          throw new Error(`${subfolder} file too large (Max 100MB allowed)`);
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const timestamp = Date.now();

        const sanitizedFileName = file.name
          .replace(/\s+/g, "_")
          .replace(/[^a-zA-Z0-9.\-_]/g, "");

        const filename = `${timestamp}-${sanitizedFileName}`;

        const relativePath = `/uploads/courses/${courseId}/${subfolder}/${filename}`;
        const fullPath = path.join("/var/www", relativePath);

        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        await fs.promises.writeFile(fullPath, buffer);

        return relativePath;
      } catch (err) {
        console.error(`Error saving ${subfolder}:`, err);
        throw err; // 🔥 important (so API knows error)
      }
    };

    // ===== UPLOAD PDF =====
    if (syllabusPdf && syllabusPdf.size > 0) {
      syllabusPdfUrl = await saveLocalFile(syllabusPdf, "pdfs");
    }

    // ===== UPLOAD IMAGE =====
    if (thumbnail && thumbnail.size > 0) {
      thumbnailUrl = await saveLocalFile(thumbnail, "images");
    }

    // ===== UPLOAD VIDEO =====
    if (introVideo && introVideo.size > 0) {
      // Validate video type
      const allowedVideoTypes = ["video/mp4", "video/x-matroska", "video/webm"];
      if (allowedVideoTypes.includes(introVideo.type)) {
        introVideoUrl = await saveLocalFile(introVideo, "intro");
      } else {
        console.warn("Invalid intro video type attempted");
      }
    }

    // ===== PARSE NORMAL FIELDS =====
    const bodyData: any = {};
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
      if (["syllabusPdf", "thumbnail", "introVideo", "_id"].includes(key)) continue;

      if (jsonFields.includes(key)) {
        try {
          if (!value || value === "undefined" || value === "null") {
            bodyData[key] = [];
          } else {
            bodyData[key] = JSON.parse(value as string);
          }
        } catch (err) {
          bodyData[key] = [];
        }
        continue;
      }

      if (objectIdFields.includes(key)) {
        if (!value || value === "") continue;
        bodyData[key] = value;
        continue;
      }

      bodyData[key] = value;
    }

    // ===== ATTACH URLS =====
    if (syllabusPdfUrl) bodyData.syllabusPdf = syllabusPdfUrl;
    if (thumbnailUrl) bodyData.thumbnail = thumbnailUrl;
    if (introVideoUrl) bodyData.introVideo = introVideoUrl;


    if (bodyData.name) {
      bodyData.slug = await generateUniqueSlug(bodyData.name, courseId);
    }

    // Use the pre-generated or existing id
    bodyData._id = courseId;

    // ===== SAVE TO DB (UPSERT) =====
    const course = await Course.findByIdAndUpdate(courseId, bodyData, {
      new: true,
      upsert: true,
      runValidators: true
    });

    return NextResponse.json(course, { status: 201 });

  } catch (error: any) {
    console.error("COURSE UPSERT ERROR:", error);
    return NextResponse.json(
      { message: "Course operation failed", error: error.message },
      { status: 500 }
    );
  }
}
