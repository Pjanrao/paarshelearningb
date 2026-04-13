import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const courseId = searchParams.get("courseId");

        if (!userId || !courseId) {
            return NextResponse.json(
                { error: "userId and courseId are required" },
                { status: 400 }
            );
        }

        // Check 1: Payment Check (Lenient, similar to my-courses dashboard)
        const payment = await Payment.findOne({
            $or: [
                { studentId: new mongoose.Types.ObjectId(userId) },
                { student: new mongoose.Types.ObjectId(userId) }
            ],
            courseId: new mongoose.Types.ObjectId(courseId),
            // We'll be lenient with status to match the dashboard's behavior
        }).lean();

        // Check 2: Batch Check (Some features use batches for access)
        let batchEnrollment = null;
        try {
            const Batch = mongoose.models.Batch || require("@/models/Batch").default;
            batchEnrollment = await Batch.findOne({
                courseId: new mongoose.Types.ObjectId(courseId),
                students: { $in: [new mongoose.Types.ObjectId(userId), userId] }
            }).lean();
        } catch (e) {
            console.log("[Enrollment Check] Batch model check failed or skipped.");
        }

        const isEnrolled = !!(payment || batchEnrollment);

        console.log(`[Enrollment Check] User: ${userId}, Course: ${courseId}, Payment Found: ${!!payment}, Batch Found: ${!!batchEnrollment}, Result: ${isEnrolled}`);

        if (payment) {
            console.log(`[Enrollment Check] Payment Details: ID: ${payment._id}, Status: ${payment.status}, Paid: ${payment.paidAmount}/${payment.totalAmount}`);
        }

        return NextResponse.json({
            isEnrolled: isEnrolled,
        });
    } catch (error: any) {
        console.error("Enrollment check error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
