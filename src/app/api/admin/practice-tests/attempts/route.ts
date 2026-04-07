import { connectDB } from "@/lib/db";
import TestAttempt from "@/models/TestAttempt";
import PracticeTest from "@/models/PracticeTest";
import User from "@/models/User";
import Batch from "@/models/Batch";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const studentName = searchParams.get("studentName") || "";
    const testName = searchParams.get("testName") || "";
    const status = searchParams.get("status") || "all";
    const dateStr = searchParams.get("date") || "";

    const query: any = {};

    if (status !== "all") {
      query.status = status;
    }

    if (dateStr) {
      const startOfDay = new Date(dateStr);
      const endOfDay = new Date(dateStr);
      endOfDay.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }

    // Since we need to filter by populated fields (studentName, testName), 
    // aggregation is more scalable.
    const pipeline: any[] = [
      { $match: query },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "student",
        },
      },
      { $unwind: "$student" },
      {
        $lookup: {
          from: "practicetests",
          localField: "testId",
          foreignField: "_id",
          as: "test",
        },
      },
      { $unwind: "$test" },
    ];

    if (studentName) {
      pipeline.push({
        $match: { "student.name": { $regex: studentName, $options: "i" } },
      });
    }

    if (testName) {
      pipeline.push({
        $match: { "test.name": { $regex: testName, $options: "i" } },
      });
    }

    // Clone pipeline for count before pagination
    const countPipeline = [...pipeline, { $count: "total" }];
    const countResult = await TestAttempt.aggregate(countPipeline);
    const totalRecords = countResult.length > 0 ? countResult[0].total : 0;

    // Sorting and Pagination
    pipeline.push({ $sort: { createdAt: -1 } });
    pipeline.push({ $skip: (page - 1) * limit });
    pipeline.push({ $limit: limit });

    const attempts = await TestAttempt.aggregate(pipeline);

    // Resolve Batches for each returned student
    const populatedAttempts = await Promise.all(
      attempts.map(async (attempt: any) => {
        let batchName = "Not Assigned";
        if (attempt.student && attempt.student._id) {
          const studentBatch = await Batch.findOne({
            students: attempt.student._id,
          }).select("name");
          if (studentBatch) batchName = studentBatch.name;
        }

        return {
          ...attempt,
          userId: {
            _id: attempt.student._id,
            name: attempt.student.name,
            email: attempt.student.email,
            contact: attempt.student.contact,
            batchName,
          },
          testId: {
            _id: attempt.test._id,
            name: attempt.test.name,
            duration: attempt.test.duration,
          },
        };
      })
    );

    return NextResponse.json({
      testLogs: populatedAttempts,
      pagination: {
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit),
        currentPage: page,
        hasMore: page < Math.ceil(totalRecords / limit),
      },
    });
  } catch (error: any) {
    console.error("Fetch logs error:", error);
    return NextResponse.json(
      { message: "Failed to fetch test logs", error: error.message },
      { status: 500 }
    );
  }
}
