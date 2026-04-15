import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Batch from "@/models/Batch";
import "@/models/User";
import "@/models/Course";

// GET: Fetch completed batches (status = "Completed" OR endDate has passed)
export async function GET() {
    try {
        await connectDB();

        const now = new Date();

        const batches = await Batch.find({
            $or: [
                { status: "Completed" },
                { endDate: { $lte: now } }
            ]
        })
            .populate("courseId", "name")
            .populate("students", "name email contact")
            .sort({ endDate: -1 });

        return NextResponse.json(batches);
    } catch (error: any) {
        console.error("Error fetching completed batches:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
