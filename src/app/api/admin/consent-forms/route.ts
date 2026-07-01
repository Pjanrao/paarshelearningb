import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ConsentForm from "@/models/ConsentForm";
import { getUserFromAuth } from "@/lib/api-auth";

// GET /api/admin/consent-forms
export async function GET(req: Request) {
    try {
        await connectDB();
        const user = await getUserFromAuth(req);

        if (!user || user.role !== "admin") {
            return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 403 });
        }

        const forms = await ConsentForm.find().sort({ createdAt: -1 });

        return NextResponse.json({ success: true, forms }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching consent forms:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST /api/admin/consent-forms
export async function POST(req: Request) {
    try {
        await connectDB();
        const user = await getUserFromAuth(req);

        if (!user || user.role !== "admin") {
            return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 403 });
        }

        const { title, content } = await req.json();

        if (!title || !content) {
            return NextResponse.json({ success: false, error: "Title and content are required" }, { status: 400 });
        }

        const newForm = await ConsentForm.create({
            title,
            content,
            createdBy: user._id,
        });

        return NextResponse.json({ success: true, form: newForm }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating consent form:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
