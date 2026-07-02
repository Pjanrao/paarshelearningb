import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import ConsentForm from "@/models/ConsentForm";
import Payment from "@/models/Payment";
import { getUserFromAuth } from "@/lib/api-auth";

// GET /api/student/consent-forms
export async function GET(req: Request) {
    try {
        await connectDB();
        const user = await getUserFromAuth(req);

        if (!user || user.role !== "student") {
            return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 403 });
        }

        // Check if student is enrolled (has at least one payment record)
        const paymentCount = await Payment.countDocuments({
            $or: [
                { studentId: user._id },
                { student: user._id },
            ],
        });

        if (paymentCount === 0) {
            return NextResponse.json({ success: true, pendingForms: [], acceptedForms: [] }, { status: 200 });
        }

        const student = await User.findById(user._id).populate({
            path: "acceptedConsentForms.formId",
            model: ConsentForm,
        });

        if (!student) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        const acceptedForms = (student.acceptedConsentForms || [])
            .filter((cf: any) => cf.formId)
            .map((cf: any) => ({
                id: cf.formId._id,
                title: cf.formId.title,
                content: cf.formId.content,
                acceptedAt: cf.acceptedAt,
            }));

        // Build a set of accepted form IDs
        const acceptedFormIds = new Set(
            acceptedForms.map((f: any) => f.id.toString())
        );



        // Get explicitly shared forms
        const explicitFormIds = (student.sharedConsentForms || []).map((f: any) => f.formId?.toString() || f.formId);

        // Fetch applicable consent forms:
        // 1. If enrolled (paymentCount > 0), they must sign ALL forms.
        // 2. If not enrolled, they only see forms explicitly shared with them.

        let query = {};


        const applicableForms = await ConsentForm.find(query).sort({ createdAt: -1 }).lean();

        const pendingForms = applicableForms
            .filter((form: any) => !acceptedFormIds.has(form._id.toString()))
            .map((form: any) => ({
                id: form._id,
                title: form.title,
                content: form.content,
                sharedAt: form.createdAt,
            }));

        return NextResponse.json({ success: true, pendingForms, acceptedForms }, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching consent forms:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
