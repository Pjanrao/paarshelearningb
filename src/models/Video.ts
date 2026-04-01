import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Video title is required"],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    videoUrl: {
        type: String,
        required: [true, "Video URL is required"],
    },
    publicId: {
        type: String,
        required: [true, "Cloudinary public ID is required"],
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: [true, "Course ID is required"],
    },
    topic: {
        type: String,
        required: [true, "Main topic is required"],
        trim: true,
    },
    subtopic: {
        type: String,
        required: [true, "Subtopic is required"],
        trim: true,
    },
}, {
    timestamps: true
});

const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);

export default Video;
