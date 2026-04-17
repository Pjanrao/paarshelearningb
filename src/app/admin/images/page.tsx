"use client";

import React, { useState, useEffect } from "react";
import { 
    Upload, 
    Image as ImageIcon, 
    Save, 
    Loader2, 
    CheckCircle, 
    Info, 
    Search,
    RefreshCcw,
    Layout,
    Trash2
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface SiteImage {
    _id?: string;
    key: string;
    url: string;
    label: string;
    category: string;
}

const PREDEFINED_KEYS = [
    { key: "SITE_LOGO", label: "Main Logo (Light)", category: "Brand" },
    { key: "SITE_LOGO_DARK", label: "Main Logo (Dark/Footer)", category: "Brand" },
    { key: "HOME_HERO_BG", label: "Home Hero Main Banner", category: "Home Page" },
    { key: "WHY_CHOOSE_US_IMAGE", label: "Why Choose Us Illustration", category: "Home Page" },
    { key: "ABOUT_US_BANNER", label: "About Us Vision Image", category: "About Us" },
    { key: "CONTACT_US_IMAGE", label: "Contact Us Hero Illustration", category: "Contact Us" },
    { key: "AUTH_SIDE_IMAGE", label: "Auth Side Illustration", category: "Authentication" },
    { key: "NOT_FOUND_IMAGE", label: "404 Page Illustration", category: "Misc" },
    { key: "FAVICON", label: "Website Favicon", category: "Brand" },
];

export default function ImageManagementPage() {
    const [images, setImages] = useState<SiteImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingKey, setUpdatingKey] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

    const fetchImages = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/site-images");
            const data = await response.json();
            if (response.ok) {
                setImages(data);
            }
        } catch (error) {
            console.error("Error fetching images:", error);
            toast.error("Failed to load images");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleUpload = async (key: string, label: string, category: string, file: File) => {
        setUpdatingKey(key);
        try {
            // 1. Upload file
            const formData = new FormData();
            formData.append("file", file);
            formData.append("folder", "site");

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const uploadData = await uploadRes.json();

            if (!uploadRes.ok) throw new Error(uploadData.error || "Upload failed");

            // 2. Save metadata
            const saveRes = await fetch("/api/admin/site-images", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    key,
                    label,
                    category,
                    url: uploadData.url
                }),
            });

            if (saveRes.ok) {
                toast.success(`${label} updated successfully`);
                fetchImages();
            } else {
                throw new Error("Failed to save image metadata");
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setUpdatingKey(null);
        }
    };

    const handleDelete = async (key: string, label: string) => {
        if (!confirm(`Are you sure you want to remove the image for "${label}"?`)) return;

        setUpdatingKey(key);
        try {
            const response = await fetch(`/api/admin/site-images?key=${key}`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success(`${label} image removed successfully`);
                fetchImages();
            } else {
                const data = await response.json();
                throw new Error(data.error || "Failed to remove image");
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setUpdatingKey(null);
        }
    };

    const getImageForKey = (key: string) => {
        return images.find(img => img.key === key);
    };

    const filteredKeys = PREDEFINED_KEYS.filter(k => 
        k.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
        k.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        k.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#2C4276]">Image Management</h1>
                    <p className="text-gray-500 mt-1">Manage all website banners and illustrations</p>
                </div>
                <button 
                    onClick={fetchImages}
                    className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                    title="Refresh List"
                >
                    <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
                </button>
            </div>

            <div className="mb-6 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search size={18} />
                </div>
                <input 
                    type="text" 
                    placeholder="Search by label, key or category..."
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {loading && images.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm">
                    <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
                    <p className="text-gray-500 font-medium tracking-wide">Loading image configuration...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredKeys.map((item) => {
                        const savedImage = getImageForKey(item.key);
                        const isUpdating = updatingKey === item.key;

                        return (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={item.key}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300"
                            >
                                <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                                    <div>
                                        <p className="text-[10px] font-extrabold text-[#2C4276]/60 uppercase tracking-widest mb-0.5">{item.category}</p>
                                        <h3 className="font-bold text-gray-800 text-sm">{item.label}</h3>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${savedImage ? 'bg-green-500' : 'bg-amber-400'} shadow-sm`} />
                                </div>

                                <div className="relative aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                                    {savedImage && !imageErrors[item.key] ? (
                                        <img 
                                            src={savedImage.url} 
                                            alt={item.label}
                                            onError={() => setImageErrors(prev => ({ ...prev, [item.key]: true }))}
                                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            {imageErrors[item.key] ? (
                                                <div className="flex flex-col items-center text-red-400">
                                                    <Info size={40} strokeWidth={1.5} />
                                                    <span className="text-xs font-bold mt-2 uppercase tracking-tight">Source File Missing</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <ImageIcon size={40} strokeWidth={1.5} />
                                                    <span className="text-xs font-medium">No Image Configured</span>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {isUpdating && (
                                        <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
                                            <Loader2 className="animate-spin text-[#2C4276] mb-2" size={32} />
                                            <span className="text-xs font-bold text-[#2C4276] animate-pulse uppercase tracking-wider">Uploading...</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 bg-white mt-auto">
                                    <div className="flex flex-col gap-3">
                                        <div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Key Reference</p>
                                            <code className="text-[11px] bg-gray-50 px-2 py-1 rounded border border-gray-100 font-mono text-gray-600 block truncate">
                                                {item.key}
                                            </code>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <label className={`
                                                flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[11px] font-bold transition-all
                                                ${savedImage ? 'bg-[#2C4276] text-white hover:bg-opacity-90' : 'bg-blue-600 text-white hover:bg-blue-700'}
                                                ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}
                                            `}>
                                                <Upload size={14} />
                                                {savedImage ? 'Update' : 'Upload'}
                                                <input 
                                                    type="file" 
                                                    className="hidden" 
                                                    accept="image/*"
                                                    disabled={isUpdating}
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleUpload(item.key, item.label, item.category, file);
                                                    }}
                                                />
                                            </label>

                                            {savedImage && (
                                                <button
                                                    onClick={() => handleDelete(item.key, item.label)}
                                                    disabled={isUpdating}
                                                    className={`
                                                        p-2.5 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 transition-all
                                                        ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}
                                                    `}
                                                    title="Remove Image"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {savedImage && (
                                        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-1.5 text-[10px] text-green-600 font-bold">
                                            <CheckCircle size={12} />
                                            CONFIGURED & ACTIVE
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}

            <div className="mt-10 bg-blue-50/50 rounded-2xl p-5 border border-blue-100 flex gap-4 items-start">
                <div className="mt-1 bg-blue-100 p-2 rounded-lg text-blue-600">
                    <Info size={20} />
                </div>
                <div>
                    <h4 className="text-blue-900 font-bold mb-1">Developer Information</h4>
                    <p className="text-sm text-blue-800/70 leading-relaxed">
                        These images are identified by their unique <strong>Key Reference</strong>. 
                        When you update an image here, it will automatically change everywhere it is used on the website.
                        Ensure the images have the correct aspect ratio for their intended location.
                    </p>
                </div>
            </div>
        </div>
    );
}
