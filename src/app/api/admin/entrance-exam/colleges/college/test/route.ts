import { NextResponse } from "next/server";
import CollegeModel from "@/models/EntranceExam/College.model";
import TestModel from "@/models/EntranceExam/Test.model";
import _db from "@/utils/db";
import { authMiddleware } from "@/middlewares/auth";
import TestSessionModel from "@/models/EntranceExam/TestSession.model";
import mongoose from "mongoose";

export const GET = authMiddleware(
    async function (request: Request) {
        try {
            await _db();
            const { searchParams } = new URL(request.url);
            const collegeId = searchParams.get("collegeId");

            if (collegeId && !mongoose.Types.ObjectId.isValid(collegeId)) {
                return NextResponse.json(
                    { success: false, message: "Invalid collegeId" },
                    { status: 400 },
                );
            }

            const query = collegeId
                ? { college: new mongoose.Types.ObjectId(collegeId) }
                : {};

            const tests = await TestModel.find(query).lean().exec();
            return NextResponse.json({
                success: true,
                message: "Tests fetched successfully",
                data: tests,
            });
        } catch (error: unknown) {
            console.error("Fetch tests error:", error);
            return NextResponse.json(
                { success: false, message: error instanceof Error ? error.message : "Something went wrong" },
                { status: 500 },
            );
        }
    },
    ["admin"],
);
