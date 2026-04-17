"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout, logoutAdmin, logoutStudent } from "@/redux/authSlice";
import toast from "react-hot-toast";
import axios from "axios";

export default function SessionValidator() {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const isChecking = useRef(false);

    // List of safe paths where we don't immediately redirect but just allow the check, 
    // or paths where we shouldn't even check session
    const publicPaths = ["/signin", "/signup", "/forgot-password", "/reset-password", "/", "/admin/signin", "/admin/signin/"];

    useEffect(() => {
        const checkSession = async () => {
            // Avoid checking if currently on public auth routes where you aren't logged in
            if (publicPaths.includes(pathname)) return;

            // Admin users are allowed multiple concurrent sessions — skip verification
            if (pathname.startsWith("/admin")) return;

            // Avoid overlapping checks
            if (isChecking.current) return;
            isChecking.current = true;

            try {
                // We'll read the token manually from cookie or localStorage
                const cookieToken = document.cookie
                    .split("; ")
                    .find(row => row.startsWith("token="))
                    ?.split("=")[1];

                const adminCookieToken = document.cookie
                    .split("; ")
                    .find(row => row.startsWith("adminToken="))
                    ?.split("=")[1];

                const studentCookieToken = document.cookie
                    .split("; ")
                    .find(row => row.startsWith("studentToken="))
                    ?.split("=")[1];

                const localToken = localStorage.getItem("token");
                const localAdminToken = localStorage.getItem("adminToken");
                const localStudentToken = localStorage.getItem("studentToken");

                const baseToken = cookieToken || localToken;

                let activeToken = baseToken;
                let isAdminRoute = pathname.startsWith("/admin");

                if (isAdminRoute) {
                    activeToken = adminCookieToken || localAdminToken || baseToken;
                } else {
                    activeToken = studentCookieToken || localStudentToken || baseToken;
                }

                if (!activeToken || activeToken === "undefined") {
                    isChecking.current = false;
                    return;
                }

                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
                const res = await axios.post(`${apiUrl}/api/auth/verify-session`, 
                    { token: activeToken },
                    { validateStatus: (status) => status < 500 }
                );

                if (res.status === 401) {
                    // Session is invalid
                    if (isAdminRoute) {
                        dispatch(logoutAdmin());
                        localStorage.removeItem("adminToken");
                        localStorage.removeItem("adminRole");
                        localStorage.removeItem("adminUser");
                        document.cookie = "adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        document.cookie = "adminRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

                        // Clean legacy if on admin
                        if (!localAdminToken) {
                            dispatch(logout());
                            localStorage.removeItem("token");
                            localStorage.removeItem("role");
                            localStorage.removeItem("user");
                            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                            document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        }
                    } else {
                        dispatch(logoutStudent());
                        localStorage.removeItem("studentToken");
                        localStorage.removeItem("studentRole");
                        localStorage.removeItem("studentUser");
                        document.cookie = "studentToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        document.cookie = "studentRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

                        // Clean legacy on student side
                        if (!localStudentToken) {
                            dispatch(logout());
                            localStorage.removeItem("token");
                            localStorage.removeItem("role");
                            localStorage.removeItem("user");
                            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                            document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        }
                    }

                    const redirectTarget = isAdminRoute ? "/admin/signin" : "/signin";

                    // Show warning BEFORE redirecting so user can read it
                    toast(
                        "⚠️ Your account was signed in on another device. You have been logged out here.",
                        {
                            duration: 5000,
                            icon: "🔐",
                            style: {
                                background: "#fff3cd",
                                color: "#856404",
                                border: "1px solid #ffc107",
                                fontWeight: "600",
                                maxWidth: "420px",
                            },
                        }
                    );

                    // Wait 4 seconds so the user can read the warning, then redirect
                    setTimeout(() => {
                        router.push(redirectTarget);
                    }, 4000);
                }
            } catch (error) {
                console.error("Session verification failed", error);
            } finally {
                isChecking.current = false;
            }
        };

        // 1. Check when layout mounts or pathname changes
        checkSession();

        // 2. Poll every 30 seconds
        const interval = setInterval(checkSession, 30000);

        return () => clearInterval(interval);
    }, [pathname, dispatch, router]);

    return null; // Component does not render anything
}
