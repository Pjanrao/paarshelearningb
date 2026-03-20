import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";

export async function POST(req: Request) {

    try {

        await connectDB();

        const { paymentId, amount, paymentMode, receipt } = await req.json();

        if (!paymentId || !amount) {
            return NextResponse.json(
                { error: "Payment ID and amount are required" },
                { status: 400 }
            );
        }

        const payment = await Payment.findById(paymentId);

        if (!payment) {
            return NextResponse.json(
                { error: "Payment not found" },
                { status: 404 }
            );
        }

        const installmentAmount = Number(amount);

        /* -------- ADD INSTALLMENT -------- */

        payment.installments.push({
            amount: installmentAmount,
            paymentMode,
            receipt: receipt || null,
            date: new Date(),
        });

        /* -------- CALCULATE TOTAL INSTALLMENTS -------- */

        const installmentTotal = payment.installments.reduce(
            (sum: number, inst: any) => sum + Number(inst.amount || 0),
            0
        );

        const totalPaid = payment.paidAmount + installmentTotal;

        /* -------- VALIDATION -------- */

        if (totalPaid > payment.totalAmount) {
            return NextResponse.json(
                { error: "Installment exceeds remaining balance" },
                { status: 400 }
            );
        }

        /* -------- UPDATE REMAINING -------- */

        payment.remainingAmount = payment.totalAmount - totalPaid;

        await payment.save();

        return NextResponse.json(payment);

    } catch (error) {

        console.error("INSTALLMENT ERROR:", error);

        return NextResponse.json(
            { error: "Installment failed" },
            { status: 500 }
        );

    }
}

// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import Payment from "@/models/Payment";

// export async function POST(req: Request) {

//   try {

//     await connectDB();

//     const { paymentId, amount, paymentMode, receipt } = await req.json();

//     if (!paymentId || !amount) {
//       return NextResponse.json(
//         { error: "Payment ID and amount are required" },
//         { status: 400 }
//       );
//     }

//     const payment = await Payment.findById(paymentId);

//     if (!payment) {
//       return NextResponse.json(
//         { error: "Payment not found" },
//         { status: 404 }
//       );
//     }

//     const installmentAmount = Number(amount);

//     // Prevent overpayment
//     if (installmentAmount > payment.remainingAmount) {
//       return NextResponse.json(
//         { error: "Installment amount exceeds remaining balance" },
//         { status: 400 }
//       );
//     }

//     // Update payment totals
//     payment.paidAmount += installmentAmount;
//     payment.remainingAmount -= installmentAmount;

//     // Push installment
//     payment.installments.push({
//       amount: installmentAmount,
//       paymentMode,
//       receipt: receipt || null,
//       date: new Date(),
//     });

//     await payment.save();

//     return NextResponse.json(payment);

//   } catch (error) {

//     console.error("INSTALLMENT ERROR:", error);

//     return NextResponse.json(
//       { error: "Installment failed" },
//       { status: 500 }
//     );

//   }
// }