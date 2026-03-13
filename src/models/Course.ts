// import mongoose from "mongoose";

// const CourseSchema = new mongoose.Schema(
//     {
//         title: { type: String, required: true },
//         description: String,
//         price: { type: Number, default: 0 },
//         duration: String,
//         category: String,
//         level: {
//             type: String,
//             enum: ["Beginner", "Intermediate", "Advanced"],
//             default: "Beginner",
//         },
//         studentsEnrolled: { type: Number, default: 0 },
//         rating: { type: Number, default: 0 },
//         thumbnail: String,
//         syllabus: [
//             {
//                 title: String,
//                 content: String,
//             },
//         ],
//     },
//     { timestamps: true }
// );

// export default mongoose.models.Course || mongoose.model("Course", CourseSchema);


import mongoose from "mongoose";
import "./Category";
import "./Subcategory";
import "./Teachers";

const syllabusSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
});

const simpleBlockSchema = new mongoose.Schema({
    title: { type: String },
    description: { type: String },
});

const testimonialSchema = new mongoose.Schema({
    studentName: { type: String },
    review: { type: String },
});

const courseSchema = new mongoose.Schema(
    {
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },

        subcategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subcategory",
        },

        name: {
            type: String,
            required: true,
        },

        shortDescription: String,
        overview: String,

        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
        },

        languages: [String],
        popularTags: [String],

        duration: Number,
        fee: Number,

        availability: {
            type: String,
            enum: ["available", "unavailable", "upcoming"],
            default: "available",
        },

        difficulty: {
            type: String,
            enum: ["beginner", "intermediate", "advanced"],
        },

        featured: {
            type: Boolean,
            default: false,
        },

        certificate: {
            type: Boolean,
            default: false,
        },

        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },

        syllabusPdf: String,
        thumbnail: String,
        introVideo: String,

        syllabus: [syllabusSchema],
        benefits: [simpleBlockSchema],
        whyJoin: [simpleBlockSchema],
        testimonials: [testimonialSchema],
    },
    { timestamps: true }
);

const Course =
    mongoose.models.Course ||
    mongoose.model("Course", courseSchema);

export default Course;