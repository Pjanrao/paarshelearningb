"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

export default function PageTracker() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const entryTimeRef = useRef<number>(Date.now());
    const lastUrlRef = useRef<string>(typeof window !== 'undefined' ? window.location.href : pathname);
    const lastTitleRef = useRef<string>("Unknown Page");

    // Helper to get descriptive page name and section
    const getPageContext = () => {
        if (typeof document === 'undefined') return "Unknown Page";
        
        const title = document.title.split('|')[0].trim() || "Portal";
        const h1 = document.querySelector('h1')?.innerText?.trim();
        
        if (h1 && h1.toLowerCase() !== title.toLowerCase()) {
            return `${h1} (${title})`;
        }
        return h1 || title || "Unknown Page";
    };

    // Helper to check if tracking should be disabled
    const isTrackerDisabled = () => {
        if (typeof document === 'undefined') return true;
        const value = `; ${document.cookie}`;
        const parts = value.split(`; role=`);
        const cookieRole = parts.length === 2 ? parts.pop()?.split(';').shift() : null;
        return session?.user?.role === 'admin' || cookieRole === 'admin';
    };

    const sendTrackingData = (url: string, title: string, start: number, end: number) => {
        if (isTrackerDisabled()) return;

        const duration = Math.round((end - start) / 1000);
        if (duration < 1) return;

        const data = {
            pathname: url,
            title: title || "Unknown Page",
            entryTime: new Date(start).toISOString(),
            exitTime: new Date(end).toISOString(),
            duration: duration,
        };

        const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
        if (navigator.sendBeacon) {
            navigator.sendBeacon("/api/analytics/track", blob);
        } else {
            fetch("/api/analytics/track", {
                method: "POST",
                body: JSON.stringify(data),
                keepalive: true,
            });
        }
    };

    // Initial title capture
    useEffect(() => {
        const timer = setTimeout(() => {
            lastTitleRef.current = getPageContext();
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (isTrackerDisabled()) return;

        const currentUrl = window.location.href;
        const entryTime = entryTimeRef.current;
        const lastUrl = lastUrlRef.current;
        const lastTitle = lastTitleRef.current;

        if (currentUrl !== lastUrl) {
            const exitTime = Date.now();
            sendTrackingData(lastUrl, lastTitle, entryTime, exitTime);
            
            // Prepare for new page
            entryTimeRef.current = exitTime;
            lastUrlRef.current = currentUrl;
            
            // Wait for metadata/H1 to load before capturing the new title
            const timer = setTimeout(() => {
                lastTitleRef.current = getPageContext();
            }, 1000);
            return () => clearTimeout(timer);
        }

    }, [pathname, session]);

    useEffect(() => {
        if (isTrackerDisabled()) return;

        const handleVisibilityChange = () => {
            if (document.visibilityState === "hidden") {
                const exitTime = Date.now();
                sendTrackingData(lastUrlRef.current, lastTitleRef.current, entryTimeRef.current, exitTime);
            } else {
                entryTimeRef.current = Date.now();
            }
        };

        window.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            window.removeEventListener("visibilitychange", handleVisibilityChange);
            const exitTime = Date.now();
            sendTrackingData(lastUrlRef.current, lastTitleRef.current, entryTimeRef.current, exitTime);
        };
    }, [session]);

    return null;
}
