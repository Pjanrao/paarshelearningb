import mongoose from "mongoose";

const STATUS_OPTIONS = [
    "Applied",
    "Under Review",
    "Shortlisted",
    "Interview Scheduled",
    "Interview Completed",
    "Selected",
    "Rejected",
    "On Hold",
] as const;

const ApplicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
    },
    name: String,
    email: String,
    phone: String,
    resumeUrl: String,
    applicationStatus: {
        type: String,
        enum: STATUS_OPTIONS,
        default: "Applied",
    },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Application ||
    mongoose.model("Application", ApplicationSchema);