import mongoose from "mongoose";

export interface IConsentForm extends mongoose.Document {
    title: string;
    content: string;
    createdBy: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const consentFormSchema = new mongoose.Schema<IConsentForm>(
    {
        title: {
            type: String,
            required: [true, "Please provide a title"],
        },
        content: {
            type: String,
            required: [true, "Please provide the consent form content"],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

if (mongoose.models.ConsentForm) {
    delete mongoose.models.ConsentForm;
}
const ConsentForm = mongoose.models.ConsentForm || mongoose.model<IConsentForm>("ConsentForm", consentFormSchema);

export default ConsentForm;
