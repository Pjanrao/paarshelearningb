import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const role = req.cookies.get("role")?.value;
    const rawPath = req.nextUrl.pathname;
    // Normalize path: Remove trailing slash if it exists (except for root "/")
    const path = rawPath.length > 1 && rawPath.endsWith("/") ? rawPath.slice(0, -1) : rawPath;

    console.log(`Middleware running: ${rawPath} (normalized: ${path}) | Token: ${token ? 'exists' : 'missing'} | Role: ${role}`);

    // 1. Allow root and public auth paths
    if (
        path === "" ||
        path === "/" ||
        path === "/signin" ||
        path === "/signup" ||
        path === "/forgot-password" ||
        path === "/reset-password" ||
        path.startsWith("/about-us") ||
        path.startsWith("/contact-us") ||
        path.startsWith("/Course") || 
        path.startsWith("/courses") ||
        path.startsWith("/digital-marketing-course-nashik") ||
        path.startsWith("/seo-training-course") ||
        path.startsWith("/internship-digital-marketing") ||
        path.startsWith("/blog") ||
        path.startsWith("/documentation") ||
        path.startsWith("/inquiry") ||
        path.startsWith("/portfolio") ||
        path.startsWith("/services") ||
        path.startsWith("/api/auth") ||
        path.startsWith("/api/login") ||
        path.startsWith("/api/register") ||
        path.startsWith("/entrance-exam") ||
        path.startsWith("/_next") ||
        path.startsWith("/images") ||
        path.startsWith("/favicon.ico")
    ) {
        return NextResponse.next();
    }

    // If no token or invalid token, redirect to sign-in
    if (!token || token === "undefined" || token === "null" || token.length < 10) {
        // Only redirect if it's a page request, not an API request
        if (!path.startsWith("/api")) {
            return NextResponse.redirect(new URL("/signin", req.url));
        }
    }

    // 3. Route protection
    if (path.startsWith("/admin") && role !== "admin") {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (path.startsWith("/teacher") && role !== "teacher") {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    if (path.startsWith("/student") && role !== "student") {
        return NextResponse.redirect(new URL("/signin", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};