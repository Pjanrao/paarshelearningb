import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    // Legacy Token
    const legacyToken = req.cookies.get("token")?.value;
    const legacyRole = req.cookies.get("role")?.value;

    // Segregated Tokens
    const adminToken = req.cookies.get("adminToken")?.value;
    const adminRole = req.cookies.get("adminRole")?.value;

    const studentToken = req.cookies.get("studentToken")?.value;
    const studentRole = req.cookies.get("studentRole")?.value;

    const rawPath = req.nextUrl.pathname;
    const path = rawPath.length > 1 && rawPath.endsWith("/") ? rawPath.slice(0, -1) : rawPath;

    // Resolve active credentials using fallback logic
    const activeAdminToken = adminToken || legacyToken;
    const activeAdminRole = adminRole || legacyRole;

    const activeStudentToken = studentToken || legacyToken;
    const activeStudentRole = studentRole || legacyRole;

    console.log(`Middleware running: ${rawPath} | adminToken: ${activeAdminToken ? 'yes' : 'no'} | studentToken: ${activeStudentToken ? 'yes' : 'no'}`);

    // 1. Allow root and public auth paths
    if (
        path === "" ||
        path === "/" ||
        path === "/signin" ||
        path === "/admin/signin" ||
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
        path.startsWith("/workshops") ||
        path.startsWith("/workshop") ||
        path.startsWith("/career") ||
        path.startsWith("/documentation") ||
        path.startsWith("/inquiry") ||
        path.startsWith("/portfolio") ||
        path.startsWith("/services") ||
        path.startsWith("/terms-and-conditions") ||
        path.startsWith("/privacy-policy") ||
        path.startsWith("/return-policy") ||
        path.startsWith("/api/auth") ||
        path.startsWith("/api/login") ||
        path.startsWith("/api/register") ||
        path.startsWith("/entrance-exam") ||
        path.startsWith("/_next") ||
        path.startsWith("/images") ||
        path.startsWith("/uploads") ||
        path.startsWith("/promo") ||
        path.startsWith("/favicon.ico")
    ) {
        return NextResponse.next();
    }

    // Check admin session if on admin path
    if (path.startsWith("/admin")) {
        if (!activeAdminToken || activeAdminToken === "undefined" || activeAdminToken === "null" || activeAdminToken.length < 10 || activeAdminRole !== "admin") {
            return NextResponse.redirect(new URL("/admin/signin", req.url));
        }
    } else {
        // Website / student paths
        if (!activeStudentToken || activeStudentToken === "undefined" || activeStudentToken === "null" || activeStudentToken.length < 10) {
            if (!path.startsWith("/api")) {
                return NextResponse.redirect(new URL("/signin", req.url));
            }
        }

        if (path.startsWith("/teacher") && activeStudentRole !== "teacher") {
            return NextResponse.redirect(new URL("/signin", req.url));
        }

        if (path.startsWith("/student") && activeStudentRole !== "student") {
            return NextResponse.redirect(new URL("/signin", req.url));
        }
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