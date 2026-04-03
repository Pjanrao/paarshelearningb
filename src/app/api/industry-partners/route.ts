import { connectDB } from "@/lib/db";
import IndustryPartner from "@/models/IndustryPartner";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectDB();
        const partners = await IndustryPartner.find().sort({ displayOrder: 1, createdAt: -1 });
        return NextResponse.json({ success: true, data: partners });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { name, logoUrl } = body;

        if (!name || !name.trim()) {
            return NextResponse.json({ success: false, error: "Partner name is required." }, { status: 400 });
        }

        if (!logoUrl || !logoUrl.trim()) {
            return NextResponse.json({ success: false, error: "Logo URL is required." }, { status: 400 });
        }

        const partner = await IndustryPartner.create({
            name: name.trim(),
            logoUrl: logoUrl.trim(),
            websiteUrl: body.websiteUrl?.trim() || "",
            displayOrder: body.displayOrder || 0,
            isActive: body.isActive !== undefined ? body.isActive : true,
        });

        return NextResponse.json({ success: true, data: partner }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
