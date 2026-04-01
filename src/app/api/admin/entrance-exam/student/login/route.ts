import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import generateTokens from "@/utils/generateTokens";
import StudentModel from "@/models/EntranceExam/Student.model";
import _db from "@/utils/db";
import CollegeModel from "@/models/EntranceExam/College.model";
import TestModel from "@/models/EntranceExam/Test.model";

export async function POST(request: Request) {
    try {
        await _db();
        const payload = await request.json();
        console.log("LOGIN PAYLOAD RECEIVED:", JSON.stringify(payload, null, 2));
        const { email, password, testId, collegeId } = payload;

        if (!email || !password || !testId || !collegeId) {
            return NextResponse.json(
                { success: false, error: "Email, password, test ID, and college ID are required" },
                { status: 400 }
            );
        }

        const mongoose = (await import("mongoose")).default;
        if (!mongoose.Types.ObjectId.isValid(collegeId)) {
            return NextResponse.json(
                { success: false, error: "Invalid college ID format" },
                { status: 400 }
            );
        }

        const college = await CollegeModel.findById(collegeId);
        if (!college) {
            console.log("Login failed: College not found", collegeId);
            return NextResponse.json(
                { success: false, error: "College not found" },
                { status: 400 }
            );
        }

        const test = await TestModel.findOne({ testId, college: collegeId });
        if (!test) {
            console.log("Login failed: Test/College mismatch", { testId, collegeId });
            return NextResponse.json(
                { success: false, error: `Invalid test for ${college.name}` },
                { status: 400 }
            );
        }

        const student = await StudentModel.findOne({
            email: email.trim().toLowerCase(),
            college: collegeId
        });

        if (!student) {
            console.log("Login failed: Student not found for email and college", { email, collegeId });
            return NextResponse.json(
                { success: false, error: "Student not registered with this institution." },
                { status: 404 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, student.password);
        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, error: "Invalid password" },
                { status: 401 }
            );
        }

        const { accessToken, refreshToken } = generateTokens(student._id, "entrance_student");
        const { password: _, ...safeUser } = student.toObject();

        return NextResponse.json({
            success: true,
            message: "Login successful",
            user: { ...safeUser, role: "entrance_student", collegeName: college.name },
            student_access_token: accessToken,
            student_refresh_token: refreshToken,
            studentId: student._id.toString(),
            redirectTo: `/entrance-exam?testId=${testId}&collegeId=${collegeId}`,
        });
    } catch (error: unknown) {
        console.error("Login error:", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Something went wrong" },
            { status: 500 }
        );
    }
}
