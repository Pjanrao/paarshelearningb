import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { authMiddleware } from "@/middlewares/auth";
import TestSession from "@/models/EntranceExam/TestSession.model";
import Student from "@/models/EntranceExam/Student.model";
import College from "@/models/EntranceExam/College.model";
import _db from "@/utils/db";

export const GET = authMiddleware(
    async function (request: Request) {
        try {
            await _db();
            const { searchParams } = new URL(request.url);

            const page = parseInt(searchParams.get("page") || "1") || 1;
            const limit = searchParams.get("limit");
            const fetchAll = limit === "all";
            const pageSize = fetchAll ? 0 : parseInt(limit || "20") || 20;

            const collegeId = searchParams.get("collegeId");
            const studentName = searchParams.get("studentName");
            const testId = searchParams.get("testId");
            const passStatus = searchParams.get("passStatus");
            const date = searchParams.get("date");
            const batchName = searchParams.get("batchName");

            if (collegeId && collegeId !== "all" && !mongoose.Types.ObjectId.isValid(collegeId)) {
                return NextResponse.json(
                    { success: false, message: "Invalid collegeId" },
                    { status: 400 }
                );
            }

            interface QueryType {
                college?: mongoose.Types.ObjectId;
                testId?: { $regex: string; $options: string };
                isPassed?: boolean;
                startTime?: { $gte: Date; $lte: Date };
                batchName?: string;
                student?: { $in: mongoose.Types.ObjectId[] };
            }

            const query: QueryType = {};

            if (collegeId && collegeId !== "all") {
                query.college = new mongoose.Types.ObjectId(collegeId);
            }

            if (testId) {
                query.testId = { $regex: testId.trim(), $options: "i" };
            }

            if (passStatus && passStatus !== "all") {
                query.isPassed = passStatus === "pass";
            }

            if (date) {
                const startOfDay = new Date(date);
                startOfDay.setHours(0, 0, 0, 0);
                const endOfDay = new Date(date);
                endOfDay.setHours(23, 59, 59, 999);
                query.startTime = { $gte: startOfDay, $lte: endOfDay };
            }

            if (batchName && batchName !== "all") {
                query.batchName = batchName;
            }

            if (studentName && studentName.trim()) {
                const students = await Student.find(
                    { name: { $regex: studentName.trim(), $options: "i" } },
                    { _id: 1 }
                ).lean();

                const studentIds = students.map(s => s._id as unknown as mongoose.Types.ObjectId);

                if (studentIds.length > 0) {
                    query.student = { $in: studentIds };
                } else {
                    return NextResponse.json({
                        success: true,
                        testSessions: [],
                        pagination: {
                            currentPage: page,
                            pageSize: pageSize || 0,
                            totalRecords: 0,
                            totalPages: 0,
                            hasMore: false,
                            fetchAll: fetchAll
                        },
                    });
                }
            }

            const totalRecords = await TestSession.countDocuments(query);

            let queryBuilder = TestSession.find(query)
                .populate("student", "name")
                .populate("college", "name")
                .sort({ startTime: -1 })
                .lean();

            if (!fetchAll && pageSize > 0) {
                const skip = (page - 1) * pageSize;
                queryBuilder = queryBuilder.skip(skip).limit(pageSize);
            }

            const testSessions = await queryBuilder;

            const totalPages = fetchAll || pageSize === 0 ? 1 : Math.ceil(totalRecords / pageSize);
            const hasMore = fetchAll ? false : page < totalPages;

            return NextResponse.json({
                success: true,
                testSessions,
                pagination: {
                    currentPage: page,
                    pageSize: fetchAll ? totalRecords : pageSize,
                    totalRecords,
                    totalPages,
                    hasMore,
                },
            });
        } catch (error: unknown) {
            console.error("Error fetching test sessions:", error);
            return NextResponse.json(
                {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to fetch test sessions"
                },
                { status: 500 }
            );
        }
    },
    ["admin"],
);

export const DELETE = authMiddleware(
    async function (request: Request) {
        try {
            await _db();
            const { searchParams } = new URL(request.url);
            const id = searchParams.get("id");

            if (!id || !mongoose.Types.ObjectId.isValid(id)) {
                return NextResponse.json(
                    { success: false, message: "Invalid session ID" },
                    { status: 400 }
                );
            }

            const deletedSession = await TestSession.findByIdAndDelete(id);

            if (!deletedSession) {
                return NextResponse.json(
                    { success: false, message: "Session not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                success: true,
                message: "Session log deleted successfully",
            });
        } catch (error: unknown) {
            console.error("Error deleting test session:", error);
            return NextResponse.json(
                {
                    success: false,
                    message: error instanceof Error ? error.message : "Failed to delete test session"
                },
                { status: 500 }
            );
        }
    },
    ["admin"],
);
