import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

export async function POST(req: Request) {
    try {
        await connectDB();
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ message: "No token provided" }, { status: 400 });
        }

        // Verify the JWT token
        let decoded: any;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
        } catch (err) {
            return NextResponse.json({ message: "Invalid or expired token" }, { status: 401 });
        }

        // Extract ID and loginToken
        const { id, loginToken } = decoded;

        if (!id) {
            return NextResponse.json({ message: "Malformed token" }, { status: 401 });
        }

        // Fetch User from DB
        const user = await User.findById(id);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // For students: compare the loginToken in the DB against the one in the JWT
        // For admins: skip check — multiple concurrent sessions are allowed
        if (user.role !== "admin" && user.loginToken !== loginToken) {
            return NextResponse.json(
                { message: "Session expired due to another login" },
                { status: 401 }
            );
        }

        return NextResponse.json({ message: "Session valid" }, { status: 200 });
    } catch (error: any) {
        console.error("DEBUG [Verify Session]: Error", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
