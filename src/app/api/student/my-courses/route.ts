import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import "@/models/User";
import Course from "@/models/Course";
import "@/models/Teachers";
import { getAuthUser } from "@/lib/api-auth";

export async function GET(req: Request) {
    try {
        await connectDB();

        const authUser = await getAuthUser();

        if (!authUser) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const userId = authUser.id;

        const payments = await Payment.find({ studentId: userId })
            .populate({
                path: "courseId",
                model: Course,
                populate: {
                    path: "instructor",
                    select: "name",
                }
            })
            .sort({ createdAt: -1 })
            .lean();

        // Extract and format courses from payments
        const courses = payments.map((p: any) => {
            const course = p.courseId as any;
            if (!course) return null;

            return {
                id: course._id,
                title: course.name,
                instructor: course.instructor?.name || "Instructor",
                duration: course.duration ? `${course.duration} Months` : "N/A",
                lectures: "N/A",
                purchasedDate: new Date(p.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                }),
                thumbnail: course.thumbnail || "/images/course/default.jpeg",
                level: course.difficulty || "beginner",
                status: p.paidAmount >= p.totalAmount ? "Paid" : "Partial"
            };
        }).filter(Boolean);

        return NextResponse.json(courses);

    } catch (error: any) {
        console.error("MY COURSES FETCH ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}