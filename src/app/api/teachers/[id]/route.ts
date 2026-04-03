import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Teachers from "@/models/Teachers";
import fs from "fs";
import path from "path";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const existingTeacher = await Teachers.findById(id);
    if (!existingTeacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    if (body.avatar && body.avatar.startsWith("data:image")) {
      // 1. Delete old
      if (existingTeacher.avatar && existingTeacher.avatar.startsWith("/uploads")) {
        const fullOldPath = path.join(process.cwd(), "public", existingTeacher.avatar);
        try {
          if (fs.existsSync(fullOldPath)) await fs.promises.unlink(fullOldPath);
        } catch (err) {
          console.error("Error deleting old avatar:", err);
        }
      }
      
      // 2. Save new
      const base64Data = body.avatar.replace(/^data:image\/\w+;base64,/, "");
      const extension = body.avatar.split(';')[0].split('/')[1] || 'png';
      const buffer = Buffer.from(base64Data, "base64");
      const filename = `${Date.now()}-teacher-avatar.${extension}`;
      const relativePath = `/uploads/courses/images/${filename}`;
      const fullPath = path.join(process.cwd(), "public", relativePath);
      
      // Ensure directory exists
      const dir = path.dirname(fullPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      await fs.promises.writeFile(fullPath, buffer);
      body.avatar = relativePath;
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
    const teacher = await Teachers.findById(id);
    if (teacher && teacher.avatar && teacher.avatar.startsWith("/uploads")) {
      const fullPath = path.join(process.cwd(), "public", teacher.avatar);
      try {
        if (fs.existsSync(fullPath)) await fs.promises.unlink(fullPath);
      } catch (err) {
        console.error("Error deleting teacher avatar:", err);
      }
    }
    await Teachers.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Teacher and avatar deleted locally" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
