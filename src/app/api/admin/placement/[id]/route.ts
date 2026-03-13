import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Placement from "@/models/Placement";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();
        const updatedPlacement = await Placement.findByIdAndUpdate(id, body, { new: true });
        if (!updatedPlacement) {
            return NextResponse.json({ error: "Placement not found" }, { status: 404 });
        }
        return NextResponse.json(updatedPlacement);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const deletedPlacement = await Placement.findByIdAndDelete(id);
        if (!deletedPlacement) {
            return NextResponse.json({ error: "Placement not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Placement deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
