import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Application from "@/models/Application";

// ✅ APPLY JOB
export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();

        const application = await Application.create(body);

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
            .populate("jobId") // 🔥 important
            .sort({ createdAt: -1 });

        return NextResponse.json(applications);
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch applications" },
            { status: 500 }
        );
    }
}