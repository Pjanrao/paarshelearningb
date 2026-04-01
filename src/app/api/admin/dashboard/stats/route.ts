import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Course from "@/models/Course";
import Payment from "@/models/Payment";
import Enquiry from "@/models/Inquiry";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await connectDB();

        // ✅ Main Stats
        const totalStudents = await User.countDocuments({ role: "student" });
        const totalCourses = await Course.countDocuments({});
        const totalinquiries = await Enquiry.countDocuments({});

        // ✅ Sales = users who paid something
        const totalSales = await Payment.countDocuments({
            paidAmount: { $gt: 0 },
        });

        // ✅ Sales Chart Data (daily)
        const salesData = await Payment.aggregate([
            {
                $match: {
                    paidAmount: { $gt: 0 },
                },
            },
            {
                $group: {
                    _id: {
                        date: {
                            $dateToString: {
                                format: "%d %b",
                                date: "$createdAt",
                            },
                        },
                    },
                    sales: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    salesDay: "$_id.date",
                    sales: 1,
                },
            },
            {
                $sort: { salesDay: 1 },
            },
        ]);
        // ✅ Revenue chart data (daily revenue)
        const revenueData = await Payment.aggregate([
            {
                $addFields: {
                    installmentTotal: {
                        $sum: "$installments.amount",
                    },
                },
            },
            {
                $group: {
                    _id: {
                        date: {
                            $dateToString: {
                                format: "%d %b",
                                date: "$createdAt",
                            },
                        },
                    },
                    revenue: {
                        $sum: {
                            $add: ["$paidAmount", "$installmentTotal"],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id.date",
                    revenue: 1,
                },
            },
            {
                $sort: { date: 1 },
            },
        ]);
        // ✅ Revenue = paidAmount + installments
        const revenueAggregation = await Payment.aggregate([
            {
                $addFields: {
                    installmentTotal: {
                        $sum: "$installments.amount",
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: {
                            $add: ["$paidAmount", "$installmentTotal"],
                        },
                    },
                },
            },
        ]);

        const totalRevenue =
            revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

        // ✅ FINAL RESPONSE (ONLY ONE RETURN)
        return NextResponse.json({
            stats: {
                totalStudents,
                totalCourses,
                totalSales,
                totalRevenue,
                totalinquiries,
            },
            salesData,
            revenueData,
        });

    } catch (error: any) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}