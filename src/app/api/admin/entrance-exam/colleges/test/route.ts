import { NextResponse } from "next/server";
import CollegeModel from "@/models/EntranceExam/College.model";
import TestModel from "@/models/EntranceExam/Test.model";
import _db from "@/utils/db";
import { authMiddleware } from "@/middlewares/auth";
import { generateTestLink } from "@/utils/EntranceExam/generateTestLink";
import { BASE_URL } from "@/config/config";
import TestSessionModel from "@/models/EntranceExam/TestSession.model";

export const POST = authMiddleware(async (request: Request) => {
    try {
        await _db();

        const {
            collegeId,
            batchName,
            testDuration,
            testSettings,
            startDateTime,
            endDateTime,
            hasExpiry
        } = await request.json();

        if (!collegeId)
            return NextResponse.json({ success: false, message: "College ID required" }, { status: 400 });

        if (!batchName || !testDuration || !testSettings?.questionsPerTest || !testSettings?.passingScore)
            return NextResponse.json({ success: false, message: "Required fields missing" }, { status: 400 });

        let startTime: Date | null = null;
        let endTime: Date | null = null;

        if (hasExpiry) {
            if (!startDateTime || !endDateTime) {
                return NextResponse.json({ success: false, message: "Start and end date/time are required when schedule is enabled" }, { status: 400 });
            }
            startTime = new Date(startDateTime);
            endTime = new Date(endDateTime);

            if (isNaN(startTime.getTime()) || isNaN(endTime.getTime()))
                return NextResponse.json({ success: false, message: "Invalid date format" }, { status: 400 });

            if (endTime <= startTime)
                return NextResponse.json({ success: false, message: "End time must be after start time" }, { status: 400 });
        }

        const college = await CollegeModel.findById(collegeId);
        if (!college)
            return NextResponse.json({ success: false, message: "College not found" }, { status: 404 });

        const testId = "TEST-" + Date.now();

        const test = await TestModel.create({
            testId,
            college: collegeId,
            batchName,
            testDuration,
            testSettings,
            hasExpiry,
            startTime,
            endTime,
        });

        // Add testId to college's testIds array
        await CollegeModel.findByIdAndUpdate(collegeId, { $push: { testIds: testId } });

        return NextResponse.json({
            success: true,
            message: "Exam created successfully",
            data: test
        });

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}, ["admin"]);

export const GET = authMiddleware(
    async function (request: Request) {
        try {
            await _db();
            const { searchParams } = new URL(request.url);
            const collegeId = searchParams.get("collegeId");
            const currentDate = new Date();

            const query = (collegeId && collegeId !== "all") ? { college: collegeId } : {};
            const tests = await TestModel.find(query).lean().exec();

            return NextResponse.json({
                success: true,
                message: "Tests fetched successfully",
                data: (tests as any[]).map((test) => {
                    const testData = {
                        ...test,
                        testLink: `${BASE_URL}/entrance-exam?testId=${test.testId}&collegeId=${test.college}&batchName=${test.batchName}`,
                        status: "active",
                    };

                    if (test.hasExpiry) {
                        const startTime = new Date(test.startTime);
                        const endTime = new Date(test.endTime);

                        if (currentDate < startTime) {
                            testData.status = "scheduled";
                            testData.statusMessage = `Starts at ${startTime.toLocaleString()}`;
                        } else if (currentDate > endTime) {
                            testData.status = "expired";
                            testData.statusMessage = `Expired on ${endTime.toLocaleString()}`;
                        } else {
                            testData.status = "active";
                            testData.statusMessage = `Ends at ${endTime.toLocaleString()}`;
                        }
                    }

                    return testData;
                }),
            });
        } catch (error: unknown) {
            console.error("Fetch tests error:", error);
            return NextResponse.json(
                { success: false, message: error instanceof Error ? error.message : "Something went wrong" },
                { status: 500 }
            );
        }
    },
    ["admin"]
);

export const DELETE = authMiddleware(
    async function (request: Request) {
        try {
            await _db();
            const { searchParams } = new URL(request.url);
            const testId = searchParams.get("testId");
            const collegeId = searchParams.get("collegeId");

            if (!testId || !collegeId) {
                return NextResponse.json(
                    { success: false, message: "Test ID and college ID are required" },
                    { status: 400 }
                );
            }

            const test = await TestModel.findOneAndDelete({ testId, college: collegeId });
            if (!test) {
                return NextResponse.json(
                    { success: false, message: "Test not found" },
                    { status: 404 }
                );
            }

            await CollegeModel.findByIdAndUpdate(collegeId, { $pull: { testIds: testId } });
            await TestSessionModel.deleteMany({ testId, college: collegeId });

            return NextResponse.json({
                success: true,
                message: "Test and associated sessions deleted successfully",
            });
        } catch (error: unknown) {
            console.error("Delete test error:", error);
            return NextResponse.json(
                { success: false, message: error instanceof Error ? error.message : "An unknown error occurred" },
                { status: 500 }
            );
        }
    },
    ["admin"]
);
export const PUT = authMiddleware(async (request: Request) => {
    try {
        await _db();

        const { searchParams } = new URL(request.url);
        const testId = searchParams.get("testId");

        if (!testId)
            return NextResponse.json({ success: false, message: "Test ID required" }, { status: 400 });

        const body = await request.json();

        let startTime: Date | null = null;
        let endTime: Date | null = null;

        if (body.hasExpiry) {
            if (!body.startDateTime || !body.endDateTime) {
                return NextResponse.json({ success: false, message: "Start and end date/time are required when schedule is enabled" }, { status: 400 });
            }
            startTime = new Date(body.startDateTime);
            endTime = new Date(body.endDateTime);

            if (isNaN(startTime.getTime()) || isNaN(endTime.getTime()))
                return NextResponse.json({ success: false, message: "Invalid date format" }, { status: 400 });

            if (endTime <= startTime)
                return NextResponse.json({ success: false, message: "End time must be after start time" }, { status: 400 });
        }

        const updated = await TestModel.findOneAndUpdate(
            { testId },
            {
                batchName: body.batchName,
                testDuration: body.testDuration,
                testSettings: body.testSettings,
                hasExpiry: body.hasExpiry,
                startTime,
                endTime,
            },
            { new: true }
        );

        if (!updated)
            return NextResponse.json({ success: false, message: "Test not found" }, { status: 404 });

        return NextResponse.json({ success: true, data: updated });

    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}, ["admin"]);
