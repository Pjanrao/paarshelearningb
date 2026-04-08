import mongoose from "mongoose";

const withdrawalSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            default: "UPI",
        },
        upiId: {
            type: String,
            required: true,
        },
        transactionId: {
            type: String,
            default: "",
        },
        remarks: {
            type: String,
            default: "",
        },
    },
    { timestamps: true }
);

if (mongoose.models.Withdrawal) {
    delete mongoose.models.Withdrawal;
}
const Withdrawal = mongoose.model("Withdrawal", withdrawalSchema);

export default Withdrawal;
