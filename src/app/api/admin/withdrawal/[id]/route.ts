import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Withdrawal from "@/models/Withdrawal";
import User from "@/models/User";

// UPDATE WITHDRAWAL STATUS (approve / reject)
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();

        const { id } = await params;
        const { status, remarks } = await req.json();

        if (!["approved", "rejected"].includes(status)) {
            return NextResponse.json(
                { error: "Invalid status" },
                { status: 400 }
            );
        }

        const withdrawal = await Withdrawal.findById(id);
        if (!withdrawal) {
            return NextResponse.json(
                { error: "Withdrawal not found" },
                { status: 404 }
            );
        }

        // If already processed, don't process again
        if (withdrawal.status !== "pending") {
            return NextResponse.json(
                { error: "Withdrawal already processed" },
                { status: 400 }
            );
        }

        // If REJECTED → refund balance back to user
        if (status === "rejected") {
            const user = await User.findById(withdrawal.studentId);
            if (user) {
                user.walletBalance = (user.walletBalance || 0) + withdrawal.amount;
                await user.save();
            }
        }

        // Update status
        withdrawal.status = status;
        withdrawal.remarks = remarks || "";
        await withdrawal.save();

        return NextResponse.json({ success: true, withdrawal });
    } catch (error) {
        console.error("ADMIN UPDATE WITHDRAWAL ERROR:", error);
        return NextResponse.json(
            { error: "Failed to update withdrawal" },
            { status: 500 }
        );
    }
}
