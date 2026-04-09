import mongoose from "mongoose";

const pageVisitSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
        pathname: {
            type: String,
            required: true,
        },
        entryTime: {
            type: Date,
            required: true,
        },
        exitTime: {
            type: Date,
            required: true,
        },
        duration: {
            type: Number, // Duration in seconds
            required: true,
        },
        title: {
            type: String,
            default: "Unknown Page",
        },
    },
    { timestamps: true }
);

const PageVisit = mongoose.models.PageVisit || mongoose.model("PageVisit", pageVisitSchema);

export default PageVisit;
