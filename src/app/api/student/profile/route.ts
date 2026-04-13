import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

import { getAuthUser } from "@/lib/api-auth";

// Helper: Get user ID from session or JWT token
async function getUserFromAuth() {
    // Try next-auth session first
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
        const user = await User.findOne({ email: session.user.email });
        if (user) return user;
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
        const dbUser = await getUserFromAuth();

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
        const dbUser = await getUserFromAuth();

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