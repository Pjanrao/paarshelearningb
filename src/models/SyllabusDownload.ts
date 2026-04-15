import mongoose from "mongoose";

const SyllabusDownloadSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
        },
        phone: {
            type: String,
            default: "",
        },
        courseName: {
            type: String,
            required: [true, "Please provide the course name"],
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            default: null,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        source: {
            type: String,
            enum: ["Authenticated", "Guest Form"],
            default: "Guest Form",
        },
    },
    {
        timestamps: true,
    }
);

// Avoid "OverwriteModelError" during development
if (process.env.NODE_ENV === "development") {
    delete mongoose.models.SyllabusDownload;
}

export default mongoose.models.SyllabusDownload || mongoose.model("SyllabusDownload", SyllabusDownloadSchema);
