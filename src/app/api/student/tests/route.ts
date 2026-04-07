import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Batch from "@/models/Batch";
import PracticeTest from "@/models/PracticeTest";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function GET(req: any) {
  try {
    await connectDB();
    
    // 1. Get raw cookie from header
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
        cookieHeader.split(";").map((c: string) => {
            const [name, ...rest] = c.trim().split("=");
            return [name, rest.join("=")];
        })
    );

    const token = cookies["token"];
    const role = cookies["role"];

    let studentId: string | null = null;

    if (token) {
        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
            studentId = decoded.id;
            console.log("DEBUG [Student Tests]: Resolved ID from custom token:", studentId);
        } catch (err) {
            console.error("DEBUG [Student Tests]: JWT Verification Failed:", err);
        }
    }

    if (!studentId || role !== "student") {
        return NextResponse.json({ 
            message: "Unauthorized: Invalid or missing custom token",
            debug: { hasToken: !!token, role }
        }, { status: 401 });
    }

    // Resolve Student Identity
    let studentIdObj: mongoose.Types.ObjectId | null = null;
    try {
        studentIdObj = new mongoose.Types.ObjectId(studentId);
    } catch (e) {
        console.error("Invalid ObjectId format in token:", studentId);
        return NextResponse.json({ message: "Invalid student identity format" }, { status: 401 });
    }

    // 1. Find batches current student is enrolled in
    // Searching by both ObjectId and String ID for maximum resilience
    const userBatches = await Batch.find({
      students: { $in: [studentIdObj, studentIdObj.toString()] },
    }).select("courseId status");

    if (!userBatches || userBatches.length === 0) {
      return NextResponse.json([], { 
          headers: { "x-debug-msg": `No batches found for resolved ID: ${studentIdObj}` } 
      });
    }

    // Extract unique course IDs
    const courseIds = [...new Set(userBatches.map((b) => b.courseId.toString()))].map(
        (id) => new mongoose.Types.ObjectId(id)
    );

    // 2. Find active tests for these courses
    const tests = await PracticeTest.find({
      courseIds: { $in: courseIds },
      status: "active",
    }).populate("courseIds", "name");

    return NextResponse.json(tests);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch student tests", error: error.message },
      { status: 500 }
    );
  }
}
