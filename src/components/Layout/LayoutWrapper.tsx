"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import SessionValidator from "@/components/auth/SessionValidator";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    // List of routes where Header and Footer should be hidden
    const authRoutes = ["/signin", "/signup", "/forgot-password", "/reset-password", "/student", "/admin", "/teacher", "/entrance-exam"];

    const isAuthRoute = authRoutes.some(route =>
        pathname === route ||
        pathname === `${route}/` ||
        pathname.startsWith(`${route}/`)
    );

    return (
        <>
            <SessionValidator />
            {!isAuthRoute && <Header />}
            {children}
            {!isAuthRoute && <Footer />}
        </>
    );
};

export default LayoutWrapper;
