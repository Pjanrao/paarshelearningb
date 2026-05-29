import mongoose from "mongoose";

const syllabusProgressSchema = new mongoose.Schema(
  {
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalTopics: {
      type: Number,
      default: 0,
    },
    completedTopics: {
      type: Number,
      default: 0,
    },
    completionPercent: {
      type: Number,
      default: 0,
    },
    lastUpdateAt: {
      type: Date,
      default: Date.now,
    },
    overdueDays: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const SyllabusProgress =
  mongoose.models.SyllabusProgress ||
  mongoose.model("SyllabusProgress", syllabusProgressSchema);
export default SyllabusProgress;
