import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Download from "@/models/Download";

export async function GET() {
    try {
        await connectDB();
        const downloads = await Download.find({ status: "active" }).sort({ createdAt: -1 });
        return NextResponse.json(downloads);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
