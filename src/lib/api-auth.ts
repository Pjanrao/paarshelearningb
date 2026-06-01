import { cookies } from "next/headers";
import { verifyToken } from "./jwt";
import { getToken } from "next-auth/jwt";
import User from "@/models/User";

/**
 * Extracts and verifies the JWT token from cookies.
 * Checks for role-specific tokens (studentToken, adminToken) first, 
 * then falls back to the generic 'token'.
 */
export async function getAuthUser() {
    try {
        const cookieStore = await cookies();
        
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

/**
 * Attempts to resolve the authenticated user from either NextAuth or the legacy JWT cookie flow.
 */
export async function getUserFromAuth(req: Request) {
    try {
        const decodedToken = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET });
        if (decodedToken?.email) {
            const user = await User.findOne({ email: decodedToken.email });
            if (user) return user;
        }
    } catch (error) {
        console.warn("getToken error:", error);
    }

    const authUser = await getAuthUser();
    if (authUser?.id) {
        const user = await User.findById(authUser.id);
        if (user) {
            if (user.role !== "admin" && authUser.decoded?.loginToken && user.loginToken !== authUser.decoded.loginToken) {
                return null;
            }
            return user;
        }
    }

    return null;
}
