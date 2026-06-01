require('dotenv').config();
const mongoose = require('mongoose');

async function addSampleSubtopicsToAll() {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.useDb("elearning");

    const course = await db.collection("courses").findOne({ name: "MERN Stack Development (MongoDB, Express, React, Node.js)" });

    if (course && course.syllabus && course.syllabus.length > 0) {
        let updated = false;

        // add sample subtopics to EVERY syllabus item that doesn't have them
        course.syllabus.forEach((item, index) => {
            if (!item.subtopics || item.subtopics.length === 0) {
                item.subtopics = [
                    { _id: new mongoose.Types.ObjectId(), title: `Sample Subtopic A for ${item.title.substring(0, 10)}...` },
                    { _id: new mongoose.Types.ObjectId(), title: `Sample Subtopic B for ${item.title.substring(0, 10)}...` }
                ];
                updated = true;
            }
        });

        if (updated) {
            await db.collection("courses").updateOne(
                { _id: course._id },
                { $set: { "syllabus": course.syllabus } }
            );
            console.log("Added sample subtopics to all items successfully!");
        } else {
            console.log("Subtopics already exist on all items.");
        }
    }

    process.exit(0);
}

addSampleSubtopicsToAll();
