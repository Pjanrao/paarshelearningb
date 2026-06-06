import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import TeacherDailyLog from "@/models/TeacherDailyLog";
import "@/models/Batch";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ teacherId: string }> }
) {
    try {
        await connectDB();

        const { teacherId } = await params;

        const logs = await TeacherDailyLog.find({
            teacherId,
        })
            .populate("teacherId", "name")
            .populate("batchId", "name")
            .sort({ logDate: -1 })
            .lean();

        const formattedLogs = logs.map((log: any) => ({
            _id: log._id,
            logDate: log.logDate
                ? new Date(log.logDate).toLocaleDateString()
                : "-",
            notes: log.notes || "",
            teacher: log.teacherId?.name || "Unknown",
            batch: log.batchId?.name || "Unknown Batch",
            createdAt: log.createdAt,
        }));

        return NextResponse.json({
            success: true,
            logs: formattedLogs,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}