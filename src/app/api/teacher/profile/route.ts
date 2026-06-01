import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Teacher from "@/models/Teachers";
import { getUserFromAuth } from "@/lib/api-auth";

export async function GET(req: Request) {
  try {
    await connectDB();

    const dbUser = await getUserFromAuth(req);
    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (dbUser.role !== "teacher") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const teacher = await Teacher.findOne({ userId: dbUser._id }).lean();
    if (!teacher) {
      return NextResponse.json({ error: "Teacher profile not found" }, { status: 404 });
    }

    return NextResponse.json({ teacher }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
