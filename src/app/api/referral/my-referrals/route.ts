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

        const referrals = await User.find({
            referredBy: user.referralCode,
        }).select("name email createdAt");

        const formatted = referrals.map((ref: any) => ({
            _id: ref._id,
            name: ref.name,
            status: "Completed",
            reward: 50,
        }));

        return NextResponse.json(formatted);

    } catch (error) {
        return NextResponse.json(
            { error: "Error fetching referrals" },
            { status: 500 }
        );
    }
}