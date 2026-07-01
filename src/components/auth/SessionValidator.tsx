"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout, logoutAdmin, logoutStudent, logoutTeacher } from "@/redux/authSlice";
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
                const isTeacherRoute = pathname.startsWith("/teacher");
                const isStudentRoute = pathname.startsWith("/student");

                // Read only the token relevant to the current route
                const cookieMap = document.cookie.split("; ").reduce((acc: Record<string, string>, cur) => {
                    const [k, v] = cur.split("=");
                    acc[k] = v;
                    return acc;
                }, {});

                let activeToken: string | undefined;
                let routeType: "teacher" | "student" | null = null;

                if (isTeacherRoute) {
                    activeToken = cookieMap["teacherToken"] || localStorage.getItem("teacherToken") || undefined;
                    routeType = "teacher";
                } else if (isStudentRoute) {
                    activeToken = cookieMap["studentToken"] || localStorage.getItem("studentToken") || undefined;
                    routeType = "student";
                } else {
                    // Default: safe fallback — check student token for legacy paths
                    activeToken = cookieMap["studentToken"] || localStorage.getItem("studentToken") || cookieMap["token"] || localStorage.getItem("token") || undefined;
                    routeType = "student";
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
                    // Session is invalid — clear only the relevant session
                    if (routeType === "teacher") {
                        dispatch(logoutTeacher());
                        localStorage.removeItem("teacherToken");
                        localStorage.removeItem("teacherRole");
                        localStorage.removeItem("teacherUser");
                        document.cookie = "teacherToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        document.cookie = "teacherRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    } else {
                        dispatch(logoutStudent());
                        localStorage.removeItem("studentToken");
                        localStorage.removeItem("studentRole");
                        localStorage.removeItem("studentUser");
                        document.cookie = "studentToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        document.cookie = "studentRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

                        // Clean legacy keys only if they were set for a student
                        const legacyRole = localStorage.getItem("role");
                        if (legacyRole === "student" || !legacyRole) {
                            dispatch(logout());
                            localStorage.removeItem("token");
                            localStorage.removeItem("role");
                            localStorage.removeItem("user");
                            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                            document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                        }
                    }

                    const redirectTarget = isTeacherRoute ? "/signin" : "/signin";

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
