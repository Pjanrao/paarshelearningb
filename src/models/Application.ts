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
    highestQualification: String,
    universityName: String,
    yearOfPassing: String,
    percentage: String,
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Application ||
    mongoose.model("Application", ApplicationSchema);