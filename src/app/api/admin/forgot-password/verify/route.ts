import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getAuthUser } from "@/lib/api-auth";

export async function POST(req: Request) {
    try {
        await connectDB();
        
        const { otp, newPassword } = await req.json();

        const authUser = await getAuthUser();
        if (!authUser || authUser.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findById(authUser.id).select("+password");
        if (!user) {
            return NextResponse.json({ error: "Admin not found" }, { status: 404 });
        }

        // 1. Check if OTP exists and matches
        if (!user.resetOtp || user.resetOtp !== otp) {
            return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
        }

        // 2. Check if OTP has expired
        if (!user.resetOtpExpires || new Date() > user.resetOtpExpires) {
            return NextResponse.json({ error: "OTP has expired" }, { status: 400 });
        }

        // 3. Hash and update password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // 4. Clear OTP fields
        user.resetOtp = null;
        user.resetOtpExpires = null;
        
        await user.save();

        return NextResponse.json({ message: "Password updated successfully" });
    } catch (error: any) {
        console.error("OTP Verification Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
