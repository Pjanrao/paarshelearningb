// models/EntranceExam/TestSession.model.js
import mongoose from "mongoose";

const entranceTestSessionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EntranceStudent",
    required: true,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EntranceCollege",
    required: true,
  },
  testId: {
    type: String,
    required: true,
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "EntranceTest",
    required: true,
  },
  batchName: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
  },
  endTime: {
    type: Date,
  },
  duration: {
    type: Number,
    required: true,
  },
  score: {
    type: Number,
    default: 0,
  },
  percentage: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["pending", "active", "completed"],
    default: "pending",
  },
  questions: [
    {
      question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "entranceQuestions",
        required: true,
      },
      selectedAnswer: { type: Number, default: -1 },
      isCorrect: { type: Boolean, default: false },
      timeSpent: { type: Number, default: 0 },
    },
  ],
  ipAddress: { type: String },
  userAgent: { type: String },
  browserInfo: {
    name: { type: String },
    version: { type: String },
    platform: { type: String },
  },
  isPassed: {
    type: Boolean,
    default: false,
  },
  passingPercentage: {
    type: Number,
    default: 70, 
  },
});

entranceTestSessionSchema.index({ student: 1, college: 1, testId: 1 });
entranceTestSessionSchema.index({ startTime: -1 }); 

export default mongoose.models.EntranceTestSession ||
  mongoose.model("EntranceTestSession", entranceTestSessionSchema);
