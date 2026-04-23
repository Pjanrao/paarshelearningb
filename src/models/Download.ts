import mongoose from "mongoose";

export interface IDownload extends mongoose.Document {
    title: string;
    description?: string;
    fileUrl: string;
    category?: string;
    status: "active" | "inactive";
    downloadCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const downloadSchema = new mongoose.Schema<IDownload>(
    {
        title: {
            type: String,
            required: [true, "Please provide a title"],
        },
        description: {
            type: String,
        },
        fileUrl: {
            type: String,
            required: [true, "Please provide a file URL"],
        },
        category: {
            type: String,
            default: "General",
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        downloadCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

const Download = mongoose.models.Download || mongoose.model<IDownload>("Download", downloadSchema);

export default Download;
