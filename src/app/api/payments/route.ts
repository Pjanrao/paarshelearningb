import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Payment from "@/models/Payment";
import User from "@/models/User";
import Course from "@/models/Course";



// export async function GET(req: Request) {
//     try {
//         await connectDB();

//         const { searchParams } = new URL(req.url);

//         const courseId = searchParams.get("courseId");

//         // ✅ CONDITIONALLY APPLY FILTER
//         const filter: any = {};

//         if (courseId) {
//             filter.courseId = courseId;
//         }

//         const payments = await Payment.find(filter)
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

//         // keep your original behavior (don’t break UI)
//         return NextResponse.json([], { status: 200 });
//     }
// }
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

        const payment = await Payment.create(body);

        return NextResponse.json(payment);

    } catch (error) {
        console.error("PAYMENT SAVE ERROR:", error);
        return NextResponse.json({ error: "Failed to save payment" }, { status: 500 });
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