import mongoose from "mongoose";

export interface ICourseRegistration extends mongoose.Document {
    name: string;
    email: string;
    contact: string;
    address: string;
    collegeName: string;
    course: string;
    attendMode: "Online" | "Offline" | "Hybrid";
    preferredJoiningDate: Date;
    hasLaptop: boolean;
    referralName?: string;
    preferredLocation?: string;
    note?: string;
    resumeUrl?: string;
    paymentScreenshotUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}

const courseRegistrationSchema = new mongoose.Schema<ICourseRegistration>(
    {
        name: { type: String, required: [true, "Full name is required"] },
        email: { type: String, required: [true, "Email is required"], lowercase: true },
        contact: { type: String, required: [true, "Contact number is required"] },
        address: { type: String, required: [true, "Address is required"] },
        collegeName: { type: String, required: [true, "College name is required"] },
        course: { type: String, required: [true, "Course is required"] },
        attendMode: {
            type: String,
            enum: ["Online", "Offline", "Hybrid"],
            required: [true, "Attend mode is required"],
        },
        preferredJoiningDate: { type: Date, required: [true, "Preferred joining date is required"] },
        hasLaptop: { type: Boolean, required: [true, "Laptop availability is required"] },
        referralName: { type: String, default: "" },
        preferredLocation: { type: String, default: "" },
        note: { type: String, default: "" },
        resumeUrl: { type: String, default: "" },
        paymentScreenshotUrl: { type: String, default: "" },
    },
    { timestamps: true }
);

const CourseRegistration =
    mongoose.models.CourseRegistration ||
    mongoose.model<ICourseRegistration>("CourseRegistration", courseRegistrationSchema);

export default CourseRegistration;
