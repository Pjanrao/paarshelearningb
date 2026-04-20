import { connectDB } from "@/lib/db";
import WorkshopRegistration from "@/models/WorkshopRegistration";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const registration = await WorkshopRegistration.findById(params.id)
            .populate("workshopId", "title date time");

        if (!registration) {
            return NextResponse.json({ message: "Registration not found" }, { status: 404 });
        }

        return NextResponse.json(registration);
    } catch (error: any) {
        return NextResponse.json(
            { message: "Failed to fetch registration", error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const body = await req.json();
        
        const registration = await WorkshopRegistration.findByIdAndUpdate(
            params.id,
            { $set: body },
            { new: true, runValidators: true }
        ).populate("workshopId", "title date time");

        if (!registration) {
            return NextResponse.json({ message: "Registration not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Registration updated successfully", registration });
    } catch (error: any) {
        return NextResponse.json(
            { message: "Failed to update registration", error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        
        const registration = await WorkshopRegistration.findByIdAndDelete(params.id);

        if (!registration) {
            return NextResponse.json({ message: "Registration not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Registration deleted successfully" });
    } catch (error: any) {
        return NextResponse.json(
            { message: "Failed to delete registration", error: error.message },
            { status: 500 }
        );
    }
}
