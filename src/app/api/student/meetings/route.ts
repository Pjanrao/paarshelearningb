import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import Meeting from "@/models/Meeting";
import "@/models/User";
import "@/models/Course";
import "@/models/Teachers";
import { verifyToken } from "@/lib/jwt";
import { cookies } from "next/headers";

// ✅ IMPORTANT: disable caching (FIX for updated meetings not showing)
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        await connectDB();

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        let decoded: any;
        try {
            decoded = verifyToken(token);
        } catch (err) {
            return NextResponse.json({ message: "Invalid token" }, { status: 401 });
        }

        const userId = decoded.id;

        // ✅ Get assigned courses
        const payments = await Payment.find({ studentId: userId })
            .select("courseId")
            .lean();

        const assignedCourseIds = payments
            .map((p: any) => p.courseId)
            .filter(Boolean);

        // ✅ If no courses → return empty (NO ERROR)
        if (assignedCourseIds.length === 0) {
            return NextResponse.json({
                meetings: [],
                hasCourses: false
            });
        }

        // ✅ Fetch meetings
        const meetings = await Meeting.find({
            course: { $in: assignedCourseIds },
            status: { $ne: "cancelled" }
        })
            .populate({
                path: "course",
                select: "name description thumbnail"
            })
            .populate({
                path: "teacher",
                select: "name profileImage"
            })
            .sort({ startTime: 1 })
            .lean();

        // ✅ Ensure zoomLink always exists (IMPORTANT FIX)
        const formattedMeetings = meetings.map((m: any) => ({
            ...m,
            zoomLink: m.zoomLink || m.meetingLink || "", // fallback support
        }));

        return NextResponse.json({
            meetings: formattedMeetings,
            hasCourses: true
        });

    } catch (error: any) {
        console.error("STUDENT MEETINGS FETCH ERROR:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}