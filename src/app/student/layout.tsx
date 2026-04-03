"use client";

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
    HelpCircle
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { logout as logoutAction } from "@/redux/authSlice";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";
import ProfileDropdown from "@/components/dashboard/ProfileDropdown";

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);

    const handleLogout = async () => {
        try {
            // Priority 1: Clear Server-side Cookies
            await fetch("/api/auth/logout", { method: "POST" });

            // Priority 2: NextAuth SignOut (clears session cookies)
            await signOut({ redirect: false });

            // Priority 3: Bulletproof client-side clearing
            Cookies.remove("token", { path: '/' });
            Cookies.remove("role", { path: '/' });
            document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

            // LocalStorage and Redux
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user");
            dispatch(logoutAction());

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
        { icon: Video, label: "Meeting Links", href: "/student/meetings" },
        { icon: Award, label: "Certificates", href: "#" },
        { icon: HelpCircle, label: "FAQ", href: "/student/faq" },
    ];

    return (
        <div className="h-screen w-full bg-gray-50 flex flex-col font-sans text-black overflow-hidden">
            {/* Top Header */}
            <header className="bg-white border-b border-gray-100 p-2 sm:p-3 flex items-center justify-between z-20 shadow-sm flex-shrink-0 w-full h-[72px]">
                {/* Left side: Logo */}
                <div className="flex items-center lg:w-[240px] px-2 sm:px-4">
                    <div className="bg-white p-1 rounded-lg">
                        <Image
                            src="/images/logo/logo-wide.webp"
                            alt="Logo"
                            width={150}
                            height={40}
                        />
                    </div>
                </div>

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
                        <button className="p-2 text-gray-400 hover:text-[#2C4276] relative transition-colors">
                            <Bell size={22} />
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-8 w-px bg-gray-100 mx-2 hidden sm:block"></div>
                        <ProfileDropdown />
                    </div>
                </div>
            </header>

            {/* Bottom Content Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-[240px] bg-[#2C4276] text-white hidden lg:flex flex-col flex-shrink-0 h-full">
                    <nav className="flex-1 mt-6 px-4 space-y-2">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive
                                        ? "bg-white/10 text-white shadow-inner"
                                        : "hover:bg-white/5 text-blue-100/80 hover:text-white"
                                        }`}
                                >
                                    <item.icon size={20} /> {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-6 border-t border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-400 flex items-center justify-center border-2 border-white/20">
                                <UserIcon size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-sm truncate max-w-[120px]">{user?.name || "Student Account"}</p>
                                <button
                                    onClick={handleLogout}
                                    className="text-xs text-blue-300 hover:text-white transition-colors cursor-pointer"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </aside>

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