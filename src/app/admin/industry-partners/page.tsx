"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Search, Loader2, X, Building2, ExternalLink, GripVertical, Upload, CheckCircle } from "lucide-react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogTitle,
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
    const [errors, setErrors] = useState<any>({});

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

    const validate = () => {
        const newErrors: any = {};
        if (!formData.name.trim()) newErrors.name = "Partner name is required";
        if (!formData.logoUrl.trim()) newErrors.logoUrl = "Logo URL or upload is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddPartner = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!validate()) return;

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
        if (!validate()) return;

        setFormLoading(true);
        try {
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
        const fileFormData = new FormData();
        fileFormData.append("file", file);

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: fileFormData,
            });
            const data = await response.json();
            if (response.ok) {
                setFormData((prev) => ({ ...prev, logoUrl: data.url }));
                if (errors.logoUrl) setErrors((prev: any) => ({ ...prev, logoUrl: null }));
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
        setErrors({});
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
        setErrors({});
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
        setErrors({});
    };

    return (
        <div className="bg-gray-50 h-full p-4 sm:p-6">
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-[#2C4276] tracking-tight">Industry Partners</h1>
                        <p className="text-gray-500 text-sm mt-1.5 font-medium">Manage partner logos displayed on the homepage</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative w-full sm:w-72">
                            <input
                                type="text"
                                placeholder="Search by name or website..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-11 pr-4 py-3 rounded-2xl border border-gray-100 focus:ring-4 focus:ring-[#2C4276]/10 w-full shadow-sm bg-white text-gray-600 outline-none transition-all placeholder:text-gray-400"
                            />
                            <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
                        </div>
                        <button
                            onClick={openAddModal}
                            className="bg-[#2C4276] text-white px-6 py-3 rounded-2xl hover:opacity-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2C4276]/20 font-bold active:scale-95 whitespace-nowrap"
                        >
                            <Plus size={20} />
                            <span>Add New Partner</span>
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 bg-white rounded-3xl shadow-sm border border-gray-50">
                    <Loader2 className="animate-spin text-[#2C4276]" size={40} />
                    <p className="text-gray-400 font-medium tracking-wide">Fetching industry records...</p>
                </div>
            ) : filteredPartners.length === 0 ? (
                <div className="text-center py-24 px-4 bg-white rounded-3xl shadow-sm border border-gray-100">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Building2 className="text-gray-300" size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">No Partners Found</h3>
                    <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">
                        {searchQuery
                            ? "No results matching your current search criteria."
                            : "Your partner list is empty. Start adding some influential brands!"}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredPartners.map((partner) => (
                        <div
                            key={partner._id}
                            className={`bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden ${!partner.isActive ? "grayscale opacity-70" : ""
                                }`}
                        >
                            {/* Logo Preview Container */}
                            <div className="h-32 flex items-center justify-center p-6 bg-gray-50/50 rounded-t-[2rem] border-b border-gray-50 relative group-hover:bg-white transition-colors">
                                <img
                                    src={partner.logoUrl}
                                    alt={partner.name}
                                    className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                                    style={{ transform: `scale(${partner.size || 1})` }}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://placehold.co/200x80/f8fafc/94a3b8?text=Logo+Missing";
                                    }}
                                />
                                {!partner.isActive && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/5 backdrop-blur-[1px]">
                                        <span className="bg-gray-800/80 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Inactive</span>
                                    </div>
                                )}
                            </div>

                            {/* Info Section */}
                            <div className="p-6">
                                <div className="flex justify-between items-start gap-2 mb-2">
                                    <h3 className="text-base font-bold text-gray-900 truncate" title={partner.name}>{partner.name}</h3>
                                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 ${partner.isActive ? "bg-green-500 shadow-sm" : "bg-gray-200"}`} />
                                </div>

                                {partner.websiteUrl ? (
                                    <a
                                        href={partner.websiteUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[11px] text-[#2C4276] font-semibold hover:underline flex items-center gap-1.5 truncate group-hover:text-blue-600 transition-colors"
                                    >
                                        <ExternalLink size={12} />
                                        {partner.websiteUrl.replace(/^https?:\/\//, '')}
                                    </a>
                                ) : (
                                    <span className="text-[11px] text-gray-300 italic font-medium flex items-center gap-1.5">
                                        <ExternalLink size={12} />
                                        No website linked
                                    </span>
                                )}

                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                                    <div className="px-2 py-1 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-1 text-[9px] font-black text-gray-500 uppercase tracking-tighter">
                                        <GripVertical size={10} className="text-gray-300" />
                                        Order {partner.displayOrder}
                                    </div>
                                    <div className="px-2 py-1 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-1 text-[9px] font-black text-gray-500 uppercase tracking-tighter">
                                        Scale {partner.size || 1}x
                                    </div>
                                </div>
                            </div>

                            {/* Hover Actions Bar */}
                            <div className="px-6 pb-6 flex items-center gap-2 mt-auto">
                                <button
                                    onClick={() => toggleActive(partner)}
                                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${partner.isActive
                                        ? "bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-100"
                                        : "bg-green-50 text-green-600 hover:bg-green-100 border border-green-100"
                                        } active:scale-95`}
                                >
                                    {partner.isActive ? "Hide" : "Show"}
                                </button>
                                <button
                                    onClick={() => openEditModal(partner)}
                                    className="p-2.5 text-white bg-[#2C4276] hover:opacity-90 rounded-xl transition-all shadow-lg shadow-[#2C4276]/10 active:scale-95"
                                    title="Edit Partner Design"
                                >
                                    <Pencil size={16} />
                                </button>
                                <button
                                    onClick={() => setDeleteId({ id: partner._id, name: partner.name })}
                                    className="p-2.5 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all border border-red-50 active:scale-95"
                                    title="Permanently Remove"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 bg-[#2C4276]/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200 overflow-hidden">
                        <div className="px-8 py-6 border-b flex justify-between items-center bg-gray-50/50">
                            <div>
                                <h2 className="text-xl font-black text-[#2C4276] tracking-tight">{isAddModalOpen ? "New Partnership" : "Update Partner"}</h2>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">Brand Visibility Management</p>
                            </div>
                            <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="p-2 hover:bg-white rounded-xl text-gray-400 hover:text-gray-600 transition-all border border-transparent hover:border-gray-100">
                                <X size={22} />
                            </button>
                        </div>
                        <div className="p-8 pb-4 space-y-6 overflow-y-auto flex-1">
                            <div className="space-y-2">
                                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider ml-1">Partner Identity <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <Building2 size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFormData({ ...formData, name: e.target.value });
                                            if (errors.name) setErrors({ ...errors, name: null });
                                        }}
                                        className={`w-full pl-12 pr-4 py-3 bg-gray-50 border rounded-2xl outline-none focus:ring-4 focus:ring-[#2C4276]/10 transition-all font-semibold ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-100'}`}
                                        placeholder="Enter company name..."
                                    />
                                </div>
                                {errors.name && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider ml-1">Brand Logo <span className="text-red-500">*</span></label>
                                <div className="flex gap-2 relative">
                                    <input
                                        type="text"
                                        value={formData.logoUrl}
                                        onChange={(e) => {
                                            setFormData({ ...formData, logoUrl: e.target.value });
                                            if (errors.logoUrl) setErrors({ ...errors, logoUrl: null });
                                        }}
                                        className={`flex-1 px-4 py-3 bg-gray-50 border rounded-2xl outline-none focus:ring-4 focus:ring-[#2C4276]/10 transition-all font-semibold pr-12 min-w-0 ${errors.logoUrl ? 'border-red-500 bg-red-50' : 'border-gray-100'}`}
                                        placeholder="Paste URL or upload..."
                                    />
                                    <label className="cursor-pointer bg-white hover:bg-gray-50 text-gray-700 w-12 h-12 rounded-2xl border border-gray-100 shadow-sm transition-all flex items-center justify-center shrink-0 active:scale-95 group">
                                        {uploading ? <Loader2 className="animate-spin text-[#2C4276]" size={20} /> : <Upload className="text-gray-400 group-hover:text-[#2C4276]" size={20} />}
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                                {errors.logoUrl && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.logoUrl}</p>}

                                {formData.logoUrl && (
                                    <div className="mt-3 p-6 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200 flex items-center justify-center h-40 relative group overflow-hidden">
                                        <img
                                            src={formData.logoUrl}
                                            alt="Preview"
                                            className="max-h-full max-w-full object-contain transition-transform duration-300"
                                            style={{ transform: `scale(${formData.size || 1})` }}
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = "none";
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, logoUrl: "" })}
                                                className="bg-white p-2.5 rounded-full text-red-500 shadow-xl border border-red-50 hover:scale-110 active:scale-90 transition-all"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider ml-1">Website (Optional)</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                        <ExternalLink size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.websiteUrl}
                                        onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#2C4276]/10 transition-all font-semibold"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider ml-1">Display Rank</label>
                                    <input
                                        type="number"
                                        value={formData.displayOrder}
                                        onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-4 focus:ring-[#2C4276]/10 transition-all font-semibold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-[11px] font-black text-gray-500 uppercase tracking-wider ml-1">Logo Scale <span>({formData.size}x)</span></label>
                                    <input
                                        type="range"
                                        step="0.05"
                                        min="0.5"
                                        max="1.5"
                                        value={formData.size}
                                        onChange={(e) => setFormData({ ...formData, size: parseFloat(e.target.value) || 1 })}
                                        className="w-full h-10 accent-[#2C4276] cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-8 pt-4 flex gap-4 bg-white border-t border-gray-50">
                            <button
                                type="button"
                                onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                                className="flex-1 py-4 text-gray-500 font-black text-[11px] uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all"
                            >
                                Back
                            </button>
                            <button
                                type="button"
                                onClick={isAddModalOpen ? handleAddPartner : handleEditPartner}
                                disabled={formLoading}
                                className="flex-[2] py-4 bg-[#2C4276] text-white rounded-2xl hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-[#2C4276]/20 transition-all font-black text-[11px] uppercase tracking-widest active:scale-95"
                            >
                                {formLoading ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
                                <span>{isAddModalOpen ? "Create Identity" : "Update Records"}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Dialog */}
            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="max-w-md bg-white rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
                    <div className="p-8 text-center bg-white space-y-6">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-red-50/50">
                            <Trash2 className="text-red-600" size={32} />
                        </div>
                        <div className="space-y-2">
                            <AlertDialogTitle className="text-2xl font-black text-gray-900 tracking-tight">
                                Disconnect Partner?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm font-medium text-gray-400">
                                This will permanently remove <span className="text-red-500 font-black">{deleteId?.name}</span> and their branding from all active directories.
                            </AlertDialogDescription>
                        </div>

                        <div className="flex flex-col gap-3">
                            <Button
                                onClick={handleDeletePartner}
                                disabled={deleteLoading}
                                className="w-full py-7 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-red-200"
                            >
                                {deleteLoading ? <Loader2 className="animate-spin" size={20} /> : "Terminate Connection"}
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setDeleteId(null)}
                                className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 bg-transparent hover:bg-gray-50 rounded-2xl"
                            >
                                Wait, Keep it
                            </Button>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
