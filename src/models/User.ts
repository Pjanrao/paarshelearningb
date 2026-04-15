import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
    name: string;
    email: string;
    contact: string;
    password?: string;
    role: "student" | "teacher" | "admin";
    image: string;
    status: "active" | "deleted";
    deletionReason: string;
    referralCode?: string;
    referredBy?: string;
    walletBalance: number;
    hasUsedReferral: boolean;
    referralReward: number;
    designation: string;
    avatar: string;
    loginToken?: string | null;
    resetOtp?: string | null;
    resetOtpExpires?: Date | null;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
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
            unique: true,
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
        referralReward: {
            type: Number,
            default: 0,
        },

        designation: {
            type: String,
            default: "Admin",
        },
        avatar: {
            type: String,
            default: "",
        },
        loginToken: {
            type: String,
            default: null,
        },
        resetOtp: {
            type: String,
            default: null,
        },
        resetOtpExpires: {
            type: Date,
            default: null,
        },

    },
    { timestamps: true }
);

if (mongoose.models.User) {
    delete mongoose.models.User;
}
const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
