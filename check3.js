require('dotenv').config();
const mongoose = require('mongoose');

async function checkData() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.useDb("elearning");

    const course = await db.collection("courses").findOne({ name: "MERN Stack Development (MongoDB, Express, React, Node.js)" });
    console.log("Course Found:", !!course);
    if (course) {
        console.log("Syllabus Array:", course.syllabus ? course.syllabus.length : 0);
        console.log("Modules Array:", course.modules ? course.modules.length : 0);
        if (course.syllabus && course.syllabus.length > 0) {
            console.log(course.syllabus.slice(0, 2));
        }
    }

    process.exit(0);
}

checkData();
