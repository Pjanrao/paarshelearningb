import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { connectDB } from "@/lib/db";
import User from "@/models/User";

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
        const { email } = await req.json();
        console.log("Checking forgot password for:", email);

        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found:", email);
            // We return 200 even if user doesn't exist for security reasons
            return NextResponse.json(
                { message: "If an account exists with that email, a reset link has been sent." },
                { status: 200 }
            );
        }

        // 2. Generate reset token
        const resetToken = jwt.sign(
            { id: user._id, type: "password-reset" },
            process.env.JWT_SECRET || "default_secret",
            { expiresIn: "1h" }
        );

        // 3. Configure Recipient & URL
        const protocol = req.headers.get("x-forwarded-proto") || "http";
        const host = req.headers.get("host");
        const baseUrl = process.env.NEXTAUTH_URL || `${protocol}://${host}`;
        const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;

        // Custom logic: Admin emails go to paarshelearning@gmail.com, students to their own
        const recipientEmail = user.role === "admin" ? "paarshelearning@gmail.com" : email;

        console.log(`Sending reset link via Nodemailer to ${recipientEmail} for user role: ${user.role}`);

        // 4. Send email via Nodemailer
        await transporter.sendMail({
            from: `"Paarsh E-learning" <${process.env.EMAIL_USER}>`,
            to: recipientEmail,
            subject: "Reset Your Password - Paarsh E-learning",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 12px; overflow: hidden;">
                    <div style="background-color: #2C4276; padding: 20px; text-align: center;">
                        <h2 style="color: white; margin: 0;">Password Reset Request</h2>
                    </div>
                    <div style="padding: 30px; color: #333;">
                        <p>Hello ${user.name},</p>
                        <p>You requested to reset your password for your Paarsh E-learning account. Click the button below to set a new one:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${resetUrl}" style="background-color: #2C4276; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Reset Password</a>
                        </div>
                        <p style="font-size: 14px; color: #666;">This link will expire in <strong>1 hour</strong>. If you didn't request this, you can safely ignore this email.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;" />
                        <p style="color: #666; font-size: 12px; text-align: center;">
                            Paarsh E-learning Team<br/>
                            This is an automated message, please do not reply.
                        </p>
                    </div>
                </div>
            `,
        });

        return NextResponse.json(
            { message: "Reset link sent successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Forgot password error (Detailed):", {
            message: error.message,
            code: error.code,
            command: error.command,
            response: error.response,
        });
        return NextResponse.json(
            { message: "Mailing service failed. Please check credentials or App Password.", error: error.message },
            { status: 500 }
        );
    }
}
