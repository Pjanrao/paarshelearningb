import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import PageVisit from "@/models/PageVisit";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { pathname, entryTime, exitTime, duration, title } = body;

        if (!pathname || !entryTime || !exitTime || typeof duration !== 'number') {
            return NextResponse.json({ message: "Invalid tracking data" }, { status: 400 });
        }

        await connectDB();
        const session = await getServerSession(authOptions);
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;
        
        let userId = session?.user?.id || null;
        let role = session?.user?.role || null;

        // If no NextAuth session, try to get user from custom JWT token
        if (!userId && token) {
            try {
                const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
                userId = decoded.id;
                role = decoded.role;
            } catch (e) {
                // Invalid token, continue as guest
            }
        }

        // ❌ STRICT EXCLUSION: Do not track admins
        if (role === 'admin') {
            return NextResponse.json({ success: true, message: "Admin tracking skipped" }, { status: 200 });
        }

        const newVisit = await PageVisit.create({
            userId,
            pathname,
            title: title || "Unknown Page",
            entryTime: new Date(entryTime),
            exitTime: new Date(exitTime),
            duration,
        });

        return NextResponse.json({ success: true, visitId: newVisit._id }, { status: 201 });
    } catch (error: any) {
        console.error("Tracking Error:", error);
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}
