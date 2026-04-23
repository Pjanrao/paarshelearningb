import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
    },
    name: String,
    email: String,
    phone: String,
    resumeUrl: String,
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Application ||
    mongoose.model("Application", ApplicationSchema);