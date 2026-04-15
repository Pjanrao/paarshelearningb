"use client";

import { useState, useEffect, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Icon } from "@iconify/react";
import Image from "next/image";

interface Workshop {
    _id?: string;
    title: string;
    instructorName: string;
    date: string;
    time: string;
    duration: string;
    price: number;
    mode: "online" | "offline";
    location?: string;
    meetingLink?: string;
    description: string;
    status: "active" | "inactive";
    thumbnail?: string;
}

interface Props {
    open: boolean;
    setOpen: (value: boolean) => void;
    editing: Workshop | null;
    onClose: () => void;
}

export default function WorkshopFormModal({
    open,
    setOpen,
    editing,
    onClose,
}: Props) {

    const [form, setForm] = useState({
        title: "",
        instructorName: "",
        date: "",
        time: "",
        duration: "",
        price: 0,
        mode: "online",
        location: "",
        meetingLink: "",
        description: "",
        status: "active",
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editing) {
            setForm({
                title: editing.title || "",
                instructorName: editing.instructorName || "",
                date: editing.date || "",
                time: editing.time || "",
                duration: editing.duration || "",
                price: editing.price || 0,
                mode: editing.mode || "online",
                location: editing.location || "",
                meetingLink: editing.meetingLink || "",
                description: editing.description || "",
                status: editing.status || "active",
            });
            setImagePreview(editing.thumbnail || "");
        } else {
            setForm({
                title: "",
                instructorName: "",
                date: "",
                time: "",
                duration: "",
                price: 0,
                mode: "online",
                location: "",
                meetingLink: "",
                description: "",
                status: "active",
            });
            setImagePreview("");
            setImageFile(null);
        }
    }, [editing, open]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            
            // Append all form fields
            Object.entries(form).forEach(([key, value]) => {
                formData.append(key, value.toString());
            });

            // Append _id if editing
            if (editing?._id) {
                formData.append("_id", editing._id);
            }

            // Append image if selected
            if (imageFile) {
                formData.append("thumbnail", imageFile);
            }

            const res = await fetch("/api/workshops", {
                method: "POST",
                body: formData, // Browser automatically sets content-type to multipart/form-data
            });

            if (res.ok) {
                onClose();
            } else {
                const data = await res.json();
                alert(data.message || "Failed to save workshop");
            }
        } catch (error) {
            console.error("Error saving workshop:", error);
            alert("An error occurred while saving the workshop");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">

                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-[#2C4276]">
                        {editing ? "Edit Workshop" : "Add New Workshop"}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
                    
                    {/* LEFT COLUMN: Image & Basic Info */}
                    <div className="space-y-6">
                        {/* Image Upload Area */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">
                                Workshop Thumbnail
                            </label>
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="relative aspect-video w-full rounded-2xl border-2 border-dashed border-gray-200 hover:border-blue-400 bg-gray-50 flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-all group"
                            >
                                {imagePreview ? (
                                    <>
                                        <Image 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            fill 
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Icon icon="solar:camera-bold" className="text-white w-10 h-10" />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Icon icon="solar:cloud-upload-bold" className="text-gray-300 w-12 h-12 mb-2 group-hover:text-blue-400 transition-colors" />
                                        <p className="text-xs text-gray-400 font-medium">Click to upload workshop thumbnail</p>
                                        <p className="text-[10px] text-gray-300 mt-1 uppercase">PNG, JPG up to 10MB</p>
                                    </>
                                )}
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleImageChange} 
                                className="hidden" 
                                accept="image/*"
                            />
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                Workshop Title
                            </label>
                            <Input
                                placeholder="Enter workshop title"
                                className="h-11 border-gray-200 focus:border-blue-600 rounded-xl"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />
                        </div>

                        {/* Instructor */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                Instructor Name
                            </label>
                            <Input
                                placeholder="Who is teaching?"
                                className="h-11 border-gray-200 focus:border-blue-600 rounded-xl"
                                value={form.instructorName}
                                onChange={(e) => setForm({ ...form, instructorName: e.target.value })}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                Description
                            </label>
                            <Textarea
                                rows={4}
                                placeholder="Describe the workshop..."
                                className="border-gray-200 focus:border-blue-600 rounded-xl resize-none"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Schedule & Logistics */}
                    <div className="space-y-6">
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                    Date
                                </label>
                                <Input
                                    type="date"
                                    className="h-11 border-gray-200 focus:border-blue-600 rounded-xl"
                                    value={form.date}
                                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                    Time
                                </label>
                                <Input
                                    type="time"
                                    className="h-11 border-gray-200 focus:border-blue-600 rounded-xl"
                                    value={form.time}
                                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                    Duration
                                </label>
                                <Input
                                    placeholder="e.g. 2 Hours"
                                    className="h-11 border-gray-200 focus:border-blue-600 rounded-xl"
                                    value={form.duration}
                                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                    Price (₹)
                                </label>
                                <Input
                                    type="number"
                                    className="h-11 border-gray-200 focus:border-blue-600 rounded-xl font-bold text-blue-600"
                                    value={form.price}
                                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                    Mode
                                </label>
                                <Select
                                    value={form.mode}
                                    onValueChange={(val: "online" | "offline") => setForm({ ...form, mode: val })}
                                >
                                    <SelectTrigger className="h-11 border-gray-200 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="online">🎥 Online</SelectItem>
                                        <SelectItem value="offline">🏢 Offline</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                    Status
                                </label>
                                <Select
                                    value={form.status}
                                    onValueChange={(val: "active" | "inactive") => setForm({ ...form, status: val })}
                                >
                                    <SelectTrigger className="h-11 border-gray-200 rounded-xl">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">🟢 Active</SelectItem>
                                        <SelectItem value="inactive">🔴 Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Mode Specific Fields */}
                        <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                            {form.mode === "offline" ? (
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
                                        Physical Venue Location
                                    </label>
                                    <Input
                                        placeholder="Enter full address"
                                        className="h-11 border-gray-200 bg-white rounded-xl"
                                        value={form.location}
                                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">
                                        Meeting Link / URL
                                    </label>
                                    <Input
                                        placeholder="Zoom, Google Meet, etc."
                                        className="h-11 border-gray-200 bg-white rounded-xl text-blue-600"
                                        value={form.meetingLink}
                                        onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-4">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-gray-500 hover:text-gray-800 font-bold text-sm transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-[#2C4276] hover:bg-blue-900 text-white px-8 py-2.5 rounded-xl shadow-lg shadow-blue-100 dark:shadow-none transition-all font-bold text-sm min-w-[120px] flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/30 border-t-white"></div>
                        ) : (
                            editing ? "Update Workshop" : "Publish Workshop"
                        )}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}