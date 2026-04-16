import mongoose from "mongoose";
import SiteImage from "./src/models/SiteImage.ts";
import { connectDB } from "./src/lib/db.ts";

async function checkImages() {
    try {
        await connectDB();
        const images = await SiteImage.find({});
        console.log(JSON.stringify(images, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkImages();
