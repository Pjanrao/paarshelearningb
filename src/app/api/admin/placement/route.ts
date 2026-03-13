import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Placement from "@/models/Placement";

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";
        const status = searchParams.get("status") || "all";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        const query: any = {};
        if (search) {
            query.$or = [
                { studentName: { $regex: search, $options: "i" } },
                { company: { $regex: search, $options: "i" } },
                { course: { $regex: search, $options: "i" } },
            ];
        }
        if (status !== "all") {
            query.status = { $regex: status, $options: "i" };
        }

        const placements = await Placement.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await Placement.countDocuments(query);

        return NextResponse.json({ placements, total });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const placement = await Placement.create(body);
        return NextResponse.json(placement, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
