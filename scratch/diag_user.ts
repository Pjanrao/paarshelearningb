import mongoose from "mongoose";
import User from "./src/models/User";
import Payment from "./src/models/Payment";
import { connectDB } from "./src/lib/db";

async function check() {
    await connectDB();
    const email = "vidhi@gmail.com";
    const user = await User.findOne({ email }).lean();
    
    if (!user) {
        console.log("User not found!");
        process.exit(0);
    }
    
    console.log("User ID:", user._id);
    
    const payments = await Payment.find({
        studentId: user._id,
        status: "completed"
    }).lean();
    
    console.log("Completed payments count:", payments.length);
    payments.forEach(p => {
        console.log(`- Course ID: ${p.courseId}, Payment ID: ${p._id}`);
    });
    
    process.exit(0);
}

check();
