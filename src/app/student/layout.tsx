"use client";

import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    Home,
    BookOpen,
    Award,
    Settings,
    User as UserIcon,
    Search,
    Bell,
    Video,
    HelpCircle,
    Gift,
    Wallet,
    ClipboardCheck,
    PanelLeftOpen,
    PanelLeftClose
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { logout as logoutAction, logoutAdmin, logoutStudent } from "@/redux/authSlice";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";
import ProfileDropdown from "@/components/dashboard/ProfileDropdown";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user || state.auth.studentUser || state.auth.adminUser);

    // Monitor screen size changes
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) setIsCollapsed(true);
        };

        // Initial check
        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Close sidebar on route change on mobile
    useEffect(() => {
        if (isMobile) setIsCollapsed(true);
    }, [pathname, isMobile]);

    const handleLogout = async () => {
        try {
            // Priority 1: Clear Server-side Cookies
            await fetch("/api/auth/logout", { method: "POST" });

            // Priority 2: NextAuth SignOut (clears session cookies)
            await signOut({ redirect: false });

            Cookies.remove("token", { path: '/' });
            Cookies.remove("role", { path: '/' });
            Cookies.remove("adminToken", { path: '/' });
            Cookies.remove("adminRole", { path: '/' });
            Cookies.remove("studentToken", { path: '/' });
            Cookies.remove("studentRole", { path: '/' });

            const pastDate = "Thu, 01 Jan 1970 00:00:00 GMT";
            document.cookie = `token=; path=/; expires=${pastDate}`;
            document.cookie = `role=; path=/; expires=${pastDate}`;
            document.cookie = `adminToken=; path=/; expires=${pastDate}`;
            document.cookie = `adminRole=; path=/; expires=${pastDate}`;
            document.cookie = `studentToken=; path=/; expires=${pastDate}`;
            document.cookie = `studentRole=; path=/; expires=${pastDate}`;

            // LocalStorage and Redux
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user");
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminRole");
            localStorage.removeItem("adminUser");
            localStorage.removeItem("studentToken");
            localStorage.removeItem("studentRole");
            localStorage.removeItem("studentUser");

            dispatch(logoutAction());
            dispatch(logoutAdmin());
            dispatch(logoutStudent());

            // Use hard redirect to ensure cookies are strictly updated in the next request
            window.location.href = "/";
        } catch (error) {
            console.error("Logout error:", error);
            window.location.href = "/";
        }
    };

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", href: "/student" },
        { icon: Home, label: "Home", href: "/" },
        { icon: BookOpen, label: "My Courses", href: "/student/my-courses" },
        { icon: ClipboardCheck, label: "Practice Tests", href: "/student/tests" },
        { icon: Video, label: "Meeting Links", href: "/student/meetings" },
        { icon: Gift, label: "Refer & Earn", href: "/student/refer-earn" },
        { icon: Wallet, label: "Wallet", href: "/student/wallet" },
        { icon: HelpCircle, label: "FAQ", href: "/student/faq" },
    ];

    return (
        <div className="h-screen w-full bg-gray-50 flex flex-col font-sans text-black overflow-hidden">
            {/* Top Header */}
            <header className="bg-white border-b border-gray-100 p-2 sm:p-3 flex items-center justify-between z-20 shadow-sm flex-shrink-0 w-full h-[72px]">
                {/* Left side: Logo */}
                <Link href="/" className="flex items-center px-2 sm:px-4 flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer">
                    <div className="bg-white p-1 rounded-lg">
                        <Image
                            src="/images/logo/logo-wide.webp"
                            alt="Logo"
                            width={160}
                            height={44}
                            className="w-auto h-10"
                        />
                    </div>
                </Link>

                {/* Right side: Search & Profile */}
                <div className="flex flex-1 items-center justify-between px-2 sm:px-4">
                    <div className="relative max-w-md w-full hidden sm:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search your courses..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] transition-all text-black"
                        />
                    </div>
                    <div className="flex items-center gap-4 ml-auto">
                        {/* <button className="p-2 text-gray-400 hover:text-[#2C4276] relative transition-colors">
                            <Bell size={22} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button> */}
                        <div className="h-8 w-px bg-gray-100 mx-2 hidden sm:block"></div>
                        <ProfileDropdown />
                    </div>
                </div>
            </header>

            {/* Bottom Content Area */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* Mobile Overlay backdrop */}
                <AnimatePresence>
                    {isMobile && !isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCollapsed(true)}
                            className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                        />
                    )}
                </AnimatePresence>

                {/* Sidebar */}
                <motion.aside
                    initial={false}
                    animate={{
                        width: isCollapsed ? (isMobile ? 70 : 80) : 240,
                        x: 0
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`bg-[#2C4276] text-white flex flex-col flex-shrink-0 overflow-hidden z-30 
                        ${isMobile && !isCollapsed ? "fixed left-0 top-[72px] bottom-0 shadow-2xl w-[240px]" : "relative h-full"}
                    `}
                >
                    <nav className="flex-1 mt-6 px-3 lg:px-4 space-y-2 overflow-y-auto custom-scrollbar min-h-0">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    title={isCollapsed ? item.label : ""}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive
                                        ? "bg-white/10 text-white shadow-inner"
                                        : "hover:bg-white/5 text-blue-100/80 hover:text-white"
                                        } ${isCollapsed ? "justify-center px-2" : ""}`}
                                >
                                    <item.icon size={20} className="flex-shrink-0" />
                                    {!isCollapsed && <span className="whitespace-nowrap transition-opacity duration-300">{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-white/10 mt-auto flex-shrink-0 pb-8 lg:pb-4 bg-[#2C4276]">
                        <div className={`flex items-center ${isCollapsed ? "justify-center flex-col gap-4" : "justify-between"}`}>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center border-2 border-white/20 flex-shrink-0">
                                    <UserIcon size={20} />
                                </div>
                                {!isCollapsed && (
                                    <div className="overflow-hidden">
                                        <p className="font-bold text-sm truncate max-w-[120px]">{user?.name || "Student Account"}</p>
                                        <button
                                            onClick={handleLogout}
                                            className="text-xs text-blue-300 hover:text-white transition-colors cursor-pointer"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className={`p-2 hover:bg-white/10 rounded-lg transition-colors text-blue-100 ${isCollapsed ? "" : "ml-2"}`}
                                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                            >
                                {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
                            </button>
                        </div>
                    </div>
                </motion.aside>

                <main className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50">

                    <div className="flex-1 p-3 sm:p-5 lg:p-6 mx-auto w-full overflow-y-auto custom-scrollbar">
                        <div className="max-w-7xl mx-auto">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}