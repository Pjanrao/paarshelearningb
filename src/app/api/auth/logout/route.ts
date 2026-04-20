import { NextResponse } from "next/server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value || 
                      cookieStore.get("studentToken")?.value || 
                      cookieStore.get("adminToken")?.value;

        if (token) {
            try {
                // Decode token to get user ID - Allow expired tokens for logout purposes
                const decoded: any = jwt.verify(
                    token,
                    process.env.JWT_SECRET || "paarsh_super_secret_key_123",
                    { ignoreExpiration: true }
                );

                if (decoded && decoded.id) {
                    await connectDB();
                    // Clear the loginToken in DB so user can log in again easily
                    const updatedUser = await User.findByIdAndUpdate(decoded.id, {
                        $set: { loginToken: null }
                    });
                }
            } catch (err) {
                console.error("Logout DB clear error:", err);
            }
        }

        const response = NextResponse.json(
            { message: "Logged out successfully" },
            { status: 200 }
        );

        // Clear cookies server-side
        response.cookies.set("token", "", {
            path: "/",
            expires: new Date(0),
            httpOnly: true,
        });

        response.cookies.set("role", "", {
            path: "/",
            expires: new Date(0),
        });

        response.cookies.set("next-auth.session-token", "", {
            path: "/",
            expires: new Date(0),
        });

        return response;
    } catch (error: any) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}