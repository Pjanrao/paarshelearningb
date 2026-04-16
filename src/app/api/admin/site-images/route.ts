import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SiteImage from "@/models/SiteImage";

export async function GET(request: Request) {
    try {
        await connectDB();
        const images = await SiteImage.find({}).sort({ category: 1, label: 1 });
        return NextResponse.json(images);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        const { key, url, label, category } = body;

        if (!key || !url || !label) {
            return NextResponse.json(
                { error: "Key, URL, and Label are required" },
                { status: 400 }
            );
        }

        const existing = await SiteImage.findOne({ key });
        if (existing) {
            existing.url = url;
            existing.label = label;
            existing.category = category || existing.category;
            await existing.save();
            return NextResponse.json(existing);
        }

        const newImage = await SiteImage.create({ key, url, label, category });
        return NextResponse.json(newImage, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
