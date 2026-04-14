import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import PageVisit from "@/models/PageVisit";
import User from "@/models/User";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getToken } from "next-auth/jwt";

export async function GET(req: Request) {
    try {
        await connectDB();
        
        let isAdmin = false;
        try {
            const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET });
            if (token?.role === "admin") isAdmin = true;
        } catch (e) {
            console.warn("getToken error:", e);
        }

        const cookieStore = await cookies();
        const cookieRole = cookieStore.get("role")?.value || cookieStore.get("adminRole")?.value;
        const cookieToken = cookieStore.get("token")?.value || cookieStore.get("adminToken")?.value;
        
        if (cookieRole === "admin" || cookieRole === "teacher") isAdmin = true;

        if (!isAdmin && cookieToken && cookieToken !== "undefined" && cookieToken !== "null" && cookieToken.length > 10) {
            try {
                const decoded: any = jwt.verify(cookieToken, process.env.JWT_SECRET || "default_secret");
                if (decoded.role === "admin" || decoded.role === "teacher") isAdmin = true;
            } catch (e) { }
        }

        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url, `http://${req.headers.get('host') || 'localhost'}`);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const search = searchParams.get("search") || "";

        const skip = (page - 1) * limit;

        let query: any = {};
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
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
