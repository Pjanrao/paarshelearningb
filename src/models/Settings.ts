import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
    {
        platformName: { type: String, default: "Paarsh E-Learning" },
        supportEmail: { type: String, default: "support@paarsh.com" },
        darkMode: { type: Boolean, default: false },
        defaultLanguage: { type: String, default: "en" },
        notificationSettings: {
            email: { type: Boolean, default: true },
            browser: { type: Boolean, default: true },
            courseUpdates: { type: Boolean, default: true },
            studentEnquiries: { type: Boolean, default: true }
        }
    },
    { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
