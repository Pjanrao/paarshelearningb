import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Batch from "@/models/Batch";
import Course from "@/models/Course";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        await connectDB();
        const session = await getServerSession(authOptions);

        if (!session || !(session.user as any)?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Only teachers should access this
        if ((session!.user as any).role !== "teacher") {
            return NextResponse.json({ error: "Access denied" }, { status: 403 });
        }

        // Fetch batches assigned to this teacher
        const batches = await Batch.find({ assignedTeacher: (session!.user as any).id })
            .populate({
                path: "courseId",
                model: Course,
                select: "name thumbnail syllabus"
            })
            .populate("students", "name email avatar")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ batches }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching teacher batches:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
