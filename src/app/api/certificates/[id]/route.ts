import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Certificate from "@/models/Certificate";

// GET: Fetch single certificate
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const certificate = await Certificate.findById(id)
            .populate("studentId", "name email contact")
            .populate("batchId", "name")
            .populate("courseId", "name");

        if (!certificate) {
            return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
        }

        return NextResponse.json(certificate);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: Revoke/delete a certificate
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const deleted = await Certificate.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Certificate deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
