import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { getToken } from "next-auth/jwt";

// Helper: Get user from auth (same pattern as profile API)
async function getUserFromAuth(req: Request) {
    try {
        const tokenData = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET });
        if (tokenData?.email) {
            const user = await User.findOne({ email: tokenData.email }).select("+password");
            if (user) return user;
        }
    } catch (e) {
        console.warn("getToken error:", e);
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value || cookieStore.get("studentToken")?.value || cookieStore.get("adminToken")?.value;
    if (token) {
        try {
            const decoded: any = verifyToken(token);
            if (decoded?.id) {
                const user = await User.findById(decoded.id).select("+password");
                if (user) return user;
            }
        } catch (err) {
            console.error("JWT verification error:", err);
        }
    }

    return null;
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const dbUser = await getUserFromAuth(req);

        if (!dbUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: "Both current and new password are required" }, { status: 400 });
        }

        if (newPassword.length < 8) {
            return NextResponse.json({ error: "New password must be at least 8 characters" }, { status: 400 });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, dbUser.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
        }

        // Hash and save new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        dbUser.password = hashedPassword;
        await dbUser.save();

        return NextResponse.json({ message: "Password changed successfully" });

    } catch (error) {
        console.error("CHANGE PASSWORD ERROR:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}