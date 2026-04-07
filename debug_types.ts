import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./src/lib/db";
import User from "./src/models/User";
import Batch from "./src/models/Batch";
import PracticeTest from "./src/models/PracticeTest";

async function checkTypes(email: string) {
  try {
    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
        console.log("User not found");
        return;
    }
    console.log(`User ID: ${user._id} (Type: ${typeof user._id} / IsObjectId: ${user._id instanceof mongoose.Types.ObjectId})`);

    const batches = await Batch.find({ students: user._id });
    console.log(`Found ${batches.length} batches.`);
    if (batches.length > 0) {
        console.log(`First Batch students sample:`, batches[0].students.slice(0, 5));
        console.log(`First Batch student type: ${typeof batches[0].students[0]} / IsObjectId: ${batches[0].students[0] instanceof mongoose.Types.ObjectId}`);
    }

    const htmlTest = await PracticeTest.findOne({ name: /html/i });
    if (htmlTest) {
        console.log(`Test courseIds sample:`, htmlTest.courseIds);
        console.log(`Test courseId type: ${typeof htmlTest.courseIds[0]} / IsObjectId: ${htmlTest.courseIds[0] instanceof mongoose.Types.ObjectId}`);
    }

  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}

checkTypes("vidhi@gmail.com");
