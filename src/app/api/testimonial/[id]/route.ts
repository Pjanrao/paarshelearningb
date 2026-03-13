import { connectDB } from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();

        const testimonial = await Testimonial.findByIdAndUpdate(id, body, { new: true });

        if (!testimonial) {
            return NextResponse.json({ success: false, error: "Testimonial not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: testimonial });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const { id } = await params;

        const testimonial = await Testimonial.findByIdAndDelete(id);

        if (!testimonial) {
            return NextResponse.json({ success: false, error: "Testimonial not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
