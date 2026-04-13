import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

import { getToken } from "next-auth/jwt";
import { getAuthUser } from "@/lib/api-auth";

// Helper: Get user ID from session or JWT token
async function getUserFromAuth(req: Request) {
    // Try next-auth session first using getToken which is safe in Next 15 API routes
    try {
        const decodedToken = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET });
        if (decodedToken?.email) {
            const user = await User.findOne({ email: decodedToken.email });
            if (user) return user;
        }
    } catch (e) {
        console.warn("getToken error:", e);
    }

    // Fallback: Using centralized JWT auth helper
    const authUser = await getAuthUser();
    if (authUser?.id) {
        const user = await User.findById(authUser.id);
        if (user) return user;
    }

    return null;
}

export async function PUT(req: Request) {
    try {
        await connectDB();
        const dbUser = await getUserFromAuth(req);

        if (!dbUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, email: newEmail, contact, image } = await req.json();

        // Update user fields
        if (name) dbUser.name = name;
        if (newEmail) dbUser.email = newEmail;
        if (contact) dbUser.contact = contact;
        if (image !== undefined) dbUser.image = image;

        await dbUser.save();

        return NextResponse.json({
            message: "Profile updated successfully",
            user: {
                name: dbUser.name,
                email: dbUser.email,
                contact: dbUser.contact,
                image: dbUser.image,
                role: dbUser.role
            }
        });

    } catch (error) {
        console.error("PROFILE UPDATE ERROR:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();
        const dbUser = await getUserFromAuth(req);

        if (!dbUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({
            user: {
                name: dbUser.name,
                email: dbUser.email,
                contact: dbUser.contact,
                image: dbUser.image,
                role: dbUser.role
            }
        });

    } catch (error) {
        console.error("PROFILE FETCH ERROR:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}