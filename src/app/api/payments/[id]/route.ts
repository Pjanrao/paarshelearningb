import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import fs from "fs";
import path from "path";

async function saveLocalReceipt(file: File): Promise<string | null> {
    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        const relativePath = `/uploads/courses/receipts/${filename}`;
        const fullPath = path.join(process.cwd(), "public", relativePath);
        
        // Ensure directory exists
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        await fs.promises.writeFile(fullPath, buffer);
        return relativePath;
    } catch (error) {
        console.error("Local upload error:", error);
        return null;
    }
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {

    try {
        await connectDB();

        const formData = await req.formData();

        const paidAmount = Number(formData.get("paidAmount") || 0);
        const paymentMode = formData.get("paymentMode") as string;

        let installments = JSON.parse(
            (formData.get("installments") as string) || "[]"
        );

        console.log("FORM DATA RECEIVED");
        console.log("paidAmount:", paidAmount);
        console.log("paymentMode:", paymentMode);
        console.log("installments:", installments);

        const { id } = await context.params;
        // ✅ FIXED (NO ERROR NOW)
        const payment = await Payment.findById(id);

        if (!payment) {
            return NextResponse.json(
                { error: "Payment not found" },
                { status: 404 }
            );
        }

        const totalAmount = Number(payment.totalAmount);

        /* ================= FIRST RECEIPT ================= */

        const firstReceipt = formData.get("receipt");

        if (firstReceipt instanceof File && firstReceipt.size > 0) {

            console.log("Uploading receipt..."); // DEBUG

            const url = await saveLocalReceipt(firstReceipt);

            console.log("UPLOAD RESPONSE:", url); // DEBUG

            if (url) {
                payment.receipt = url;
            }
        }

        /* ================= INSTALLMENT RECEIPTS ================= */

        const updatedInstallments = [];

        for (let index = 0; index < installments.length; index++) {

            const inst = installments[index];
            const file = formData.get(`installment_receipt_${index}`) as File;

            if (file && typeof file !== "string" && file.size > 0) {

                const url = await saveLocalReceipt(file);

                if (url) {
                    updatedInstallments.push({
                        ...inst,
                        receipt: url
                    });
                    continue;
                }
            }

            updatedInstallments.push(inst);
        }

        installments = updatedInstallments;

        /* ================= CALCULATION ================= */

        const installmentTotal = installments.reduce(
            (sum: number, i: any) => sum + Number(i.amount || 0),
            0
        );

        const finalPaid = paidAmount + installmentTotal;

        /* ================= VALIDATION ================= */

        if (finalPaid > totalAmount) {
            return NextResponse.json(
                { success: false, error: "Total payment exceeds course fee" },
                { status: 400 }
            );
        }

        /* ================= SAVE ================= */

        payment.paidAmount = paidAmount;
        payment.paymentMode = paymentMode;
        payment.installments = installments;
        payment.remainingAmount = totalAmount - finalPaid;

        await payment.save();

        return NextResponse.json({
            message: "Payment updated successfully",
            payment
        });

    } catch (error) {

        console.error("UPDATE ERROR:", error);

        return NextResponse.json(
            { success: false, error: "Server Error" },
            { status: 500 }
        );
    }
}
/* ================= DELETE PAYMENT ================= */
export async function DELETE(req: Request, context: any) {

    const { params } = await context;

    try {
        await connectDB();

        const deletedPayment = await Payment.findByIdAndDelete(params.id);

        if (!deletedPayment) {
            return NextResponse.json(
                { message: "Payment not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Payment deleted successfully" },
            { status: 200 }
        );

    } catch (error) {

        console.error("DELETE ERROR:", error);

        return NextResponse.json(
            { message: "Delete failed" },
            { status: 500 }
        );
    }
}