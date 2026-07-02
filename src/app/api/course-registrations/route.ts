import { connectDB } from "@/lib/db";
import CourseRegistration from "@/models/CourseRegistration";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

export const runtime = "nodejs";

// POST — Submit a new course registration (public, no auth required)
export async function POST(req: Request) {
    try {
        await connectDB();

        const formData = await req.formData();

        // Generate a unique ID for file storage
        const registrationId = new mongoose.Types.ObjectId().toString();

        // ===== FILE UPLOAD HELPER =====
        const saveFile = async (file: File, subfolder: string) => {
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSize) {
                throw new Error(`${subfolder} file exceeds the maximum allowed size of 5MB.`);
            }

            const allowedTypes: Record<string, string[]> = {
                resume: [
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "image/jpeg",
                    "image/png",
                ],
                paymentScreenshot: [
                    "image/jpeg",
                    "image/png",
                    "image/webp",
                    "application/pdf",
                ],
            };

            const allowed = allowedTypes[subfolder] || [];
            if (allowed.length > 0 && !allowed.includes(file.type)) {
                throw new Error(
                    `Invalid file type for ${subfolder}. Allowed types: ${allowed.join(", ")}`
                );
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            const timestamp = Date.now();
            const sanitizedFileName = file.name
                .replace(/\s+/g, "_")
                .replace(/[^a-zA-Z0-9.\-_]/g, "");
            const filename = `${timestamp}-${sanitizedFileName}`;

            const relativePath = `/uploads/course-registrations/${registrationId}/${subfolder}/${filename}`;

            const basePath =
                process.env.NODE_ENV === "development"
                    ? path.join(process.cwd(), "public")
                    : "/var/www";
            const fullPath = path.join(basePath, relativePath);

            const dir = path.dirname(fullPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            await fs.promises.writeFile(fullPath, buffer);
            return relativePath;
        };

        // ===== EXTRACT FIELDS =====
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const contact = formData.get("contact") as string;
        const address = formData.get("address") as string;
        const collegeName = formData.get("collegeName") as string;
        const course = formData.get("course") as string;
        const attendMode = formData.get("attendMode") as string;
        const preferredJoiningDate = formData.get("preferredJoiningDate") as string;
        const hasLaptop = formData.get("hasLaptop") as string;
        const referralName = (formData.get("referralName") as string) || "";
        const preferredLocation = (formData.get("preferredLocation") as string) || "";
        const note = (formData.get("note") as string) || "";

        // ===== BASIC VALIDATION =====
        const errors: string[] = [];

        if (!name || name.trim().length < 2) errors.push("Full Name is required (minimum 2 characters).");
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("A valid email address is required.");
        if (!contact || !/^\d{10}$/.test(contact)) errors.push("A valid 10-digit contact number is required.");
        if (!address || address.trim().length < 5) errors.push("Address is required (minimum 5 characters).");
        if (!collegeName || collegeName.trim().length < 2) errors.push("College name is required.");
        if (!course) errors.push("Course selection is required.");
        if (!attendMode || !["Online", "Offline", "Hybrid"].includes(attendMode)) errors.push("Attend mode must be Online, Offline, or Hybrid.");
        if (!preferredJoiningDate) errors.push("Preferred joining date is required.");
        if (hasLaptop === null || hasLaptop === undefined || hasLaptop === "") errors.push("Laptop availability is required.");

        const allowedLocations = ["Nashik", "Pune", "Ahmedabad", "Hyderabad", "Mumbai", "Surat", "Bengaluru", ""];
        if (preferredLocation && !allowedLocations.includes(preferredLocation)) {
            errors.push("Preferred location must be one of: Nashik, Pune, Ahmedabad, Hyderabad, Mumbai, Surat, Bengaluru.");
        }

        if (errors.length > 0) {
            return NextResponse.json({ error: errors.join(" ") }, { status: 400 });
        }

        // ===== HANDLE FILE UPLOADS =====
        let resumeUrl = "";
        let paymentScreenshotUrl = "";

        const resumeFile = formData.get("resume") as File | null;
        if (resumeFile && resumeFile.size > 0) {
            resumeUrl = await saveFile(resumeFile, "resume");
        }

        const paymentFile = formData.get("paymentScreenshot") as File | null;
        if (paymentFile && paymentFile.size > 0) {
            paymentScreenshotUrl = await saveFile(paymentFile, "paymentScreenshot");
        }

        // ===== SAVE TO DATABASE =====
        const registration = await CourseRegistration.create({
            _id: registrationId,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            contact: contact.trim(),
            address: address.trim(),
            collegeName: collegeName.trim(),
            course: course.trim(),
            attendMode,
            preferredJoiningDate: new Date(preferredJoiningDate),
            hasLaptop: hasLaptop === "true" || hasLaptop === "Yes",
            referralName: referralName.trim(),
            preferredLocation: preferredLocation.trim(),
            note: note.trim(),
            resumeUrl,
            paymentScreenshotUrl,
        });

        return NextResponse.json(
            { message: "Your course registration has been submitted successfully. Our team will contact you shortly.", registration },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("COURSE REGISTRATION ERROR:", error);
        return NextResponse.json(
            { error: error.message || "Registration failed. Please try again." },
            { status: 500 }
        );
    }
}
