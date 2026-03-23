import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Batch from "@/models/Batch";

export async function PUT(req: Request, { params }: any) {
    try {
        await connectDB();

        const body = await req.json();

        const updated = await Batch.findByIdAndUpdate(
            params.id,
            body,
            { new: true }
        );

        return NextResponse.json(updated);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: any) {
    try {
        await connectDB();

        await Batch.findByIdAndDelete(params.id);

        return NextResponse.json({ message: "Deleted" });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}