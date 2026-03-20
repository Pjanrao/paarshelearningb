import { connectDB } from "@/lib/db";
import Meeting from "@/models/Meeting";
import { NextResponse } from "next/server";

export async function PUT(req: Request, context: any) {
    await connectDB();

    const { id } = context.params;
    const body = await req.json();

    const meeting = await Meeting.findByIdAndUpdate(id, body, { new: true });

    return NextResponse.json(meeting);
}

export async function DELETE(req: Request, context: any) {
    await connectDB();

    const { id } = context.params;

    await Meeting.findByIdAndDelete(id);

    return NextResponse.json({ message: "Deleted" });
}