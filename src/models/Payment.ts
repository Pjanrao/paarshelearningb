import mongoose from "mongoose";

const installmentSchema = new mongoose.Schema({
    amount: Number,
    paymentMode: String,
    receipt: String,
    date: { type: Date, default: Date.now }
});

const paymentSchema = new mongoose.Schema(
    {
        // 🔗 Relations
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Student",
        },
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
        },

        // 💰 Payment details
        totalAmount: {
            type: Number,
            required: true,
        },
        paidAmount: {
            type: Number,
            default: 0,
        },
        remainingAmount: {
            type: Number,
            default: 0,
        },

        // 💳 Mode & receipt
        paymentMode: {
            type: String,
            default: "cash",
        },
        receipt: String,

        // 🧾 Transaction (from old schema)
        transactionId: String,
        currency: {
            type: String,
            default: "INR",
        },

        // 📊 Status
        status: {
            type: String,
            enum: ["pending", "completed", "failed"],
            default: "pending",
        },

        // 📅 Installments
        installments: [installmentSchema],

        // 📅 Date
        date: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Payment ||
    mongoose.model("Payment", paymentSchema);


// import mongoose from "mongoose";

// const PaymentSchema = new mongoose.Schema(
//     {
//         student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//         amount: { type: Number, required: true },
//         currency: { type: String, default: "INR" },
//         status: {
//             type: String,
//             enum: ["pending", "completed", "failed"],
//             default: "pending",
//         },
//         transactionId: String,
//         method: { type: String, default: "card" },
//         date: { type: Date, default: Date.now },
//     },
//     { timestamps: true }
// );

// export default mongoose.models.Payment || mongoose.model("Payment", PaymentSchema);
