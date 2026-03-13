import { connectDB } from "@/lib/db";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

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
        console.error("❌ Error fetching blog:", error);
        return NextResponse.json(
            { message: "Failed to fetch blog", error: error.message },
            { status: 500 }
        );
    }
}

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
        console.error("❌ Error updating blog:", error);
        return NextResponse.json(
            { message: "Failed to update blog", error: error.message },
            { status: 500 }
        );
    }
}

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
        console.error("❌ Error deleting blog:", error);
        return NextResponse.json(
            { message: "Failed to delete blog", error: error.message },
            { status: 500 }
        );
    }
}
