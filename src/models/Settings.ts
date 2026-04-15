import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
    {
        contactDetails: {
            phone: { type: String, default: "+91 90752 01033" },
            email: { type: String, default: "paarshelearning@gmail.com" },
            puneAddress: { type: String, default: "Second Floor, Wisteriaa Fortune, Wakad, Maharashtra 411057" },
            nashikAddress: { type: String, default: "Bhakti Apartment, Suchita Nagar, Mumbai Naka, Nashik" },
            openHours: { type: String, default: "Mon - Fri, 9:30 AM - 7:30 PM" }
        }
    },
    { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
