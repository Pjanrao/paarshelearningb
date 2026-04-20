import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Job from "@/models/Job";

// ✅ GET SINGLE JOB
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectDB();

        const job = await Job.findById(id);

        if (!job) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        return NextResponse.json(job);
    } catch (error) {
        return NextResponse.json({ error: "Error fetching job" }, { status: 500 });
    }
}

// ✅ UPDATE JOB
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectDB();

        const body = await req.json();

        const updatedJob = await Job.findByIdAndUpdate(
            id,
            body,
            { new: true }
        );

        return NextResponse.json(updatedJob);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
    }
}

// ✅ DELETE JOB
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await connectDB();

        await Job.findByIdAndDelete(id);

        return NextResponse.json({ message: "Job deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
    }
}