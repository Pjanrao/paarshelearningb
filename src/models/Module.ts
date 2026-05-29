import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: String,
    sequence: {
      type: Number,
      default: 1,
    },
    topics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Topic",
      },
    ],
  },
  { timestamps: true }
);

const Module = mongoose.models.Module || mongoose.model("Module", moduleSchema);
export default Module;
