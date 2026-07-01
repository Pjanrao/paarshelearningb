import { connectDB } from "@/lib/db";
import { getAuthUser } from "@/lib/api-auth";
import CourseRegistration from "@/models/CourseRegistration";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET — List all registrations (admin only, paginated)
export async function GET(req: Request) {
    try {
        const authUser = await getAuthUser();
        if (!authUser || authUser.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectDB();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search") || "";
        const exportAll = searchParams.get("export") === "true";

        const query: any = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { contact: { $regex: search, $options: "i" } },
                { collegeName: { $regex: search, $options: "i" } },
                { course: { $regex: search, $options: "i" } },
            ];
        }

        // Export mode: return all records as JSON (no pagination)
        if (exportAll) {
            const registrations = await CourseRegistration.find(query)
                .sort({ createdAt: -1 })
                .lean();

            return NextResponse.json({ registrations, total: registrations.length });
        }

        const total = await CourseRegistration.countDocuments(query);
        const registrations = await CourseRegistration.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        return NextResponse.json({
            registrations,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (error: any) {
        console.error("ADMIN COURSE REGISTRATION LIST ERROR:", error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch registrations" },
            { status: 500 }
        );
    }
}
