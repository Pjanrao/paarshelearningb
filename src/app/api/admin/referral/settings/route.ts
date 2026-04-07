import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ReferralSettings from "@/models/ReferralSettings";

// export async function POST(req: Request) {
//     try {
//         await connectDB();

//         const body = await req.json();

//         // ✅ only allow required fields
//         const {
//             discount,
//             cashbackAmount,
//             maxReferrals,
//             creditDays,
//         } = body;

//         const existing = await ReferralSettings.findOne();

//         if (existing) {
//             await ReferralSettings.findByIdAndUpdate(existing._id, {
//                 discount,
//                 cashbackAmount,
//                 maxReferrals,
//                 creditDays,
//             });
//         } else {
//             await ReferralSettings.create({
//                 discount,
//                 cashbackAmount,
//                 maxReferrals,
//                 creditDays,
//             });
//         }

//         return NextResponse.json({ message: "Settings saved" });

//     } catch (error) {
//         console.error("SETTINGS SAVE ERROR:", error);
//         return NextResponse.json({ error: "Failed" }, { status: 500 });
//     }
// }

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();

        console.log("BODY:", body);

        let settings = await ReferralSettings.findOne();

        if (!settings) {
            settings = new ReferralSettings(body);
        } else {
            // ✅ DIRECT ASSIGN (BEST PRACTICE)
            settings.discount = body.discount;
            settings.cashbackAmount = body.cashbackAmount;
            settings.maxReferrals = body.maxReferrals;
            settings.creditDays = body.creditDays;
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
                discount: 10,
                cashbackAmount: 50, // 🔥 default
                maxReferrals: "Unlimited",
                creditDays: 1,
            });
        }

        return NextResponse.json(settings);

    } catch (error) {
        console.error("SETTINGS FETCH ERROR:", error);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
// import { NextResponse } from "next/server";

// let settings = {
//     discount: 10,
//     cashback: 50,
//     maxReferrals: "Unlimited",
//     creditDays: 1,
// };

// // ✅ GET SETTINGS
// export async function GET() {
//     try {
//         return NextResponse.json(settings);
//     } catch (error) {
//         return NextResponse.json(
//             { error: "Failed to fetch settings" },
//             { status: 500 }
//         );
//     }
// }

// // ✅ UPDATE SETTINGS
// export async function PUT(req: Request) {
//     try {
//         const body = await req.json();

//         // optional validation
//         if (!body) {
//             return NextResponse.json(
//                 { error: "Invalid data" },
//                 { status: 400 }
//             );
//         }

//         settings = {
//             discount: body.discount ?? settings.discount,
//             cashback: body.cashback ?? settings.cashback,
//             maxReferrals: body.maxReferrals ?? settings.maxReferrals,
//             creditDays: body.creditDays ?? settings.creditDays,
//         };

//         console.log("Updated settings:", settings); // ✅ debug

//         return NextResponse.json({
//             success: true,
//             data: settings,
//         });

//     } catch (error) {
//         return NextResponse.json(
//             { error: "Update failed" },
//             { status: 500 }
//         );
//     }
// }