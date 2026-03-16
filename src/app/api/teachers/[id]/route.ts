import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Teachers from "@/models/Teachers";
import cloudinary from "@/lib/cloudinary";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    if (body.avatar && body.avatar.startsWith("data:image")) {
      const uploadResponse = await cloudinary.uploader.upload(body.avatar, {
        folder: "teachers",
      });
      body.avatar = uploadResponse.secure_url;
    }

    const teacher = await Teachers.findByIdAndUpdate(id, body, { new: true });
    if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    return NextResponse.json(teacher);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    await Teachers.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
