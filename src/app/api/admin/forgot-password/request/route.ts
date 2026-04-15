import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getAuthUser } from "@/lib/api-auth";

// Configure Nodemailer with Gmail SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

export async function POST(req: Request) {
    try {
        await connectDB();
        
        const authUser = await getAuthUser();
        if (!authUser || authUser.role !== 'admin') {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findById(authUser.id);
        if (!user) {
            return NextResponse.json({ error: "Admin not found" }, { status: 404 });
        }

        // 1. Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // 2. Save OTP to user record
        user.resetOtp = otp;
        user.resetOtpExpires = otpExpires;
        await user.save();

        // 3. Send OTP via email
        // Requirement: Always send admin forgot password mail to paarshelearning@gmail.com
        const recipientEmail = "paarshelearning@gmail.com";

        await transporter.sendMail({
            from: `"Paarsh E-learning" <${process.env.EMAIL_USER}>`,
            to: recipientEmail,
            subject: "Your Password Reset OTP - Admin Panel",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 12px; overflow: hidden;">
                    <div style="background-color: #2C4276; padding: 20px; text-align: center;">
                        <h2 style="color: white; margin: 0;">Verification Code</h2>
                    </div>
                    <div style="padding: 30px; color: #333;">
                        <p>Hello ${user.name},</p>
                        <p>You requested a password reset for your Admin account. Please use the following One-Time Password (OTP) to proceed:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <span style="background-color: #f4f7ff; color: #2C4276; padding: 15px 30px; border-radius: 8px; font-weight: bold; font-size: 32px; letter-spacing: 5px; border: 2px dashed #2C4276; display: inline-block;">${otp}</span>
                        </div>
                        <p style="font-size: 14px; color: #666;">This code is valid for <strong>10 minutes</strong>. If you didn't request this, please secure your account immediately.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                        <p style="color: #666; font-size: 12px; text-align: center;">
                            Paarsh E-learning Admin Team<br/>
                            This is an automated message, please do not reply.
                        </p>
                    </div>
                </div>
            `,
        });

        return NextResponse.json({ message: "OTP sent successfully" });
    } catch (error: any) {
        console.error("OTP Request Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
