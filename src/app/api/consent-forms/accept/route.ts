import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import ConsentForm from "@/models/ConsentForm";
import Payment from "@/models/Payment";
import jwt from "jsonwebtoken";

// GET /api/consent-forms/accept?token=...
// Verifies and decodes the token, returning form and student info
export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const token = searchParams.get("token");

        if (!token) {
            return NextResponse.json({ success: false, error: "No token provided" }, { status: 400 });
        }

        const secret = process.env.JWT_SECRET || "default_secret";
        let decoded: any;
        try {
            decoded = jwt.verify(token, secret);
        } catch (err) {
            return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 });
        }

        const { formId, studentId } = decoded;

        if (!formId || !studentId) {
            return NextResponse.json({ success: false, error: "Invalid token payload" }, { status: 400 });
        }

        const student = await User.findById(studentId).select("name email acceptedConsentForms");
        if (!student) {
            return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 });
        }

        // Verify student is enrolled (has at least one payment record)
        const paymentCount = await Payment.countDocuments({
            $or: [
                { studentId: student._id },
                { student: student._id },
            ],
        });

        if (paymentCount === 0) {
            return NextResponse.json({ success: false, error: "Student is not enrolled (has not purchased a course)" }, { status: 400 });
        }

        const form = await ConsentForm.findById(formId);
        if (!form) {
            return NextResponse.json({ success: false, error: "Consent form not found" }, { status: 404 });
        }

        // Check if already accepted
        const alreadyAccepted = student.acceptedConsentForms.some(
            (cf: any) => cf.formId?.toString() === formId
        );

        return NextResponse.json({
            success: true,
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
            },
            form: {
                id: form._id,
                title: form.title,
                content: form.content,
            },
            alreadyAccepted
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error verifying consent form token:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// POST /api/consent-forms/accept
export async function POST(req: Request) {
    try {
        await connectDB();

        const { token, signature } = await req.json();

        if (!token) {
            return NextResponse.json({ success: false, error: "No token provided" }, { status: 400 });
        }

        const secret = process.env.JWT_SECRET || "default_secret";
        let decoded: any;
        try {
            decoded = jwt.verify(token, secret);
        } catch (err) {
            return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 401 });
        }

        const { formId, studentId } = decoded;

        if (!formId || !studentId) {
            return NextResponse.json({ success: false, error: "Invalid token payload" }, { status: 400 });
        }

        const student = await User.findById(studentId);
        if (!student) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        // Verify student is enrolled (has at least one payment record)
        const paymentCount = await Payment.countDocuments({
            $or: [
                { studentId: student._id },
                { student: student._id },
            ],
        });

        if (paymentCount === 0) {
            return NextResponse.json({ success: false, error: "Student is not enrolled (has not purchased a course)" }, { status: 400 });
        }

        // Check if already accepted
        const alreadyAccepted = student.acceptedConsentForms.some(
            (cf: any) => cf.formId.toString() === formId
        );

        if (alreadyAccepted) {
            return NextResponse.json({ success: true, message: "Consent form already accepted" }, { status: 200 });
        }

        student.acceptedConsentForms.push({
            formId,
            acceptedAt: new Date(),
            signature: signature || ""
        });

        // Also clean up from shared forms if present
        student.sharedConsentForms = (student.sharedConsentForms || []).filter(
            (cf: any) => cf.formId?.toString() !== formId
        );

        await student.save();

        return NextResponse.json({ success: true, message: "Consent form accepted successfully" }, { status: 200 });

    } catch (error: any) {
        console.error("Error accepting consent form:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
