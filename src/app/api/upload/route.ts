import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        // Convert file to buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const result: any = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: "receipts" },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            ).end(buffer);
        });

        return NextResponse.json({
            url: result.secure_url,
        });

    } catch (error) {
        console.error("UPLOAD ERROR:", error);

        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}