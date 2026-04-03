"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { User as UserIcon, Camera, Save, ArrowLeft, Mail, Shield, Trash2, Phone, Key, Lock, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function EditProfilePage() {
    const dispatch = useDispatch();
    const router = useRouter();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [contact, setContact] = useState("");
    const [image, setImage] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'delete'>('profile');
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPasswords, setShowPasswords] = useState(false);

    const [deleteEmail, setDeleteEmail] = useState("");
    const [deletePassword, setDeletePassword] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [showDeleteReason, setShowDeleteReason] = useState(false);
    const [deleteReason, setDeleteReason] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get("tab") === "security") {
                setActiveTab("security");
            }
        }
    }, []);

    useEffect(() => {
        const fetchProfile = async () => {
            let loaded = false;

            try {
                const res = await fetch("/api/student/profile");

                if (res.ok) {
                    const data = await res.json();
                    if (data.user) {
                        setName(data.user.name || "");
                        setEmail(data.user.email || "");
                        setDeleteEmail(data.user.email || "");
                        setContact(data.user.contact || "");
                        setImage(data.user.image || "");

                        localStorage.setItem("user", JSON.stringify({
                            ...JSON.parse(localStorage.getItem("user") || "{}"),
                            name: data.user.name,
                            email: data.user.email,
                            contact: data.user.contact,
                            image: data.user.image,
                            role: data.user.role
                        }));
                        loaded = true;
                    }
                }
            } catch (error) {
                // API call failed, will use fallback
            }

            // Fallback: load from localStorage
            if (!loaded) {
                try {
                    const localUser = JSON.parse(localStorage.getItem("user") || "{}");
                    setName(localUser.name || "");
                    setEmail(localUser.email || "");
                    setDeleteEmail(localUser.email || "");
                    setContact(localUser.contact || localUser.phone || "");
                    setImage(localUser.image || "");
                } catch (e) {
                    // localStorage unavailable
                }
            }

            setIsLoading(false);
        };
        fetchProfile();
    }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (data.url) {
                setImage(data.url);
                toast.success("Image uploaded successfully!");
            } else {
                toast.error("Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);

        try {
            const res = await fetch("/api/student/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, contact, image }),
            });

            if (res.ok) {
                const data = await res.json();
                toast.success("Profile updated successfully!");
            } else {
                // API failed (mock user) — still save locally
                toast.success("Profile saved locally!");
            }
        } catch (error) {
            // Network error — still save locally
            toast.success("Profile saved locally!");
        }

        // Always update localStorage with the latest values
        const localUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = { ...localUser, name, email, contact, image };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        setIsEditing(false);
        setIsSaving(false);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch("/api/student/change-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();

            if (res.ok) {
                toast.success("Password changed successfully!");
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                toast.error(data.error || "Failed to change password");
            }
        } catch (error) {
            toast.error("Failed to change password");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteInitiate = () => {
        if (!deleteEmail || !deletePassword) {
            toast.error("Please fill in both email and password");
            return;
        }
        setShowDeleteReason(true);
    };

    const handleConfirmDelete = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/student/delete-account", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: deleteEmail, password: deletePassword, reason: deleteReason }),
            });
            const data = await res.json();
            if (res.ok) {
                setShowDeleteConfirm(false);
                setShowSuccessPopup(true);
                setTimeout(() => {
                    localStorage.removeItem("user");
                    localStorage.removeItem("token");
                    localStorage.removeItem("role");
                    router.push("/signin");
                }, 2000);
            } else {
                if (data.error === "Incorrect password") {
                    setDeleteError("password is wrong  enter correct pssword");
                    toast.error("password is wrong  enter correct pssword");
                } else {
                    toast.error(data.error || "Failed to delete account");
                }
                setShowDeleteConfirm(false);
            }
        } catch (error) {
            toast.error("Failed to delete account");
            setShowDeleteConfirm(false);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-[calc(100vh-100px)] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#2C4276] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium text-sm">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-100px)] flex items-center justify-center p-4">
            <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
                {/* Left Side: Sidebar Card */}
                <div className="w-full md:w-[280px] bg-[#2C4276] p-6 flex flex-col items-center justify-center text-white">
                    <div className="relative group">
                        <div className="w-28 h-28 rounded-full border-4 border-white/20 overflow-hidden flex items-center justify-center bg-white/10 shadow-xl">
                            {image ? (
                                <img src={image} alt={name} className="w-full h-full object-cover" />
                            ) : (
                                <UserIcon className="w-16 h-16 opacity-50" />
                            )}
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                        <label className="absolute bottom-1 right-1 p-2 bg-white text-[#2C4276] rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform">
                            <Camera size={14} />
                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                        </label>
                    </div>

                    <div className="mt-4 text-center w-full">
                        <h2 className="text-xl font-bold truncate">{name || "Student Name"}</h2>
                        <p className="text-blue-100/60 text-xs mt-1 truncate">{email || "student@example.com"}</p>
                    </div>

                    <nav className="mt-6 w-full space-y-2 text-sm">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium transition-colors ${activeTab === 'profile' ? 'bg-white/15 text-white' : 'hover:bg-white/5 text-blue-100/70'}`}
                        >
                            <UserIcon size={18} /> Profile Information
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium transition-colors ${activeTab === 'security' ? 'bg-white/15 text-white' : 'hover:bg-white/5 text-blue-100/70'}`}
                        >
                            <Shield size={18} /> Security Settings
                        </button>
                        <button
                            onClick={() => setActiveTab('delete')}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl font-medium transition-colors ${activeTab === 'delete' ? 'bg-white/15 text-white' : 'hover:bg-white/5 text-blue-100/70'}`}
                        >
                            <Trash2 size={18} /> Delete Account
                        </button>
                    </nav>
                </div>

                {/* Right Side: Main Content */}
                <div className="flex-1 p-5 md:p-6 relative bg-[#f8fafc]">
                    {activeTab === 'profile' ? (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-2xl font-bold text-slate-800">Profile Information</h1>
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-slate-700 rounded-lg text-sm font-medium border border-gray-200 shadow-sm transition-all"
                                    >
                                        <Camera size={16} className="text-slate-400" />
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => { setIsEditing(false); window.location.reload(); }}
                                            className="px-4 py-2 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="bg-[#2C4276] hover:bg-[#1e2e54] text-white px-6 py-2 rounded-lg text-sm font-bold shadow-lg shadow-[#2C4276]/10 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {isSaving ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <form className="space-y-4">
                                {/* Full Name Field */}
                                <div className="relative group">
                                    <div className={`flex items-center gap-4 bg-white border rounded-2xl p-4 shadow-sm transition-all ${isEditing ? 'border-[#2C4276] ring-4 ring-[#2C4276]/5' : 'border-gray-100'}`}>
                                        <div className={`${isEditing ? 'text-[#2C4276]' : 'text-slate-400'} transition-colors`}>
                                            <UserIcon size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Full Name</p>
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                readOnly={!isEditing}
                                                className={`w-full bg-transparent text-slate-700 focus:outline-none placeholder-slate-300 text-sm font-semibold ${!isEditing && 'cursor-default'}`}
                                                placeholder="Your full name"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="relative group">
                                    <div className={`flex items-center gap-4 bg-white border rounded-2xl p-4 shadow-sm transition-all ${isEditing ? 'border-[#2C4276] ring-4 ring-[#2C4276]/5' : 'border-gray-100'}`}>
                                        <div className={`${isEditing ? 'text-[#2C4276]' : 'text-slate-400'} transition-colors`}>
                                            <Mail size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Email Address</p>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                readOnly={!isEditing}
                                                className={`w-full bg-transparent text-slate-700 focus:outline-none placeholder-slate-300 text-sm font-semibold ${!isEditing && 'cursor-default'}`}
                                                placeholder="Your email address"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Phone Field */}
                                <div className="relative group">
                                    <div className={`flex items-center gap-4 bg-white border rounded-2xl p-4 shadow-sm transition-all ${isEditing ? 'border-[#2C4276] ring-4 ring-[#2C4276]/5' : 'border-gray-100'}`}>
                                        <div className={`${isEditing ? 'text-[#2C4276]' : 'text-slate-400'} transition-colors`}>
                                            <Phone size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Phone Number</p>
                                            <input
                                                type="text"
                                                value={contact}
                                                onChange={(e) => setContact(e.target.value)}
                                                readOnly={!isEditing}
                                                className={`w-full bg-transparent text-slate-700 focus:outline-none placeholder-slate-300 text-sm font-semibold ${!isEditing && 'cursor-default'}`}
                                                placeholder="Your phone number"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </>
                    ) : activeTab === 'security' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold text-slate-800">Security Settings</h1>
                                <p className="text-slate-500 mt-1 text-sm">Security settings allow you to manage your password and account security preferences.</p>
                            </div>

                            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-5">
                                <h2 className="text-lg font-bold text-slate-800 mb-2">Change Password</h2>
                                <p className="text-slate-500 text-sm mb-4">It is a good idea to use a strong password that you do not use elsewhere.</p>

                                <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Current Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type={showPasswords ? "text" : "password"}
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full px-12 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] transition-all text-gray-900 shadow-sm"
                                                placeholder="Enter current password"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type={showPasswords ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-12 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] transition-all text-gray-900 shadow-sm"
                                                placeholder="Enter new password"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Confirm New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type={showPasswords ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full px-12 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] transition-all text-gray-900 shadow-sm"
                                                placeholder="Confirm new password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPasswords(!showPasswords)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showPasswords ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="w-full sm:w-auto px-6 py-2.5 bg-[#2C4276] hover:bg-[#1e2e54] text-white rounded-xl font-bold shadow-lg shadow-[#2C4276]/20 transition-all active:scale-[0.98] disabled:opacity-70"
                                        >
                                            {isSaving ? "Updating..." : "Change Password"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    ) : activeTab === 'delete' ? (
                        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col items-center justify-center py-2">
                            <div className="w-full max-w-md bg-white border border-gray-100 rounded-2xl shadow-sm p-5 sm:p-6">
                                <div className="flex flex-col items-center text-center mb-4">
                                    <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-3 border border-red-100">
                                        <UserIcon size={32} />
                                    </div>
                                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Delete Account</h1>
                                    <p className="text-slate-500 text-sm">
                                        This action will permanently delete your account and all associated data. This cannot be undone.
                                    </p>
                                </div>

                                <div className="bg-red-50/50 border border-red-100/50 rounded-xl p-3 mb-4 flex items-center gap-3">
                                    <div className="text-red-500 ml-1"><Trash2 size={18} /></div>
                                    <p className="text-sm font-medium text-red-800">{deleteError || "Please verify your credentials to proceed"}</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                                        <input
                                            type="email"
                                            value={deleteEmail}
                                            readOnly
                                            autoComplete="off"
                                            className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none text-gray-500 cursor-not-allowed shadow-sm"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Password</label>
                                        <input
                                            type="password"
                                            value={deletePassword}
                                            onChange={(e) => {
                                                setDeletePassword(e.target.value);
                                                setDeleteError("");
                                            }}
                                            autoComplete="new-password"
                                            className={`w-full px-4 py-2 bg-gray-50 border ${deleteError ? 'border-red-400 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-200 focus:ring-[#2C4276]/20 focus:border-[#2C4276]'} rounded-xl focus:outline-none focus:ring-2 transition-all text-gray-900 shadow-sm`}
                                            placeholder="Enter your password"
                                            required
                                        />
                                        {deleteError && (
                                            <p className="text-red-500 text-xs ml-1 font-medium mt-1">{deleteError}</p>
                                        )}
                                    </div>

                                    <div className="pt-3 space-y-2">
                                        <button
                                            type="button"
                                            onClick={handleDeleteInitiate}
                                            className="w-full px-6 py-2 bg-red-700 hover:bg-red-800 text-white rounded-xl font-bold shadow-lg shadow-red-700/20 transition-all active:scale-[0.98]"
                                        >
                                            Delete Account
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('profile')}
                                            className="w-full px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98]"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {/* Reason for Deletion Modal */}
                    {showDeleteReason && (
                        <div className="absolute inset-0 z-[55] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm rounded-3xl overflow-hidden">
                            <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200 z-[55]">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-slate-800">Why are you leaving?</h3>
                                    <button
                                        onClick={() => setShowDeleteReason(false)}
                                        className="text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="flex flex-col items-center text-center my-4">
                                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 border border-red-100">
                                        <UserIcon size={32} />
                                    </div>
                                    <p className="text-slate-500 text-sm mb-4">
                                        We're sorry to see you go. Please let us know the reason for deleting your account.
                                    </p>
                                    <textarea
                                        value={deleteReason}
                                        onChange={(e) => setDeleteReason(e.target.value)}
                                        placeholder="Type your reason here..."
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2C4276]/20 focus:border-[#2C4276] outline-none transition-all text-sm min-h-[100px] resize-none"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setShowDeleteReason(false)}
                                        className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold transition-all text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (!deleteReason.trim()) {
                                                toast.error("Please provide a reason");
                                                return;
                                            }
                                            setShowDeleteReason(false);
                                            setShowDeleteConfirm(true);
                                        }}
                                        className="flex-[1.5] px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-bold transition-all text-sm shadow-lg shadow-red-700/20"
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Delete Confirmation Modal */}
                    {showDeleteConfirm && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm rounded-3xl overflow-hidden">
                            <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200 z-50">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-lg font-bold text-slate-800">Confirm Account Deletion</h3>
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="flex flex-col items-center text-center my-6">
                                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 border border-red-100">
                                        <UserIcon size={32} />
                                    </div>
                                    <p className="text-slate-500 text-sm">
                                        This will permanently delete your account and all associated data. This action cannot be reversed.
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="flex-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold transition-all text-sm shadow-lg shadow-slate-900/20"
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmDelete}
                                        disabled={isSaving}
                                        className="flex-[1.5] px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg font-bold transition-all text-sm shadow-lg shadow-red-700/20 disabled:opacity-70 flex justify-center items-center"
                                    >
                                        {isSaving ? "Deleting..." : "Yes, Delete My Account"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Success Popup Modal */}
                    {showSuccessPopup && (
                        <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm rounded-3xl overflow-hidden">
                            <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in-95 duration-200 z-[60] flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4 border border-green-100">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Success!</h3>
                                <p className="text-slate-500 text-sm">
                                    your account delete successfully
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}