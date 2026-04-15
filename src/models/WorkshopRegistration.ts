import mongoose from "mongoose";

const workshopRegistrationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide your name"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please provide your email"],
            trim: true,
            lowercase: true,
        },
        phone: {
            type: String,
            required: [true, "Please provide your phone number"],
            trim: true,
        },
        workshopId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workshop",
            required: true,
        },
        currentStatus: {
            type: String, // e.g., "Student", "Working Professional"
            default: "Student",
        },
        message: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.models.WorkshopRegistration ||
    mongoose.model("WorkshopRegistration", workshopRegistrationSchema);
