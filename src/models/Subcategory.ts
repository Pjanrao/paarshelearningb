import mongoose, { Schema, models } from "mongoose";
import "./Category"; // Ensure Category is registered

const SubcategorySchema = new Schema(
    {
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: String,
        keywords: [String],
    },
    { timestamps: true }
);

export default models.Subcategory ||
    mongoose.model("Subcategory", SubcategorySchema);