import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

// ✅ GET SINGLE BLOG
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const blog = await Blog.findById(id);

        if (!blog) {
            return NextResponse.json({ message: "Blog not found" }, { status: 404 });
        }

        return NextResponse.json({ blog }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: "Failed to fetch blog" }, { status: 500 });
    }
}

// ✅ UPDATE BLOG
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();

        const blog = await Blog.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!blog) {
            return NextResponse.json({ message: "Blog not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Blog updated successfully", blog },
            { status: 200 }
        );

    } catch (error: any) {
        return NextResponse.json({ message: "Failed to update blog" }, { status: 500 });
    }
}

// ✅ DELETE BLOG
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const blog = await Blog.findByIdAndDelete(id);

        if (!blog) {
            return NextResponse.json({ message: "Blog not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Blog deleted successfully" },
            { status: 200 }
        );

    } catch (error: any) {
        return NextResponse.json({ message: "Failed to delete blog" }, { status: 500 });
    }
}