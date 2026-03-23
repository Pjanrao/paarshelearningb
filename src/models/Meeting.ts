import mongoose from "mongoose";

const meetingSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },

        platform: {
            type: String,
            default: "Zoom",
        },

        batch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Batch",
            required: false,
        },

        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: false,
        },

        description: String,

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: false,
        },


        meetingLink: { type: String, required: true },

        meetingDate: { type: Date, required: true },
        duration: Number,

        startTime: {
            type: Date,
            required: true,
        },
        endTime: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: ["scheduled", "completed", "cancelled"],
            default: "scheduled",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Meeting ||
    mongoose.model("Meeting", meetingSchema);