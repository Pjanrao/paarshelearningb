import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SyllabusDownload from "@/models/SyllabusDownload";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const startDate = searchParams.get("startDate");
        const endDate = searchParams.get("endDate");

        const query: any = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { courseName: { $regex: search, $options: "i" } },
            ];
        }

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const skip = (page - 1) * limit;

        const [downloads, total] = await Promise.all([
            SyllabusDownload.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            SyllabusDownload.countDocuments(query),
        ]);

        return NextResponse.json({
            downloads,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();

        const { name, email, phone, courseName, courseId, userId, source } = body;

        if (!name || !email || !courseName) {
            return NextResponse.json(
                { error: "Name, email, and course name are required" },
                { status: 400 }
            );
        }

        const newDownload = await SyllabusDownload.create({
            name,
            email,
            phone: phone || "",
            courseName,
            courseId: courseId || null,
            userId: userId || null,
            source: source || "Guest Form",
        });

        return NextResponse.json(
            { message: "Syllabus download logged", download: newDownload },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error logging syllabus download:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
