import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Activity from "@/models/Activity";
import { getAuthUser } from "@/lib/api-auth";

export async function GET() {
    try {
        await connectDB();
        const user = await getAuthUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const activities = await Activity.find({ userId: user.id })
            .sort({ createdAt: -1 })
            .limit(10);

        return NextResponse.json(activities);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
