import { connectDB } from "@/lib/db";
import Testimonial from "@/models/Testimonial";
import { NextResponse } from "next/server";
import { validateName, validateMessage, isRequired } from "@/utils/validation";

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const isAdmin = searchParams.get("admin") === "true";
        const statusFilter = searchParams.get("status");

        const filter = (isAdmin || statusFilter === "all") ? {} : { status: "approved" };
        const testimonials = await Testimonial.find(filter).sort({ createdAt: -1 });

        return NextResponse.json({ success: true, data: testimonials });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { name, course, message, rating } = body;

        // --- Backend Validation ---
        if (!isRequired(name || ""))
            return NextResponse.json({ success: false, error: "Name is required." }, { status: 400 });

        if (!validateName(name))
            return NextResponse.json({ success: false, error: "Name must be 2–60 characters and contain only letters." }, { status: 400 });

        if (!isRequired(course || ""))
            return NextResponse.json({ success: false, error: "Course / Role is required." }, { status: 400 });

        if (course.trim().length < 2 || course.trim().length > 100)
            return NextResponse.json({ success: false, error: "Course name must be between 2 and 100 characters." }, { status: 400 });

        if (!isRequired(message || ""))
            return NextResponse.json({ success: false, error: "Feedback message is required." }, { status: 400 });

        if (!validateMessage(message, 10))
            return NextResponse.json({ success: false, error: "Message must be at least 10 characters." }, { status: 400 });

        if (message.trim().length > 1000)
            return NextResponse.json({ success: false, error: "Message must not exceed 1000 characters." }, { status: 400 });

        const parsedRating = Number(rating);
        if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5)
            return NextResponse.json({ success: false, error: "Rating must be between 1 and 5." }, { status: 400 });

        // Sanitize and save
        const testimonial = await Testimonial.create({
            name: name.trim(),
            course: course.trim(),
            message: message.trim(),
            rating: parsedRating,
        });

        return NextResponse.json({ success: true, data: testimonial }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
