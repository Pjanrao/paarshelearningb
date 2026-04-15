import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { getAuthUser } from "@/lib/api-auth";

export async function GET() {
    try {
        await connectDB();
        
        const authUser = await getAuthUser();

        if (authUser?.id) {
            const user = await User.findById(authUser.id).select("-password");
            if (user) {
                return NextResponse.json(user);
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
        
        const authUser = await getAuthUser();

        if (!authUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = authUser.id;
        const body = await request.json();
        let { name, email, contact, designation, avatar, currentPassword, newPassword } = body;

        if (email) email = email.trim().toLowerCase();

        const user = await User.findById(userId).select("+password");
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
