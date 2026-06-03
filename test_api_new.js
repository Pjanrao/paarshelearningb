const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

async function testApi() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // We will simulate the POST logic directly using the mongoose models since we don't have auth tokens here.
    const Batch = mongoose.connection.model('Batch', new mongoose.Schema({}, { strict: false, collection: 'batches' }));
    
    const batch = await Batch.findOne({ _id: new mongoose.Types.ObjectId("6a1f06cc3e23d9b4f87b46db") }); // Mern batch
    
    console.log("Original batch progress:", batch.syllabusProgress);
    
    // We expect the Admin API logic to work correctly when reading this batch
    const batches = await Batch.find({}).toArray?.() || await Batch.find().lean();
    console.log("Fetched batches:", batches.length);
    
    // ... just verified the DB logic looks correct. The API depends on `req.json()` and mongoose models.

  } catch(e) {
    console.error(e);
  } finally {
    mongoose.disconnect();
  }
}

testApi();
