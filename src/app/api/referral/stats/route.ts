import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getToken } from "next-auth/jwt";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        const token: any = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findById(token.id);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const totalReferrals = await User.countDocuments({
            referredBy: user.referralCode,
        });

        return NextResponse.json({
            totalReferrals,
            totalEarned: user.walletBalance || 0,
            pending: 0,
            referralCode: user.referralCode,
        });

    } catch (error) {
        return NextResponse.json({ error: "Error fetching stats" }, { status: 500 });
    }
}