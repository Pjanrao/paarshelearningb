import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./src/lib/db";
import User from "./src/models/User";
import Batch from "./src/models/Batch";
import PracticeTest from "./src/models/PracticeTest";

async function debugStudentTestsByEmail(email: string) {
  try {
    await connectDB();
    console.log(`Searching for student email: ${email}`);

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log("User not found.");
      return;
    }
    console.log(`Found user: ${user.name} (${user._id})`);

    const batches = await Batch.find({ students: user._id });
    console.log(`User is in ${batches.length} batches.`);
    
    if (batches.length === 0) {
        console.log("❌ USER NOT IN ANY BATCHES.");
    }

    const courseIds = batches.map(b => b.courseId);
    console.log(`Associated Course IDs: ${courseIds}`);

    const tests = await PracticeTest.find({ 
      courseIds: { $in: courseIds },
      status: "active" 
    });
    
    console.log(`Found ${tests.length} active tests for these courses.`);
    
    tests.forEach(test => {
        console.log(`- Test: ${test.name} (Courses: ${test.courseIds})`);
    });

  } catch (error) {
    console.error("Error:", error);
  } finally {
    process.exit();
  }
}

const targetEmail = process.argv[2] || "vidhi@gmail.com";
debugStudentTestsByEmail(targetEmail);
