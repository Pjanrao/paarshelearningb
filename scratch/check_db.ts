import mongoose from "mongoose";
import Payment from "./src/models/Payment";
import { connectDB } from "./src/lib/db";

async function check() {
    await connectDB();
    const userId = "69cf9c11e2c131037d3d3450";
    const courseId = "69b3cfe3bed881e7f6e8e74a";
    
    const payment = await Payment.findOne({
        studentId: userId,
        courseId: courseId,
        status: "completed"
    }).lean();
    
    console.log("Payment found:", payment);
    process.exit(0);
}

check();
