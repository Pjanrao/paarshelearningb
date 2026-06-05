import mongoose from "mongoose";

const teacherDailyLogSchema = new mongoose.Schema(
  {
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    },
    logDate: {
      type: Date,
      required: true,
    },
    notes: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const TeacherDailyLog =
  mongoose.models.TeacherDailyLog ||
  mongoose.model("TeacherDailyLog", teacherDailyLogSchema);

export default TeacherDailyLog;
