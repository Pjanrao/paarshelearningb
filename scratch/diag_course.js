const mongoose = require("mongoose");
const Course = require("./src/models/Course").default || require("./src/models/Course");
const User = require("./src/models/User").default || require("./src/models/User");
const Payment = require("./src/models/Payment").default || require("./src/models/Payment");

async function check() {
    try {
        const dbUri = "mongodb://paarshelearning_db_user:PxF9FH0GFO3Qglra@ac-eomezw0-shard-00-00.qunpbyy.mongodb.net:27017,ac-eomezw0-shard-00-01.qunpbyy.mongodb.net:27017,ac-eomezw0-shard-00-02.qunpbyy.mongodb.net:27017/elearning?ssl=true&replicaSet=atlas-tsrxir-shard-0&authSource=admin&retryWrites=true&w=majority";
        
        await mongoose.connect(dbUri);
        console.log("Connected to DB");

        const courseId = "69b3cfe3bed881e7f6e8e74a";
        const email = "vidhi@gmail.com";
        
        const user = await mongoose.models.User.findOne({ email }).lean();
        console.log("Current User ID for vidhi@gmail.com:", user ? user._id : "NOT FOUND");

        const paymentsForCourse = await mongoose.models.Payment.find({
            courseId: new mongoose.Types.ObjectId(courseId),
            status: "completed"
        }).populate({
            path: "studentId",
            model: mongoose.models.User,
            select: "email"
        }).lean();
        
        console.log(`Found ${paymentsForCourse.length} total completed payments for this course.`);
        paymentsForCourse.forEach(p => {
            console.log(`- Student Email: ${p.studentId ? p.studentId.email : "UNKNOWN"}, Student ID: ${p.studentId ? p.studentId._id : "N/A"}`);
        });

        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

check();
