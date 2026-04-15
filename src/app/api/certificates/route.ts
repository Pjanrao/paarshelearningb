import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Certificate from "@/models/Certificate";
import "@/models/User";
import "@/models/Batch";
import "@/models/Course";

// GET: Fetch all certificates with pagination & search
export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const studentId = searchParams.get("studentId") || "";

        const query: any = {};

        if (search) {
            query.$or = [
                { studentName: { $regex: search, $options: "i" } },
                { courseName: { $regex: search, $options: "i" } },
                { certificateNumber: { $regex: search, $options: "i" } },
            ];
        }

        if (studentId) {
            query.studentId = studentId;
        }

        const total = await Certificate.countDocuments(query);
        const certificates = await Certificate.find(query)
            .populate("studentId", "name email contact")
            .populate("batchId", "name")
            .populate("courseId", "name")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return NextResponse.json({
            certificates,
            pagination: {
                total,
                page,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error: any) {
        console.error("Error fetching certificates:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Generate a certificate
export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();
        const { studentId, batchId, courseId, studentName, courseName, completionDate } = body;

        // Check if certificate already exists for this student + batch
        const existing = await Certificate.findOne({ studentId, batchId });
        if (existing) {
            return NextResponse.json(
                { error: "Certificate already generated for this student in this batch", certificate: existing },
                { status: 409 }
            );
        }

        // Generate unique certificate number: PE-YYYY-NNNNN
        const year = new Date().getFullYear();
        const count = await Certificate.countDocuments();
        const certNumber = `PE-${year}-${String(count + 1).padStart(5, "0")}`;

        const certificate = await Certificate.create({
            certificateNumber: certNumber,
            studentId,
            batchId,
            courseId,
            studentName,
            courseName,
            completionDate: completionDate || new Date(),
        });

        return NextResponse.json(certificate, { status: 201 });
    } catch (error: any) {
        console.error("Error creating certificate:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
