import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";
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

// ✅ APPLY JOB
export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();
        const { applicationStatus = "Applied", ...rest } = body;

        if (!STATUS_OPTIONS.includes(applicationStatus)) {
            return NextResponse.json(
                { error: "Invalid application status" },
                { status: 400 }
            );
        }

        const application = await Application.create({
            ...rest,
            applicationStatus,
        });

        return NextResponse.json(application, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to submit application" },
            { status: 500 }
        );
    }
}

// ✅ GET ALL APPLICATIONS (ADMIN)
export async function GET() {
    try {
        await connectDB();

        const applications = await Application.find()
            .populate({ path: "jobId", select: "title", model: Job })
            .sort({ createdAt: -1 });

        return NextResponse.json(applications);
    } catch (error) {
        console.error("Applications GET error:", error);
        return NextResponse.json(
            { error: "Failed to fetch applications" },
            { status: 500 }
        );
    }
}