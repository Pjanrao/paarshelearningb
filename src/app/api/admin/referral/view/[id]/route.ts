import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Payment from "@/models/Payment";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        await connectDB();

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const referredUsers = await User.find({
            referredBy: user.referralCode,
        });

        const data = await Promise.all(
            referredUsers.map(async (ref) => {

                const payments = await Payment.find({
                    studentId: ref._id,
                });

                const isCompleted = payments.length > 0;

                return {
                    _id: ref._id,
                    name: ref.name,
                    email: ref.email,
                    coursesPurchased: payments.length,
                    status: isCompleted ? "Completed" : "Pending",
                    rewardGiven: isCompleted ? "Yes" : "No",
                    amount: ref.referralReward || 0, // ✅ CORRECT
                    date: ref.createdAt,
                };
            })
        );

        return NextResponse.json({
            userName: user.name,
            referrals: data,
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}

