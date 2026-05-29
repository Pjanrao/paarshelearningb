import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Module",
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
    estimatedDuration: String,
  },
  { timestamps: true }
);

const Topic = mongoose.models.Topic || mongoose.model("Topic", topicSchema);
export default Topic;
