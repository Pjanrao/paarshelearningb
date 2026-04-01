"use client";

import { useState } from "react";
import {
    Plus,
    Trash2,
    Edit2,
    Building2,
    Mail,
    Search,
    Loader2,
    X
} from "lucide-react";
import { toast } from "sonner";
import {
    useFetchEntranceCollegesQuery,
    useCreateEntranceCollegeMutation,
    useUpdateEntranceCollegeMutation,
    useDeleteEntranceCollegeMutation,
} from "@/redux/api";
import DeleteCourseDialog from "@/components/dashboard/courses/DeleteCourseDialog";

interface College {
    _id: string;
    name: string;
    email: string;
    createdAt: string;
}

export default function EntranceCollegesPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCollege, setSelectedCollege] = useState<College | null>(null);
    const [formData, setFormData] = useState({ name: "", email: "" });

    const { data: collegesData, isLoading } = useFetchEntranceCollegesQuery(undefined);
    const [createCollege, { isLoading: isCreating }] = useCreateEntranceCollegeMutation();
    const [updateCollege, { isLoading: isUpdating }] = useUpdateEntranceCollegeMutation();
    const [deleteCollege] = useDeleteEntranceCollegeMutation();
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const [searchQuery, setSearchQuery] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isLoadingState, setIsLoadingState] = useState(false);

    const colleges = (collegesData?.colleges || []) as College[];
    const filteredColleges = colleges.filter((c: College) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const collegesPerPage = 10;


    const fetchColleges = async () => {
        try {
            setIsLoadingState(true);
            const response = await fetch(
                `/api/entrance-college?search=${searchQuery}&page=${currentPage}&limit=${collegesPerPage}&startDate=${startDate}&endDate=${endDate}`
            );
            const data = await response.json();

            if (response.ok) {
                setTotalPages(data.pagination?.totalPages || 1);
                setTotal(data.pagination?.total || 0);
            }
        } catch (error) {
            console.error("Error fetching colleges:", error);
        } finally {
            setIsLoadingState(false);
        }
    };

    const handleSave = async () => {
        if (!formData.name || !formData.email) {
            toast.error("Please fill all fields");
            return;
        }
        try {
            if (selectedCollege) {
                await updateCollege({ collegeId: selectedCollege._id, data: formData }).unwrap();
                toast.success("College updated successfully");
            } else {
                await createCollege(formData).unwrap();
                toast.success("College added successfully");
            }
            setIsDialogOpen(false);
            setFormData({ name: "", email: "" });
            setSelectedCollege(null);
        } catch (err: any) {
            toast.error(err?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`Are you sure you want to delete ${name}?`)) {
            try {
                await deleteCollege({ collegeId: id }).unwrap();
                toast.success("College removed");
            } catch (err: any) {
                toast.error(err?.data?.message || "Delete failed");
            }
        }
    };

    const handleOpenEdit = (college: College) => {
        setSelectedCollege(college);
        setFormData({ name: college.name, email: college.email });
        setIsDialogOpen(true);
    };

    const openAddDialog = () => {
        setSelectedCollege(null);
        setFormData({ name: "", email: "" });
        setIsDialogOpen(true);
    };

    return (
        <div className="bg-gray-50 p-4 h-full">
            <div className="mb-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#2C4276]">College Management</h1>
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search colleges..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 rounded-xl border-0 focus:ring-2 focus:ring-[#2C4276]/20 w-full shadow-sm bg-white text-gray-600 outline-none transition-all"
                            />
                            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        </div>
                        <button
                            onClick={openAddDialog}
                            className="bg-[#2C4276] text-white px-5 py-2.5 rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-md font-semibold active:scale-95 whitespace-nowrap"
                        >
                            <Plus size={20} />
                            <span>Add College</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-blue-600" size={40} />
                        <p className="text-gray-500 animate-pulse">Loading colleges...</p>
                    </div>
                ) : filteredColleges.length === 0 ? (
                    <div className="text-center py-20 px-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Building2 className="text-gray-400" size={32} />
                        </div>
                        <p className="text-gray-500 text-lg font-medium">No colleges found</p>
                        <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">
                            {searchTerm
                                ? "No colleges match your search. Try a different term."
                                : "No colleges registered yet. Click 'Add College' to get started."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="custom-scrollbar-container overflow-auto h-[450px] sm:max-h-[600px] border-x rounded-t-lg">
                            <table className="w-full divide-y divide-gray-200 min-w-[800px]">
                                <thead className="bg-gray-50 border-b sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">College</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {filteredColleges.map((c: College, index: number) => (
                                        <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{(currentPage - 1) * collegesPerPage + index + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2C4276] to-blue-500 flex items-center justify-center text-white font-bold shadow-inner uppercase">
                                                        {c.name.charAt(0)}
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900">{c.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{c.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Active</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {new Date(c.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => handleOpenEdit(c)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit College"><Edit2 size={18} /></button>
                                                    <button onClick={() => handleDelete(c._id, c.name)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete College"><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 border-t bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-600 font-medium order-2 md:order-1">
                                Showing <span className="font-bold text-gray-900">{(currentPage - 1) * collegesPerPage + (filteredColleges.length > 0 ? 1 : 0)}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * collegesPerPage, total || filteredColleges.length)}</span> of <span className="font-bold text-gray-900">{total || filteredColleges.length}</span> colleges
                            </div>
                            <div className="flex items-center gap-2 order-1 md:order-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 text-sm font-bold rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm active:scale-95"
                                >
                                    Prev
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
                                    disabled={currentPage === totalPages || (total === 0 && filteredColleges.length === 0)}
                                    className="px-4 py-2 text-sm font-bold rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm active:scale-95">
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {isDialogOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-[#2C4276]">{selectedCollege ? "Update College" : "Register New College"}</h2>
                            <button onClick={() => setIsDialogOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">College Name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter college name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Email <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    required
                                    placeholder="official@college.edu"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 p-6 pt-0">
                            <button type="button" onClick={() => setIsDialogOpen(false)} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                            <button
                                onClick={handleSave}
                                disabled={isCreating || isUpdating}
                                className="px-6 py-2 bg-[#2C4276] text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 flex items-center gap-2 shadow-md transition-all font-semibold"
                            >
                                {(isCreating || isUpdating) && <Loader2 className="animate-spin" size={16} />}
                                {selectedCollege ? "Update College" : "Save College"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
