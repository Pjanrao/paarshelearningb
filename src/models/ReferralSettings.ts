import mongoose from "mongoose";

const referralSettingsSchema = new mongoose.Schema({
    cashbackAmount: {
        type: Number,
        default: 50,
    },
    discountPercentage: {
        type: Number,
        default: 10,
    },
    maxReferrals: {
        type: String,
        default: "Unlimited",
    },
    newUserReward: {   // ✅ NEW FIELD
        type: Number,
        default: 50,
    },
    rewardDays: {
        type: Number,
        default: 1,
    },
}, { timestamps: true });

export default mongoose.models.ReferralSettings ||
    mongoose.model("ReferralSettings", referralSettingsSchema);