import mongoose from "mongoose";

const GroupRequestSchema = new mongoose.Schema(
    {
        course: {
            type: String,
            required: true,
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
        },
        participants: [
            {
                studentId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                consentStatus: {
                    type: String,
                    enum: ["pending", "accepted", "declined"],
                    default: "pending",
                },
                notifiedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        teacherConsent: {
            type: String,
            enum: ["pending", "accepted", "declined"],
            default: "pending",
        },
        status: {
            type: String,
            enum: ["awaiting_consent", "active", "completed", "cancelled"],
            default: "awaiting_consent",
        },
        proposedSchedule: {
            type: String,
            required: true,
        },
        maxParticipants: {
            type: Number,
            default: 10,
        },
    },
    { timestamps: true }
);

if (process.env.NODE_ENV === "development") {
    delete (mongoose.models as any).GroupRequest;
}

export default mongoose.models.GroupRequest || mongoose.model("GroupRequest", GroupRequestSchema);
