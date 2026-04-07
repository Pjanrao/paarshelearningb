import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./src/lib/db";
import User from "./src/models/User";
import Payment from "./src/models/Payment";

async function checkStudentPayments(name: string) {
  try {
    await connectDB();
    const user = await User.findOne({ name: new RegExp(name, 'i') });
    if (!user) return;

    const payments = await Payment.find({ student: user._id }).populate("courseId");
    console.log(`Student has ${payments.length} payment records.`);
    payments.forEach(p => {
        console.log(`- Course: ${p.courseId?.name || "Unknown"} (Status: ${p.status})`);
    });

  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}

checkStudentPayments("pranjal janrao");
