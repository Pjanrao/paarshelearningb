require('dotenv').config();
const mongoose = require('mongoose');

async function checkData() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");

    // Get first batch
    const db = mongoose.connection.useDb("elearning");

    const batches = await db.collection("batches").find({}).limit(5).toArray();
    console.log(`Found ${batches.length} batches.`);

    for (const b of batches) {
        console.log(`-------------`);
        console.log(`Batch: ${b.name}`);
        console.log(`CourseId: ${b.courseId}`);

        // find modules
        const modules = await db.collection("modules").find({ courseId: b.courseId }).toArray();
        console.log(`Modules found: ${modules.length}`);

        // find topics
        const moduleIds = modules.map(m => m._id);
        const topics = await db.collection("topics").find({ moduleId: { $in: moduleIds } }).toArray();
        console.log(`Topics found: ${topics.length}`);
    }

    process.exit(0);
}

checkData();
