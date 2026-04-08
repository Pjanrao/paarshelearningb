import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Payment from "@/models/Payment";
import Batch from "@/models/Batch";

export async function GET() {
    await connectDB();
    const referrers = await User.find({ walletBalance: { $gt: 0 } }).lean();
    const referred = await User.find({ referredBy: { $ne: null } }).lean();
    const payments = await Payment.find().sort({createdAt: -1}).limit(5).lean();
    const batches = await Batch.find().sort({createdAt: -1}).limit(5).lean();

    return NextResponse.json({
        referrers,
        referred,
        payments,
        batches
    });
}
