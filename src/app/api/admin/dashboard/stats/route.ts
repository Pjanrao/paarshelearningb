import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Teacher from "@/models/Teachers";
import Blog from "@/models/Blog";
import GroupRequest from "@/models/GroupRequest";
import Testimonial from "@/models/Testimonial";
import Course from "@/models/Course";
import Enquiry from "@/models/Inquiry";
import Payment from "@/models/Payment";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        await connectDB();

        const totalStudents = await User.countDocuments({ role: "student" });
        const totalTeachers = await Teacher.countDocuments({});
        const totalBlogs = await Blog.countDocuments({});
        const activeGroupRequests = await GroupRequest.countDocuments({});
        const totalCourses = await Course.countDocuments({});
        const totalinquiries = await Enquiry.countDocuments({});
        const totalTestimonials = await Testimonial.countDocuments({});

        const revenueAggregation = await Payment.aggregate([
            { $match: { status: "completed" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

        const totalPlacements = 0;
        const totalWorkshops = 0;

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);

        const monthlyJoinStats = await User.aggregate([
            { $match: { role: "student", createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id": 1 } }
        ]);

        const monthlyRevenueStats = await Payment.aggregate([
            { $match: { status: "completed", createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    total: { $sum: "$amount" },
                },
            },
            { $sort: { "_id": 1 } }
        ]);

        const monthlyEnquiryStats = await Enquiry.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { "_id": 1 } }
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const currentMonth = new Date().getMonth();
        const last6Months = [];
        const revenueTrends = [];
        const enquiryTrends = [];

        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(currentMonth - i);
            const monIdx = d.getMonth();
            const monName = monthNames[monIdx];

            const enrollmentFound = monthlyJoinStats.find(e => {
                return e._id === (monIdx + 1);
            });
            last6Months.push({
                name: monName,
                students: enrollmentFound ? enrollmentFound.count : 0
            });

            const revenueFound = monthlyRevenueStats.find(r => r._id === (monIdx + 1));
            revenueTrends.push({
                name: monName,
                revenue: revenueFound ? revenueFound.total : 0
            });

            const enquiryFound = monthlyEnquiryStats.find(e => e._id === (monIdx + 1));
            enquiryTrends.push({
                name: monName,
                inquiries: enquiryFound ? enquiryFound.count : 0
            });
        }

        const courseDistribution = await GroupRequest.aggregate([
            {
                $group: {
                    _id: "$course",
                    value: { $sum: 1 }
                }
            },
            { $limit: 5 }
        ]);

        const courseStats = courseDistribution.map(c => ({
            name: c._id,
            value: c.value
        }));

        const recentGroupRequests = await GroupRequest.find()
            .sort({ createdAt: -1 })
            .limit(2)
            .populate('teacherId', 'name')
            .lean();

        const recentTeachers = await Teacher.find()
            .sort({ createdAt: -1 })
            .limit(2)
            .select('name course designation')
            .lean();

        const recentTestimonials = await Testimonial.find()
            .sort({ createdAt: -1 })
            .limit(2)
            .select('name message')
            .lean();

        return NextResponse.json({
            stats: {
                totalStudents,
                totalTeachers,
                totalBlogs,
                activeGroupRequests,
                totalTestimonials,
                totalCourses,
                totalinquiries,
                totalPlacements,
                totalWorkshops,
                totalRevenue
            },
            charts: {
                enrollmentTrends: last6Months,
                revenueTrends: revenueTrends,
                enquiryTrends: enquiryTrends,
                courseDistribution: courseStats.length > 0 ? courseStats : [{ name: "No Data", value: 1 }]
            },
            recent: {
                groupRequests: recentGroupRequests,
                teachers: recentTeachers,
                testimonials: recentTestimonials
            }
        });

    } catch (error: any) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
