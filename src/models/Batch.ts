import mongoose from "mongoose";

const BatchSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },

        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true
        },

        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],

        startDate: Date,
        endDate: Date,

        assignedTeacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

        syllabusProgress: [
            {
                topicId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Topic",
                },
                teacherId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                completed: { type: Boolean, default: false },
                completedAt: Date,
completedSubtopics: [
 {
   type: mongoose.Schema.Types.ObjectId
 }
],
                createdAt: { type: Date, default: Date.now },
                updatedAt: { type: Date, default: Date.now }
            }
        ],

        lastLectureAt: Date,

        status: {
            type: String,
            enum: ["Upcoming", "Active", "Completed"],
            default: "Active"
        }
    },
    { timestamps: true }
);

export default mongoose.models.Batch ||
    mongoose.model("Batch", BatchSchema);