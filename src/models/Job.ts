import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
    title: String,
    company: String,
    location: String,
    salary: String,

    // ✅ NEW FIELDS
    workMode: String, // Remote / Hybrid / On-site
    responsibilities: String,
    skills: [String],
    education: String,
    isActive: {
        type: Boolean,
        default: true,
    },
    description: String,
    requirements: [String],

    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Job || mongoose.model("Job", JobSchema);