import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Video from "@/models/Video";
import fs from "fs";
import path from "path";

// Helper function to save video locally with the correct structure
async function saveLocalVideo(file: File, courseId: string): Promise<{ url: string } | null> {
    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        
        // Generate unique filename: timestamp-originalName (sanitized)
        const timestamp = Date.now();
        const sanitizedFileName = file.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9.\-_]/g, "");
        const filename = `${timestamp}-${sanitizedFileName}`;
        
        // Target structure: uploads/courses/{courseId}/{videoFileName}
        // Placing it inside 'public' for static serving from Next.js
        const relativePath = `/uploads/courses/${courseId}/${filename}`;
        const fullPath = path.join(process.cwd(), "public", relativePath);
        
        // Ensure directory exists (uploads/courses/{courseId})
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        await fs.promises.writeFile(fullPath, buffer);

        return {
            url: relativePath,
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

        // 1. Validation
        if (!title || !courseId || !topic || !subtopic || !file) {
            return NextResponse.json(
                { error: "Missing required fields: title, courseId, topic, subtopic, or file" },
                { status: 400 }
            );
        }

        // 2. File type validation (mp4, mkv, webm)
        const allowedTypes = ["video/mp4", "video/x-matroska", "video/webm"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Only mp4, mkv, and webm are allowed." },
                { status: 400 }
            );
        }

        // 3. Upload locally
        const uploadResult = await saveLocalVideo(file, courseId);

        if (!uploadResult) {
            return NextResponse.json(
                { error: "Failed to save video to local storage" },
                { status: 500 }
            );
        }

        // 4. Save to Database
        const video = await Video.create({
            title,
            description,
            course: courseId,
            topic,
            subtopic,
            videoUrl: uploadResult.url,
            // publicId is no longer needed but kept for schema compatibility or can be empty
            publicId: "", 
        });

        return NextResponse.json({
            message: "Video uploaded successfully",
            video,
            url: uploadResult.url
        }, { status: 201 });

    } catch (error: any) {
        console.error("VIDEO UPLOAD ERROR:", error);
        return NextResponse.json({ error: error.message || "Failed to upload video" }, { status: 500 });
    }
}