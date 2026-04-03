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
        size: {
            type: Number,
            default: 1,
        },
    },
    {
        timestamps: true,
        collection: "industrypartners",
    }
);

if (process.env.NODE_ENV === "development") {
    delete (mongoose as any).models.IndustryPartner;
}

const IndustryPartner = mongoose.models.IndustryPartner || mongoose.model("IndustryPartner", industryPartnerSchema);

export default IndustryPartner;
