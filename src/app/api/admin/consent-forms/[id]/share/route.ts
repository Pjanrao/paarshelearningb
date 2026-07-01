import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ConsentForm from "@/models/ConsentForm";
import User from "@/models/User";
import { getUserFromAuth } from "@/lib/api-auth";
import { sendConsentFormEmail } from "@/utils/sendEmail";
import jwt from "jsonwebtoken";

// POST /api/admin/consent-forms/[id]/share
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const user = await getUserFromAuth(req);

        if (!user || user.role !== "admin") {
            return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 403 });
        }

        const { userId, email } = await req.json();

        if (!userId && !email) {
            return NextResponse.json({ success: false, error: "Provide either a user ID or email to share the form" }, { status: 400 });
        }

        let student = null;
        if (userId) {
            student = await User.findById(userId);
        } else if (email) {
            student = await User.findOne({ email });
        }

        if (!student) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        const form = await ConsentForm.findById(id);
        if (!form) {
            return NextResponse.json({ success: false, error: "Consent form not found" }, { status: 404 });
        }

        // IMPORTANT: Save the form to the student's shared forms array
        // so it appears in their dashboard regardless of course enrollment.
        if (!student.sharedConsentForms) student.sharedConsentForms = [];
        const alreadyShared = student.sharedConsentForms.find((f: any) => f.formId?.toString() === form._id.toString());

        if (!alreadyShared) {
            student.sharedConsentForms.push({ formId: form._id, sharedAt: new Date() });
            await student.save();
        }

        // Generate encrypted token with formId and studentId
        const secret = process.env.JWT_SECRET || "default_secret";
        const token = jwt.sign(
            { formId: form._id.toString(), studentId: student._id.toString() },
            secret
        );

        // Send email notification to the student with live domain URL
        const liveDomain = "https://paarshelearning.com";
        const sharedLink = `${liveDomain}/consent-forms/accept?token=${token}`;

        const emailResult = await sendConsentFormEmail(
            student.email,
            student.name,
            form.title,
            sharedLink
        );

        if (!emailResult.success) {
            console.error("[Share] Email sending failed:", emailResult.error);
            return NextResponse.json({ success: false, error: "Failed to send email notification" }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            studentName: student.name,
            sharedLink,
            message: "Consent form email sent successfully"
        }, { status: 200 });

    } catch (error: any) {
        console.error("Error sharing consent form:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
