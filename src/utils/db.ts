import { connectDB } from "@/lib/db";

// Re-export connectDB as the default export for compatibility with entrance exam routes
const _db = connectDB;
export default _db;
