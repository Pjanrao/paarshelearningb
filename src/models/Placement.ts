import mongoose, { Schema, Document } from "mongoose";

export interface IPlacement extends Document {
    studentName: string;
    course: string;
    company: string;
    package: string;
    date: Date;
    status: "Placed" | "Offered" | "Interviewing" | "Pending";
    logo?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PlacementSchema: Schema = new Schema(
    {
        studentName: { type: String, required: true },
        course: { type: String, required: true },
        company: { type: String, required: true },
        package: { type: String, required: true },
        date: { type: Date, required: true },
        status: {
            type: String,
            enum: ["Placed", "Offered", "Interviewing", "Pending"],
            default: "Pending",
        },
        logo: { type: String },
    },
    { timestamps: true }
);

export default mongoose.models.Placement ||
    mongoose.model<IPlacement>("Placement", PlacementSchema);
