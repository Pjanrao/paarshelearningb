"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Star,
    Search,
    MessageSquare,
    X,
    Loader2,
    Check,
    Filter
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface Testimonial {
    _id: string;
    name: string;
    course: string;
    message: string;
    rating: number;
    status: "pending" | "approved" | "rejected";
    createdAt?: string;
}

export default function AdmintestimonialPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const testimonialsPerPage = 10;
    const [deleteId, setDeleteId] = useState<{ id: string, name: string } | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [formData, setFormData] = useState({
        _id: "",
        name: "",
        course: "",
        message: "",
        rating: 5,
    });

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const res = await fetch(`/api/testimonial?admin=true&status=all&page=${currentPage}&limit=${testimonialsPerPage}&search=${searchQuery}`);
            const result = await res.json();

            if (res.ok) {
                setTestimonials(result.data || []);
                if (result.pagination) {
                    setTotal(result.pagination.total);
                    setTotalPages(result.pagination.totalPages);
                }
            }
        } catch (error) {
            console.error("Error fetching testimonials:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchTestimonials();
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [currentPage, searchQuery]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const method = formData._id ? "PUT" : "POST";
            const url = formData._id ? `/api/testimonial/${formData._id}` : "/api/testimonial";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    course: formData.course,
                    message: formData.message,
                    rating: formData.rating,
                }),
            });

            if (res.ok) {
                setIsDialogOpen(false);
                fetchTestimonials();
                resetForm();
            } else {
                const errorData = await res.json();
                alert("Error: " + errorData.error);
            }
        } catch (error) {
            console.error("Error saving testimonial:", error);
            alert("Failed to save testimonial");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleteLoading(true);
        try {
            const res = await fetch(`/api/testimonial/${deleteId.id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                fetchTestimonials();
                setDeleteId(null);
            }
        } catch (error) {
            console.error("Error deleting testimonial:", error);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleEdit = (t: Testimonial) => {
        setFormData({
            _id: t._id,
            name: t.name,
            course: t.course,
            message: t.message,
            rating: t.rating,
        });
        setIsDialogOpen(true);
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/testimonial/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) fetchTestimonials();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const resetForm = () => {
        setFormData({
            _id: "",
            name: "",
            course: "",
            message: "",
            rating: 5,
        });
    };

    const openAddDialog = () => {
        resetForm();
        setIsDialogOpen(true);
    };

    return (
        <div className="bg-gray-50 h-full">
            <div className="mb-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C4276]">Testimonials Management</h1>
                        <p className="text-gray-500 text-sm mt-1 font-medium">Manage student feedback and public testimonials</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search testimonials..."
                                value={searchQuery}
                                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                className="pl-10 pr-4 py-2.5 rounded-xl border-0 focus:ring-2 focus:ring-[#2C4276]/20 w-full shadow-sm bg-white text-gray-600 outline-none transition-all"
                            />
                            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        </div>
                        <button
                            onClick={openAddDialog}
                            className="bg-[#2C4276] text-white px-5 py-2.5 rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-md font-semibold active:scale-95 whitespace-nowrap"
                        >
                            <Plus size={20} />
                            <span>Add Testimonial</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-blue-600" size={40} />
                        <p className="text-gray-500 animate-pulse">Loading testimonials...</p>
                    </div>
                ) : testimonials.length === 0 ? (
                    <div className="text-center py-20 px-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="text-gray-400" size={32} />
                        </div>
                        <p className="text-gray-500 text-lg font-medium">No testimonials found</p>
                        <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">
                            {searchQuery
                                ? "We couldn't find any testimonials matching your search."
                                : "The testimonial gallery is currently empty."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="custom-scrollbar-container overflow-auto h-[430px] sm:max-h-[600px] border-x rounded-t-xl">
                            <table className="w-full divide-y divide-gray-200 min-w-[900px]">
                                <thead className="bg-gray-50 border-b sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Course</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Message</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {testimonials.map((t, index) => (
                                        <tr key={t._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                                {(currentPage - 1) * testimonialsPerPage + index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2C4276] to-blue-500 flex items-center justify-center text-white font-bold shadow-inner uppercase">
                                                        {t.name.charAt(0)}
                                                    </div>
                                                    <div className="text-sm font-bold text-gray-900">{t.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider border border-blue-100">
                                                    {t.course}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 max-w-[300px]">
                                                <p className="truncate" title={t.message}>"{t.message}"</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={14} className={i < t.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${t.status === 'approved' ? 'bg-green-50 text-green-700 border-green-100' :
                                                    t.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-100' :
                                                        'bg-yellow-50 text-yellow-700 border-yellow-100'
                                                    }`}>
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleStatusUpdate(t._id, 'approved')}
                                                        className={`p-2 rounded-lg transition-colors ${t.status === 'approved' ? 'text-gray-300' : 'text-green-600 hover:bg-green-50'}`}
                                                        disabled={t.status === 'approved'}
                                                        title="Approve"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button onClick={() => handleEdit(t)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Pencil size={18} /></button>
                                                    <button onClick={() => setDeleteId({ id: t._id, name: t.name })} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 border-t bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                             <div className="text-sm text-gray-600 font-medium order-2 md:order-1">
                                {total === 0 ? (
                                    "Showing 0 to 0 of 0 testimonials"
                                ) : (
                                    <>
                                        Showing <span className="font-bold text-gray-900">{(currentPage - 1) * testimonialsPerPage + 1}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * testimonialsPerPage, total)}</span> of <span className="font-bold text-gray-900">{total}</span> testimonials
                                    </>
                                )}
                            </div>
                            <div className="flex items-center gap-2 order-1 md:order-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 text-sm font-bold rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm active:scale-95"
                                >
                                    Previous
                                </button>
                                <div className="hidden sm:flex items-center gap-1">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                        let pageNum;
                                        if (totalPages <= 5) pageNum = i + 1;
                                        else if (currentPage <= 3) pageNum = i + 1;
                                        else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                                        else pageNum = currentPage - 2 + i;

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-10 h-10 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95 ${currentPage === pageNum ? "bg-[#2C4276] text-white" : "border bg-white hover:bg-gray-50 text-gray-700"
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="sm:hidden text-sm font-bold px-3 py-2 border rounded-lg bg-white">
                                    {currentPage} / {totalPages}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 text-sm font-bold rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm active:scale-95"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Modal */}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-[#2C4276]">
                                {formData._id ? "Edit Testimonial" : "Add New Testimonial"}
                            </h2>
                            <button onClick={() => setIsDialogOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Student Name <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    placeholder="e.g. Rahul Sharma"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Course / Role <span className="text-red-500">*</span></label>
                                <input
                                    required
                                    placeholder="e.g. MERN Stack Student"
                                    value={formData.course}
                                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, rating: s })}
                                            className="focus:outline-none transition-transform hover:scale-110"
                                        >
                                            <Star className={`h-8 w-8 ${s <= formData.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 hover:text-gray-300"}`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Feedback Message <span className="text-red-500">*</span></label>
                                <textarea
                                    required
                                    placeholder="Enter the student's feedback..."
                                    className="w-full px-4 py-2 border rounded-lg min-h-[120px] focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setIsDialogOpen(false)}
                                    className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formLoading}
                                    className="px-6 py-2 bg-[#2C4276] text-white rounded-lg hover:bg-opacity-90 flex items-center gap-2 shadow-md transition-all font-semibold disabled:opacity-50"
                                >
                                    {formLoading && <Loader2 className="animate-spin" size={16} />}
                                    {formData._id ? "Update Testimonial" : "Save Testimonial"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="max-w-md bg-white dark:bg-gray-900">
                    <AlertDialogHeader className="flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                            <Trash2 className="text-red-600" size={22} />
                        </div>
                        <AlertDialogTitle className="text-lg font-semibold text-gray-900">
                            Delete Testimonial
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-gray-500 leading-relaxed">
                            Are you sure you want to delete the testimonial from <span className="font-bold text-gray-800">{deleteId?.name}</span>? This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex justify-center gap-3 mt-4">
                        <Button variant="outline" onClick={() => setDeleteId(null)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
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
