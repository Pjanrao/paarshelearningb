import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import SiteImage from "@/models/SiteImage";

const normalizeUrl = (url: string) => {
    const cleaned = url.toString().trim().replace(/\\/g, "/");
    if (/^(https?:|data:|\/)/i.test(cleaned)) return cleaned;
    return `/${cleaned.replace(/^\/+/, "")}`;
};

export async function GET(request: Request) {
    try {
        await connectDB();
        const images = await SiteImage.find({}).sort({ category: 1, label: 1 }).lean();
        const normalized = images.map((image: any) => ({
            ...image,
            url: image.url ? normalizeUrl(image.url) : image.url,
        }));
        return NextResponse.json(normalized);
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

        const normalizedUrl = normalizeUrl(url);
        const existing = await SiteImage.findOne({ key });
        if (existing) {
            existing.url = normalizedUrl;
            existing.label = label;
            existing.category = category || existing.category;
            await existing.save();
            const saved = existing.toObject ? existing.toObject() : existing;
            return NextResponse.json({
                ...saved,
                url: normalizedUrl,
            });
        }

        const newImage = await SiteImage.create({ key, url: normalizedUrl, label, category });
        const obj = newImage.toObject ? newImage.toObject() : newImage;
        return NextResponse.json({
            ...obj,
            url: normalizedUrl,
        }, { status: 201 });
    } catch (error: any) {
        console.error("POST /api/admin/site-images error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const key = searchParams.get("key");

        if (!key) {
            return NextResponse.json({ error: "Key is required" }, { status: 400 });
        }

        const deleted = await SiteImage.findOneAndDelete({ key });
        
        if (!deleted) {
            return NextResponse.json({ error: "Image record not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Image record removed successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
