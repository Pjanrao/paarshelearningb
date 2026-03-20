import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {

    try {

        await connectDB();

        const formData = await req.formData();

        const paidAmount = Number(formData.get("paidAmount"));
        const paymentMode = formData.get("paymentMode") as string;
        const installments = JSON.parse(
            (formData.get("installments") as string) || "[]"
        );

        const payment = await Payment.findById(params.id);

        if (!payment) {
            return NextResponse.json(
                { error: "Payment not found" },
                { status: 404 }
            );
        }

        const totalAmount = payment.totalAmount;

        /* ---------- CALCULATE INSTALLMENT TOTAL ---------- */

        const installmentTotal = installments.reduce(
            (sum: number, i: any) => sum + Number(i.amount || 0),
            0
        );

        const totalPaid = paidAmount + installmentTotal;

        const remainingAmount = totalAmount - totalPaid;

        /* ---------- UPDATE PAYMENT ---------- */

        payment.paidAmount = paidAmount;
        payment.paymentMode = paymentMode;
        payment.installments = installments;
        payment.remainingAmount = remainingAmount;

        await payment.save();

        return NextResponse.json({
            message: "Payment updated successfully",
            payment
        });

    } catch (error) {

        console.error(error);

        return NextResponse.json(
            { error: "Server Error" },
            { status: 500 }
        );

    }
}