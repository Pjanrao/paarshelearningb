import mongoose from "mongoose";
import Job from "../src/models/Job";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const checkJobs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "");
        console.log("Connected to MongoDB");

        const jobs = await Job.find().sort({ createdAt: -1 }).limit(1);
        console.log("Latest job:", JSON.stringify(jobs[0], null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkJobs();
