// models/EntranceExam/Test.model.js
import mongoose from "mongoose";

const entranceTestSchema = new mongoose.Schema({
  testId: { type: String, required: true, unique: true },
  college: { type: mongoose.Schema.Types.ObjectId, ref: "EntranceCollege", required: true },
  batchName: { type: String, required: true, trim: true },
  testDuration: { type: Number, required: true },
  testSettings: {
    questionsPerTest: { type: Number, required: true },
    passingScore: { type: Number, required: true },
    allowRetake: { type: Boolean, default: false },
  },
  createdAt: { type: Date, default: Date.now },
  hasExpiry: { type: Boolean, required: true, default: false },
  startTime: { type: Date },
  endTime: { type: Date }
});

entranceTestSchema.index({ college: 1 });

export default mongoose.models.EntranceTest || mongoose.model("EntranceTest", entranceTestSchema);
