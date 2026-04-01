import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

// Helper: Get user ID from session or JWT token
async function getUserFromAuth() {
    // Try next-auth session first
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
        const user = await User.findOne({ email: session.user.email });
        if (user) return user;
    }

    // Fallback: JWT token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {
        try {
            const decoded: any = verifyToken(token);
            if (decoded?.id) {
                const user = await User.findById(decoded.id);
                if (user) return user;
            }
        } catch (err) {
            console.error("JWT verification error:", err);
        }
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