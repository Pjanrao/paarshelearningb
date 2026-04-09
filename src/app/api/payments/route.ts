import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import User from "@/models/User";
import Course from "@/models/Course";
import ReferralSettings from "@/models/ReferralSettings";

export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);

        const courseId = searchParams.get("courseId");
        const studentId = searchParams.get("studentId"); // ✅ ADD THIS

        const filter: any = {};

        // ✅ FIX: apply both filters properly
        if (courseId) {
            filter.courseId = courseId;
        }

        if (studentId) {
            filter.studentId = studentId;
        }

        const payments = await Payment.find(filter)
            .populate({
                path: "studentId",
                model: User,
                select: "name email contact",
            })
            .populate({
                path: "courseId",
                model: Course,
                select: "name fee",
            })
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json(payments ?? []);

    } catch (error) {
        console.error("PAYMENT FETCH ERROR:", error);
        return NextResponse.json([], { status: 200 });
    }
}


export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();

        // ✅ 1. CREATE PAYMENT
        const payment = await Payment.create(body);

        // 🔥 2. REFERRAL LOGIC START
        const user = await User.findById(body.studentId);

        if (user && user.referredBy && !user.referralReward) {

            // ✅ find referrer
            const referrer = await User.findOne({
                referralCode: user.referredBy,
            });

            // ✅ get settings
            let settings = await ReferralSettings.findOne();

            if (!settings) {
                settings = await ReferralSettings.create({});
            }

            const rewardAmount = settings.cashbackAmount || 1000;
            const newUserReward = settings.newUserReward || 50;

            if (referrer) {

                // 🔥 1. ADD WALLET (SAFE Mongoose Update)
                await User.findByIdAndUpdate(referrer._id, {
                    $inc: { walletBalance: rewardAmount }
                });

                // 🔥 2. STORE REWARD (SAFE Mongoose Update)
                await User.findByIdAndUpdate(user._id, {
                    $set: { referralReward: rewardAmount }
                });
                // 🎁 ADD WALLET TO REFERRER (EXISTING)
                referrer.walletBalance =
                    (referrer.walletBalance || 0) + rewardAmount;

                await referrer.save();

                // 🎁 NEW: ADD WALLET TO NEW USER ⭐
                user.walletBalance =
                    (user.walletBalance || 0) + newUserReward;

                // 🔥 3. STORE REWARD (IMPORTANT 🔥🔥🔥)
                user.referralReward = rewardAmount;

                // ✅ OPTIONAL (better tracking)
                user.hasUsedReferral = true;

                await user.save();
            }
        }
        // 🔥 2. REFERRAL LOGIC END

        return NextResponse.json(payment);

    } catch (error) {
        console.error("PAYMENT SAVE ERROR:", error);
        return NextResponse.json(
            { error: "Failed to save payment" },
            { status: 500 }
        );
    }
}


//import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import Payment from "@/models/Payment";
// import User from "@/models/User";
// import Course from "@/models/Course";

// export async function GET() {
//     try {
//         await connectDB();

//         const payments = await Payment.find({})
//             .populate({
//                 path: "studentId",
//                 model: User,
//                 select: "name email contact",
//             })
//             .populate({
//                 path: "courseId",
//                 model: Course,
//                 select: "name fee",
//             })
//             .sort({ createdAt: -1 })
//             .lean();

//         return NextResponse.json(payments ?? []);

//     } catch (error) {
//         console.error("PAYMENT FETCH ERROR:", error);
//         return NextResponse.json([], { status: 200 });
//     }
// }

// export async function POST(req: Request) {
//     try {
//         await connectDB();

//         const body = await req.json();

//         const payment = await Payment.create(body);

//         return NextResponse.json(payment);

//     } catch (error) {
//         console.error("PAYMENT SAVE ERROR:", error);
//         return NextResponse.json({ error: "Failed to save payment" }, { status: 500 });
//     }
// }



// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import Payment from "@/models/Payment";
// import "@/models/User";
// import "@/models/Course";

// export async function GET() {
//   try {
//     await connectDB();

//     const payments = await Payment.find({})
//       .populate({
//         path: "studentId",
//         select: "name email contact",
//       })
//       .populate({
//         path: "courseId",
//         select: "name fee",
//       })
//       .sort({ createdAt: -1 })
//       .lean();

//     return NextResponse.json(payments);

//   } catch (error) {
//     console.error("PAYMENT FETCH ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to fetch payments" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req: Request) {
//   try {
//     await connectDB();

//     const body = await req.json();

//     const payment = await Payment.create(body);

//     return NextResponse.json(payment);

//   } catch (error) {
//     console.error("PAYMENT SAVE ERROR:", error);

//     return NextResponse.json(
//       { error: "Failed to save payment" },
//       { status: 500 }
//     );
//   }
// }

//