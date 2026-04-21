import mongoose from "mongoose";

const JobSchema = new mongoose.Schema({
    title: String,
    company: String,
    location: String,
    locations: [String],
    salary: String,
    jobImage: String,

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
    type: {
        type: String,
        required: true,
    },
    requirements: [String],

    createdAt: { type: Date, default: Date.now },
});

// Next.js hot-reload fix for mongoose caching
if (mongoose.models.Job) {
    delete mongoose.models.Job;
}

export default mongoose.model("Job", JobSchema);