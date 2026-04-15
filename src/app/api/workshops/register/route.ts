import { connectDB } from "@/lib/db";
import WorkshopRegistration from "@/models/WorkshopRegistration";
import Workshop from "@/models/Workshop";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        
        const { name, email, phone, workshopId, currentStatus, message } = body;

        if (!name || !email || !phone || !workshopId) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Verify workshop exists
        const workshop = await Workshop.findById(workshopId);
        if (!workshop) {
            return NextResponse.json(
                { message: "Workshop not found" },
                { status: 404 }
            );
        }

        // Check for duplicate registration for same workshop and email
        const existing = await WorkshopRegistration.findOne({ email, workshopId });
        if (existing) {
            return NextResponse.json(
                { message: "You have already registered for this workshop" },
                { status: 400 }
            );
        }

        const registration = await WorkshopRegistration.create({
            name,
            email,
            phone,
            workshopId,
            currentStatus,
            message,
        });

        // Optionally increment enrolledCount in Workshop model
        await Workshop.findByIdAndUpdate(workshopId, { $inc: { enrolledCount: 1 } });

        return NextResponse.json(
            { message: "Registration successful", registration },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: "Registration failed", error: error.message },
            { status: 500 }
        );
    }
}
