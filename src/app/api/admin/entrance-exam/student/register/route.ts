import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import validator from "validator";
import generateTokens from "@/utils/generateTokens";
import StudentModel from "@/models/EntranceExam/Student.model";
import CollegeModel from "@/models/EntranceExam/College.model";
import TestModel from "@/models/EntranceExam/Test.model";
import _db from "@/utils/db";

export async function POST(request: Request) {
    try {
        await _db();
        const payload = await request.json();
        console.log("REGISTRATION PAYLOAD RECEIVED:", JSON.stringify(payload, null, 2));

        let { name, email, phone, degree, university, gender, testId, collegeId, password } = payload;

        if (!name || !email || !phone || !degree || !university || !gender || !testId || !collegeId || !password) {
            const missing = [];
            if (!name) missing.push("name");
            if (!email) missing.push("email");
            if (!phone) missing.push("phone");
            if (!degree) missing.push("degree");
            if (!university) missing.push("university");
            if (!gender) missing.push("gender");
            if (!testId) missing.push("testId");
            if (!collegeId) missing.push("collegeId");
            if (!password) missing.push("password");

            console.log("Registration failed: Missing fields:", missing);
            return NextResponse.json(
                { success: false, error: `Missing fields: ${missing.join(", ")}` },
                { status: 400 }
            );
        }

        // Basic sanitization
        email = email.trim().toLowerCase();
        phone = phone.trim().replace(/\s/g, "");

        if (!validator.isEmail(email)) {
            console.log("Registration failed: Invalid email", email);
            return NextResponse.json(
                { success: false, error: `Invalid email format: ${email}` },
                { status: 400 }
            );
        }

        // Improved phone check
        if (!validator.isMobilePhone(phone, 'any', { strictMode: false })) {
            console.log("Registration failed: Invalid phone format", phone);
            return NextResponse.json(
                { success: false, error: `Invalid phone format: ${phone}. Please enter a valid mobile number.` },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            console.log("Registration failed: Password too short");
            return NextResponse.json(
                { success: false, error: "Password must be at least 6 characters long" },
                { status: 400 }
            );
        }

        const college = await CollegeModel.findById(collegeId);
        if (!college) {
            console.log("Registration failed: College not found", collegeId);
            return NextResponse.json(
                { success: false, error: "College not found. Please use a valid registration link." },
                { status: 400 }
            );
        }

        const test = await TestModel.findOne({ testId, college: collegeId });
        if (!test) {
            console.log("Registration failed: Test/College mismatch", { testId, collegeId });
            return NextResponse.json(
                { success: false, error: `This exam is not associated with ${college.name}.` },
                { status: 400 }
            );
        }

        const existingStudent = await StudentModel.findOne({ email, college: collegeId });
        if (existingStudent) {
            console.log("Registration failed: Student already exists for this college", email);
            return NextResponse.json(
                { success: false, error: "Student already registered for this college" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const student = new StudentModel({
            name: name.trim(),
            email: email.toLowerCase(),
            phone,
            degree,
            university,
            gender,
            college: collegeId,
            password: hashedPassword,
        });
        await student.save();

        const { accessToken, refreshToken } = generateTokens(student._id, "entrance_student");
        const { password: _, ...safeUser } = student.toObject();

        return NextResponse.json({
            success: true,
            message: "Registration successful",
            user: { ...safeUser, role: "entrance_student", collegeName: college.name },
            student_access_token: accessToken,
            student_refresh_token: refreshToken,
            studentId: student._id,
            redirectTo: `/entrance-exam?testId=${testId}&collegeId=${collegeId}`,
        });
    } catch (error: unknown) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Something went wrong" },
            { status: 500 }
        );
    }
}
