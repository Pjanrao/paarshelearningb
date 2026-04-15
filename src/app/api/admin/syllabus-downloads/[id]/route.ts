import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SyllabusDownload from "@/models/SyllabusDownload";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const deleted = await SyllabusDownload.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Download record deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
