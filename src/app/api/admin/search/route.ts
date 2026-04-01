import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Teacher from "@/models/Teachers";
import Course from "@/models/Course";
import Blog from "@/models/Blog";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");

        if (!query) {
            return NextResponse.json({ results: [] });
        }

        const searchRegex = new RegExp(query, "i");

        const [students, teachers, courses, blogs] = await Promise.all([
            User.find({ role: "student", $or: [{ name: searchRegex }, { email: searchRegex }] }).limit(5).lean(),
            Teacher.find({ $or: [{ name: searchRegex }, { email: searchRegex }, { course: searchRegex }] }).limit(5).lean(),
            Course.find({ $or: [{ title: searchRegex }, { category: searchRegex }] }).limit(5).lean(),
            Blog.find({ $or: [{ title: searchRegex }, { category: searchRegex }] }).limit(5).lean()
        ]);

        const results = [
            ...students.map((s: any) => ({ id: s._id, title: s.name, type: "Student", subtitle: s.email, link: `/admin/students` })),
            ...teachers.map((t: any) => ({ id: t._id, title: t.name, type: "Teacher", subtitle: t.course, link: `/admin/teachers` })),
            ...courses.map((c: any) => ({ id: c._id, title: c.title, type: "Course", subtitle: c.category, link: `/admin/courses` })),
            ...blogs.map((b: any) => ({ id: b._id, title: b.title, type: "Blog", subtitle: b.category, link: `/admin/blogs` }))
        ];

        return NextResponse.json({ results });

    } catch (error: any) {
        console.error("Search API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
