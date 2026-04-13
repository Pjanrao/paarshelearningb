"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogOut, Settings, Key, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { logout as logoutAction, logoutAdmin, logoutStudent } from "@/redux/authSlice";
import Cookies from "js-cookie";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ProfileDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const user = useSelector((state: RootState) => state.auth.user || state.auth.studentUser || state.auth.adminUser);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
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

            window.location.href = "/";
        } catch (error) {
            console.error("Logout error:", error);
            window.location.href = "/";
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 p-1.5 hover:bg-gray-100 rounded-xl transition-all group"
            >
                <div className="w-10 h-10 rounded-full bg-[#2C4276]/10 flex items-center justify-center text-[#2C4276] border-2 border-transparent group-hover:border-[#2C4276]/20 transition-all overflow-hidden">
                    {user?.image ? (
                        <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <User size={20} />
                    )}
                </div>
                <div className="hidden sm:block text-left">
                    <p className="text-sm font-bold text-gray-900 leading-none mb-1">
                        {user?.name || "Student"}
                    </p>
                    <p className="text-[11px] text-gray-500 font-medium">Student Dashboard</p>
                </div>
                <ChevronDown
                    size={16}
                    className={`text-gray-400 transition-transform hidden sm:block ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-50 mb-2">
                        <p className="text-sm font-bold text-gray-900 truncate">{user?.name || "Student"}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email || "student@example.com"}</p>
                    </div>

                    <div className="px-2">
                        <Link
                            href="/student/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#2C4276] rounded-xl transition-all group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors">
                                <Settings size={16} />
                            </div>
                            <span>Profile</span>
                        </Link>

                        <Link
                            href="/student/profile?tab=security"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-[#2C4276] rounded-xl transition-all group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors">
                                <Key size={16} />
                            </div>
                            <span>Change Password</span>
                        </Link>
                    </div>

                    <div className="mt-2 pt-2 border-t border-gray-50 px-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-all group"
                        >
                            <div className="w-8 h-8 rounded-lg bg-red-50/50 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                                <LogOut size={16} />
                            </div>
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}