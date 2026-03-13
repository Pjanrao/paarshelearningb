import { NextResponse } from "next/server";
import Student from "@/models/EntranceExam/Student.model";
import TestSession from "@/models/EntranceExam/TestSession.model";
import _db from "@/utils/db";
import { authMiddleware } from "@/middlewares/auth";

export const GET = authMiddleware(async function (request: Request) {
    try {
        await _db();
        const students = await Student.find({})
            .populate("college", "name")
            .sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            data: students,
        });
    } catch (error: unknown) {
        console.error("Fetch students error:", error);
        return NextResponse.json(
            { success: false, message: error instanceof Error ? error.message : "An unknown error occurred" },
            { status: 500 }
        );
    }
}, ["admin"]);

export const DELETE = authMiddleware(async function (request: Request) {
    try {
        await _db();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Student ID is required" },
                { status: 400 }
            );
        }

        const student = await Student.findByIdAndDelete(id);
        if (!student) {
            return NextResponse.json(
                { success: false, message: "Student not found" },
                { status: 404 }
            );
        }

        // Delete associated test sessions
        await TestSession.deleteMany({ student: id });

        return NextResponse.json({
            success: true,
            message: "Student and associated test sessions deleted successfully",
        });
    } catch (error: unknown) {
        console.error("Delete student error:", error);
        return NextResponse.json(
            { success: false, message: error instanceof Error ? error.message : "An unknown error occurred" },
            { status: 500 }
        );
    }
}, ["admin"]);
