import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

        // Save locally
        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
        const relativePath = `/uploads/courses/receipts/${filename}`;
        const fullPath = path.join(process.cwd(), "public", relativePath);
        
        // Ensure directory exists
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        await fs.promises.writeFile(fullPath, buffer);

        return NextResponse.json({
            url: relativePath,
        });

    } catch (error) {
        console.error("UPLOAD ERROR:", error);

        return NextResponse.json(
            { error: "Upload failed" },
            { status: 500 }
        );
    }
}