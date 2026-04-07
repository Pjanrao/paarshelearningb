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