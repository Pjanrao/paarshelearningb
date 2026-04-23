import { connectDB } from "@/lib/db";
import Activity from "@/models/Activity";

export async function logActivity(userId: string, type: "video" | "download" | "test" | "login" | "other", action: string, details?: string) {
    try {
        await connectDB();
        const activity = await Activity.create({
            userId,
            type,
            action,
            details
        });
        return activity;
    } catch (error) {
        console.error("Error logging activity:", error);
        return null;
    }
}
