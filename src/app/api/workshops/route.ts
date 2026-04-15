import { connectDB } from "@/lib/db";
import Workshop from "@/models/Workshop";
import { NextResponse } from "next/server";
<<<<<<< Updated upstream
import mongoose from "mongoose";

export const runtime = "nodejs";
=======
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

>>>>>>> Stashed changes
export const dynamic = "force-dynamic";

// GET ALL WORKSHOPS
export async function GET(req: Request) {
<<<<<<< Updated upstream
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "active";

    const query: any = {};
    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (status !== "all") {
      query.status = status;
    }

    const workshops = await Workshop.find(query).sort({ createdAt: -1 });

    return NextResponse.json(workshops);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch workshops", error: error.message },
      { status: 500 }
    );
  }
}

// CREATE OR UPDATE WORKSHOP
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    let id = body._id;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      id = new mongoose.Types.ObjectId();
    }

    const workshop = await Workshop.findByIdAndUpdate(
      id,
      { ...body, _id: id },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json(workshop, { status: 201 });
  } catch (error: any) {
    console.error("WORKSHOP UPSERT ERROR:", error);
    return NextResponse.json(
      { message: "Workshop operation failed", error: error.message },
      { status: 500 }
    );
  }
=======
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        
        const status = searchParams.get("status");
        const query: any = {};
        
        if (status) {
            query.status = status;
        }

        const workshops = await Workshop.find(query).sort({ createdAt: -1 });

        return NextResponse.json(workshops);
    } catch (error: any) {
        return NextResponse.json(
            { message: "Failed to fetch workshops", error: error.message },
            { status: 500 }
        );
    }
}

// CREATE / UPDATE WORKSHOP
export async function POST(req: Request) {
    try {
        await connectDB();
        
        const formData = await req.formData();
        
        // 1. Get or Generate ID
        let workshopId = formData.get("_id") as string;
        if (!workshopId || workshopId === "undefined") {
            workshopId = new mongoose.Types.ObjectId().toString();
        }

        // ===== GET FILES =====
        const thumbnail = formData.get("thumbnail") as File | null;
        let thumbnailUrl = "";

        // Helper function to save file locally (Standardized with Courses API)
        const saveLocalFile = async (file: File) => {
            try {
                if (file.size > 10 * 1024 * 1024) { // 10MB limit for workshops
                    throw new Error("File too large (Max 10MB allowed)");
                }

                const buffer = Buffer.from(await file.arrayBuffer());
                const timestamp = Date.now();
                const sanitizedFileName = file.name
                    .replace(/\s+/g, "_")
                    .replace(/[^a-zA-Z0-9.\-_]/g, "");

                const filename = `${timestamp}-${sanitizedFileName}`;
                const relativePath = `/uploads/workshops/${workshopId}/${filename}`;
                
                const basePath = process.env.NODE_ENV === "development"
                    ? path.join(process.cwd(), "public")
                    : "/var/www";
                const fullPath = path.join(basePath, relativePath);

                const dir = path.dirname(fullPath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                await fs.promises.writeFile(fullPath, buffer);
                return relativePath;
            } catch (err) {
                console.error("Error saving file:", err);
                throw err;
            }
        };

        if (thumbnail && thumbnail.size > 0 && typeof thumbnail !== "string") {
            thumbnailUrl = await saveLocalFile(thumbnail);
        }

        // ===== PARSE FIELDS =====
        const updateData: any = {};
        for (const [key, value] of formData.entries()) {
            if (key === "thumbnail" || key === "_id") continue;
            
            // Handle numeric fields
            if (key === "price" || key === "capacity") {
                updateData[key] = Number(value);
            } else {
                updateData[key] = value;
            }
        }

        if (thumbnailUrl) {
            updateData.thumbnail = thumbnailUrl;
        }

        // Save to DB
        const workshop = await Workshop.findByIdAndUpdate(
            workshopId, 
            { ...updateData, _id: workshopId }, 
            { new: true, upsert: true }
        );

        return NextResponse.json(workshop);
    } catch (error: any) {
        console.error("Workshop Save Error:", error);
        return NextResponse.json(
            { message: "Failed to save workshop", error: error.message },
            { status: 500 }
        );
    }
}

// DELETE WORKSHOP
export async function DELETE(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ message: "ID is required" }, { status: 400 });
        }

        await Workshop.findByIdAndDelete(id);
        return NextResponse.json({ message: "Workshop deleted" });
    } catch (error: any) {
        return NextResponse.json(
            { message: "Failed to delete workshop", error: error.message },
            { status: 500 }
        );
    }
>>>>>>> Stashed changes
}
