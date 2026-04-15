import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        thumbnail: {
            type: String, // image URL
            default: "",
        },

        instructorName: {
            type: String,
            required: true,
            trim: true,
        },

        // 📅 Date & Time
        date: {
            type: String, // or Date if you prefer
            required: true,
        },

        time: {
            type: String,
            required: true,
        },

        duration: {
            type: String, // e.g. "2 hours"
            required: true,
        },

        // 💰 Pricing
        price: {
            type: Number,
            required: true,
            default: 0,
        },

        // 🖥 Mode
        mode: {
            type: String,
            enum: ["online", "offline"],
            default: "online",
        },

        location: {
            type: String, // for offline
            default: "",
        },

        meetingLink: {
            type: String, // for online
            default: "",
        },

        // 👥 Capacity
        capacity: {
            type: Number,
            default: 0,
        },

        enrolledCount: {
            type: Number,
            default: 0,
        },

        // 📌 Status
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },

    },
    {
        timestamps: true, // createdAt, updatedAt
    }
);

export default mongoose.models.Workshop ||
    mongoose.model("Workshop", workshopSchema);