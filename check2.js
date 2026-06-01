require('dotenv').config();
const mongoose = require('mongoose');

async function checkData() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.useDb("elearning");

    const courses = await db.collection("courses").find({}).toArray();
    console.log(`Found ${courses.length} courses.`);
    for (const c of courses) {
        console.log(`Course: ${c.name}, ID: ${c._id}`);
    }

    const modules = await db.collection("modules").find({}).toArray();
    console.log(`Found ${modules.length} modules total.`);
    for (const m of modules) {
        console.log(`Module: ${m.title}, CourseId: ${m.courseId}`);
    }

    process.exit(0);
}

checkData();
