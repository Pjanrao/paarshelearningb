import mongoose from "mongoose";

export interface IActivity extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    type: "video" | "download" | "test" | "login" | "other";
    action: string;
    details?: string;
    createdAt: Date;
    updatedAt: Date;
}

const activitySchema = new mongoose.Schema<IActivity>(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        type: {
            type: String,
            enum: ["video", "download", "test", "login", "other"],
            required: true,
        },
        action: {
            type: String,
            required: true,
        },
        details: {
            type: String,
        },
    },
    { timestamps: true }
);

const Activity = mongoose.models.Activity || mongoose.model<IActivity>("Activity", activitySchema);

export default Activity;
