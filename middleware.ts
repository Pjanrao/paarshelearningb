import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;
  const path = req.nextUrl.pathname;

  // Redirect /sign-in to /signin
  if (path === "/sign-in") {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // Allow public/auth pages and static assets
  if (
    path === "/signin" ||
    path === "/signup" ||
    path === "/forgot-password" ||
    path === "/reset-password" ||
    path.startsWith("/entrance-exam") ||
    path.startsWith("/api/auth") ||
    path.startsWith("/api/login") ||
    path.startsWith("/_next") ||
    path.startsWith("/images") ||
    path.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // If no token, redirect to sign-in
  if (!token) {
    // Only redirect if it's a page request, not an API request
    if (!path.startsWith("/api")) {
      return NextResponse.redirect(new URL("/signin", req.url));
    }
  }

  // Route protection
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
