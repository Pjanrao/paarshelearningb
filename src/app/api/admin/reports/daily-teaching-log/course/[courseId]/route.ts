import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import TeacherDailyLog from "@/models/TeacherDailyLog";
import "@/models/Batch";
import "@/models/Course";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ courseId: string }> }
) {
    try {
        await connectDB();

        const { courseId } = await params;

        const logs = await TeacherDailyLog.find()
            .populate({
                path: "batchId",
                select: "name courseId",
                match: { courseId },
                populate: {
                    path: "courseId",
                    select: "name",
                },
            })
            .populate("teacherId", "name")
            .sort({ logDate: -1 })
            .lean();

        const filteredLogs = logs.filter(
            (log: any) => log.batchId !== null
        );

        const formattedLogs = filteredLogs.map((log: any) => ({
            _id: log._id,
            logDate: log.logDate
                ? new Date(log.logDate).toLocaleDateString()
                : "-",
            notes: log.notes || "",
            teacher: log.teacherId?.name || "Unknown",
            batch: log.batchId?.name || "Unknown Batch",
            course: log.batchId?.courseId?.name || "",
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