import { NextResponse } from "next/server";
import _db from "@/utils/db";
import { authMiddleware } from "@/middlewares/auth";
import TestSessionModel from "@/models/EntranceExam/TestSession.model";
import StudentModel from "@/models/EntranceExam/Student.model";
import CollegeModel from "@/models/EntranceExam/College.model";
import TestModel from "@/models/EntranceExam/Test.model";

export const GET = authMiddleware(async function (request: Request) {
    try {
        await _db();

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

        const [
            totalStudents,
            studentsThisMonth,
            studentsLastMonth,
            totalColleges,
            totalExams,
            totalSessions,
            passedSessions,
        ] = await Promise.all([
            StudentModel.countDocuments().catch(() => 0),
            StudentModel.countDocuments({ createdAt: { $gte: startOfMonth } }).catch(() => 0),
            StudentModel.countDocuments({ createdAt: { $gte: startOfLastMonth, $lt: startOfMonth } }).catch(() => 0),
            CollegeModel.countDocuments().catch(() => 0),
            TestModel.countDocuments().catch(() => 0),
            TestSessionModel.countDocuments({ status: "completed" }).catch(() => 0),
            TestSessionModel.countDocuments({ status: "completed", isPassed: true }).catch(() => 0),
        ]);

        const passRate = totalSessions > 0
            ? Math.round((passedSessions / totalSessions) * 100)
            : 0;

        const studentGrowth = studentsLastMonth > 0
            ? Math.round(((studentsThisMonth - studentsLastMonth) / studentsLastMonth) * 100)
            : studentsThisMonth > 0 ? 100 : 0;

        let monthlyStudentsFormatted: any[] = [];
        try {
            const monthlyStudents = await StudentModel.aggregate([
                { $match: { createdAt: { $gte: sixMonthsAgo } } },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                        },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
            ]);
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            monthlyStudentsFormatted = monthlyStudents.map((m) => ({
                month: `${monthNames[m._id.month - 1]} ${m._id.year}`,
                students: m.count,
            }));
        } catch (e) {
            console.error("monthlyStudents aggregation error:", e);
        }
        let collegePerformance: any[] = [];
        try {
            collegePerformance = await TestSessionModel.aggregate([
                { $match: { status: "completed" } },
                {
                    $group: {
                        _id: "$college",
                        total: { $sum: 1 },
                        passed: { $sum: { $cond: [{ $eq: ["$isPassed", true] }, 1, 0] } },
                    },
                },
                {
                    $lookup: {
                        from: "entrancecolleges",
                        localField: "_id",
                        foreignField: "_id",
                        as: "collegeInfo",
                    },
                },
                {
                    $addFields: {
                        college: {
                            $ifNull: [
                                { $arrayElemAt: ["$collegeInfo.name", 0] },
                                "Unknown",
                            ],
                        },
                        failed: { $subtract: ["$total", "$passed"] },
                    },
                },
                { $project: { _id: 0, college: 1, total: 1, passed: 1, failed: 1 } },
                { $sort: { total: -1 } },
                { $limit: 8 },
            ]);
        } catch (e) {
            console.error("collegePerformance aggregation error:", e);
        }

        let scoreDistFormatted: any[] = [];
        try {
            const scoreDist = await TestSessionModel.aggregate([
                { $match: { status: "completed" } },
                {
                    $addFields: {
                        scoreRange: {
                            $switch: {
                                branches: [
                                    { case: { $lt: ["$percentage", 20] }, then: "0–20%" },
                                    { case: { $lt: ["$percentage", 40] }, then: "20–40%" },
                                    { case: { $lt: ["$percentage", 60] }, then: "40–60%" },
                                    { case: { $lt: ["$percentage", 80] }, then: "60–80%" },
                                ],
                                default: "80–100%",
                            },
                        },
                    },
                },
                {
                    $group: {
                        _id: "$scoreRange",
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]);

            const order = ["0–20%", "20–40%", "40–60%", "60–80%", "80–100%"];
            const distMap = Object.fromEntries(scoreDist.map((s) => [s._id, s.count]));
            scoreDistFormatted = order.map((range) => ({
                range,
                count: distMap[range] || 0,
            }));
        } catch (e) {
            console.error("scoreDistribution aggregation error:", e);
        }

        let monthlySessionsFormatted: any[] = [];
        try {
            const monthlySessions = await TestSessionModel.aggregate([
                { $match: { status: "completed", startTime: { $gte: sixMonthsAgo } } },
                {
                    $group: {
                        _id: {
                            year: { $year: "$startTime" },
                            month: { $month: "$startTime" },
                        },
                        total: { $sum: 1 },
                        passed: { $sum: { $cond: [{ $eq: ["$isPassed", true] }, 1, 0] } },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
            ]);

            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            monthlySessionsFormatted = monthlySessions.map((m) => ({
                month: monthNames[m._id.month - 1],
                total: m.total,
                passed: m.passed,
                failed: m.total - m.passed,
            }));
        } catch (e) {
            console.error("monthlySessions aggregation error:", e);
        }

        let recentSessionsFormatted: any[] = [];
        try {
            const recentSessions = await TestSessionModel.find({ status: "completed" })
                .sort({ startTime: -1 })
                .limit(10)
                .lean();

            const collegeIds = [...new Set(recentSessions.map((s: any) => s.college?.toString()).filter(Boolean))];
            const studentIds = [...new Set(recentSessions.map((s: any) => s.student?.toString()).filter(Boolean))];

            const [colleges, students] = await Promise.all([
                CollegeModel.find({ _id: { $in: collegeIds } }).select("name").lean(),
                StudentModel.find({ _id: { $in: studentIds } }).select("name email").lean(),
            ]);

            const collegeMap: Record<string, string> = {};
            (colleges as any[]).forEach((c) => { collegeMap[c._id.toString()] = c.name; });
            const studentMap: Record<string, { name: string; email: string }> = {};
            (students as any[]).forEach((s) => { studentMap[s._id.toString()] = { name: s.name, email: s.email }; });

            recentSessionsFormatted = recentSessions.map((s: any) => ({
                studentName: studentMap[s.student?.toString()]?.name || "Unknown",
                studentEmail: studentMap[s.student?.toString()]?.email || "",
                college: collegeMap[s.college?.toString()] || "Unknown",
                score: s.score || 0,
                percentage: Math.round(s.percentage || 0),
                isPassed: s.isPassed,
                batchName: s.batchName,
                date: s.startTime,
            }));
        } catch (e) {
            console.error("recentSessions error:", e);
        }

        // Category-wise performance
        let categoryPerformance: any[] = [];
        try {
            categoryPerformance = await TestSessionModel.aggregate([
                { $match: { status: "completed" } },
                { $unwind: "$questions" },
                {
                    $lookup: {
                        from: "entrancequestions",
                        localField: "questions.question",
                        foreignField: "_id",
                        as: "qInfo",
                    },
                },
                { $unwind: "$qInfo" },
                {
                    $group: {
                        _id: "$qInfo.category",
                        total: { $sum: 1 },
                        correct: { $sum: { $cond: [{ $eq: ["$questions.isCorrect", true] }, 1, 0] } },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        category: { $toUpper: "$_id" },
                        accuracy: {
                            $round: [
                                { $multiply: [{ $divide: ["$correct", "$total"] }, 100] },
                                1
                            ]
                        }
                    }
                },
                { $sort: { accuracy: -1 } }
            ]);
        } catch (e) {
            console.error("categoryPerformance error:", e);
        }

        return NextResponse.json({
            success: true,
            data: {
                kpis: {
                    totalStudents,
                    studentsThisMonth,
                    studentGrowth,
                    totalColleges,
                    totalExams,
                    totalSessions,
                    passedSessions,
                    passRate,
                },
                monthlyStudents: monthlyStudentsFormatted,
                collegePerformance,
                scoreDistribution: scoreDistFormatted,
                monthlySessions: monthlySessionsFormatted,
                recentSessions: recentSessionsFormatted,
                categoryPerformance,
            },
        });
    } catch (error: unknown) {
        console.error("Reports API error:", error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : "Something went wrong" },
            { status: 500 }
        );
    }
}, ["admin"]);
