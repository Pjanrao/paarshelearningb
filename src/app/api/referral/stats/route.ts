import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import ReferralSettings from "@/models/ReferralSettings";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
    try {
        await connectDB();

        const authHeader = req.headers.get("authorization");

        if (!authHeader) {
            return NextResponse.json({ error: "No token" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        const user = await User.findById(decoded.id);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // ✅ ensure referral code
        if (!user.referralCode) {
            user.referralCode = `REF${user._id.toString().slice(-5)}`;
            await user.save();
        }

        // ✅ get referred users
        const referrals = await User.find({
            referredBy: user.referralCode,
        }).select("referralReward");

        // ============================================
        // ✅ CALCULATIONS (FINAL LOGIC)
        // ============================================

        const totalReferrals = referrals.length;

        const completed = referrals.filter(
            (r: any) => r.referralReward > 0
        ).length;

        const pendingCount = referrals.filter(
            (r: any) => !r.referralReward
        ).length;

        // total earned = sum of stored rewards
        const totalEarned = referrals.reduce(
            (sum, r: any) => sum + (r.referralReward || 0),
            0
        );

        // ============================================
        // ✅ SETTINGS (only for pending calculation)
        // ============================================

        let settings = await ReferralSettings.findOne();

        if (!settings) {
            settings = await ReferralSettings.create({});
        }

        const rewardAmount = settings.cashbackAmount || 50;

        const pendingAmount = pendingCount * rewardAmount;

        // ============================================
        // ✅ FINAL RESPONSE
        // ============================================

        return NextResponse.json({
            referralCode: user.referralCode,
            totalReferrals,
            totalEarned,
            pending: pendingAmount,
            completed,
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}

// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import User from "@/models/User";
// import ReferralSettings from "@/models/ReferralSettings";
// import jwt from "jsonwebtoken";

// export async function GET(req: Request) {
//     try {
//         await connectDB();

//         // ✅ GET TOKEN
//         const authHeader = req.headers.get("authorization");

//         if (!authHeader) {
//             return NextResponse.json({ error: "No token" }, { status: 401 });
//         }

//         const token = authHeader.split(" ")[1];

//         const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

//         const user = await User.findById(decoded.id);

//         if (!user) {
//             return NextResponse.json({ error: "User not found" }, { status: 404 });
//         }

//         // ✅ Ensure referral code
//         if (!user.referralCode) {
//             user.referralCode = `REF${user._id.toString().slice(-5)}`;
//             await user.save();
//         }

//         // ============================================
//         // 🔥 GET REFERRED USERS
//         // ============================================
//         const referrals = await User.find({
//             referredBy: user.referralCode,
//         });

//         console.log("Referral Code:", user.referralCode);
//         console.log("Referrals Found:", referrals);

//         const totalReferrals = referrals.length;

//         const pendingCount = referrals.filter(
//             (r: any) => !r.hasUsedReferral
//         ).length;

//         const completed = referrals.filter(
//             (r: any) => r.hasUsedReferral
//         ).length;

//         // ============================================
//         // 🔥 GET SETTINGS
//         // ============================================
//         let settings = await ReferralSettings.findOne();

//         if (!settings) {
//             settings = await ReferralSettings.create({
//                 discount: 10,
//                 cashbackAmount: 50,
//                 maxReferrals: "Unlimited",
//                 creditDays: 1,
//             });
//         }

//         const rewardAmount = settings.cashbackAmount || 50;

//         // ============================================
//         // 🔥 CALCULATE PENDING ₹
//         // ============================================
//         const pendingAmount = pendingCount * rewardAmount;

//         // ============================================
//         // ✅ FINAL RESPONSE
//         // ============================================
//         return NextResponse.json({
//             referralCode: user.referralCode,
//             totalReferrals,
//             totalEarned: user.walletBalance || 0,
//             pending: pendingAmount,
//             completed,
//         });

//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//     }
// }

// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import User from "@/models/User";
// import jwt from "jsonwebtoken";

// export async function GET(req: Request) {
//     try {
//         await connectDB();

//         // 🔥 GET TOKEN FROM HEADER
//         const authHeader = req.headers.get("authorization");

//         if (!authHeader) {
//             return NextResponse.json({ error: "No token" }, { status: 401 });
//         }

//         const token = authHeader.split(" ")[1];

//         // 🔥 VERIFY TOKEN
//         const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

//         const user = await User.findById(decoded.id);

//         if (!user) {
//             return NextResponse.json({ error: "User not found" }, { status: 404 });
//         }

//         // 🔥 ENSURE REFERRAL CODE
//         if (!user.referralCode) {
//             user.referralCode = `REF${user._id.toString().slice(-5)}`;
//             await user.save();
//         }

//         return NextResponse.json({
//             referralCode: user.referralCode,
//             totalReferrals: 0,
//             totalEarned: user.walletBalance || 0,
//             pending: 0,
//             completed: 0,
//         });

//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//     }
// }

// import { NextResponse, NextRequest } from "next/server";
// import { connectDB } from "@/lib/db";
// import User from "@/models/User";
// import { getToken } from "next-auth/jwt";

// export async function GET(req: NextRequest) {
//     try {
//         await connectDB();

//         // ✅ Get logged-in user
//         const token: any = await getToken({
//             req,
//             secret: process.env.NEXTAUTH_SECRET,
//         });

//         if (!token?.id) {
//             return NextResponse.json(
//                 { error: "Unauthorized" },
//                 { status: 401 }
//             );
//         }

//         const user = await User.findById(token.id);

//         if (!user) {
//             return NextResponse.json(
//                 { error: "User not found" },
//                 { status: 404 }
//             );
//         }

//         // ✅ Ensure referral code exists
//         if (!user.referralCode) {
//             user.referralCode = `REF${user._id.toString().slice(-5)}`;
//             await user.save();
//         }

//         // ✅ Counts
//         const totalReferrals = await User.countDocuments({
//             referredBy: user.referralCode,
//         });

//         const pending = await User.countDocuments({
//             referredBy: user.referralCode,
//             hasUsedReferral: false,
//         });

//         const completed = await User.countDocuments({
//             referredBy: user.referralCode,
//             hasUsedReferral: true,
//         });

//         return NextResponse.json({
//             totalReferrals: totalReferrals || 0,
//             totalEarned: user.walletBalance || 0,
//             pending: pending || 0,
//             completed: completed || 0,
//             referralCode: user.referralCode,
//         });

//     } catch (error) {
//         console.error("Referral Stats Error:", error);

//         return NextResponse.json(
//             { error: "Error fetching stats" },
//             { status: 500 }
//         );
//     }
// }