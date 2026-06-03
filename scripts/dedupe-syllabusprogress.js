require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Please set MONGODB_URI in environment');
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGODB_URI, { bufferCommands: false });
  console.log('Connected to DB for dedupe');

  const col = mongoose.connection.collection('syllabusprogresses');

  const groups = await col.aggregate([
    { $group: { _id: { batchId: '$batchId', teacherId: '$teacherId' }, ids: { $push: '$_id' }, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } }
  ]).toArray();

  console.log('Found duplicate groups:', groups.length);

  for (const g of groups) {
    const { batchId, teacherId } = g._id;
    const docs = await col.find({ batchId: batchId, teacherId: teacherId }).sort({ lastUpdateAt: -1, updatedAt: -1 }).toArray();
    if (docs.length <= 1) continue;
    const keep = docs[0]._id;
    const remove = docs.slice(1).map(d => d._id);
    console.log(`Keeping ${keep}, removing ${remove.length} for batch ${batchId} teacher ${teacherId}`);
    await col.deleteMany({ _id: { $in: remove } });
  }

  console.log('Dedupe complete');
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
