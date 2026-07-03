import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Application from "@/models/Application";

const STATUS_OPTIONS = [
    "Applied",
    "Under Review",
    "Shortlisted",
    "Interview Scheduled",
    "Interview Completed",
    "Selected",
    "Rejected",
    "On Hold",
];

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    await connectDB();
    await Application.findByIdAndDelete(id);
    return NextResponse.json({ message: "Deleted" });
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await req.json();
    const { applicationStatus } = body;

    if (!applicationStatus || typeof applicationStatus !== "string" || !STATUS_OPTIONS.includes(applicationStatus)) {
        return NextResponse.json(
            { error: "Invalid application status" },
            { status: 400 }
        );
    }

    await connectDB();

    const application = await Application.findByIdAndUpdate(
        id,
        { applicationStatus },
        { new: true }
    );

    if (!application) {
        return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json(application);
}
