import { connectDB } from "@/lib/db";
import Meeting from "@/models/Meeting";
import { NextResponse } from "next/server";
import { createZoomMeeting } from "@/lib/zoom";


export async function GET(req: Request) {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    const query: any = {};

    if (courseId) query.course = courseId;

    const meetings = await Meeting.find(query)
        .populate("course")

        .sort({ meetingDate: 1 });

    return NextResponse.json(meetings);
}

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();

        // 🔥 Convert date + time to ISO
        const convertToISO = (date: string, time: string) => {
            const [hourMin, period] = time.split(" ");
            let [hour, min] = hourMin.split(":").map(Number);

            if (period === "PM" && hour !== 12) hour += 12;
            if (period === "AM" && hour === 12) hour = 0;

            const d = new Date(date);
            d.setHours(hour);
            d.setMinutes(min);

            return d.toISOString();
        };

        const startTimeISO = convertToISO(body.date, body.startTime);

        // 🎥 Create Zoom meeting
        const zoomMeeting = await createZoomMeeting({
            topic: body.title,
            startTime: startTimeISO,
            duration: body.duration || 60,
        });

        // 💾 Save in DB
        const meeting = await Meeting.create({
            ...body,
            meetingDate: body.date, // ✅ map date → meetingDate
            meetingLink: zoomMeeting.join_url,
            meetingId: zoomMeeting.id,
            platform: "Zoom",
        });

        return NextResponse.json(meeting);

    } catch (error: any) {
        console.error("Meeting creation error:", error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}