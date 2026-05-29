import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Batch from "@/models/Batch";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: Promise<{ batchId: string }> }) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !(session.user as any)?.id || (session.user as any)?.role !== "teacher") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { batchId } = await params;
        const { topicId, completed } = await req.json();

        if (!topicId) {
            return NextResponse.json({ error: "Topic ID is required" }, { status: 400 });
        }

        const batch = await Batch.findById(batchId);
        if (!batch) {
            return NextResponse.json({ error: "Batch not found" }, { status: 404 });
        }

        // Verify the teacher is assigned to this batch
        if (batch.assignedTeacher?.toString() !== (session!.user as any).id) {
            return NextResponse.json({ error: "Not authorized for this batch" }, { status: 403 });
        }

        // Initialize if not present
        if (!batch.syllabusProgress) {
            batch.syllabusProgress = [];
        }

        // Find if topic already marked
        const topicIndex = batch.syllabusProgress.findIndex((p: any) => p.topicId === topicId);

        if (topicIndex >= 0) {
            batch.syllabusProgress[topicIndex].completed = completed;
            if (completed) {
                batch.syllabusProgress[topicIndex].completedAt = new Date();
            }
        } else {
            batch.syllabusProgress.push({
                topicId,
                completed,
                completedAt: completed ? new Date() : undefined
            });
        }

        await batch.save();

        return NextResponse.json({ success: true, syllabusProgress: batch.syllabusProgress }, { status: 200 });
    } catch (error: any) {
        console.error("Error updating syllabus progress:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
