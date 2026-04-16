import mongoose from "mongoose";

const SiteImageSchema = new mongoose.Schema(
    {
        key: {
            type: String,
            required: [true, "Please provide a key"],
            unique: true,
            trim: true,
        },
        url: {
            type: String,
            required: [true, "Please provide an image URL"],
        },
        label: {
            type: String,
            required: [true, "Please provide a label"],
        },
        category: {
            type: String,
            default: "General",
        },
    },
    {
        timestamps: true,
    }
);

// Avoid "OverwriteModelError" during development
if (process.env.NODE_ENV === "development") {
    delete mongoose.models.SiteImage;
}

export default mongoose.models.SiteImage || mongoose.model("SiteImage", SiteImageSchema);
