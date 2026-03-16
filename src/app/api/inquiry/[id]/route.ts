import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Inquiry from "@/models/Inquiry";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();

        const updatedInquiry = await Inquiry.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!updatedInquiry) {
            return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Inquiry updated successfully", inquiry: updatedInquiry });
    } catch (error: any) {
        console.error("Error updating inquiry:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const deletedInquiry = await Inquiry.findByIdAndDelete(id);

        if (!deletedInquiry) {
            return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Inquiry deleted successfully" });
    } catch (error: any) {
        console.error("Error deleting inquiry:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
