
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ReferralSettings from "@/models/ReferralSettings";

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();

        console.log("BODY:", body);

        let settings = await ReferralSettings.findOne();

        if (!settings) {
            settings = new ReferralSettings(body);
        } else {
            // ✅ KEEP EXISTING LOGIC (NO CHANGE)
            if (body.discountPercentage !== undefined) settings.discountPercentage = body.discountPercentage;
            if (body.cashbackAmount !== undefined) settings.cashbackAmount = body.cashbackAmount;
            if (body.maxReferrals !== undefined) settings.maxReferrals = body.maxReferrals;
            if (body.rewardDays !== undefined) settings.rewardDays = body.rewardDays;

            // ✅ NEW FIELD (SAFE ADD)
            if (body.newUserReward !== undefined) settings.newUserReward = body.newUserReward;
        }

        await settings.save(); // 🔥 IMPORTANT

        return NextResponse.json(settings);

    } catch (error) {
        console.error("SETTINGS SAVE ERROR:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}

export async function GET() {
    try {
        await connectDB();

        let settings = await ReferralSettings.findOne();

        if (!settings) {
            settings = await ReferralSettings.create({
                discountPercentage: 10,
                cashbackAmount: 50,
                maxReferrals: "Unlimited",
                rewardDays: 1,
                newUserReward: 50,
            });
        }

        return NextResponse.json(settings);

    } catch (error) {
        console.error("SETTINGS FETCH ERROR:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}


// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import ReferralSettings from "@/models/ReferralSettings";

// // export async function POST(req: Request) {
// //     try {
// //         await connectDB();

// //         const body = await req.json();

// //         // ✅ only allow required fields
// //         const {
// //             discount,
// //             cashbackAmount,
// //             maxReferrals,
// //             creditDays,
// //         } = body;

// //         const existing = await ReferralSettings.findOne();

// //         if (existing) {
// //             await ReferralSettings.findByIdAndUpdate(existing._id, {
// //                 discount,
// //                 cashbackAmount,
// //                 maxReferrals,
// //                 creditDays,
// //             });
// //         } else {
// //             await ReferralSettings.create({
// //                 discount,
// //                 cashbackAmount,
// //                 maxReferrals,
// //                 creditDays,
// //             });
// //         }

// //         return NextResponse.json({ message: "Settings saved" });

// //     } catch (error) {
// //         console.error("SETTINGS SAVE ERROR:", error);
// //         return NextResponse.json({ error: "Failed" }, { status: 500 });
// //     }
// // }

// export async function POST(req: Request) {
//     try {
//         await connectDB();

//         const body = await req.json();

//         console.log("BODY:", body);

//         let settings = await ReferralSettings.findOne();

//         if (!settings) {
//             settings = new ReferralSettings(body);
//         } else {
//             // ✅ DIRECT ASSIGN (BEST PRACTICE)
//             if (body.discountPercentage !== undefined) settings.discountPercentage = body.discountPercentage;
//             if (body.cashbackAmount !== undefined) settings.cashbackAmount = body.cashbackAmount;
//             if (body.maxReferrals !== undefined) settings.maxReferrals = body.maxReferrals;
//             if (body.rewardDays !== undefined) settings.rewardDays = body.rewardDays;
//         }

//         await settings.save(); // 🔥 IMPORTANT

//         return NextResponse.json(settings);

//     } catch (error) {
//         console.error("SETTINGS SAVE ERROR:", error);
//         return NextResponse.json({ error: "Failed" }, { status: 500 });
//     }
// }
// export async function GET() {
//     try {
//         await connectDB();

//         let settings = await ReferralSettings.findOne();

//         if (!settings) {
//             settings = await ReferralSettings.create({
//                 discountPercentage: 10,
//                 cashbackAmount: 50, // 🔥 default
//                 maxReferrals: "Unlimited",
//                 rewardDays: 1,
//             });
//         }

//         return NextResponse.json(settings);

//     } catch (error) {
//         console.error("SETTINGS FETCH ERROR:", error);
//         return NextResponse.json({ error: "Failed" }, { status: 500 });
//     }
// }


