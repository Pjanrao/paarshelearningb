import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import Video from "@/models/Video";
import { getAuthUser } from "@/lib/api-auth";

export async function GET(req: Request) {
    try {
        await connectDB();

        const authUser = await getAuthUser();

        if (!authUser) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = authUser.id;
        
        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");

        // 1. Get all courses assigned to this student from Payment model
        const payments = await Payment.find({ studentId: userId }).select("courseId").lean();
        const assignedCourseIds = payments.map((p: any) => p.courseId?.toString()).filter(Boolean);

        if (assignedCourseIds.length === 0) {
            return NextResponse.json({ videos: [] });
        }

        // 2. Validate enrollment if a specific courseId is requested
        if (courseId) {
            if (!assignedCourseIds.includes(courseId)) {
                return NextResponse.json(
                    { error: "You are not enrolled in this course" },
                    { status: 403 }
                );
            }
        }

        // 3. Fetch videos 
        const filter: any = {};
        if (courseId) {
            filter.course = courseId;
        } else {
            filter.course = { $in: assignedCourseIds };
        }

        const videos = await Video.find(filter)
            .sort({ topic: 1, subtopic: 1, createdAt: 1 })
            .lean();

        return NextResponse.json({ videos });

    } catch (error: any) {
        console.error("STUDENT VIDEOS FETCH ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
