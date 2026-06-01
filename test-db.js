import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/paarsh-e-learning-blue"; // Or whatever is in .env

async function test() {
  const env = (await import('fs')).readFileSync('.env', 'utf8');
  const uriMatch = env.match(/MONGODB_URI="(.*)"/);
  const uri = uriMatch ? uriMatch[1] : (env.match(/MONGODB_URI=(.*)/) ? env.match(/MONGODB_URI=(.*)/)[1] : null);
  
  if (!uri) {
    console.log("No MONGODB_URI found");
    return;
  }
  
  await mongoose.connect(uri);
  
  const users = await mongoose.connection.collection('users').find({ role: 'teacher' }).sort({ createdAt: -1 }).limit(3).toArray();
  const teachers = await mongoose.connection.collection('teachers').find().sort({ createdAt: -1 }).limit(3).toArray();
  
  console.log("USERS:");
  console.log(users);
  console.log("TEACHERS:");
  console.log(teachers);
  
  process.exit(0);
}

test();
