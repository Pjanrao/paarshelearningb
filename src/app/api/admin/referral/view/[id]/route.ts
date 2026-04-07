import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Payment from "@/models/Payment";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const user = await User.findById(params.id);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const referredUsers = await User.find({
            referredBy: user.referralCode,
        });

        const data = await Promise.all(
            referredUsers.map(async (ref) => {

                const payments = await Payment.find({
                    studentId: ref._id,
                });

                const isCompleted = payments.length > 0;

                return {
                    _id: ref._id,
                    name: ref.name,
                    email: ref.email,
                    coursesPurchased: payments.length,
                    status: isCompleted ? "Completed" : "Pending",
                    rewardGiven: isCompleted ? "Yes" : "No",
                    amount: ref.referralReward || 0, // ✅ CORRECT
                    date: ref.createdAt,
                };
            })
        );

        return NextResponse.json({
            userName: user.name,
            referrals: data,
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}


// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import User from "@/models/User";
// import Payment from "@/models/Payment";
// import ReferralSettings from "@/models/ReferralSettings"; // ✅ NEW

// export async function GET(
//     req: Request,
//     { params }: { params: { id: string } }
// ) {
//     try {
//         await connectDB();

//         // ✅ GET USER
//         const user = await User.findById(params.id);

//         if (!user) {
//             return NextResponse.json({ error: "User not found" }, { status: 404 });
//         }

//         // ✅ GET SETTINGS (DYNAMIC CASHBACK)
//         let settings = await ReferralSettings.findOne();

//         if (!settings) {
//             settings = await ReferralSettings.create({});
//         }

//         const rewardAmount = settings.cashbackAmount || 50;

//         // 🔥 GET REFERRED USERS
//         const referredUsers = await User.find({
//             referredBy: user.referralCode,
//         });

//         // ✅ PREPARE DATA
//         const data = await Promise.all(
//             referredUsers.map(async (ref) => {

//                 // ✅ GET PAYMENTS (COURSES COUNT)
//                 const payments = await Payment.find({
//                     studentId: ref._id,
//                 });

//                 const isCompleted = payments.length > 0;

//                 return {
//                     _id: ref._id,
//                     name: ref.name,
//                     email: ref.email,
//                     coursesPurchased: payments.length,
//                     status: isCompleted ? "Completed" : "Pending",
//                     rewardGiven: isCompleted ? "Yes" : "No",
//                     amount: ref.referralReward || 0, // 🔥 MAIN FIX
//                     date: ref.createdAt,
//                 };
//             })
//         );

//         return NextResponse.json({
//             userName: user.name,
//             referrals: data,
//         });

//     } catch (error) {
//         console.error(error);
//         return NextResponse.json({ error: "Error" }, { status: 500 });
//     }
// }