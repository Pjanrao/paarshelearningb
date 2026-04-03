import mongoose from "mongoose";

const industryPartnerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        logoUrl: {
            type: String,
            required: true,
        },
        websiteUrl: {
            type: String,
            default: "",
        },
        displayOrder: {
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
        collection: "industrypartners",
    }
);

export default mongoose.models.IndustryPartner ||
    mongoose.model("IndustryPartner", industryPartnerSchema);
