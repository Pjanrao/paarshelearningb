import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Payment from "@/models/Payment";

export async function GET() {
    try {
        await connectDB();

        const users = await User.find({
            referralCode: { $exists: true },
        });

        let totalReferrers = 0;
        let completed = 0;
        let pending = 0;
        let totalAmount = 0;

        // 🔥 LOOP EACH REFERRER
        for (let user of users) {

            // ✅ get referred users
            const referrals = await User.find({
                referredBy: user.referralCode,
            });

            if (referrals.length === 0) continue;

            // ✅ count this user as referrer
            totalReferrers++;

            let userCompleted = 0;
            let userPending = 0;

            for (let ref of referrals) {

                const payments = await Payment.find({
                    studentId: ref._id,
                });

                const hasPayment = payments.length > 0;

                if (hasPayment) {
                    userCompleted++;
                } else {
                    userPending++;
                }
            }

            completed += userCompleted;
            pending += userPending;

            // ✅ total reward
            const userTotal = referrals.reduce(
                (sum, r) => sum + (r.referralReward || 0),
                0
            );

            totalAmount += userTotal;
        }

        return NextResponse.json({
            totalReferrers,
            totalReferrals: completed + pending, // ✅ ADD THIS
            completed,
            pending,
            totalAmount,
        });

    } catch (error) {
        console.error("ADMIN STATS ERROR:", error);
        return NextResponse.json(
            { error: "Error fetching stats" },
            { status: 500 }
        );
    }
}