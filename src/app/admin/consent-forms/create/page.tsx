"use client";

import React, { useState, useRef, useMemo } from "react";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function CreateConsentFormPage() {
    const router = useRouter();
    const editor = useRef(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [saving, setSaving] = useState(false);

    const config = useMemo(
        () => ({
            readonly: false,
            placeholder: "Start typing your consent form content here...",
            height: 500,
        }),
        []
    );

    const handleSave = async () => {
        if (!title.trim()) {
            return toast.error("Please enter a document title");
        }
        if (!content.trim() || content === "<p><br></p>") {
            return toast.error("Please enter the document content");
        }

        setSaving(true);
        try {
            const res = await axios.post("/api/admin/consent-forms", {
                title,
                content
            });

            if (res.data.success) {
                toast.success("Consent form created successfully!");
                router.push("/admin/consent-forms");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to create form");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-gray-50 h-full min-h-screen">
            <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/consent-forms"
                        className="bg-white hover:bg-gray-50 border text-gray-700 p-2 rounded-lg transition"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-[#2C4276]">Create Consent Form</h1>
                        <p className="text-gray-500 mt-1">Draft a new document for users to accept.</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Document Title *</label>
                        <input
                            type="text"
                            placeholder="e.g. Terms & Conditions 2026"
                            className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-[#2C4276]"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Document Content *</label>
                        <div className="border border-gray-300 rounded-lg overflow-hidden">
                            <JoditEditor
                                ref={editor}
                                value={content}
                                config={config}
                                onBlur={newContent => setContent(newContent)}
                            />
                        </div>
                    </div>

                    <div className="pt-4 border-t flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-[#2C4276] hover:bg-[#1f3159] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium transition disabled:opacity-70"
                        >
                            {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                            {saving ? "Saving..." : "Save Document"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
