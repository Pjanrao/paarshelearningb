const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
const Batch = require('./src/models/Batch').default || require('./src/models/Batch');
const Course = require('./src/models/Course').default || require('./src/models/Course');
const User = require('./src/models/User').default || require('./src/models/User');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const batches = await Batch.find()
      .populate("courseId", "name")
      .populate("assignedTeacher", "name _id")
      .lean();
      
  console.log("Batches count:", batches.length);
  if (batches.length > 0) {
    console.log("First batch:", JSON.stringify(batches[0], null, 2));
  }
  
  await mongoose.disconnect();
}
main().catch(console.error);
