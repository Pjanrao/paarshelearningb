import mongoose from "mongoose";
import Job from "../src/models/Job";
import dotenv from "dotenv";

dotenv.config();

const checkJobs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "");
        console.log("Connected to MongoDB");

        const jobs = await Job.find({});
        console.log(`Total jobs found: ${jobs.length}`);

        jobs.forEach((job: any) => {
            console.log(`Job ID: ${job._id}, Title: ${job.title}, jobImage: "${job.jobImage || 'MISSING'}"`);
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkJobs();
