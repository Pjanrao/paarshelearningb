"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/authSlice";
import toast from "react-hot-toast";

export default function SessionValidator() {
    const router = useRouter();
    const pathname = usePathname();
    const dispatch = useDispatch();
    const isChecking = useRef(false);

    // List of safe paths where we don't immediately redirect but just allow the check, 
    // or paths where we shouldn't even check session
    const publicPaths = ["/signin", "/signup", "/forgot-password", "/reset-password", "/"];

    useEffect(() => {
        const checkSession = async () => {
            // Avoid checking if currently on public auth routes where you aren't logged in
            if (publicPaths.includes(pathname)) return;

            // Avoid overlapping checks
            if (isChecking.current) return;
            isChecking.current = true;

            try {
                // We'll read the token manually from cookie or localStorage
                // The API needs the token to verify it
                const cookieToken = document.cookie
                    .split("; ")
                    .find(row => row.startsWith("token="))
                    ?.split("=")[1];

                const localToken = localStorage.getItem("token");
                const token = cookieToken || localToken;

                if (!token || token === "undefined") {
                    isChecking.current = false;
                    return;
                }

                const res = await fetch("/api/auth/verify-session", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                });

                if (res.status === 401) {
                    // Session is invalid (e.g., token expired or loginToken changed)
                    dispatch(logout());
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                    localStorage.removeItem("user");
                    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                    
                    toast.error("You have been signed out because your account was accessed from another device.", { duration: 5000 });
                    router.push("/signin");
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
