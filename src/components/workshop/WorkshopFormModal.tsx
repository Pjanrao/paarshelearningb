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
    subtitle?: string;
    instructorName: string;
    date: string;
    time: string;
    duration: string;
    mode: "online" | "offline";
    location?: string;
    meetingLink?: string;
    description: string;
    highlights: string[];
    status: "active" | "inactive";
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
        subtitle: "",
        instructorName: "",
        date: "",
        time: "",
        duration: "",
        mode: "online",
        location: "",
        meetingLink: "",
        description: "",
        highlights: ["", "", "", ""],
        status: "active",
    });


    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editing) {
            setForm({
                title: editing.title || "",
                subtitle: editing.subtitle || "",
                instructorName: editing.instructorName || "",
                date: editing.date || "",
                time: editing.time || "",
                duration: editing.duration || "",
                mode: editing.mode || "online",
                location: editing.location || "",
                meetingLink: editing.meetingLink || "",
                description: editing.description || "",
                highlights: editing.highlights?.length > 0 ? [...editing.highlights, "", "", "", ""].slice(0, 4) : ["", "", "", ""],
                status: editing.status || "active",
            });
        } else {
            setForm({
                title: "",
                subtitle: "",
                instructorName: "",
                date: "",
                time: "",
                duration: "",
                mode: "online",
                location: "",
                meetingLink: "",
                description: "",
                highlights: ["", "", "", ""],
                status: "active",
            });
        }
    }, [editing, open]);



    const handleSubmit = async () => {
        setLoading(true);
        try {

            // ✅ STEP 1: VALIDATION (FIRST)
            if (!form.title || !form.description) {
                alert("Title and Description are required");
                setLoading(false);
                return;
            }

            if (form.mode === "online" && !form.meetingLink) {
                alert("Meeting link is required for online workshop");
                setLoading(false);
                return;
            }

            if (form.mode === "offline" && !form.location) {
                alert("Location is required for offline workshop");
                setLoading(false);
                return;
            }
            const payload = {
                ...form,
                highlights: form.highlights.filter((h) => h.trim() !== ""),
                ...(form.mode === "online"
                    ? { location: "" }
                    : { meetingLink: "" }),

                ...(editing?._id && { _id: editing._id }),
            };

            const res = await fetch("/api/workshops", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                onClose();
                setForm({
                    title: "",
                    subtitle: "",
                    instructorName: "",
                    date: "",
                    time: "",
                    duration: "",
                    mode: "online",
                    location: "",
                    meetingLink: "",
                    description: "",
                    highlights: ["", "", "", ""],
                    status: "active",
                });
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

                        {/* Subtitle */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                Short Subtitle
                            </label>
                            <Input
                                placeholder="Catchy one-liner"
                                className="h-11 border-gray-200 focus:border-blue-600 rounded-xl"
                                value={form.subtitle}
                                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                Detailed Description
                            </label>
                            <Textarea
                                rows={4}
                                placeholder="Describe the workshop..."
                                className="border-gray-200 focus:border-blue-600 rounded-xl resize-none"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                            />
                        </div>

                        {/* Highlights/Benefits */}
                        <div className="p-5 border rounded-2xl bg-gray-50/50 space-y-4">
                            <label className="text-sm font-bold text-[#2C4276] flex items-center gap-2">
                                <Icon icon="solar:star-bold-duotone" className="text-blue-600" />
                                Workshop Benefits (Up to 4)
                            </label>
                            <div className="grid grid-cols-1 gap-3">
                                {form.highlights.map((h, i) => (
                                    <div key={i} className="relative group">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-300 group-focus-within:text-blue-400">0{i + 1}</span>
                                        <Input
                                            placeholder={`Benefit ${i + 1}...`}
                                            className="pl-8 h-10 border-gray-200 focus:border-blue-600 rounded-xl bg-white"
                                            value={h}
                                            onChange={(e) => {
                                                const newH = [...form.highlights];
                                                newH[i] = e.target.value;
                                                setForm({ ...form, highlights: newH });
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
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

                        <div className="grid grid-cols-1">
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
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wider">
                                Instructor Name
                            </label>
                            <Input
                                placeholder="Expert Name"
                                className="h-11 border-gray-200 focus:border-blue-600 rounded-xl"
                                value={form.instructorName}
                                onChange={(e) => setForm({ ...form, instructorName: e.target.value })}
                            />
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
                                    <SelectContent className="bg-white">
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