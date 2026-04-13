const mongoose = require("mongoose");
const User = require("./src/models/User").default || require("./src/models/User");
const Payment = require("./src/models/Payment").default || require("./src/models/Payment");

async function check() {
    try {
        const dbUri = "mongodb://paarshelearning_db_user:PxF9FH0GFO3Qglra@ac-eomezw0-shard-00-00.qunpbyy.mongodb.net:27017,ac-eomezw0-shard-00-01.qunpbyy.mongodb.net:27017,ac-eomezw0-shard-00-02.qunpbyy.mongodb.net:27017/elearning?ssl=true&replicaSet=atlas-tsrxir-shard-0&authSource=admin&retryWrites=true&w=majority";
        
        await mongoose.connect(dbUri);
        console.log("Connected to DB");

        const email = "vidhi@gmail.com";
        const user = await mongoose.models.User.findOne({ email }).lean();
        
        if (!user) {
            console.log("User not found!");
            process.exit(0);
        }
        
        console.log("User ID:", user._id.toString());
        
        const payments = await mongoose.models.Payment.find({
            studentId: user._id,
            status: "completed"
        }).lean();
        
        console.log("Completed payments count:", payments.length);
        payments.forEach(p => {
            console.log(`- Course ID: ${p.courseId.toString()}, Payment ID: ${p._id.toString()}`);
        });
        
        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

check();
