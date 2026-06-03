import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

/**
 * Debug endpoint to verify NextAuth configuration
 * Endpoint: GET /api/auth/debug
 */
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    const response = {
      status: "success",
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        nextAuthUrl: process.env.NEXTAUTH_URL,
        hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
        hasJwtSecret: !!process.env.JWT_SECRET,
      },
      session: {
        active: !!session,
        user: session?.user ? {
          email: session.user.email,
          name: (session.user as any).name,
          role: (session.user as any).role,
        } : null,
      },
      cookies: {
        nextAuthSession: !!req.headers.get("cookie")?.includes("next-auth.session-token"),
        csrfToken: !!req.headers.get("cookie")?.includes("next-auth.csrf-token"),
      },
      message: "NextAuth is configured and responding correctly",
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("NextAuth debug endpoint error:", error);
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error?.message || "Unknown error",
        details: error?.toString(),
        message: "NextAuth configuration or session retrieval failed",
      },
      { status: 500 }
    );
  }
}
