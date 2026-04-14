import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import PageVisit from "@/models/PageVisit";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getToken } from "next-auth/jwt";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { pathname, entryTime, exitTime, duration, title } = body;

        if (!pathname || !entryTime || !exitTime || typeof duration !== 'number') {
            return NextResponse.json({ message: "Invalid tracking data" }, { status: 400 });
        }

        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value || cookieStore.get("adminToken")?.value || cookieStore.get("studentToken")?.value;
        const cookieRole = cookieStore.get("role")?.value || cookieStore.get("adminRole")?.value || cookieStore.get("studentRole")?.value;

        let userId = null;
        let role = cookieRole || null;

        try {
            const decodedToken = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET });
            if (decodedToken) {
                userId = decodedToken.id || null;
                role = (decodedToken.role as string) || role;
            }
        } catch (e) {
            console.warn("getToken error:", e);
        }

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

        // STRICT EXCLUSION: Do not track admins
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
