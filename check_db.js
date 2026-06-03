const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env' });

async function main() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const batch = await db.collection('batches').findOne({});
    console.log("Batch _id type:", typeof batch._id, batch._id.constructor.name);
    console.log("Batch courseId type:", typeof batch.courseId, batch.courseId?.constructor?.name);
    console.log("Batch assignedTeacher type:", typeof batch.assignedTeacher, batch.assignedTeacher?.constructor?.name);
  } finally {
    await client.close();
  }
}
main().catch(console.error);
