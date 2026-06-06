import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import TeacherDailyLog from "@/models/TeacherDailyLog";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ batchId: string }> }
) {
    try {
        await connectDB();

        const { batchId } = await params;

        const logs = await TeacherDailyLog.find({
            batchId,
        })
            .populate("teacherId", "name")
            .sort({ logDate: -1 })
            .lean();

        const formattedLogs = logs.map((log: any) => ({
            _id: log._id,
            logDate: log.logDate
                ? new Date(log.logDate).toLocaleDateString()
                : "-",
            notes: log.notes || "",
            teacher: log.teacherId?.name || "Unknown",
            createdAt: log.createdAt,
        }));

        return NextResponse.json({
            success: true,
            logs: formattedLogs,
        });
    } catch (error: any) {
        console.error("Batch log fetch error:", error);

        return NextResponse.json(
            {
                success: false,
                message: error.message,
            },
            { status: 500 }
        );
    }
}