import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Batch from "@/models/Batch";
import "@/models/User";   // ✅ REQUIRED
import "@/models/Course"; // ✅ also needed

export async function GET(req: Request) {
    try {
        await connectDB();

        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get("courseId");

        const query: any = {};

        // ✅ FILTER BY COURSE
        if (courseId) {
            query.courseId = courseId;
        }

        const batches = await Batch.find(query);

        const populated = await Batch.populate(batches, [
            { path: "courseId", select: "name" },
            { path: "students", select: "name email contact" }
        ]);

        return NextResponse.json(populated);

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();

        const batch = await Batch.create(body);

        return NextResponse.json(batch);

    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import Batch from "@/models/Batch";

// export async function POST(req: Request) {

//   await connectDB();

//   const body = await req.json();

//   const { name, courseId, type } = body;

//   const maxStudents = type === "one-to-one" ? 1 : 2;

//   const batch = await Batch.create({
//     name,
//     courseId,
//     type,
//     maxStudents
//   });

//   return NextResponse.json(batch);
// }

// export async function GET() {

//   await connectDB();

//   const batches = await Batch.find().populate("courseId");

//   return NextResponse.json(batches);
// }