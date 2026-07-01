import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ConsentForm from "@/models/ConsentForm";

// GET /api/admin/consent-forms/[id]
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

        const form = await ConsentForm.findById(id);

        if (!form) {
            return NextResponse.json({ success: false, error: "Consent form not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, form }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching consent form details:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
