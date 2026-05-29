const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  console.error("MONGODB_URI not set in env");
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(async () => {
    console.log("Connected to MongoDB successfully!");
    
    // Define a simple Schema to match User
    const UserSchema = new mongoose.Schema({}, { strict: false, collection: "users" });
    const User = mongoose.model("User", UserSchema);
    
    const users = await User.find({ email: /teachertesting/i });
    console.log("Found users matching 'teachertesting':");
    console.log(JSON.stringify(users, null, 2));

    const TeacherSchema = new mongoose.Schema({}, { strict: false, collection: "teachers" });
    const TeacherModel = mongoose.model("TeacherDebug", TeacherSchema);
    const teachers = await TeacherModel.find({ email: /teachertesting/i });
    console.log("Found teachers matching 'teachertesting':");
    console.log(JSON.stringify(teachers, null, 2));

    const allUsers = await User.find({});
    console.log("Total users in DB:", allUsers.length);
    console.log("Roles breakdown:");
    const roles = {};
    allUsers.forEach(u => {
      roles[u.role] = (roles[u.role] || 0) + 1;
    });
    console.log(roles);
    
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("Connection error:", err);
  });
