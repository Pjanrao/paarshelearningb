import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Video from "@/models/Video";
import cloudinary from "@/lib/cloudinary";

// Helper function to upload video to Cloudinary
async function uploadToCloudinary(file: File): Promise<{ url: string; publicId: string } | null> {
    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result: any = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "course-videos",
                    resource_type: "auto", // ✅ IMPORTANT: 'auto' or 'video' for video files
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return null;
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");

        const filter: any = {};
        if (courseId) {
            filter.course = courseId;
        }

        const videos = await Video.find(filter).sort({ createdAt: 1 }).lean();

        return NextResponse.json({ videos });

    } catch (error: any) {
        console.error("VIDEOS FETCH ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();

        const formData = await req.formData();

        const title = formData.get("title") as string;
        const description = (formData.get("description") as string) || "";
        const courseId = formData.get("courseId") as string;
        const topic = formData.get("topic") as string;
        const subtopic = formData.get("subtopic") as string;
        const file = formData.get("file") as File;

        if (!title || !courseId || !topic || !subtopic || !file) {
            return NextResponse.json(
                { error: "Missing required fields or file" },
                { status: 400 }
            );
        }

        // Upload to Cloudinary
        const uploadResult = await uploadToCloudinary(file);

        if (!uploadResult) {
            return NextResponse.json(
                { error: "Failed to upload video to Cloudinary" },
                { status: 500 }
            );
        }

        // Save to Database
        const video = await Video.create({
            title,
            description,
            course: courseId,
            topic,
            subtopic,
            videoUrl: uploadResult.url,
            publicId: uploadResult.publicId,
        });

        return NextResponse.json(video, { status: 201 });

    } catch (error: any) {
        console.error("VIDEO UPLOAD ERROR:", error);
        return NextResponse.json({ error: error.message || "Failed to upload video" }, { status: 500 });
    }
}