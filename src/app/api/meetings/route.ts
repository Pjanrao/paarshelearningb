import { connectDB } from "@/lib/db";
import Meeting from "@/models/Meeting";
import { NextResponse } from "next/server";
import { createZoomMeeting } from "@/lib/zoom";
import "@/models/Course";
import "@/models/Teachers";


export async function GET(req: Request) {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    const query: any = {};

    if (courseId) query.course = courseId;

    const meetings = await Meeting.find(query)
        .populate("course")
        .populate("teacher")
        .sort({ meetingDate: 1 });

    return NextResponse.json(meetings);
}

export async function POST(req: Request) {
    try {
        await connectDB();

        const body = await req.json();

        // 🔥 Convert date + time to ISO
        const convertToISO = (date: string, time: string) => {
            console.log("🔥 convertToISO:", date, time);

            if (!date || !time) {
                throw new Error("Missing date or time");
            }

            const [hourMin, period] = time.trim().split(" ");
            let [hour, min] = hourMin.split(":").map(Number);

            if (isNaN(hour) || isNaN(min)) {
                throw new Error("Invalid time format");
            }

            // ✅ convert to 24-hour
            if (period === "PM" && hour !== 12) hour += 12;
            if (period === "AM" && hour === 12) hour = 0;

            // ✅ SAFE ISO string creation
            const isoString = `${date}T${hour
                .toString()
                .padStart(2, "0")}:${min
                    .toString()
                    .padStart(2, "0")}:00`;

            console.log("✅ ISO STRING:", isoString);

            const d = new Date(isoString);

            if (isNaN(d.getTime())) {
                console.error("❌ Invalid Date:", isoString);
                throw new Error("Invalid time value");
            }

            return d.toISOString();
        };

        const startTimeISO = convertToISO(body.date, body.startTime);
        const endTimeISO = convertToISO(body.date, body.endTime);
        // 🎥 Create Zoom meeting
        const zoomMeeting = await createZoomMeeting({
            topic: body.title,
            startTime: startTimeISO,
            duration: body.duration || 60,
        });

        console.log("👉 Incoming body:", body);
        console.log("👉 date:", body.date);
        console.log("👉 startTime:", body.startTime);



        // 💾 Save in DB
        const meeting = await Meeting.create({
            ...body,
            meetingDate: body.date, // ✅ map date → meetingDate
            meetingLink: zoomMeeting.join_url,
            meetingId: zoomMeeting.id,
            platform: "Zoom",
            startTime: startTimeISO,   // ✅ FIX
            endTime: endTimeISO,
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