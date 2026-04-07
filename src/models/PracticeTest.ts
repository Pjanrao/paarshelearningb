import mongoose from "mongoose";
import "./Course";

const practiceTestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    courseIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    skill: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["Easy", "Intermediate", "Hard"],
      default: "Intermediate",
    },
    duration: {
      type: Number, // in minutes
      required: true,
    },
    totalQuestions: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

const PracticeTest =
  mongoose.models.PracticeTest ||
  mongoose.model("PracticeTest", practiceTestSchema);

export default PracticeTest;
