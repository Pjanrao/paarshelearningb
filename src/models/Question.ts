import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PracticeTest",
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
      validate: [
        (val: string[]) => val.length === 4,
        "Must have exactly 4 options",
      ],
    },
    correctAnswer: {
      type: Number, // Index of the correct option (0-3)
      required: true,
    },
    marks: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

const Question =
  mongoose.models.Question ||
  mongoose.model("Question", questionSchema);

export default Question;
