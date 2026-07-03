"use client";

import { useState, useEffect } from "react";
import {
    User,
    Lock,
    Phone,
    Mail,
    Camera,
    Save,
    ShieldCheck,
    Loader2,
    Eye,
    EyeOff
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { logout as logoutAction, logoutAdmin as logoutAdminAction, logoutStudent, logoutTeacher } from "@/redux/authSlice";
// import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export default function SettingsPage() {
    // const { toast } = useToast();
    const { theme, setTheme } = useTheme();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const activeTab = searchParams.get("tab") === "security" ? "security" : "profile";
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const handleLogoutAdmin = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            try {
                const { signOut } = await import("next-auth/react");
                await signOut({ redirect: false });
            } catch (e) {
                console.warn("signOut error or not importable:", e);
            }

            const Cookies = (await import("js-cookie")).default;
            Cookies.remove("token", { path: '/' });
            Cookies.remove("role", { path: '/' });
            Cookies.remove("adminToken", { path: '/' });
            Cookies.remove("adminRole", { path: '/' });
            Cookies.remove("studentToken", { path: '/' });
            Cookies.remove("studentRole", { path: '/' });
            Cookies.remove("teacherToken", { path: '/' });
            Cookies.remove("teacherRole", { path: '/' });

            const pastDate = "Thu, 01 Jan 1970 00:00:00 GMT";
            document.cookie = `token=; path=/; expires=${pastDate}`;
            document.cookie = `role=; path=/; expires=${pastDate}`;
            document.cookie = `adminToken=; path=/; expires=${pastDate}`;
            document.cookie = `adminRole=; path=/; expires=${pastDate}`;
            document.cookie = `studentToken=; path=/; expires=${pastDate}`;
            document.cookie = `studentRole=; path=/; expires=${pastDate}`;
            document.cookie = `teacherToken=; path=/; expires=${pastDate}`;
            document.cookie = `teacherRole=; path=/; expires=${pastDate}`;

            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user");
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminRole");
            localStorage.removeItem("adminUser");
            localStorage.removeItem("studentToken");
            localStorage.removeItem("studentRole");
            localStorage.removeItem("studentUser");
            localStorage.removeItem("teacherToken");
            localStorage.removeItem("teacherRole");
            localStorage.removeItem("teacherUser");

            try {
                dispatch(logoutAction());
                dispatch(logoutAdminAction());
                dispatch(logoutStudent());
                dispatch(logoutTeacher());
            } catch (reduxError) {
                console.warn("Redux dispatch failed:", reduxError);
            }

            window.location.href = "/admin/signin";
        } catch (error) {
            console.error("Local logout error:", error);
            window.location.href = "/admin/signin";
        }
    };

    // Profile State
    const [profile, setProfile] = useState({
        _id: "",
        name: "",
        email: "",
        contact: "",
        designation: "Admin",
        avatar: ""
    });

    // Application Settings State
    const [settings, setSettings] = useState({
        contactDetails: {
            phone: "",
            email: "",
            puneAddress: "",
            nashikAddress: "",
            openHours: ""
        }
    });

    // Security State
    const [security, setSecurity] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    const showSuccessAndLogout = (message: string) => {
        toast.success(message, {
            duration: 2000,
        });
        setTimeout(() => {
            handleLogoutAdmin();
        }, 2000);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [settingsRes, profileRes] = await Promise.all([
                    fetch('/api/admin/settings'),
                    fetch('/api/admin/profile')
                ]);

                if (settingsRes.ok) {
                    const data = await settingsRes.json();
                    setSettings(data);
                }
                if (profileRes.ok) {
                    const data = await profileRes.json();
                    if (data) setProfile({
                        _id: data._id || "",
                        name: data.name || "",
                        email: data.email || "",
                        contact: data.contact || "",
                        designation: data.designation || "Admin",
                        avatar: data.avatar || ""
                    });
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setFetching(false);
            }
        };
        fetchData();
    }, []);



    const validatePhone = (phone: string) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    };

    const handleProfileSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (profile.contact && !validatePhone(profile.contact)) {
            toast.error("Please enter a valid 10-digit phone number.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/admin/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile)
            });

            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                if (data.emailChanged) {
                    showSuccessAndLogout("Email changed successfully. You will be logged out to continue with your new email.");
                } else {
                    toast.success("Profile Updated", {
                        description: "Profile updated successfully.",
                    });
                }
            } else {
                const err = await res.json();
                throw new Error(err.error || "Failed to update");
            }
        } catch (error: any) {
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleSecuritySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!security.newPassword) {
            toast.error("New password cannot be empty.");
            return;
        }

        if (security.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters.");
            return;
        }

        if (security.newPassword !== security.confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/admin/profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    _id: profile._id,
                    currentPassword: security.currentPassword,
                    newPassword: security.newPassword
                })
            });

            if (res.ok) {
                toast.success(
                    "Password changed successfully. You will be logged out to continue with your new password.",
                    {
                        duration: 3000,
                    }
                );

                setSecurity({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });

                setTimeout(() => {
                    handleLogoutAdmin();
                }, 3000);

                return;
            } else {
                const err = await res.json();
                throw new Error(err.error || "Failed to update password");
            }
        } catch (error: any) {
            toast.error("Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prev => ({ ...prev, avatar: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSettingsSave = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                toast.success("Settings Saved", {
                    description: "Application preferences have been updated.",
                });
            } else {
                throw new Error("Failed to save");
            }
        } catch (error) {
            toast.error("Failed to save settings");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)] bg-[#fbfbfb]">
                <Loader2 className="h-8 w-8 animate-spin text-[#3b82f6]" />
            </div>
        );
    }

    return (
        <div className="md:p-2 bg-[#fbfbfb] dark:bg-slate-950 transition-colors duration-300">
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C4276] dark:text-slate-100 flex items-center gap-3">
                            Account Settings
                        </h1>
                    </div>
                </div>

                <Tabs defaultValue={activeTab} key={activeTab} className="space-y-6">
                    <TabsList className="bg-white dark:bg-slate-900 p-1.5 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 w-full lg:w-fit h-auto flex flex-col sm:flex-row gap-1 shadow-md">
                        <TabsTrigger value="profile" className="rounded-lg data-[state=active]:bg-[#2C4276] data-[state=active]:text-white data-[state=inactive]:text-gray-500 py-3 px-6 font-bold transition-all flex-1 text-sm sm:text-base">
                            <User className="h-4 w-4 mr-2" />
                            Profile
                        </TabsTrigger>
                        <TabsTrigger value="contact" className="rounded-lg data-[state=active]:bg-[#2C4276] data-[state=active]:text-white data-[state=inactive]:text-gray-500 py-3 px-6 font-bold transition-all flex-1 text-sm sm:text-base">
                            <Phone className="h-4 w-4 mr-2" />
                            Contact Details
                        </TabsTrigger>
                        <TabsTrigger value="security" className="rounded-lg data-[state=active]:bg-[#2C4276] data-[state=active]:text-white data-[state=inactive]:text-gray-500 py-3 px-6 font-bold transition-all flex-1 text-sm sm:text-base">
                            <Lock className="h-4 w-4 mr-2" />
                            Security
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="space-y-6">
                        <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                            <CardHeader className="bg-white dark:bg-slate-900 border-b border-gray-50 dark:border-slate-800 p-6 sm:p-8">
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <div className="relative group">
                                        <Avatar className="h-24 w-24 border-4 border-white shadow-xl ring-1 ring-gray-100">
                                            <AvatarImage src={profile.avatar} />
                                            <AvatarFallback className="bg-[#3b82f6] text-white text-2xl font-bold">
                                                {profile.name ? profile.name.charAt(0).toUpperCase() : "A"}
                                            </AvatarFallback>
                                        </Avatar>
                                        <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors group-hover:scale-110 cursor-pointer">
                                            <Camera className="h-4 w-4 text-[#233863]" />
                                            <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                        </label>
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <CardTitle className="text-xl sm:text-2xl font-bold text-[#2C4276] dark:text-slate-100">Personal Information</CardTitle>
                                        <CardDescription className="text-gray-500 dark:text-slate-400 font-medium mt-1">Update your photo and personal details here.</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 sm:p-8">
                                <form onSubmit={handleProfileSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-bold text-[#2C4276] dark:text-slate-300 ml-1">Full Name</Label>
                                            <Input
                                                value={profile.name}
                                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                                className="h-12 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-[#3b82f6] transition-all dark:text-slate-100 font-medium"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-bold text-[#2C4276] dark:text-slate-300 ml-1">Email Address</Label>
                                            <div className="relative">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    value={profile.email}
                                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                                    className="h-12 pl-11 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-[#3b82f6] transition-all dark:text-slate-100 font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-bold text-[#2C4276] dark:text-slate-300 ml-1">Phone Number</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    value={profile.contact}
                                                    maxLength={10}
                                                    onChange={(e) => {
                                                        const val = e.target.value.replace(/\D/g, '');
                                                        if (val.length <= 10) {
                                                            setProfile({ ...profile, contact: val });
                                                        }
                                                    }}
                                                    placeholder="10-digit mobile number"
                                                    className="h-12 pl-11 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-[#3b82f6] transition-all dark:text-slate-100 font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-bold text-[#2C4276] dark:text-slate-300 ml-1">Designation</Label>
                                            <Input
                                                value={profile.designation}
                                                onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
                                                className="h-12 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-[#3b82f6] transition-all dark:text-slate-100 font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="pt-4 flex justify-end">
                                        <Button disabled={loading} type="submit" className="w-full sm:w-auto bg-[#2C4276] hover:bg-[#1e2e54] text-white h-12 px-8 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center justify-center">
                                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                            Save Changes
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Contact Details Tab */}
                    <TabsContent value="contact" className="space-y-6">
                        <Card className="border-0 shadow-md rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
                            <CardHeader className="bg-white dark:bg-slate-900 border-b border-gray-50 dark:border-slate-800 p-6 sm:p-8">
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                                        <Phone className="h-8 w-8 text-[#2C4276] dark:text-blue-400" />
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <CardTitle className="text-xl sm:text-2xl font-bold text-[#2C4276] dark:text-slate-100">Contact Details</CardTitle>
                                        <CardDescription className="text-gray-500 dark:text-slate-400 font-medium mt-1">Manage the contact information displayed on the website.</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 sm:p-8">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-bold text-[#2C4276] dark:text-slate-300 ml-1">Phone Number</Label>
                                            <Input
                                                value={settings.contactDetails.phone}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    contactDetails: { ...settings.contactDetails, phone: e.target.value }
                                                })}
                                                className="h-12 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-[#3b82f6] transition-all dark:text-slate-100 font-medium"
                                                placeholder="+91 XXXXX XXXXX"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-bold text-[#2C4276] dark:text-slate-300 ml-1">Email Address</Label>
                                            <Input
                                                value={settings.contactDetails.email}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    contactDetails: { ...settings.contactDetails, email: e.target.value }
                                                })}
                                                className="h-12 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-[#3b82f6] transition-all dark:text-slate-100 font-medium"
                                                placeholder="example@gmail.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-[#2C4276] dark:text-slate-300 ml-1">Pune Office Address</Label>
                                        <Textarea
                                            value={settings.contactDetails.puneAddress}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                contactDetails: { ...settings.contactDetails, puneAddress: e.target.value }
                                            })}
                                            className="min-h-[100px] rounded-xl bg-gray-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-[#3b82f6] transition-all dark:text-slate-100 font-medium"
                                            placeholder="Enter Pune office address..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-[#2C4276] dark:text-slate-300 ml-1">Nashik Office Address</Label>
                                        <Textarea
                                            value={settings.contactDetails.nashikAddress}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                contactDetails: { ...settings.contactDetails, nashikAddress: e.target.value }
                                            })}
                                            className="min-h-[100px] rounded-xl bg-gray-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-[#3b82f6] transition-all dark:text-slate-100 font-medium"
                                            placeholder="Enter Nashik office address..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-[#2C4276] dark:text-slate-300 ml-1">Open Hours</Label>
                                        <Input
                                            value={settings.contactDetails.openHours}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                contactDetails: { ...settings.contactDetails, openHours: e.target.value }
                                            })}
                                            className="h-12 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-[#3b82f6] transition-all dark:text-slate-100 font-medium"
                                            placeholder="Mon - Fri, 9:30 AM - 7:30 PM"
                                        />
                                    </div>

                                    <div className="pt-4 flex justify-end">
                                        <Button onClick={handleSettingsSave} disabled={loading} className="w-full sm:w-auto bg-[#2C4276] hover:bg-[#1e2e54] text-white h-12 px-8 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center justify-center">
                                            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                            Save Contact Details
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Security Tab */}
                    <TabsContent value="security" className="space-y-6">
                        <Card className="border-none shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] rounded-2xl bg-white dark:bg-slate-900 text-black dark:text-slate-100">
                            <CardHeader className="p-6 sm:p-8 sm:pb-0">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl shrink-0">
                                        <ShieldCheck className="h-6 w-6 text-red-500 dark:text-red-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl sm:text-2xl font-bold text-[#233863] dark:text-slate-100">Password & Security</CardTitle>
                                        <CardDescription className="text-[#64748b] dark:text-slate-400 font-medium mt-1">Manage your password and account security settings.</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 sm:p-8 space-y-8">
                                <form onSubmit={handleSecuritySubmit} className="space-y-6 max-w-2xl">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-[#233863] dark:text-slate-300 ml-1">Current Password</Label>
                                        <div className="relative">
                                            <Input
                                                type={showPassword.current ? "text" : "password"}
                                                required
                                                value={security.currentPassword}
                                                onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                                                className="h-12 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 dark:text-slate-100 pr-10"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                            >
                                                {showPassword.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-bold text-[#233863] dark:text-slate-300 ml-1">New Password</Label>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword.new ? "text" : "password"}
                                                    required
                                                    value={security.newPassword}
                                                    onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                                                    className="h-12 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 dark:text-slate-100 pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                >
                                                    {showPassword.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm font-bold text-[#233863] dark:text-slate-300 ml-1">Confirm New Password</Label>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword.confirm ? "text" : "password"}
                                                    required
                                                    value={security.confirmPassword}
                                                    onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                                                    className="h-12 rounded-xl bg-gray-50/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 dark:text-slate-100 pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                >
                                                    {showPassword.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <Button disabled={loading} type="submit" className="w-full sm:w-auto bg-[#2C4276] hover:bg-[#1e2e54] text-white h-12 px-8 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 shadow-md">
                                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                                        Update Password
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

