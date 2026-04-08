import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Withdrawal from "@/models/Withdrawal";
import User from "@/models/User";

// GET ALL WITHDRAWALS (admin)
export async function GET() {
    try {
        await connectDB();

        const withdrawals = await Withdrawal.find({})
            .populate({
                path: "studentId",
                model: User,
                select: "name email contact",
            })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(withdrawals ?? []);
    } catch (error) {
        console.error("ADMIN GET WITHDRAWALS ERROR:", error);
        return NextResponse.json([], { status: 200 });
    }
}
