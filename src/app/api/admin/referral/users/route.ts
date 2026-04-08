import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Payment from "@/models/Payment"; // ✅ IMPORTANT

export async function GET() {
    try {
        await connectDB();

        const users = await User.find({
            referralCode: { $exists: true, $ne: null },
        });

        const formatted = await Promise.all(
            users.map(async (user) => {

                const referrals = await User.find({
                    referredBy: user.referralCode,
                });

                let completed = 0;
                let pending = 0;

                for (let ref of referrals) {
                    const payments = await Payment.find({
                        studentId: ref._id,
                    });

                    if (payments.length > 0) {
                        completed++;
                    } else {
                        pending++;
                    }
                }

                const totalReferrals = completed + pending;

                // ❌ skip users with no referrals
                if (totalReferrals === 0) return null;

                // ✅ total reward (stored value)
                const totalAmount = referrals.reduce(
                    (sum, r) => sum + (r.referralReward || 0),
                    0
                );

                return {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    contact: user.contact,
                    referralCode: user.referralCode,
                    completed,
                    pending,
                    totalAmount,
                };
            })
        );

        const filtered = formatted.filter((u) => u !== null);

        return NextResponse.json(filtered);

    } catch (error) {
        console.error("Admin Referral Error:", error);
        return NextResponse.json(
            { error: "Error fetching users" },
            { status: 500 }
        );
    }
}

// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import User from "@/models/User";

// export async function GET() {
//     try {
//         await connectDB();

//         const users = await User.find({ referralCode: { $exists: true } });

//         const formatted = await Promise.all(
//             users.map(async (user) => {
//                 const completed = await User.countDocuments({
//                     referredBy: user.referralCode,
//                     hasUsedReferral: true,
//                 });

//                 const pending = await User.countDocuments({
//                     referredBy: user.referralCode,
//                     hasUsedReferral: false,
//                 });

//                 return {
//                     _id: user._id,
//                     name: user.name,
//                     email: user.email,
//                     contact: user.contact,
//                     referralCode: user.referralCode,
//                     completed,
//                     pending,
//                     totalAmount: user.walletBalance || 0,
//                 };
//             })
//         );

//         return NextResponse.json(formatted);
//     } catch (error) {
//         return NextResponse.json({ error: "Error fetching users" }, { status: 500 });
//     }
// }