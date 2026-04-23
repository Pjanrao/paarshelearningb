import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Download from "@/models/Download";
import { getAuthUser } from "@/lib/api-auth";

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const user = await getAuthUser();

        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const updatedDownload = await Download.findByIdAndUpdate(
            id,
            data,
            { new: true }
        );

        if (!updatedDownload) {
            return NextResponse.json({ error: "Download not found" }, { status: 404 });
        }

        return NextResponse.json(updatedDownload);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const user = await getAuthUser();

        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const deletedDownload = await Download.findByIdAndDelete(id);

        if (!deletedDownload) {
            return NextResponse.json({ error: "Download not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Download deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
