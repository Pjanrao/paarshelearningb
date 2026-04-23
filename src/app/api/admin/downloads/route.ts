import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Download from "@/models/Download";
import { getAuthUser } from "@/lib/api-auth";

export async function GET() {
    try {
        await connectDB();
        const downloads = await Download.find().sort({ createdAt: -1 });
        return NextResponse.json(downloads);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const user = await getAuthUser();

        if (!user || user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        const newDownload = await Download.create(data);

        return NextResponse.json(newDownload, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
