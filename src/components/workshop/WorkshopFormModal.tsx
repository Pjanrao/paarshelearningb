"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

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
        }
    }, [editing]);

    const handleSubmit = () => {
        console.log(form);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">

                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold">
                        {editing ? "Edit Workshop" : "Add Workshop"}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">

                    {/* BASIC INFO */}
                    <div className="grid grid-cols-2 gap-4">

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Workshop Title
                            </label>
                            <Input
                                className="h-8 text-sm border border-gray-300 bg-white hover:border-blue-600 hover:bg-blue-50/30 focus:border-blue-900 transition"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                            />
                        </div>

                        {/* Instructor */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Instructor Name
                            </label>
                            <Input
                                className="h-8 text-sm border border-gray-300 bg-white hover:border-blue-600 hover:bg-blue-50/30 focus:border-blue-900 transition"
                                value={form.instructorName}
                                onChange={(e) => setForm({ ...form, instructorName: e.target.value })}
                            />
                        </div>

                    </div>

                    {/* DATE TIME */}
                    <div className="grid grid-cols-3 gap-4">

                        <Input
                            type="date"
                            className="h-9 text-sm border border-gray-300 hover:border-blue-600 focus:border-blue-900"
                            value={form.date}
                            onChange={(e) => setForm({ ...form, date: e.target.value })}
                        />

                        <Input
                            type="time"
                            className="h-9 text-sm border border-gray-300 hover:border-blue-600 focus:border-blue-900"
                            value={form.time}
                            onChange={(e) => setForm({ ...form, time: e.target.value })}
                        />

                        <Input
                            placeholder="Duration (hrs)"
                            className="h-9 text-sm border border-gray-300 hover:border-blue-600 focus:border-blue-900"
                            value={form.duration}
                            onChange={(e) => setForm({ ...form, duration: e.target.value })}
                        />

                    </div>

                    {/* PRICE + MODE */}
                    <div className="grid grid-cols-2 gap-4">
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            price
                        </label>
                        <Input
                            type="number"
                            placeholder="Price"
                            className="h-9 text-sm border border-gray-300 hover:border-blue-600 focus:border-blue-900"
                            value={form.price}
                            onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                        />

                        <Select
                            value={form.mode}
                            onValueChange={(val) => setForm({ ...form, mode: val })}
                        >
                            <SelectTrigger className="h-9 border border-gray-300 hover:border-blue-600">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="online">Online</SelectItem>
                                <SelectItem value="offline">Offline</SelectItem>
                            </SelectContent>
                        </Select>

                    </div>

                    {/* LOCATION / LINK */}
                    <div className="grid grid-cols-2 gap-4">

                        {form.mode === "offline" && (
                            <Input
                                placeholder="Location"
                                className="h-9 text-sm border border-gray-300 hover:border-blue-600"
                                value={form.location}
                                onChange={(e) => setForm({ ...form, location: e.target.value })}
                            />
                        )}

                        {form.mode === "online" && (
                            <Input
                                placeholder="Meeting Link"
                                className="h-9 text-sm border border-gray-300 hover:border-blue-600"
                                value={form.meetingLink}
                                onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
                            />
                        )}

                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                            Description
                        </label>
                        <Textarea
                            rows={3}
                            className="text-sm border border-gray-300 hover:border-blue-600 focus:border-blue-900"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                    </div>

                    {/* STATUS */}
                    <Select
                        value={form.status}
                        onValueChange={(val) => setForm({ ...form, status: val })}
                    >
                        <SelectTrigger className="h-9 border border-gray-300">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-4 pt-4 border-t">

                        <button
                            onClick={onClose}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={handleSubmit}
                            className="bg-[#2C4276] hover:bg-[#1f3159] text-white px-6 py-2 rounded-lg shadow"
                        >
                            {editing ? "Update" : "Save"}
                        </button>

                    </div>

                </div>
            </DialogContent>
        </Dialog>
    );
}