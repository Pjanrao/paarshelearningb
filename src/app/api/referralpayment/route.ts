import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();
        const { userId } = body; // ✅ get userId from frontend

        // find user
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // ✅ only first time
        if (user.referredBy && !user.hasUsedReferral) {

            const referrer = await User.findOne({
                referralCode: user.referredBy,
            });

            if (referrer) {
                // reward both
                referrer.walletBalance += 50;
                user.walletBalance += 50;

                user.hasUsedReferral = true;

                await referrer.save();
                await user.save();
            }
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json(
            { error: "Error processing referral payment" },
            { status: 500 }
        );
    }
}