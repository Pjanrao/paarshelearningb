import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt";

export async function GET() {
    try {
        await connectDB();
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (token) {
            try {
                const decoded: any = verifyToken(token);
                if (decoded && decoded.id) {
                    const user = await User.findById(decoded.id).select("-password");
                    if (user) {
                        return NextResponse.json(user);
                    }
                }
            } catch (jwtErr) {
                console.error("JWT Verification Error:", jwtErr);
            }
        }

        // Fallback for cases where token might be missing or invalid but user is in dashboard
        const user = await User.findOne({ role: "admin" }).select("-password");
        return NextResponse.json(user);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await connectDB();
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded: any = verifyToken(token);
        if (!decoded || !decoded.id) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        const body = await request.json();
        const { name, email, contact, designation, avatar, currentPassword, newPassword } = body;

        const user = await User.findById(decoded.id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Handle Profile Update
        if (name) user.name = name;
        if (email) user.email = email;
        if (contact) {
            if (!/^\d{10}$/.test(contact)) {
                return NextResponse.json({ error: "Invalid phone number format (10 digits required)" }, { status: 400 });
            }
            user.contact = contact;
        }
        if (designation) user.designation = designation;
        if (avatar) user.avatar = avatar;

        // Handle Password Update
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
            }
            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();

        const userObj = user.toObject();
        const { password, ...responseUser } = userObj;

        return NextResponse.json(responseUser);
    } catch (error: any) {
        console.error("Profile Update Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
