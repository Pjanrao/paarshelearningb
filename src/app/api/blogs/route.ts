import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        const searchQuery = search
            ? {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { "author.name": { $regex: search, $options: "i" } },
                    { tags: { $in: [new RegExp(search, "i")] } },
                ],
            }
            : {};

        const total = await Blog.countDocuments(searchQuery);

        const blogs = await Blog.find(searchQuery)
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip((page - 1) * limit)
            .limit(limit);

        return NextResponse.json(
            {
                blogs,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error fetching blogs:", error);
        return NextResponse.json(
            { message: "Failed to fetch blogs" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();

        const blog = await Blog.create(body);

        return NextResponse.json(
            { message: "Blog created successfully", blog },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Error creating blog:", error);
        return NextResponse.json(
            { message: "Failed to create blog" },
            { status: 500 }
        );
    }
}
