"use client";

import { useState, useEffect } from "react";
import { Eye, Pencil, Trash2, Plus, Search, Loader2, X, Star } from "lucide-react";
import DeleteCourseDialog from "@/components/dashboard/courses/DeleteCourseDialog";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface Teacher {
    _id: string;
    name: string;
    email: string;
    contact: string;
    avatar?: string;
    designation: string;
    course: string;
    experience: string;
    dateOfJoining: string;
    assignedCourses: string[];
    totalStudents: number;
    rating: number;
    createdAt: string;
}

interface TeacherFormData {
    name: string;
    email: string;
    contact: string;
    avatar: string;
    designation: string;
    course: string;
    experience: string;
    dateOfJoining: string;
    assignedCourses: string[];
    totalStudents: number;
    rating: number;
}

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const teachersPerPage = 10;

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<{ id: string, name: string } | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [formData, setFormData] = useState<TeacherFormData>({
        name: "",
        email: "",
        contact: "",
        avatar: "",
        designation: "",
        course: "",
        experience: "",
        dateOfJoining: "",
        assignedCourses: [],
        totalStudents: 0,
        rating: 0,
    });

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            setErrorMsg(null);
            const response = await fetch(
                `/api/teachers?search=${searchQuery}&page=${currentPage}&limit=${teachersPerPage}`
            );

            if (!response.ok) {
                if (response.status === 404) throw new Error("API endpoint not found (404)");
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }

            const data = await response.json();
            setTeachers(data.teachers || []);
            setTotalPages(data.pagination?.totalPages || 1);
            setTotal(data.pagination?.total || 0);
        } catch (error: any) {
            console.error("Error fetching teachers:", error);
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchTeachers();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery, currentPage]);

    const handleAddTeacher = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const response = await fetch("/api/teachers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsAddModalOpen(false);
                resetForm();
                fetchTeachers();
            } else {
                alert("Failed to create teacher");
            }
        } catch (error) {
            console.error("Error creating teacher:", error);
            alert("Failed to create teacher");
        } finally {
            setFormLoading(false);
        }
    };

    const handleEditTeacher = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTeacher) return;

        setFormLoading(true);

        try {
            const response = await fetch(`/api/teachers/${selectedTeacher._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsEditModalOpen(false);
                resetForm();
                fetchTeachers();
            } else {
                alert("Failed to update teacher");
            }
        } catch (error) {
            console.error("Error updating teacher:", error);
            alert("Failed to update teacher");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteTeacher = async () => {
        if (!deleteId) return;
        setDeleteLoading(true);
        try {
            const response = await fetch(`/api/teachers/${deleteId.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchTeachers();
                setDeleteId(null);
            } else {
                alert("Failed to delete teacher");
            }
        } catch (error) {
            console.error("Error deleting teacher:", error);
            alert("Failed to delete teacher");
        } finally {
            setDeleteLoading(false);
        }
    };

    const openAddModal = () => {
        resetForm();
        setIsAddModalOpen(true);
    };

    const openEditModal = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setFormData({
            name: teacher.name,
            email: teacher.email,
            contact: teacher.contact || "",
            avatar: teacher.avatar || "",
            designation: teacher.designation || "",
            course: teacher.course || "",
            experience: teacher.experience || "",
            dateOfJoining: teacher.dateOfJoining || "",
            assignedCourses: teacher.assignedCourses || [],
            totalStudents: teacher.totalStudents || 0,
            rating: teacher.rating || 0,
        });
        setIsEditModalOpen(true);
    };

    const openViewModal = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setIsViewModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            contact: "",
            avatar: "",
            designation: "",
            course: "",
            experience: "",
            dateOfJoining: "",
            assignedCourses: [],
            totalStudents: 0,
            rating: 0,
        });
        setSelectedTeacher(null);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, avatar: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? "N/A" : date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="bg-gray-50 h-full">
            <div className="mb-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C4276]">Teachers Management</h1>
                        <p className="text-gray-500 text-sm mt-1 font-medium">Manage and track faculty members and their performance</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search teachers..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-10 pr-4 py-2.5 rounded-xl border-0 focus:ring-2 focus:ring-[#2C4276]/20 w-full shadow-sm bg-white text-gray-600 outline-none transition-all"
                            />
                            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        </div>
                        <button
                            onClick={openAddModal}
                            className="bg-[#2C4276] text-white px-5 py-2.5 rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-md font-semibold active:scale-95 whitespace-nowrap"
                        >
                            <Plus size={20} />
                            <span>Add Teacher</span>
                        </button>
                    </div>
                </div>
            </div>

            {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
                    <p>Error: {errorMsg}</p>
                    <button onClick={fetchTeachers} className="text-sm font-bold underline">Retry</button>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-blue-600" size={40} />
                        <p className="text-gray-500 animate-pulse">Loading teachers...</p>
                    </div>
                ) : teachers.length === 0 ? (
                    <div className="text-center py-20 px-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-gray-400" size={32} />
                        </div>
                        <p className="text-gray-500 text-lg font-medium">No teachers found</p>
                        <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">
                            {searchQuery
                                ? "We couldn't find any teachers matching your search. Try a different term."
                                : "The teacher directory is currently empty. Click 'Add Teacher' to get started."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="custom-scrollbar-container overflow-auto h-[430px] sm:max-h-[600px] border-x rounded-t-xl">
                            <table className="w-full divide-y divide-gray-200 min-w-[1000px]">
                                <thead className="bg-gray-50 border-b sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Teacher</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role & Exp</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Courses</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Students</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {teachers.map((teacher, index) => (
                                        <tr key={teacher._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                                {(currentPage - 1) * teachersPerPage + index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2C4276] to-blue-500 flex items-center justify-center text-white font-bold shadow-inner uppercase overflow-hidden">
                                                        {teacher.avatar ? (
                                                            <img
                                                                src={teacher.avatar}
                                                                alt={teacher.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                                }}
                                                            />
                                                        ) : (
                                                            teacher.name.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div className="text-sm font-bold text-gray-900">{teacher.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-xs text-gray-600 font-medium">{teacher.email}</div>
                                                <div className="text-xs text-gray-400">{teacher.contact || "N/A"}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-xs font-bold text-gray-700">{teacher.designation || "N/A"}</div>
                                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{teacher.experience || "N/A"} Exp</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-wrap gap-1 max-w-[200px]">
                                                    {teacher.assignedCourses?.slice(0, 2).map((c, i) => (
                                                        <span key={i} className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold border border-blue-100 uppercase tracking-tight">
                                                            {c}
                                                        </span>
                                                    ))}
                                                    {teacher.assignedCourses?.length > 2 && (
                                                        <span className="text-[10px] text-gray-400 font-bold">+{teacher.assignedCourses.length - 2} more</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                <span className="font-bold text-gray-900">{teacher.totalStudents || 0}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {formatDate(teacher.dateOfJoining || teacher.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <span className="bg-yellow-50 text-yellow-700 border border-yellow-100 px-2 py-1 rounded-full font-bold flex items-center gap-1 w-fit">
                                                    <Star size={12} className="fill-yellow-700" /> {teacher.rating || 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => openViewModal(teacher)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="View Details"><Eye size={18} /></button>
                                                    <button onClick={() => openEditModal(teacher)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Teacher"><Pencil size={18} /></button>
                                                    <button onClick={() => setDeleteId({ id: teacher._id, name: teacher.name })} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Teacher"><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 border-t bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-600 font-medium order-2 md:order-1">
                                Showing <span className="font-bold text-gray-900">{(currentPage - 1) * teachersPerPage + 1}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * teachersPerPage, total)}</span> of <span className="font-bold text-gray-900">{total}</span> teachers
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

            {/* Modals */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-[#2C4276]">{isAddModalOpen ? "Register New Teacher" : "Update Teacher Information"}</h2>
                            <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                        </div>
                        <form onSubmit={isAddModalOpen ? handleAddTeacher : handleEditTeacher} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="Enter full name" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="email@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number <span className="text-red-500">*</span></label>
                                    <input type="text" required value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="10-digit number"
                                        maxLength={10}
                                        minLength={10}
                                        onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                            const target = e.target as HTMLInputElement;
                                            target.value = target.value.replace(/[^0-9]/g, "");
                                        }} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Designation <span className="text-red-500">*</span></label>
                                    <input type="text" required value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="e.g. Senior Instructor" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Course <span className="text-red-500">*</span></label>
                                    <input type="text" required value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="e.g. MERN Stack" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Experience (Years) <span className="text-red-500">*</span></label>
                                    <input type="text" required value={formData.experience} onChange={(e) => setFormData({ ...formData, experience: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="e.g. 5+" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Joining <span className="text-red-500">*</span></label>
                                    <input type="date" required value={formData.dateOfJoining} onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Assigned Courses (Comma separated)</label>
                                <input
                                    type="text"
                                    value={formData.assignedCourses.join(", ")}
                                    onChange={(e) => setFormData({ ...formData, assignedCourses: e.target.value.split(",").map(s => s.trim()) })}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400"
                                    placeholder="React, Node.js, Next.js"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Total Students</label>
                                    <input type="number" value={formData.totalStudents} onChange={(e) => setFormData({ ...formData, totalStudents: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="100" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Rating</label>
                                    <input type="number" step="0.1" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400" placeholder="4.9" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Profile Picture</label>
                                <div className="flex items-center gap-4 border p-3 rounded-lg bg-gray-50">
                                    {formData.avatar ? (
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                                            <img src={formData.avatar} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0 border-2 border-white shadow-sm">
                                            No Image
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[#2C4276] file:text-white hover:file:bg-opacity-90 transition-all cursor-pointer" />
                                </div>
                            </div>
                        </form>
                        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                            <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                            <button onClick={isAddModalOpen ? handleAddTeacher : handleEditTeacher} disabled={formLoading} className="px-6 py-2 bg-[#2C4276] text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 flex items-center gap-2 shadow-md transition-all font-semibold">
                                {formLoading && <Loader2 className="animate-spin" size={16} />}
                                {isAddModalOpen ? "Save Teacher" : "Update Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isViewModalOpen && selectedTeacher && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-[#2C4276]">Teacher Profile Summary</h2>
                            <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2C4276] to-blue-500 flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-xl border-4 border-white overflow-hidden">
                                    {selectedTeacher.avatar ? (
                                        <img src={selectedTeacher.avatar} alt={selectedTeacher.name} className="w-full h-full object-cover" />
                                    ) : (
                                        selectedTeacher.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">{selectedTeacher.name}</h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100">{selectedTeacher.designation || "Faculty"}</span>
                                    <span className="px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase tracking-widest border border-green-100">{selectedTeacher.course}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-gray-400 text-[10px] font-bold uppercase mb-1 whitespace-nowrap">Experience</p>
                                        <p className="text-lg font-bold text-gray-900">{selectedTeacher.experience || "N/A"}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-gray-400 text-[10px] font-bold uppercase mb-1 whitespace-nowrap">Avg Rating</p>
                                        <p className="text-lg font-bold text-gray-900 flex items-center gap-1">
                                            <Star size={16} className="fill-yellow-500 text-yellow-500" /> {selectedTeacher.rating || 0}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-medium">Email Address</span>
                                        <span className="text-gray-900 font-bold max-w-[180px] truncate">{selectedTeacher.email}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-medium">Contact No</span>
                                        <span className="text-gray-900 font-bold">{selectedTeacher.contact || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-medium">Joining Date</span>
                                        <span className="text-gray-900 font-bold">{formatDate(selectedTeacher.dateOfJoining || selectedTeacher.createdAt)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-medium">Total Managed</span>
                                        <span className="text-[#2C4276] font-extrabold">{selectedTeacher.totalStudents || 0} Students</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <span className="text-gray-400 text-[10px] font-bold uppercase block mb-3 tracking-widest">Expertise In</span>
                                <div className="flex flex-wrap gap-2">
                                    {selectedTeacher.assignedCourses?.map((course: string, idx: number) => (
                                        <span key={idx} className="bg-white px-3 py-1 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 shadow-sm">{course}</span>
                                    )) || <span className="text-gray-400 italic">No courses assigned</span>}
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => { setIsViewModalOpen(false); openEditModal(selectedTeacher); }}
                                    className="flex-1 py-3 bg-[#2C4276] text-white rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-lg active:scale-95"
                                >
                                    Modify Profile
                                </button>
                                <button
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
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
                            Delete Teacher
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-gray-500 leading-relaxed">
                            Are you sure you want to delete <span className="font-bold text-gray-800">{deleteId?.name}</span>? This action cannot be undone and will permanently delete the teacher from the system.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex justify-center gap-3 mt-4">
                        <Button variant="outline" onClick={() => setDeleteId(null)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteTeacher}
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
