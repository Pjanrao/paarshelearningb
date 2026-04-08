import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import ReferralSettings from "@/models/ReferralSettings";

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();
        const { userId } = body;

        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // ✅ ONLY IF REFERRED + NOT REWARDED YET
        if (user.referredBy && !user.referralReward) {

            // ✅ find referrer
            const referrer = await User.findOne({
                referralCode: user.referredBy,
            });

            if (!referrer) {
                return NextResponse.json({ error: "Referrer not found" }, { status: 404 });
            }

            // ✅ get dynamic settings
            let settings = await ReferralSettings.findOne();

            if (!settings) {
                settings = await ReferralSettings.create({});
            }

            const rewardAmount = settings.cashbackAmount || 1000;

            // ✅ NEW: get new user reward
            const newUserReward = settings.newUserReward || 50;

            // 🎁 ADD WALLET TO REFERRER (EXISTING)
            referrer.walletBalance =
                (referrer.walletBalance || 0) + rewardAmount;

            await referrer.save();

            // 🎁 NEW: ADD WALLET TO NEW USER ⭐
            user.walletBalance =
                (user.walletBalance || 0) + newUserReward;

            // ✅ STORE REWARD IN REFERRED USER (EXISTING)
            user.referralReward = rewardAmount;

            // ✅ OPTIONAL (better tracking)
            user.hasUsedReferral = true;

            await user.save();
        }

        return NextResponse.json({
            success: true,
            message: "Referral reward applied",
        });

    } catch (error) {
        console.error("REFERRAL PAYMENT ERROR:", error);
        return NextResponse.json(
            { error: "Error processing referral payment" },
            { status: 500 }
        );
    }
}
// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import User from "@/models/User";

// export async function POST(req: Request) {
//     try {
//         await connectDB();

//         const body = await req.json();
//         const { userId } = body; // ✅ get userId from frontend

//         // find user
//         const user = await User.findById(userId);

//         if (!user) {
//             return NextResponse.json({ error: "User not found" }, { status: 404 });
//         }

//         // ✅ only first time
//         if (user.referredBy && !user.hasUsedReferral) {

//             const referrer = await User.findOne({
//                 referralCode: user.referredBy,
//             });

//             if (referrer) {
//                 // reward both
//                 referrer.walletBalance += 50;
//                 user.walletBalance += 50;

//                 user.hasUsedReferral = true;

//                 await referrer.save();
//                 await user.save();
//             }
//         }

//         return NextResponse.json({ success: true });

//     } catch (error) {
//         return NextResponse.json(
//             { error: "Error processing referral payment" },
//             { status: 500 }
//         );
//     }
// }