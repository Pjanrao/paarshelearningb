import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Video from "@/models/Video";
import cloudinary from "@/lib/cloudinary";

// ✅ UPDATE VIDEO
export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await context.params;
        const body = await req.json();

        // ✅ VALIDATION (important)
        if (!id) {
            return NextResponse.json(
                { error: "Video ID is required" },
                { status: 400 }
            );
        }

        // ✅ ONLY UPDATE REQUIRED FIELDS (safe update)
        const updatedVideo = await Video.findByIdAndUpdate(
            id,
            {
                ...(body.title && { title: body.title }),
                ...(body.description !== undefined && { description: body.description }),
                ...(body.topic && { topic: body.topic }),
                ...(body.subtopic && { subtopic: body.subtopic }),
                ...(body.course && { course: body.course }),
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedVideo) {
            return NextResponse.json(
                { error: "Video not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(updatedVideo);

    } catch (error: any) {
        console.error("VIDEO UPDATE ERROR:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update video" },
            { status: 500 }
        );
    }
}


// ✅ DELETE VIDEO
export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await context.params;

        if (!id) {
            return NextResponse.json(
                { error: "Video ID is required" },
                { status: 400 }
            );
        }

        const video = await Video.findById(id);

        if (!video) {
            return NextResponse.json(
                { error: "Video not found" },
                { status: 404 }
            );
        }

        // ✅ DELETE FROM CLOUDINARY (SAFE)
        if (video.publicId) {
            try {
                await cloudinary.uploader.destroy(video.publicId, {
                    resource_type: "video",
                });
            } catch (cloudErr) {
                console.error("Cloudinary delete error:", cloudErr);
            }
        }

        await Video.findByIdAndDelete(id);

        return NextResponse.json({
            message: "Video deleted successfully",
        });

    } catch (error: any) {
        console.error("VIDEO DELETE ERROR:", error);
        return NextResponse.json(
            { error: error.message || "Failed to delete video" },
            { status: 500 }
        );
    }
}