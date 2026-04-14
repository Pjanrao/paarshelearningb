import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Payment from "@/models/Payment";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";
import { getToken } from "next-auth/jwt";

async function getUserFromAuth(req: Request) {
    let email = null;
    try {
        const decodedToken = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET });
        if (decodedToken?.email) {
            email = decodedToken.email;
        }
    } catch (e) {
        console.warn("getToken error:", e);
    }
    if (email) {
        const user = await User.findOne({ email }).select("+password");
        if (user) return user;
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

        const { email, password, reason } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        if (email !== dbUser.email) {
            return NextResponse.json({ error: "Email does not match your account" }, { status: 400 });
        }

        const isMatch = await bcrypt.compare(password, dbUser.password);
        if (!isMatch) {
            return NextResponse.json({ error: "Incorrect password" }, { status: 400 });
        }

        // Soft delete user and save reason
        console.log("DELETING USER:", dbUser._id, "REASON:", reason);
        const result = await User.findByIdAndUpdate(dbUser._id, {
            status: "deleted",
            deletionReason: reason || "No reason provided",
        }, { new: true });
        console.log("UPDATE RESULT:", result);

        if (!result) {
            console.error("FAILED TO UPDATE USER STATUS");
            return NextResponse.json({ error: "Failed to update account status" }, { status: 500 });
        }

        // Return success message
        return NextResponse.json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error("DELETE ACCOUNT ERROR:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}