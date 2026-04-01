import { NextResponse } from 'next/server';
import CollegeModel from '@/models/EntranceExam/College.model';
import _db from '@/utils/db';
import { authMiddleware } from '@/middlewares/auth';
import TestSessionModel from '@/models/EntranceExam/TestSession.model';


export const POST = authMiddleware(async function (request: Request) {
    try {
        await _db();
        const { name, email } = await request.json();

        if (!name || !email) {
            return NextResponse.json(
                { success: false, message: "Name and email are required" },
                { status: 400 }
            );
        }

        const existingCollege = await CollegeModel.findOne({ email });
        if (existingCollege) {
            return NextResponse.json(
                { success: false, message: "College with this email already exists" },
                { status: 400 }
            );
        }

        const userId = (request as any).user?._id;
        if (!userId) {
            console.warn("POST /api/admin/entrance-exam/colleges: No user ID found on request. Auth middleware may be misconfigured.");
        }

        const college = new CollegeModel({
            name,
            email,
            createdBy: userId || "000000000000000000000000", // Fallback if auth is still being set up
        });
        await college.save();

        return NextResponse.json({
            success: true,
            message: "College created successfully",
            data: college,
        });
    } catch (error: unknown) {
        console.error("College creation error:", error);
        return NextResponse.json(
            { success: false, message: error instanceof Error ? error.message : "An unknown error occurred" },
            { status: 500 }
        );
    }
}, ["admin"]);

export const GET = authMiddleware(async function (request) {
    try {
        await _db();
        const colleges = await CollegeModel.find()
            .sort({ createdAt: -1 });

        return NextResponse.json({ success: true, colleges });
    } catch (error: unknown) {
        console.error("College fetch error:", error);
        return NextResponse.json(
            { success: false, message: error instanceof Error ? error.message : "An unknown error occurred" },
            { status: 500 }
        );
    }
}, ["admin"]);

export const PUT = authMiddleware(async function (request) {
    try {
        await _db();
        const { searchParams } = new URL(request.url);
        const collegeId = searchParams.get("collegeId");

        const { name, email } = await request.json();

        const college = await CollegeModel.findByIdAndUpdate(
            collegeId,
            {
                name,
                email,
            },
            { new: true, runValidators: true }
        );

        if (!college) {
            return NextResponse.json(
                { success: false, message: "College not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, college });
    } catch (error: unknown) {
        console.error("College update error:", error);
        return NextResponse.json(
            { success: false, message: error instanceof Error ? error.message : "An unknown error occurred" },
            { status: 500 }
        );
    }
}, ["admin"]);

export const DELETE = authMiddleware(async function (request) {
    try {
        await _db();
        const { searchParams } = new URL(request.url);
        const collegeId = searchParams.get("collegeId");

        const college = await CollegeModel.findByIdAndDelete(collegeId);
        if (!college) {
            return NextResponse.json(
                { success: false, message: "College not found" },
                { status: 404 }
            );
        }

        await TestSessionModel.deleteMany({ college: college._id });

        return NextResponse.json({
            success: true,
            message: "College and associated test sessions deleted successfully",
        });
    } catch (error: unknown) {
        console.error("College deletion error:", error);
        return NextResponse.json(
            { success: false, message: error instanceof Error ? error.message : "An unknown error occurred" },
            { status: 500 }
        );
    }
}, ["admin"]);

