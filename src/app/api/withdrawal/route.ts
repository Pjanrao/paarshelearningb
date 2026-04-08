import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Withdrawal from "@/models/Withdrawal";
import jwt from "jsonwebtoken";

// GET WITHDRAWAL HISTORY
export async function GET(req: Request) {
    try {
        await connectDB();

        const authHeader = req.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json({ error: "No token" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        const withdrawals = await Withdrawal.find({ studentId: decoded.id })
            .sort({ createdAt: -1 })
            .limit(20);

        return NextResponse.json(withdrawals);
    } catch (error) {
        console.error("GET WITHDRAWAL ERROR:", error);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}

// REQUEST WITHDRAWAL
export async function POST(req: Request) {
    try {
        await connectDB();

        const authHeader = req.headers.get("authorization");
        if (!authHeader) {
            return NextResponse.json({ error: "No token" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        const { amount, upiId } = await req.json();

        // VALIDATIONS
        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }
        if (!upiId) {
            return NextResponse.json({ error: "UPI ID is required" }, { status: 400 });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if ((user.walletBalance || 0) < amount) {
            return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
        }

        // CREATE WITHDRAWAL
        const withdrawal = await Withdrawal.create({
            studentId: decoded.id,
            amount,
            upiId,
            status: "pending",
        });

        // DEDUCT FROM USER BALANCE (Or mark as locked/pending? For simplicity, we deduct now)
        user.walletBalance = (user.walletBalance || 0) - amount;
        await user.save();

        return NextResponse.json({ success: true, withdrawal });
    } catch (error) {
        console.error("POST WITHDRAWAL ERROR:", error);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
}
