import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Video from "@/models/Video";
import fs from "fs";
import path from "path";

// Helper function to upload video to Cloudinary (Old) / Local (New)
async function saveLocalVideo(file: File): Promise<{ url: string; publicId: string } | null> {
    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        const relativePath = `/uploads/courses/videos/${filename}`;
        const fullPath = path.join(process.cwd(), "public", relativePath);
        
        // Ensure directory exists
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        await fs.promises.writeFile(fullPath, buffer);

        return {
            url: relativePath,
            publicId: "", // Not needed for local
        };
    } catch (error) {
        console.error("Local upload error:", error);
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

        // Upload locally
        const uploadResult = await saveLocalVideo(file);

        if (!uploadResult) {
            return NextResponse.json(
                { error: "Failed to save video to local storage" },
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