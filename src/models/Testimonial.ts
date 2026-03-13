import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        course: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        featured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        collection: "testimonials"
    }
);

export default mongoose.models.Testimonial ||
    mongoose.model("Testimonial", testimonialSchema);
