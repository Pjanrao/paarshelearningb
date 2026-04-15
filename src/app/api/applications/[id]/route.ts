import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Application from "@/models/Application";

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    await connectDB();
    await Application.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Deleted" });
}