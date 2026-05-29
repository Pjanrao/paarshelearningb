import mongoose from "mongoose";

const lectureTrackingSchema = new mongoose.Schema(
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
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
    },
    topicId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lectureTitle: {
      type: String,
      required: true,
    },
    summary: String,
    homework: String,
    recordingLink: String,
    durationHours: Number,
    completed: {
      type: Boolean,
      default: true,
    },
    lectureDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const LectureTracking =
  mongoose.models.LectureTracking ||
  mongoose.model("LectureTracking", lectureTrackingSchema);
export default LectureTracking;
