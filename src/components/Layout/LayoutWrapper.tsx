"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        // If student session becomes invalid (e.g. from session callback returning null)
        if (status === "unauthenticated" && pathname.startsWith("/student")) {
            router.push("/signin");
        }
    }, [status, pathname, router]);

    // List of routes where Header and Footer should be hidden
    const authRoutes = ["/signin", "/signup", "/forgot-password", "/reset-password", "/student", "/admin", "/teacher", "/entrance-exam"];

    const isAuthRoute = authRoutes.some(route =>
        pathname === route ||
        pathname === `${route}/` ||
        pathname.startsWith(`${route}/`)
    );

    return (
        <>
            {!isAuthRoute && <Header />}
            {children}
            {!isAuthRoute && <Footer />}
        </>
    );
};

export default LayoutWrapper;
