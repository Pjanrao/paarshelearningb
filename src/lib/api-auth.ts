import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

/**
 * Extracts and verifies the JWT token from cookies.
 * Checks for role-specific tokens (studentToken, adminToken) first, 
 * then falls back to the generic 'token'.
 */
export async function getAuthUser() {
    try {
        const cookieStore = await cookies();
        
        // Priority order for tokens
        const studentToken = cookieStore.get("studentToken")?.value;
        const adminToken = cookieStore.get("adminToken")?.value;
        const genericToken = cookieStore.get("token")?.value;

        const token = studentToken || adminToken || genericToken;

        if (!token) return null;

        const decoded = verifyToken(token) as any;
        if (!decoded || !decoded.id) return null;

        return {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
            decoded
        };
    } catch (error) {
        console.error("Auth helper error:", error);
        return null;
    }
}
