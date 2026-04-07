import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./src/lib/db";
import PracticeTest from "./src/models/PracticeTest";

async function debugHtmlTest() {
  try {
    await connectDB();
    const test = await PracticeTest.findOne({ name: /html/i });
    if (test) {
        console.log("Test Found:", JSON.stringify(test, null, 2));
    } else {
        console.log("Test not found by name 'html'");
    }

  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}

debugHtmlTest();
