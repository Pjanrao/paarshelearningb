import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Teachers from "@/models/Teachers";
import {
    validateEmail,
    validatePhone,
    validateName,
    validatePassword,
} from "@/utils/validation";

// Helper
function generateReferralCode(name: string) {
    return (
        name.slice(0, 3).toUpperCase() +
        Date.now().toString().slice(-4)
    );
}

export async function POST(req: Request) {
    try {
        await connectDB();

        const { name, email, contact, password, designation, course, experience, dateOfJoining } = await req.json();

        if (!name || !email || !contact || !password || !designation || !course || !experience || !dateOfJoining) {
            return NextResponse.json(
                { message: "All fields are required." },
                { status: 400 }
            );
        }

        if (!validateName(name)) {
            return NextResponse.json({ message: "Invalid name" }, { status: 400 });
        }

        if (!validateEmail(email)) {
            return NextResponse.json({ message: "Invalid email" }, { status: 400 });
        }

        if (!validatePhone(contact)) {
            return NextResponse.json({ message: "Invalid contact" }, { status: 400 });
        }

        const passwordCheck = validatePassword(password);
        if (!passwordCheck.valid) {
            return NextResponse.json(
                { message: passwordCheck.message },
                { status: 400 }
            );
        }

        // Check if user exists
        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) {
            return NextResponse.json(
                { message: "An account with this email already exists." },
                { status: 400 }
            );
        }

        const contactExists = await User.findOne({ contact });
        if (contactExists) {
            return NextResponse.json(
                { message: "An account with this contact number already exists." },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create User
        const newUser = await User.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            contact,
            password: hashedPassword,
            role: "teacher",
            approvalStatus: "pending",
            referralCode: generateReferralCode(name),
        });

        // Create Teacher profile
        await Teachers.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            contact,
            designation,
            course,
            experience,
            dateOfJoining,
            approvalStatus: "pending",
            userId: newUser._id,
        });

        return NextResponse.json(
            { message: "Teacher registered successfully. Pending admin approval." },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Teacher registration error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
