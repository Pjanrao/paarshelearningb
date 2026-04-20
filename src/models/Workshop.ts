import mongoose from "mongoose";

const workshopSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        subtitle: {
            type: String,
            default: "",
        },
        description: {
            type: String,
            default: "",
        },
        thumbnail: {
            type: String, // mapped to promoImage
            default: "",
        },
        promoImage: {
            type: String,
            default: "",
        },
        qrImage: {
            type: String,
            default: "",
        },
        instructorName: {
            type: String,
            default: "Expert Instructor",
        },
        date: {
            type: String,
            default: "",
        },
        time: {
            type: String,
            default: "",
        },
        duration: {
            type: String,
            default: "",
        },
        price: {
            type: Number,
            default: 0,
        },
        mode: {
            type: String,
            enum: ["online", "offline"],
            default: "online",
        },
        location: {
            type: String,
            default: "",
        },
        meetingLink: {
            type: String,
            default: "",
        },
        whatsappGroupLink: {
            type: String,
            default: "https://chat.whatsapp.com/KTnpNJVt2MUIaGz6wzXn65?mode=gi_t",
        },
        highlights: {
            type: [String],
            default: [],
        },
        agenda: {
            type: [{
                time: String,
                activity: String
            }],
            default: [],
        },
        instructions: {
            type: [String],
            default: [],
        },
        brochurePdf: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.Workshop ||
    mongoose.model("Workshop", workshopSchema);