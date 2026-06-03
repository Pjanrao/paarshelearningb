const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

async function debugAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    
    const batches = await mongoose.connection.model('Batch', new mongoose.Schema({}, { strict: false, collection: 'batches' })).find({}).lean();
    console.log("Found batches:", batches.length);
    
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
}

debugAdmin();
