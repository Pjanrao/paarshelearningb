import { connectDB } from "@/lib/db";
import IndustryPartner from "@/models/IndustryPartner";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();

        const partner = await IndustryPartner.findByIdAndUpdate(id, body, { new: true });

        if (!partner) {
            return NextResponse.json({ success: false, error: "Partner not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: partner });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

        const partner = await IndustryPartner.findByIdAndDelete(id);

        if (!partner) {
            return NextResponse.json({ success: false, error: "Partner not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
