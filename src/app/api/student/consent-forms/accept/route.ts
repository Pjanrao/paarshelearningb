import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import ConsentForm from "@/models/ConsentForm";
import { getUserFromAuth } from "@/lib/api-auth";

// POST /api/student/consent-forms/accept
export async function POST(req: Request) {
    try {
        await connectDB();
        const user = await getUserFromAuth(req);

        if (!user || user.role !== "student") {
            return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 403 });
        }

        const { formId, signature } = await req.json();

        if (!formId) {
            return NextResponse.json({ success: false, error: "Form ID is required" }, { status: 400 });
        }

        // Verify the form exists
        const form = await ConsentForm.findById(formId);
        if (!form) {
            return NextResponse.json({ success: false, error: "Consent form not found" }, { status: 404 });
        }

        const student = await User.findById(user._id);
        if (!student) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        // Check if already accepted
        const alreadyAccepted = student.acceptedConsentForms.some(
            (cf: any) => cf.formId.toString() === formId
        );

        if (alreadyAccepted) {
            return NextResponse.json({ success: true, message: "Consent form already accepted" }, { status: 200 });
        }

        // Add to accepted forms
        student.acceptedConsentForms.push({
            formId,
            acceptedAt: new Date(),
            signature: signature || "",
        });

        // Remove from shared forms
        student.sharedConsentForms = (student.sharedConsentForms || []).filter(
            (cf: any) => cf.formId.toString() !== formId
        );

        await student.save();

        return NextResponse.json({ success: true, message: "Consent form accepted successfully" }, { status: 200 });

    } catch (error: any) {
        console.error("Error accepting consent form:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
