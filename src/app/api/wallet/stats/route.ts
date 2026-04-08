import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Withdrawal from "@/models/Withdrawal";
import jwt from "jsonwebtoken";

// GET WALLET STATS (balance + pending withdrawals)
export async function GET(req: Request) {
    try {
        await connectDB();

        const authHeader = req.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json({ error: "No token" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        const user = await User.findById(decoded.id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Sum of all pending withdrawal amounts
        const pendingWithdrawals = await Withdrawal.aggregate([
            { $match: { studentId: user._id, status: "pending" } },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const pendingAmount = pendingWithdrawals.length > 0 ? pendingWithdrawals[0].total : 0;

        return NextResponse.json({
            walletBalance: user.walletBalance || 0,
            pendingWithdrawals: pendingAmount,
        });

    } catch (error) {
        console.error("WALLET STATS ERROR:", error);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
