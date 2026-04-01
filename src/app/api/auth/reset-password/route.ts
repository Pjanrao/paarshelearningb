import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        await connectDB();
        const { token, password } = await req.json();

        if (!token || !password) {
            return NextResponse.json({ message: "Token and password are required" }, { status: 400 });
        }

        // 1. Verify token
        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
        } catch (err) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
        }

        if (decoded.type !== "password-reset") {
            return NextResponse.json({ message: "Invalid token type" }, { status: 401 });
        }

        // 2. Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Update user password
        const user = await User.findByIdAndUpdate(decoded.id, {
            password: hashedPassword
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(
            { message: "Password reset successful" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
