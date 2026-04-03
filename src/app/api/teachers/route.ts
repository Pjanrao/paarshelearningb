import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Teachers from "@/models/Teachers";
import fs from "fs";
import path from "path";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [teachers, total] = await Promise.all([
      Teachers.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Teachers.countDocuments(query),
    ]);

    return NextResponse.json({
      teachers,
      pagination: {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    if (body.avatar && body.avatar.startsWith("data:image")) {
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

    const teacher = await Teachers.create(body);
    return NextResponse.json(teacher, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
