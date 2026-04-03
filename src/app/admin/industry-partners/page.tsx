"use client";

import { useState, useEffect } from "react";
import { Eye, Pencil, Trash2, Plus, Search, Loader2, X, Building2, ExternalLink, GripVertical, Upload } from "lucide-react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Partner {
    _id: string;
    name: string;
    logoUrl: string;
    websiteUrl: string;
    displayOrder: number;
    isActive: boolean;
    size: number;
    createdAt: string;
}

interface PartnerFormData {
    name: string;
    logoUrl: string;
    websiteUrl: string;
    displayOrder: number;
    isActive: boolean;
    size: number;
}

export default function IndustryPartnersPage() {
    const [partners, setPartners] = useState<Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [deleteId, setDeleteId] = useState<{ id: string; name: string } | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState<PartnerFormData>({
        name: "",
        logoUrl: "",
        websiteUrl: "",
        displayOrder: 0,
        isActive: true,
        size: 1,
    });

    const fetchPartners = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/industry-partners");
            const data = await response.json();
            if (response.ok) {
                setPartners(data.data || []);
            }
        } catch (error) {
            console.error("Error fetching partners:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPartners();
    }, []);

    const filteredPartners = partners.filter(
        (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.websiteUrl.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddPartner = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!formData.name.trim() || !formData.logoUrl.trim()) {
            toast.error("Name and Logo URL are required.");
            return;
        }
        setFormLoading(true);
        try {
            const response = await fetch("/api/industry-partners", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                toast.success("Partner added successfully!");
                setIsAddModalOpen(false);
                resetForm();
                fetchPartners();
            } else {
                const res = await response.json();
                toast.error(res.error || "Failed to add partner");
            }
        } catch (error) {
            console.error("Error adding partner:", error);
            toast.error("Failed to add partner");
        } finally {
            setFormLoading(false);
        }
    };

    const handleEditPartner = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!selectedPartner) return;
        setFormLoading(true);
        try {
            console.log("[Client] Updating partner:", selectedPartner._id, formData);
            const response = await fetch(`/api/industry-partners/${selectedPartner._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                toast.success("Partner updated successfully!");
                setIsEditModalOpen(false);
                resetForm();
                fetchPartners();
            } else {
                toast.error("Failed to update partner");
            }
        } catch (error) {
            console.error("Error updating partner:", error);
            toast.error("Failed to update partner");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeletePartner = async () => {
        if (!deleteId) return;
        setDeleteLoading(true);
        try {
            const response = await fetch(`/api/industry-partners/${deleteId.id}`, {
                method: "DELETE",
            });
            if (response.ok) {
                toast.success("Partner deleted successfully!");
                fetchPartners();
                setDeleteId(null);
            } else {
                toast.error("Failed to delete partner");
            }
        } catch (error) {
            console.error("Error deleting partner:", error);
            toast.error("Failed to delete partner");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (response.ok) {
                setFormData((prev) => ({ ...prev, logoUrl: data.url }));
                toast.success("Logo uploaded successfully!");
            } else {
                toast.error(data.error || "Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const toggleActive = async (partner: Partner) => {
        try {
            const response = await fetch(`/api/industry-partners/${partner._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !partner.isActive }),
            });
            if (response.ok) {
                toast.success(`Partner ${!partner.isActive ? "activated" : "deactivated"}`);
                fetchPartners();
            }
        } catch (error) {
            console.error("Error toggling partner:", error);
        }
    };

    const openAddModal = () => {
        resetForm();
        setIsAddModalOpen(true);
    };

    const openEditModal = (partner: Partner) => {
        setSelectedPartner(partner);
        setFormData({
            name: partner.name,
            logoUrl: partner.logoUrl,
            websiteUrl: partner.websiteUrl || "",
            displayOrder: partner.displayOrder || 0,
            isActive: partner.isActive,
            size: partner.size || 1,
        });
        setIsEditModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            logoUrl: "",
            websiteUrl: "",
            displayOrder: 0,
            isActive: true,
            size: 1,
        });
        setSelectedPartner(null);
    };

    return (
        <div className="bg-gray-50 h-full">
            <div className="mb-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C4276]">Industry Partners</h1>
                        <p className="text-gray-500 text-sm mt-1 font-medium">Manage partner logos displayed on the homepage</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search partners..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2.5 rounded-xl border-0 focus:ring-2 focus:ring-[#2C4276]/20 w-full shadow-sm bg-white text-gray-600 outline-none transition-all"
                            />
                            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        </div>
                        <button
                            onClick={openAddModal}
                            className="bg-[#2C4276] text-white px-5 py-2.5 rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-md font-semibold active:scale-95 whitespace-nowrap"
                        >
                            <Plus size={20} />
                            <span>Add Partner</span>
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                    <p className="text-gray-500 animate-pulse">Loading partners...</p>
                </div>
            ) : filteredPartners.length === 0 ? (
                <div className="text-center py-20 px-4 bg-white rounded-lg shadow-md">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Building2 className="text-gray-400" size={32} />
                    </div>
                    <p className="text-gray-500 text-lg font-medium">No partners found</p>
                    <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">
                        {searchQuery
                            ? "No partners match your search. Try a different term."
                            : "No industry partners yet. Click 'Add Partner' to get started."}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredPartners.map((partner) => (
                        <div
                            key={partner._id}
                            className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all group relative ${!partner.isActive ? "opacity-60" : ""
                                }`}
                        >
                            {/* Status indicator */}
                            <div className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full ${partner.isActive ? "bg-green-500" : "bg-gray-300"}`} title={partner.isActive ? "Active" : "Inactive"} />

                            {/* Logo Preview */}
                            <div className="h-28 flex items-center justify-center p-4 border-b bg-gray-50/50 rounded-t-xl">
                                <img
                                    src={partner.logoUrl}
                                    alt={partner.name}
                                    className="max-h-full max-w-full object-contain transition-transform"
                                    style={{ transform: `scale(${partner.size || 1})` }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='40' fill='%23ccc'%3E%3Ctext x='10' y='28' font-size='14'%3ENo Logo%3C/text%3E%3C/svg%3E";
                                    }}
                                />
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <h3 className="text-sm font-bold text-gray-900 truncate">{partner.name}</h3>
                                {partner.websiteUrl && (
                                    <a
                                        href={partner.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] text-blue-500 hover:underline flex items-center gap-1 mt-1 truncate"
                                    >
                                        <ExternalLink size={10} />
                                        {partner.websiteUrl}
                                    </a>
                                )}
                                <div className="flex items-center gap-1.5 mt-2">
                                    <span className="text-[9px] font-bold text-gray-400 uppercase">Order: {partner.displayOrder}</span>
                                    <span className="text-gray-200">•</span>
                                    <span className="text-[9px] font-bold text-gray-400 uppercase">Size: {partner.size || 1}x</span>
                                    <span className="text-gray-200">•</span>
                                    <span className={`text-[9px] font-bold uppercase ${partner.isActive ? "text-green-600" : "text-gray-400"}`}>
                                        {partner.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="px-4 pb-3 flex items-center gap-1.5">
                                <button
                                    onClick={() => toggleActive(partner)}
                                    className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${partner.isActive
                                        ? "bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-100"
                                        : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-100"
                                        }`}
                                >
                                    {partner.isActive ? "Deactivate" : "Activate"}
                                </button>
                                <button
                                    onClick={() => openEditModal(partner)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Edit"
                                >
                                    <Pencil size={15} />
                                </button>
                                <button
                                    onClick={() => setDeleteId({ id: partner._id, name: partner.name })}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                        <div className="px-5 py-3 border-b flex justify-between items-center bg-gray-50 flex-shrink-0">
                            <h2 className="text-base font-bold text-[#2C4276]">{isAddModalOpen ? "Add New Partner" : "Edit Partner"}</h2>
                            <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-5 space-y-4 overflow-y-auto flex-1">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Partner Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 text-sm"
                                    placeholder="e.g. Google, Microsoft"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Logo <span className="text-red-500">*</span></label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        required
                                        value={formData.logoUrl}
                                        onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                        className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 text-sm"
                                        placeholder="Paste URL or upload image"
                                    />
                                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg border transition-all flex items-center justify-center shrink-0">
                                        {uploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                                {formData.logoUrl && (
                                    <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center h-24 relative group">
                                        <img
                                            src={formData.logoUrl}
                                            alt="Preview"
                                            className="max-h-full max-w-full object-contain transition-transform"
                                            style={{ transform: `scale(${formData.size || 1})` }}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = "none";
                                            }}
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setFormData({ ...formData, logoUrl: "" })}
                                            className="absolute top-1 right-1 p-1 bg-white/80 hover:bg-white text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Website URL</label>
                                <input
                                    type="text"
                                    value={formData.websiteUrl}
                                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 text-sm"
                                    placeholder="https://example.com"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Display Order</label>
                                    <input
                                        type="number"
                                        value={formData.displayOrder}
                                        onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                        placeholder="0"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Logo Size (Scale)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0.1"
                                        max="2"
                                        value={formData.size}
                                        onChange={(e) => setFormData({ ...formData, size: parseFloat(e.target.value) || 1 })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                        placeholder="1.0"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">1.0 = Default, 0.8 = Smaller, 1.2 = Larger</p>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                                    <select
                                        value={formData.isActive ? "active" : "inactive"}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.value === "active" })}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white text-sm"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 px-5 py-3 border-t bg-gray-50 flex-shrink-0">
                            <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors text-sm">
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={isAddModalOpen ? handleAddPartner : handleEditPartner}
                                disabled={formLoading}
                                className="px-5 py-2 bg-[#2C4276] text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 flex items-center gap-2 shadow-md transition-all font-semibold text-sm"
                            >
                                {formLoading && <Loader2 className="animate-spin" size={16} />}
                                {isAddModalOpen ? "Add Partner" : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="max-w-md bg-white dark:bg-gray-900">
                    <AlertDialogHeader className="flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                            <Trash2 className="text-red-600" size={22} />
                        </div>
                        <AlertDialogTitle className="text-lg font-semibold text-gray-900">
                            Delete Partner
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-gray-500 leading-relaxed">
                            Are you sure you want to delete <span className="font-bold text-gray-800">{deleteId?.name}</span>? This will remove the partner logo from the website.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex justify-center gap-3 mt-4">
                        <Button variant="outline" onClick={() => setDeleteId(null)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeletePartner}
                            disabled={deleteLoading}
                            className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-60"
                        >
                            {deleteLoading && <Loader2 className="animate-spin mr-2" size={16} />}
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
