import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        contact: {
            type: String,
        },
        avatar: {
            type: String,
            default: "/placeholder-avatar.jpg",
        },
        course: {
            type: String,
            required: true,
        },
        designation: {
            type: String,
            required: true,
        },
        experience: {
            type: String,
            required: true,
        },
        dateOfJoining: {
            type: String,
            required: true,
        },
        assignedCourses: {
            type: [String],
            default: [],
        },
        totalStudents: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

if (process.env.NODE_ENV === "development") {
    delete (mongoose.models as any).Teacher;
}

export default mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);
