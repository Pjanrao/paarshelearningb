import { connectDB } from "@/lib/db";
import Meeting from "@/models/Meeting";
import { NextResponse } from "next/server";

export async function PUT(req: Request, context: any) {
    await connectDB();

    const { id } = await context.params;
    const body = await req.json();

    // 🔥 CONVERT TIME (ADD THIS)
    const convertToISO = (date: string, time: string) => {
        if (!date || !time) return null;

        const [hourMin, period] = time.trim().split(" ");
        let [hour, min] = hourMin.split(":").map(Number);

        if (period === "PM" && hour !== 12) hour += 12;
        if (period === "AM" && hour === 12) hour = 0;

        return new Date(
            `${date}T${hour.toString().padStart(2, "0")}:${min
                .toString()
                .padStart(2, "0")}:00`
        );
    };

    if (typeof body.startTime === "string") {
        body.startTime = convertToISO(body.date, body.startTime);
    }

    if (typeof body.endTime === "string") {
        body.endTime = convertToISO(body.date, body.endTime);
    }



    const meeting = await Meeting.findByIdAndUpdate(id, body, { new: true });

    return NextResponse.json(meeting);
}

export async function DELETE(
    req: Request,
    context: any
) {
    try {
        await connectDB();

        const { id } = context.params;

        const meeting = await Meeting.findByIdAndDelete(id);

        if (!meeting) {
            return NextResponse.json(
                { error: "Meeting not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Meeting deleted successfully",
        });

    } catch (error) {
        console.error("Delete error:", error);

        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}