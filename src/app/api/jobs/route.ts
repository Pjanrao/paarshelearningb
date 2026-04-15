import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";

// ✅ CREATE JOB
export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();

        const job = await Job.create({
            ...body,
            isActive: body.isActive ?? true,
        });
        return NextResponse.json(job, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
    }
}

// ✅ GET ALL JOBS
export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const all = searchParams.get("all") === "true";

        const query = all ? {} : { isActive: { $ne: false } };
        const jobs = await Job.find(query).sort({ createdAt: -1 });

        return NextResponse.json(jobs);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
    }
}