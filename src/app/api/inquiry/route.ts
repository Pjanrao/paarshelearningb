

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Inquiry from "@/models/Inquiry";
import { sendConfirmationEmail, sendAdminNotificationEmail } from "@/utils/sendEmail";
import { validateEmail, validatePhone } from "@/utils/validation";

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const type = searchParams.get("type");

    const query: any = {};

    if (type) {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { course: { $regex: search, $options: "i" } },
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [inquiries, total] = await Promise.all([
      Inquiry.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Inquiry.countDocuments(query),
    ]);

    return NextResponse.json({
      inquiries,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    // Destructure payload
    const { name, email, phone, message, course, courseId, userId, type, status, source, education, college, country } = body;

    // Basic validation
    if (!name || !email || !phone || !message || !type) {
      return NextResponse.json(
        { error: "Please fill out all required fields" },
        { status: 400 }
      );
    }

    // Name length check
    if (name.trim().length < 2 || name.trim().length > 60) {
      return NextResponse.json(
        { error: "Name must be between 2 and 60 characters." },
        { status: 400 }
      );
    }

    // Email format check
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Phone format check
    if (!validatePhone(phone)) {
      return NextResponse.json(
        { error: "Phone number must be exactly 10 digits." },
        { status: 400 }
      );
    }

    // Message length check
    if (message.trim().length < 5) {
      return NextResponse.json(
        { error: "Message must be at least 5 characters." },
        { status: 400 }
      );
    }

    // Validate type
    if (!["Contact Form", "Inquiry Form", "Course Inquiry"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid inquiry type" },
        { status: 400 }
      );
    }


    // Create the Inquiry document
    const newInquiry = await Inquiry.create({
      name,
      email,
      phone,
      message,
      course: course || "Not Specified",
      courseId: courseId || null,
      userId: userId || null,
      type,
      status: status || "New",
      source: source || "Website",
      education,
      college,
      country,
    });

    // Send Emails (User Confirmation & Admin Notification)
    try {
      // 1. Send confirmation email to the inquirer
      await sendConfirmationEmail(email, name, type);

      // 2. Send notification email to the admin
      await sendAdminNotificationEmail({
        name,
        email,
        phone,
        message,
        course,
        type,
        education,
        college,
        country
      });
    } catch (err) {
      console.error("Email failure:", err);
      // We continue as the inquiry is already saved in the database
    }

    return NextResponse.json(
      {
        message: "Inquiry submitted successfully",
        inquiry: newInquiry
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Error submitting inquiry:", error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}