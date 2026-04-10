import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import PageVisit from "@/models/PageVisit";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
    try {
        await connectDB();
        
        // 1. Verify session using NextAuth OR Cookies (Fallback for custom admin login)
        const session = await getServerSession(authOptions);
        const cookieStore = await cookies();
        const cookieRole = cookieStore.get("role")?.value;
        const cookieToken = cookieStore.get("token")?.value;
        let isAdmin = (session?.user as any)?.role === "admin" || cookieRole === "admin";

        // Optional: extra check for token validity if needed
        if (!isAdmin && cookieToken) {
            try {
                const decoded: any = jwt.verify(cookieToken, process.env.JWT_SECRET || "default_secret");
                if (decoded.role === "admin") isAdmin = true;
            } catch (e) {
                // Invalid token
            }
        }

        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search") || "";

        const skip = (page - 1) * limit;

        // Build query
        let query: any = {};
        
        // If there's a search, we might need to find users first or match path
        if (search) {
            const users = await User.find({
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            }).select("_id");
            
            const userIds = users.map(u => u._id);
            
            query = {
                $or: [
                    { userId: { $in: userIds } },
                    { pathname: { $regex: search, $options: "i" } }
                ]
            };
        }

        const visits = await PageVisit.find(query)
            .populate("userId", "name email role")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await PageVisit.countDocuments(query);

        return NextResponse.json({
            visits,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        console.error("Admin Analytics Error:", error);
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}
