import mongoose from "mongoose";

const InquirySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please fill a valid email address",
            ],
        },
        phone: {
            type: String,
            required: [true, "Please provide a phone number"],
        },
        message: {
            type: String,
            required: [true, "Please provide a message"],
        },
        course: {
            type: String,
            default: "Not Specified",
        },
        status: {
            type: String,
            enum: ["New", "Contacted", "Enrolled", "Cancelled"],
            default: "New",
        },
        source: {
            type: String,
            default: "Website",
        },
        education: {
            type: String,
        },
        college: {
            type: String,
        },
        country: {
            type: String,
        },
        type: {
            type: String,
            enum: ["Contact Form", "Inquiry Form"],
            required: [true, "Please specify the type of inquiry"],
            default: "Contact Form",
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Avoid "OverwriteModelError" while allowing schema updates during development
if (process.env.NODE_ENV === "development") {
    delete mongoose.models.Inquiry;
}

export default mongoose.models.Inquiry || mongoose.model("Inquiry", InquirySchema);