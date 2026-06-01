const mongoose = require("mongoose");
const fs = require("fs");

async function test() {
  try {
    const env = fs.readFileSync('.env', 'utf8');
    const uriMatch = env.match(/MONGODB_URI="(.*)"/) || env.match(/MONGODB_URI=(.*)/);
    const uri = uriMatch ? uriMatch[1] : null;

    if (!uri) {
        console.log("No MONGODB_URI found");
        return;
    }
    
    await mongoose.connect(uri);
    
    const users = await mongoose.connection.collection('users').find({ role: 'teacher' }).sort({ createdAt: -1 }).limit(3).toArray();
    const teachers = await mongoose.connection.collection('teachers').find().sort({ createdAt: -1 }).limit(3).toArray();
    
    console.log("USERS:", JSON.stringify(users, null, 2));
    console.log("TEACHERS:", JSON.stringify(teachers, null, 2));
  } catch (err) {
      console.log("Error:", err);
  } finally {
      process.exit(0);
  }
}

test();
