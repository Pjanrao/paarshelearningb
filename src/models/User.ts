import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
            lowercase: true,
        },
        contact: {
            type: String,
            required: [true, "Please provide a contact number"],
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            select: false, // Don't return password by default
        },
        role: {
            type: String,
            enum: ["student", "teacher", "admin"],
            default: "student",
        },
        image: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["active", "deleted"],
            default: "active",
        },
        deletionReason: {
            type: String,
            default: "",
        },


        referralCode: {
            type: String,
            unique: true,
        },

        referredBy: {
            type: String,
            default: null,
        },

        walletBalance: {
            type: Number,
            default: 0,
        },

        hasUsedReferral: {
            type: Boolean,
            default: false,
        },

        image: {
            type: String,
            default: "",
        },
        designation: {
            type: String,
            default: "Admin",
        },
        avatar: {
            type: String,
            default: "",
        },

    },
    { timestamps: true }
);

if (mongoose.models.User) {
    delete mongoose.models.User;
}
const User = mongoose.model("User", userSchema);

export default User;
