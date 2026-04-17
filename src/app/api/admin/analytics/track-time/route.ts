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

        const pipeline: any[] = [
            // 1. Lookup user info
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            // 2. Unwind userDetails (preserve nulls for guests)
            { 
                $unwind: { 
                    path: "$userDetails", 
                    preserveNullAndEmptyArrays: true 
                } 
            },
            // 3. Match based on search query
            {
                $match: search ? {
                    $or: [
                        { "userDetails.name": { $regex: search, $options: "i" } },
                        { "userDetails.email": { $regex: search, $options: "i" } },
                        { "pathname": { $regex: search, $options: "i" } },
                        { "title": { $regex: search, $options: "i" } }
                    ]
                } : {}
            },
            // 4. Group by userId
            {
                $group: {
                    _id: "$userId",
                    user: { $first: "$userDetails" },
                    visits: { 
                        $push: {
                            _id: "$_id",
                            pathname: "$pathname",
                            title: "$title",
                            entryTime: "$entryTime",
                            exitTime: "$exitTime",
                            duration: "$duration",
                            createdAt: "$createdAt"
                        } 
                    },
                    lastActive: { $max: "$exitTime" }
                }
            },
            // 5. Sort by last activity
            { $sort: { lastActive: -1 } },
            // 6. Facet for pagination
            {
                $facet: {
                    metadata: [{ $count: "total" }],
                    data: [{ $skip: skip }, { $limit: limit }]
                }
            }
        ];

        const result = await PageVisit.aggregate(pipeline);
        const metadata = result[0].metadata[0] || { total: 0 };
        const data = result[0].data || [];

        // Format data to match expected frontend structure if needed
        // The frontend expects Visit[] and groups them. 
        // We will change the frontend to handle these groups directly, 
        // or flatten them here. Flattening would break the pagination by user.
        // So we will change the frontend.
        
        return NextResponse.json({
            groups: data,
            pagination: {
                total: metadata.total,
                page,
                limit,
                totalPages: Math.ceil(metadata.total / limit)
            }
        });
    } catch (error: any) {
        console.error("Admin Analytics Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        await connectDB();
        
        let isAdmin = false;
        try {
            const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET });
            if (token?.role === "admin") isAdmin = true;
        } catch (e) {}

        const cookieStore = await cookies();
        const cookieRole = cookieStore.get("role")?.value || cookieStore.get("adminRole")?.value;
        if (cookieRole === "admin" || cookieRole === "teacher") isAdmin = true;

        if (!isAdmin) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const userId = searchParams.get("userId");

        if (id) {
            await PageVisit.findByIdAndDelete(id);
            return NextResponse.json({ message: "Visit record deleted" });
        }

        if (userId) {
            // userId could be "guest" if we want to delete all null userIds
            if (userId === "guest") {
                await PageVisit.deleteMany({ userId: null });
            } else {
                await PageVisit.deleteMany({ userId });
            }
            return NextResponse.json({ message: "User visit history cleared" });
        }

        return NextResponse.json({ message: "ID or UserID required" }, { status: 400 });
    } catch (error: any) {
        console.error("Delete Analytics Error:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
