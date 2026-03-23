import { connectDB } from "@/lib/db";
import Course from "@/models/Course";
import "@/models/Category";
import "@/models/Subcategory";
import "@/models/Teachers";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
export const runtime = "nodejs";


export const config = {
  api: {
    bodyParser: false,
  },
};

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

    const query: any = {};

    // 🔍 Search by course name
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
      ];
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
// CREATE COURSE
export async function POST(req: Request) {
  try {
    await connectDB();

    const formData = await req.formData();
    console.log("FORM DATA:", Object.fromEntries(formData.entries()));

    let data: any = {};

    // ✅ NEW: check if JSON data is sent
    const jsonData = formData.get("data");

    if (jsonData) {
      data = JSON.parse(jsonData as string);
    }

    const objectIdFields = ["category", "subcategory", "instructor"];

    if (jsonData) {
      try {
        data = JSON.parse(jsonData as string);
      } catch (err) {
        return NextResponse.json(
          { message: "Invalid JSON format in 'data' field" },
          { status: 400 }
        );
      }

      const course = await Course.create(data);

      return NextResponse.json(course, { status: 201 });
    } else {


      // ===== GET FILES =====
      const syllabusPdf = formData.get("syllabusPdf") as File | null;
      const thumbnail = formData.get("thumbnail") as File | null;
      const introVideo = formData.get("introVideo") as File | null;

      console.log("PDF:", syllabusPdf);
      console.log("Thumbnail:", thumbnail);
      console.log("Video:", introVideo);

      if (syllabusPdf)
        console.log("PDF size:", syllabusPdf.size);

      if (thumbnail)
        console.log("Image size:", thumbnail.size);

      if (introVideo)
        console.log("Video size:", introVideo.size);

      console.log("=======================");

      let syllabusPdfUrl = "";
      let thumbnailUrl = "";
      let introVideoUrl = "";

      // ===== UPLOAD PDF =====
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

      // ===== UPLOAD IMAGE =====
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

      // ===== UPLOAD VIDEO =====
      console.log("PDF exists:", !!syllabusPdf);
      console.log("Video exists:", !!introVideo);
      // ===== UPLOAD VIDEO (BETTER VERSION) =====
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

      // ===== PARSE NORMAL FIELDS SAFELY =====
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

        if (key === "data") continue;

        if (
          key === "syllabusPdf" ||
          key === "thumbnail" ||
          key === "introVideo"
        ) {
          continue;
        }

        if (jsonFields.includes(key)) {
          try {
            if (!value || value === "undefined" || value === "null") {
              data[key] = [];
            } else {
              data[key] = JSON.parse(value as string);
            }
          } catch (err) {
            console.error(`JSON parse failed for ${key}:`, value);
            data[key] = [];
          }

          continue;
        }

        // 🔥 Handle ObjectId fields safely
        if (objectIdFields.includes(key)) {
          if (!value || value === "") continue;
          data[key] = value;
          continue;
        }

        data[key] = value;
      }

      // ===== ATTACH CLOUDINARY URLS =====
      if (syllabusPdfUrl) data.syllabusPdf = syllabusPdfUrl;
      if (thumbnailUrl) data.thumbnail = thumbnailUrl;
      if (introVideoUrl) data.introVideo = introVideoUrl;

      // ===== SAVE TO DB =====
      const course = await Course.create(data);

      return NextResponse.json(course, { status: 201 });

    }
  }
  catch (error: any) {
    console.error("COURSE CREATE ERROR:", error);

    return NextResponse.json(
      {
        message: "Course creation failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}