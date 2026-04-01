import { NextResponse, NextRequest } from "next/server";
// import jwt from "jsonwebtoken"; // Uncomment if you want actual JWT verification

export const authMiddleware = (handler: (request: NextRequest, ...args: any[]) => any, allowedRoles: string[] = []) => {
    return async (request: NextRequest, ...args: any[]) => {
        console.log(`AUTH_DEBUG: Middleware reached for ${request.nextUrl.pathname}`);
        try {
            // 1. Check for token in cookies or headers
            // const token = request.cookies.get("entrance_token")?.value;

            // if (!token) {
            //   return NextResponse.json(
            //     { success: false, error: "Authentication required" },
            //     { status: 401 }
            //   );
            // }

            // 2. Verify token (mock implementation for now as we don't have the original auth logic)
            // const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Check roles
            // if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
            //   return NextResponse.json(
            //     { success: false, error: "Insufficient permissions" },
            //     { status: 403 }
            //   );
            // }

            // 4. Attach user to request (if needed, though Next.js Request object is immutable, usually we use headers)
            // request.user = decoded;

            // 5. Call the handler
            return handler(request, ...args);
        } catch (error) {
            console.error("Auth middleware error:", error);
            return NextResponse.json(
                { success: false, error: "Authentication failed" },
                { status: 401 }
            );
        }
    };
};
