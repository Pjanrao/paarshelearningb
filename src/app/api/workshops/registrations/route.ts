import { connectDB } from "@/lib/db";
import WorkshopRegistration from "@/models/WorkshopRegistration";
import "@/models/Workshop"; // Ensure the model is registered
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        await connectDB();
        
        const registrations = await WorkshopRegistration.find()
            .populate("workshopId", "title date time")
            .sort({ createdAt: -1 });

        return NextResponse.json(registrations);
    } catch (error: any) {
        return NextResponse.json(
            { message: "Failed to fetch registrations", error: error.message },
            { status: 500 }
        );
    }
}
