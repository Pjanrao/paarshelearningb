import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
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
        }).select("name email createdAt referralReward");

        // ✅ format response (IMPORTANT)
        const formatted = referrals.map((r: any) => ({
            _id: r._id,
            name: r.name,
            email: r.email,
            createdAt: r.createdAt,
            status: r.referralReward > 0 ? "Completed" : "Pending",
            reward: r.referralReward || 0,
        }));

        return NextResponse.json(formatted);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
}



// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import User from "@/models/User";
// import ReferralSettings from "@/models/ReferralSettings"; // ✅ NEW
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

//         // ✅ GET USER
//         const user = await User.findById(decoded.id);

//         if (!user) {
//             return NextResponse.json({ error: "User not found" }, { status: 404 });
//         }

//         // ✅ GET REFERRAL SETTINGS (DYNAMIC)
//         let settings = await ReferralSettings.findOne();

//         if (!settings) {
//             settings = await ReferralSettings.create({}); // default values
//         }

//         const rewardAmount = settings.cashbackAmount || 50;

//         // ✅ GET REFERRALS
//         const referrals = await User.find({
//             referredBy: user.referralCode,
//         }).select("name email createdAt hasUsedReferral");

//         // ✅ FORMAT RESPONSE
//         const formatted = referrals.map((r: any) => ({
//             _id: r._id,
//             name: r.name,
//             email: r.email,
//             createdAt: r.createdAt,
//             status: r.hasUsedReferral ? "Completed" : "Pending",
//             reward: r.hasUsedReferral ? rewardAmount : 0, // 🔥 DYNAMIC
//         }));

//         return NextResponse.json(formatted);

//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ error: "Invalid token" }, { status: 401 });
//     }
// }