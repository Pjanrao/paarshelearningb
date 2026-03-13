import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        coverImage: {
            type: String,
            default: "",
        },
        author: {
            name: {
                type: String,
                required: true,
            },
            role: {
                type: String,
                required: true,
            },
            avatar: {
                type: String,
                default: "/placeholder-avatar.jpg",
            },
        },
        publishedDate: {
            type: Date,
            default: Date.now,
        },
        tags: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ["published", "draft"],
            default: "draft",
        },
    },
    { timestamps: true }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
export default Blog;
