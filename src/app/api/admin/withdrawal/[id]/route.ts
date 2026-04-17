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
        const { status, remarks, paymentMethod, transactionId } = await req.json();

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

        const oldStatus = withdrawal.status;

        // Balance adjustment logic
        if (oldStatus !== status) {
            const user = await User.findById(withdrawal.studentId);
            if (user) {
                // If moving TO rejected (from pending or approved) -> Refund
                if (status === "rejected" && oldStatus !== "rejected") {
                    user.walletBalance = (user.walletBalance || 0) + withdrawal.amount;
                }
                // If moving FROM rejected (to pending or approved) -> Deduct back
                else if (oldStatus === "rejected" && status !== "rejected") {
                    // Check if user has enough balance to go back to approved/pending
                    if ((user.walletBalance || 0) < withdrawal.amount) {
                         return NextResponse.json(
                            { error: "User has insufficient balance to re-approve" },
                            { status: 400 }
                        );
                    }
                    user.walletBalance = (user.walletBalance || 0) - withdrawal.amount;
                }
                await user.save();
            }
        }

        // Update status and payment info
        withdrawal.status = status;
        withdrawal.remarks = remarks || "";
        if (paymentMethod) withdrawal.paymentMethod = paymentMethod;
        if (transactionId !== undefined) withdrawal.transactionId = transactionId;
        
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
