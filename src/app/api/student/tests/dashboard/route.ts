import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/api-auth";
import TestAttempt from "@/models/TestAttempt";

export async function GET() {
    try {
        await connectDB();
        const user = await getAuthUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const attempts = await TestAttempt.find({ userId: user.id })
            .sort({ createdAt: -1 })
            .limit(5);

        return NextResponse.json({
            recentAttempts: attempts,
            totalAttempts: await TestAttempt.countDocuments({ userId: user.id })
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
