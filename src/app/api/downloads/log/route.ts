import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/api-auth";
import { logActivity } from "@/lib/logActivity";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const user = await getAuthUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { title, type } = await req.json();

        await logActivity(
            user.id,
            "download",
            `Downloaded: ${title}`,
            `Resource type: ${type || 'general'}`
        );

        return NextResponse.json({ message: "Activity logged successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
