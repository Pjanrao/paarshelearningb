import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        await connectDB();
        const { email, password } = await req.json();

        // 1. Find user and include password field (which is select: false)
        let user = await User.findOne({ email }).select("+password");

        // Special handling for requested admin credentials
        if (email === "paarshadmin@gmail.com" && password === "paarsh@123") {
            if (!user) {
                // Auto-create admin if not exists
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);
                user = await User.create({
                    name: "Admin",
                    email,
                    password: hashedPassword,
                    role: "admin",
                    contact: "0000000000"
                });
            } else if (user.role !== "admin") {
                // Ensure existing user with this email becomes admin
                user.role = "admin";
                await user.save();
            }
        }

        if (!user) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        // 2. Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { message: "Invalid email or password" },
                { status: 401 }
            );
        }

        // 3. Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "1d" }
        );

        // 4. Return user info and token
        return NextResponse.json({
            token,
            role: user.role,
            name: user.name,
            email: user.email,
            contact: user.contact,
            image: user.image || "",
        });
    } catch (error: any) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}


