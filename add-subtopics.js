require('dotenv').config();
const mongoose = require('mongoose');

async function addSampleSubtopics() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.useDb("elearning");

    const course = await db.collection("courses").findOne({ name: "MERN Stack Development (MongoDB, Express, React, Node.js)" });

    if (course && course.syllabus && course.syllabus.length > 0) {
        // add two sample subtopics to the very first syllabus item
        const firstItem = course.syllabus[0];

        if (!firstItem.subtopics || firstItem.subtopics.length === 0) {
            firstItem.subtopics = [
                { _id: new mongoose.Types.ObjectId(), title: "Understanding Client-Server Architecture" },
                { _id: new mongoose.Types.ObjectId(), title: "Introduction to MongoDB and Express" }
            ];

            await db.collection("courses").updateOne(
                { _id: course._id },
                { $set: { "syllabus": course.syllabus } }
            );
            console.log("Added sample subtopics successfully!");
        } else {
            console.log("Subtopics already exist.");
        }
    }

    process.exit(0);
}

addSampleSubtopics();
