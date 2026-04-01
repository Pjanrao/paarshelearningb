import { NextResponse } from "next/server";

export async function POST() {
    try {
        const response = NextResponse.json(
            { message: "Logged out successfully" },
            { status: 200 }
        );

        // Clear cookies server-side via Set-Cookie headers
        response.cookies.set("token", "", {
            path: "/",
            expires: new Date(0),
            httpOnly: false, // Ensure it can still be read/cleared by client if needed, but here we are forcing clear
        });

        response.cookies.set("role", "", {
            path: "/",
            expires: new Date(0),
        });

        // Also try to clear NextAuth cookies if they exist
        response.cookies.set("next-auth.session-token", "", {
            path: "/",
            expires: new Date(0),
        });

        return response;
    } catch (error: any) {
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}