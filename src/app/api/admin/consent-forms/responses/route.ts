import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import ConsentForm from "@/models/ConsentForm";
import { getUserFromAuth } from "@/lib/api-auth";

// GET /api/admin/consent-forms/responses
export async function GET(req: Request) {
    try {
        await connectDB();
        const adminUser = await getUserFromAuth(req);

        if (!adminUser || adminUser.role !== "admin") {
            return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 403 });
        }

        // Fetch all users who have accepted at least one consent form
        const users = await User.find({
            "acceptedConsentForms": { $exists: true, $not: { $size: 0 } }
        }).populate({
            path: "acceptedConsentForms.formId",
            model: ConsentForm,
            select: "title"
        }).lean();

        // Group the data by student
        const responses: any[] = [];

        users.forEach((user: any) => {
            const acceptedForms = (user.acceptedConsentForms || [])
                .filter((acceptItem: any) => acceptItem && acceptItem.formId)
                .map((acceptItem: any) => ({
                    formId: acceptItem.formId._id,
                    formTitle: acceptItem.formId.title,
                    acceptedAt: acceptItem.acceptedAt,
                    signature: acceptItem.signature || null
                }));

            if (acceptedForms.length > 0) {
                // Sort student's forms descending by accepted date
                acceptedForms.sort((a: any, b: any) => new Date(b.acceptedAt).getTime() - new Date(a.acceptedAt).getTime());

                responses.push({
                    _id: user._id.toString(),
                    studentId: user._id,
                    studentName: user.name,
                    studentEmail: user.email,
                    studentContact: user.contact || "N/A",
                    latestAcceptedAt: acceptedForms[0].acceptedAt,
                    acceptedForms: acceptedForms
                });
            }
        });

        // Sort students descending by their latest acceptedAt date
        responses.sort((a, b) => new Date(b.latestAcceptedAt).getTime() - new Date(a.latestAcceptedAt).getTime());

        return NextResponse.json({ success: true, responses }, { status: 200 });

    } catch (error: any) {
        console.error("Error fetching consent form responses:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
