import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema(
    {
        certificateNumber: {
            type: String,
            required: true,
            unique: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
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
        studentName: {
            type: String,
            required: true,
        },
        courseName: {
            type: String,
            required: true,
        },
        completionDate: {
            type: Date,
            required: true,
        },
        issuedBy: {
            type: String,
            default: "Paarsh E-Learning",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Certificate ||
    mongoose.model("Certificate", CertificateSchema);
