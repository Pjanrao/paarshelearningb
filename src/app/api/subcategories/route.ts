import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Subcategory from "@/models/Subcategory";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("category") || "";
    const query: any = {};
    if (categoryId) query.category = categoryId;
    const subcategories = await Subcategory.find(query).populate("category", "name").sort({ name: 1 }).lean();
    return NextResponse.json(subcategories);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const subcategory = await Subcategory.create(body);
    return NextResponse.json(subcategory, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
