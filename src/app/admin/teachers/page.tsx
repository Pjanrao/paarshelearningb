"use client";

import { useState, useEffect } from "react";
import { Eye, Pencil, Trash2, Plus, Search, Loader2, X, Star, CheckCircle, XCircle, BookOpen, Layers, AlertCircle } from "lucide-react";
import { toast } from "sonner";

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
    approvalStatus?: string;
    userId?: string;
}

interface TeacherFormData {
    name: string;
    email: string;
    contact: string;
    password?: string;
    avatar: string;
    designation: string;
    course: string;
    experience: string;
    dateOfJoining: string;
    assignedCourses: string[];
    totalStudents: number;
    rating: number;
    approvalStatus?: string;
}

interface FormErrors {
    [key: string]: string;
}

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [teachersPerPage, setTeachersPerPage] = useState<number | "all">(10);
    const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("all");

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
    const [selectedTeacherForAssign, setSelectedTeacherForAssign] = useState<Teacher | null>(null);
    const [isAssignCourseModalOpen, setIsAssignCourseModalOpen] = useState(false);
    const [isAssignBatchModalOpen, setIsAssignBatchModalOpen] = useState(false);
    const [courses, setCourses] = useState<any[]>([]);
    const [courseSearch, setCourseSearch] = useState("");
    const [availableBatches, setAvailableBatches] = useState<any[]>([]);
    const [selectedAssignedCourses, setSelectedAssignedCourses] = useState<string[]>([]);
    const [selectedBatchId, setSelectedBatchId] = useState<string>("");
    const [batchFilterCourseId, setBatchFilterCourseId] = useState<string>("");
    const [isLoadingCourses, setIsLoadingCourses] = useState(false);
    const [isLoadingBatches, setIsLoadingBatches] = useState(false);
    const [formLoading, setFormLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [deleteId, setDeleteId] = useState<{ id: string, name: string } | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [viewBatches, setViewBatches] = useState<any[]>([]);
    const [isLoadingViewBatches, setIsLoadingViewBatches] = useState(false);

    const [formData, setFormData] = useState<TeacherFormData>({
        name: "",
        email: "",
        contact: "",
        password: "",
        avatar: "",
        designation: "",
        course: "",
        experience: "",
        dateOfJoining: "",
        assignedCourses: [],
        totalStudents: 0,
        rating: 0,
        approvalStatus: "approved",
    });

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) newErrors.name = "Full name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
        if (!formData.contact.trim()) newErrors.contact = "Contact number is required";
        else if (!/^\d{10}$/.test(formData.contact)) newErrors.contact = "Contact must be 10 digits";
        if (isAddModalOpen && !formData.password?.trim()) newErrors.password = "Password is required";
        if (isAddModalOpen && formData.password && formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
        if (!formData.designation.trim()) newErrors.designation = "Designation is required";
        if (!formData.course.trim()) newErrors.course = "Course domain is required";
        if (!formData.experience.trim()) newErrors.experience = "Experience is required";
        if (!formData.dateOfJoining) newErrors.dateOfJoining = "Date of joining is required";

        setFormErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const fetchTeachers = async () => {
        try {
            setLoading(true);
            const limit = teachersPerPage === "all" ? 99999 : teachersPerPage;
            setErrorMsg(null);
            const statusParam = activeTab !== "all" ? `&status=${activeTab}` : "";
            const response = await fetch(
                `/api/teachers?search=${searchQuery}&page=${currentPage}&limit=${limit}${statusParam}`
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
    }, [searchQuery, currentPage, teachersPerPage, activeTab]);

    const handleAddTeacher = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fix validation errors ❌");
            return;
        }

        setFormLoading(true);

        try {
            const response = await fetch("/api/teachers/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Teacher registered successfully ✅");
                setIsAddModalOpen(false);
                resetForm();
                fetchTeachers();
            } else {
                setFormErrors({ submit: data.message || "Failed to create teacher" });
                toast.error(data.message || "Registration failed ❌");
            }
        } catch (error) {
            console.error("Error creating teacher:", error);
            setFormErrors({ submit: "Failed to create teacher" });
            toast.error("An error occurred ❌");
        } finally {
            setFormLoading(false);
        }
    };

    const handleEditTeacher = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTeacher) return;

        if (!validateForm()) {
            toast.error("Please fix validation errors ❌");
            return;
        }

        setFormLoading(true);

        try {
            const updateData = { ...formData };
            // Don't send password on edit if empty
            if (!updateData.password) {
                delete updateData.password;
            }

            const response = await fetch(`/api/teachers/${selectedTeacher._id}/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData),
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Teacher updated successfully ✅");
                setIsEditModalOpen(false);
                resetForm();
                fetchTeachers();
            } else {
                setFormErrors({ submit: data.message || "Failed to update teacher" });
                toast.error(data.message || "Update failed ❌");
            }
        } catch (error) {
            console.error("Error updating teacher:", error);
            setFormErrors({ submit: "Failed to update teacher" });
            toast.error("An error occurred ❌");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteTeacher = async () => {
        if (!deleteId) return;
        setDeleteLoading(true);
        try {
            const response = await fetch(`/api/teachers/${deleteId.id}/`, {
                method: "DELETE",
            });

            if (response.ok) {
                toast.success("Teacher deleted successfully ✅");
                fetchTeachers();
                setDeleteId(null);
            } else {
                toast.error("Failed to delete teacher ❌");
            }
        } catch (error) {
            console.error("Error deleting teacher:", error);
            toast.error("An error occurred ❌");
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, status: string) => {
        try {
            const response = await fetch(`/api/teachers/${id}/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ approvalStatus: status }),
            });
            if (response.ok) {
                toast.success(`Teacher status updated to ${status} ✅`);
                fetchTeachers();
            } else {
                toast.error("Failed to update status ❌");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("An error occurred ❌");
        }
    };

    const openAddModal = () => {
        resetForm();
        setFormErrors({});
        setIsAddModalOpen(true);
        fetchCourses();
    };

    const openEditModal = (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setFormData({
            name: teacher.name,
            email: teacher.email,
            contact: teacher.contact || "",
            password: "",
            avatar: teacher.avatar || "",
            designation: teacher.designation || "",
            course: teacher.course || "",
            experience: teacher.experience || "",
            dateOfJoining: teacher.dateOfJoining || "",
            assignedCourses: teacher.assignedCourses || [],
            totalStudents: teacher.totalStudents || 0,
            rating: teacher.rating || 0,
        });
        setFormErrors({});
        setIsEditModalOpen(true);
        fetchCourses();
    };

    const openViewModal = async (teacher: Teacher) => {
        setSelectedTeacher(teacher);
        setIsViewModalOpen(true);
        setViewBatches([]);
        if (teacher.userId) {
            setIsLoadingViewBatches(true);
            try {
                const res = await fetch(`/api/batches?assignedTeacher=${teacher.userId}`);
                if (res.ok) {
                    const data = await res.json();
                    setViewBatches(data.batches || data || []);
                }
            } catch (err) {
                console.error("Failed to fetch teacher batches:", err);
            } finally {
                setIsLoadingViewBatches(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            contact: "",
            password: "",
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
        setFormErrors({});
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

    const fetchCourses = async () => {
        try {
            setIsLoadingCourses(true);
            const response = await fetch("/api/courses?limit=200&page=1");
            if (!response.ok) throw new Error("Failed to load courses");
            const data = await response.json();
            setCourses(data.courses || []);
        } catch (error) {
            console.error("Error loading courses:", error);
        } finally {
            setIsLoadingCourses(false);
        }
    };

    const fetchBatches = async (courseId?: string) => {
        try {
            setIsLoadingBatches(true);
            const query = courseId ? `?courseId=${courseId}` : "";
            const response = await fetch(`/api/batches${query}`);
            if (!response.ok) throw new Error("Failed to load batches");
            const data = await response.json();
            setAvailableBatches(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error loading batches:", error);
        } finally {
            setIsLoadingBatches(false);
        }
    };

    const openAssignCourseModal = (teacher: Teacher) => {
        setSelectedTeacherForAssign(teacher);
        setSelectedAssignedCourses(teacher.assignedCourses || []);
        setCourseSearch("");
        setIsAssignCourseModalOpen(true);
        fetchCourses();
    };

    const openAssignBatchModal = async (teacher: Teacher) => {
        setSelectedTeacherForAssign(teacher);
        setSelectedBatchId("");
        setBatchFilterCourseId("");
        setCourseSearch("");
        setIsAssignBatchModalOpen(true);
        await fetchCourses();
        await fetchBatches();
    };

    const toggleCourseSelection = (courseName: string) => {
        setSelectedAssignedCourses((prev) =>
            prev.includes(courseName)
                ? prev.filter((item) => item !== courseName)
                : [...prev, courseName]
        );
    };

    const handleAssignCoursesSave = async () => {
        if (!selectedTeacherForAssign) return;
        try {
            const response = await fetch(`/api/teachers/${selectedTeacherForAssign._id}/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ assignedCourses: selectedAssignedCourses }),
            });
            if (!response.ok) throw new Error("Failed to save assigned courses");
            toast.success("Courses assigned successfully ✅");
            setIsAssignCourseModalOpen(false);
            setSelectedTeacherForAssign(null);
            fetchTeachers();
        } catch (error) {
            console.error("Error assigning courses:", error);
            toast.error("Failed to assign courses ❌");
        }
    };

    const handleAssignBatchSave = async () => {
        if (!selectedTeacherForAssign || !selectedBatchId) {
            toast.error("Please select a batch to assign ⚠️");
            return;
        }

        const teacherUserId = selectedTeacherForAssign.userId ? String(selectedTeacherForAssign.userId) : "";
        if (!teacherUserId) {
            toast.error("Teacher account is not ready ⚠️");
            return;
        }

        try {
            const response = await fetch(`/api/batches/${selectedBatchId}/`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ assignedTeacher: teacherUserId }),
            });
            if (!response.ok) throw new Error("Failed to assign batch");
            toast.success("Batch assigned successfully ✅");
            setIsAssignBatchModalOpen(false);
            setSelectedTeacherForAssign(null);
            setSelectedBatchId("");
            fetchTeachers();
        } catch (error) {
            console.error("Error assigning batch:", error);
            toast.error("Failed to assign batch ❌");
        }
    };

    const handleBatchCourseFilterChange = async (courseId: string) => {
        setBatchFilterCourseId(courseId);
        await fetchBatches(courseId);
    };

    const filteredCourses = courses.filter((course) =>
        course.name?.toLowerCase().includes(courseSearch.toLowerCase())
    );

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

                {/* Tabs */}
                <div className="flex gap-2 mt-4 flex-wrap">
                    {(["all", "pending", "approved", "rejected"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
                            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all capitalize ${activeTab === tab
                                ? tab === "pending" ? "bg-yellow-500 text-white border-yellow-500"
                                    : tab === "approved" ? "bg-green-600 text-white border-green-600"
                                        : tab === "rejected" ? "bg-red-500 text-white border-red-500"
                                            : "bg-[#2C4276] text-white border-[#2C4276]"
                                : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                                }`}
                        >
                            {tab === "all" ? "All Teachers" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
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
                        <div className="overflow-x-auto border-x border-b border-gray-200 rounded-b-xl">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">#</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Teacher</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Contact</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Role & Exp</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Students</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Joined</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Rating</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {teachers.map((teacher, index) => (
                                        <tr key={teacher._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-mono">
                                                {(currentPage - 1) * (teachersPerPage as number) + index + 1}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
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
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                <div className="text-sm font-semibold text-gray-900">{teacher.email}</div>
                                                <div className="text-xs text-gray-500">{teacher.contact || "N/A"}</div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                <div className="font-semibold text-gray-900">{teacher.designation || "N/A"}</div>
                                                <div className="text-xs text-gray-400 uppercase tracking-wide">{teacher.experience || "N/A"} Exp</div>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                <span className="font-semibold text-gray-900">{teacher.totalStudents || 0}</span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                                                {formatDate(teacher.dateOfJoining || teacher.createdAt)}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                <span className="bg-yellow-50 text-yellow-700 border border-yellow-100 px-2 py-1 rounded-full font-semibold flex items-center gap-1 w-fit">
                                                    <Star size={12} className="fill-yellow-700" /> {teacher.rating || 0}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                <span className={`px-2 py-1 rounded-full font-semibold text-xs ${teacher.approvalStatus === "pending" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                                                    teacher.approvalStatus === "rejected" ? "bg-red-100 text-red-800 border-red-200" :
                                                        "bg-green-100 text-green-800 border-green-200"
                                                    } border`}>
                                                    {teacher.approvalStatus ? teacher.approvalStatus.charAt(0).toUpperCase() + teacher.approvalStatus.slice(1) : "Approved"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-2">
                                                    {teacher.approvalStatus === "pending" && (
                                                        <>
                                                            <button onClick={() => handleStatusUpdate(teacher._id, "approved")} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Approve"><CheckCircle size={18} /></button>
                                                            <button onClick={() => handleStatusUpdate(teacher._id, "rejected")} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject"><XCircle size={18} /></button>
                                                        </>
                                                    )}
                                                    <button onClick={() => openAssignCourseModal(teacher)} className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors" title="Assign Courses"><BookOpen size={18} /></button>
                                                    <button onClick={() => openAssignBatchModal(teacher)} className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors" title="Assign Batch"><Layers size={18} /></button>
                                                    <button onClick={() => openViewModal(teacher)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details"><Eye size={18} /></button>
                                                    <button onClick={() => openEditModal(teacher)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Edit Teacher"><Pencil size={18} /></button>
                                                    <button onClick={() => setDeleteId({ id: teacher._id, name: teacher.name })} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="Delete Teacher"><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 border-t bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3 font-medium order-2 md:order-1">
                                <div className="text-sm text-gray-600">
                                    Showing <span className="font-bold text-gray-900">{(currentPage - 1) * (teachersPerPage as number) + 1}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * (teachersPerPage as number), total)}</span> of <span className="font-bold text-gray-900">{total}</span> teachers
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <span>Show:</span>
                                    <select
                                        value={teachersPerPage}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setTeachersPerPage(val === "all" ? "all" : Number(val));
                                            setCurrentPage(1);
                                        }}
                                        className="border px-2 py-1 rounded-lg text-sm bg-white"
                                    >
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                        <option value={50}>50</option>
                                        <option value="all">All</option>
                                    </select>
                                </div>
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
                            {formErrors.submit && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                                    <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <p className="text-sm font-medium text-red-800">{formErrors.submit}</p>
                                    </div>
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                                <input type="text" required value={formData.name} onChange={(e) => { setFormData({ ...formData, name: e.target.value }); if (formErrors.name) setFormErrors({ ...formErrors, name: "" }); }} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 ${formErrors.name ? "border-red-300 bg-red-50" : "border-gray-300"}`} placeholder="Enter full name" />
                                {formErrors.name && <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                                    <input type="email" required value={formData.email} onChange={(e) => { setFormData({ ...formData, email: e.target.value }); if (formErrors.email) setFormErrors({ ...formErrors, email: "" }); }} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 ${formErrors.email ? "border-red-300 bg-red-50" : "border-gray-300"}`} placeholder="email@example.com" />
                                    {formErrors.email && <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number <span className="text-red-500">*</span></label>
                                    <input type="text" required value={formData.contact} onChange={(e) => { setFormData({ ...formData, contact: e.target.value }); if (formErrors.contact) setFormErrors({ ...formErrors, contact: "" }); }} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 ${formErrors.contact ? "border-red-300 bg-red-50" : "border-gray-300"}`} placeholder="10-digit number"
                                        maxLength={10}
                                        minLength={10}
                                        onInput={(e: React.FormEvent<HTMLInputElement>) => {
                                            const target = e.target as HTMLInputElement;
                                            target.value = target.value.replace(/[^0-9]/g, "");
                                        }} />
                                    {formErrors.contact && <p className="mt-1 text-sm text-red-600">{formErrors.contact}</p>}
                                </div>
                            </div>

                            {isAddModalOpen && (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Password <span className="text-red-500">*</span></label>
                                    <input type="password" required={isAddModalOpen} value={formData.password || ""} onChange={(e) => { setFormData({ ...formData, password: e.target.value }); if (formErrors.password) setFormErrors({ ...formErrors, password: "" }); }} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 ${formErrors.password ? "border-red-300 bg-red-50" : "border-gray-300"}`} placeholder="Minimum 6 characters" />
                                    {formErrors.password && <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>}
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Designation <span className="text-red-500">*</span></label>
                                    <input type="text" required value={formData.designation} onChange={(e) => { setFormData({ ...formData, designation: e.target.value }); if (formErrors.designation) setFormErrors({ ...formErrors, designation: "" }); }} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 ${formErrors.designation ? "border-red-300 bg-red-50" : "border-gray-300"}`} placeholder="e.g. Senior Instructor" />
                                    {formErrors.designation && <p className="mt-1 text-sm text-red-600">{formErrors.designation}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Primary Course <span className="text-red-500">*</span></label>
                                    {isLoadingCourses ? (
                                        <div className="mt-1 flex items-center gap-2 text-gray-500">
                                            <Loader2 size={16} className="animate-spin" />
                                            <span>Loading courses...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <select required value={formData.course} onChange={(e) => { setFormData({ ...formData, course: e.target.value }); if (formErrors.course) setFormErrors({ ...formErrors, course: "" }); }} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${formErrors.course ? "border-red-300 bg-red-50" : "border-gray-300"}`}>
                                                <option value="">Select a course</option>
                                                {courses.map((course) => (
                                                    <option key={course._id} value={course.name}>
                                                        {course.name}
                                                    </option>
                                                ))}
                                            </select>
                                            {formErrors.course && <p className="mt-1 text-sm text-red-600">{formErrors.course}</p>}
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Experience (Years) <span className="text-red-500">*</span></label>
                                    <input type="text" required value={formData.experience} onChange={(e) => { setFormData({ ...formData, experience: e.target.value }); if (formErrors.experience) setFormErrors({ ...formErrors, experience: "" }); }} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-400 ${formErrors.experience ? "border-red-300 bg-red-50" : "border-gray-300"}`} placeholder="e.g. 5+" />
                                    {formErrors.experience && <p className="mt-1 text-sm text-red-600">{formErrors.experience}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Joining <span className="text-red-500">*</span></label>
                                    <input type="date" required value={formData.dateOfJoining} onChange={(e) => { setFormData({ ...formData, dateOfJoining: e.target.value }); if (formErrors.dateOfJoining) setFormErrors({ ...formErrors, dateOfJoining: "" }); }} className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all ${formErrors.dateOfJoining ? "border-red-300 bg-red-50" : "border-gray-300"}`} />
                                    {formErrors.dateOfJoining && <p className="mt-1 text-sm text-red-600">{formErrors.dateOfJoining}</p>}
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

            {isAssignCourseModalOpen && selectedTeacherForAssign && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <div>
                                <h2 className="text-xl font-bold text-[#2C4276]">Assign Courses to {selectedTeacherForAssign.name}</h2>
                                <p className="text-sm text-gray-500">Select courses for this teacher from the available list.</p>
                            </div>
                            <button onClick={() => setIsAssignCourseModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">Available Courses</label>
                                <input
                                    type="text"
                                    value={courseSearch}
                                    placeholder="Search courses..."
                                    onChange={(e) => setCourseSearch(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                />
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {isLoadingCourses ? (
                                    <div className="col-span-full p-8 text-center text-gray-500">Loading courses...</div>
                                ) : filteredCourses.length === 0 ? (
                                    <div className="col-span-full p-8 text-center text-gray-500">No courses available.</div>
                                ) : (
                                    filteredCourses.map((course) => {
                                        const isSelected = selectedAssignedCourses.includes(course.name);
                                        return (
                                            <button
                                                key={course._id}
                                                type="button"
                                                onClick={() => toggleCourseSelection(course.name)}
                                                className={`w-full text-left p-4 rounded-2xl border transition-all ${isSelected ? "border-[#2C4276] bg-[#EFF6FF]" : "border-gray-200 bg-white hover:border-[#2C4276]"}`}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{course.name}</p>
                                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{course.shortDescription || "No description provided."}</p>
                                                    </div>
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${isSelected ? "bg-[#2C4276] text-white" : "bg-gray-100 text-gray-600"}`}>
                                                        {isSelected ? "Selected" : "Select"}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                            <button onClick={() => { setIsAssignCourseModalOpen(false); setSelectedTeacherForAssign(null); }} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                            <button onClick={handleAssignCoursesSave} className="px-6 py-2 bg-[#2C4276] text-white rounded-lg hover:bg-opacity-90 transition-all font-semibold">Save Courses</button>
                        </div>
                    </div>
                </div>
            )}

            {isAssignBatchModalOpen && selectedTeacherForAssign && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <div>
                                <h2 className="text-xl font-bold text-[#2C4276]">Assign Batch to {selectedTeacherForAssign.name}</h2>
                                <p className="text-sm text-gray-500">Choose an available batch for the selected teacher.</p>
                            </div>
                            <button onClick={() => setIsAssignBatchModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by course</label>
                                    <select
                                        value={batchFilterCourseId}
                                        onChange={(e) => handleBatchCourseFilterChange(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    >
                                        <option value="">All courses</option>
                                        {courses.map((course) => (
                                            <option key={course._id} value={course._id}>{course.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex items-end gap-2">
                                    <button type="button" onClick={() => { setBatchFilterCourseId(""); fetchBatches(); }} className="w-full px-4 py-2 bg-gray-100 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-200 transition-colors">Reset Filter</button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {!selectedTeacherForAssign?.userId && (
                                    <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-sm text-orange-700">
                                        This teacher does not have a linked user account yet. Batch assignment requires a teacher user ID to be set.
                                    </div>
                                )}
                                {isLoadingBatches ? (
                                    <div className="p-6 text-center text-gray-500">Loading batches...</div>
                                ) : availableBatches.length === 0 ? (
                                    <div className="p-6 text-center text-gray-500">No batches available.</div>
                                ) : (
                                    availableBatches.map((batch) => {
                                        const assignedTeacherId = batch.assignedTeacher ? String(batch.assignedTeacher) : "";
                                        const teacherUserId = selectedTeacherForAssign?.userId ? String(selectedTeacherForAssign.userId) : "";
                                        const alreadyAssignedToTeacher = assignedTeacherId !== "" && assignedTeacherId === teacherUserId;
                                        const isDisabled = assignedTeacherId !== "" && !alreadyAssignedToTeacher;
                                        return (
                                            <button
                                                key={batch._id}
                                                type="button"
                                                onClick={() => setSelectedBatchId(batch._id)}
                                                disabled={isDisabled}
                                                className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedBatchId === batch._id ? "border-[#2C4276] bg-[#EFF6FF]" : "border-gray-200 bg-white hover:border-[#2C4276]"} ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{batch.name}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{batch.courseId?.name || "Unknown course"}</p>
                                                    </div>
                                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${alreadyAssignedToTeacher ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                                                        {alreadyAssignedToTeacher ? "Assigned" : isDisabled ? "Already assigned" : selectedBatchId === batch._id ? "Selected" : "Select"}
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
                            <button onClick={() => { setIsAssignBatchModalOpen(false); setSelectedTeacherForAssign(null); setSelectedBatchId(""); }} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                            <button onClick={handleAssignBatchSave} disabled={!selectedBatchId || !selectedTeacherForAssign?.userId} className="px-6 py-2 bg-[#2C4276] text-white rounded-lg hover:bg-opacity-90 transition-all font-semibold disabled:opacity-50">Save Batch</button>
                        </div>
                    </div>
                </div>
            )}

            {isViewModalOpen && selectedTeacher && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-5 py-3 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-base font-bold text-[#2C4276]">Teacher Profile Summary</h2>
                            <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
                        </div>
                        <div className="p-4 space-y-3">
                            {/* Inline avatar + name + badges */}
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2C4276] to-blue-500 flex items-center justify-center text-white text-xl font-bold shadow-md border-2 border-white overflow-hidden flex-shrink-0">
                                    {selectedTeacher.avatar ? (
                                        <img src={selectedTeacher.avatar} alt={selectedTeacher.name} className="w-full h-full object-cover" />
                                    ) : (
                                        selectedTeacher.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-gray-900 leading-tight">{selectedTeacher.name}</h3>
                                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-blue-100">{selectedTeacher.designation || "Faculty"}</span>
                                        <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100">{selectedTeacher.course}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-2 gap-2">
                                <div className="bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                                    <p className="text-gray-400 text-[9px] font-bold uppercase">Experience</p>
                                    <p className="text-sm font-bold text-gray-900">{selectedTeacher.experience || "N/A"}</p>
                                </div>
                                <div className="bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                                    <p className="text-gray-400 text-[9px] font-bold uppercase">Avg Rating</p>
                                    <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                                        <Star size={13} className="fill-yellow-500 text-yellow-500" /> {selectedTeacher.rating || 0}
                                    </p>
                                </div>
                            </div>

                            {/* Info rows */}
                            <div className="bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 space-y-2">
                                {[
                                    { label: "Email Address", value: selectedTeacher.email, truncate: true },
                                    { label: "Contact No", value: selectedTeacher.contact || "N/A" },
                                    { label: "Joining Date", value: formatDate(selectedTeacher.dateOfJoining || selectedTeacher.createdAt) },
                                    { label: "Total Managed", value: `${selectedTeacher.totalStudents || 0} Students`, highlight: true },
                                ].map(({ label, value, truncate, highlight }) => (
                                    <div key={label} className="flex justify-between items-center text-xs">
                                        <span className="text-gray-500 font-medium">{label}</span>
                                        <span className={`font-bold ${highlight ? "text-[#2C4276]" : "text-gray-900"} ${truncate ? "max-w-[160px] truncate" : ""}`}>{value}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Expertise */}
                            <div className="bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                                <span className="text-gray-400 text-[9px] font-bold uppercase block mb-1.5 tracking-widest">Expertise In</span>
                                <div className="flex flex-wrap gap-1.5">
                                    {selectedTeacher.assignedCourses?.map((course: string, idx: number) => (
                                        <span key={idx} className="bg-white px-2 py-0.5 border border-gray-200 rounded-lg text-[10px] font-bold text-gray-700 shadow-sm">{course}</span>
                                    )) || <span className="text-gray-400 italic text-xs">No courses assigned</span>}
                                </div>
                            </div>

                            {/* Assigned Batches */}
                            <div className="bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                                <span className="text-gray-400 text-[9px] font-bold uppercase block mb-1.5 tracking-widest">Assigned Batches</span>
                                {isLoadingViewBatches ? (
                                    <div className="flex items-center gap-2 text-gray-400 text-xs py-1">
                                        <Loader2 size={12} className="animate-spin" /> Loading batches...
                                    </div>
                                ) : viewBatches.length === 0 ? (
                                    <span className="text-gray-400 italic text-xs">No batches assigned</span>
                                ) : (
                                    <div className="space-y-1.5">
                                        {viewBatches.map((batch: any) => (
                                            <div key={batch._id} className="bg-white px-3 py-2 border border-gray-200 rounded-lg shadow-sm flex items-center justify-between gap-2">
                                                <div className="min-w-0">
                                                    <p className="text-[11px] font-bold text-gray-900 truncate">{batch.name}</p>
                                                    <p className="text-[10px] text-gray-500 truncate">{batch.courseId?.name || "—"}</p>
                                                </div>
                                                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${batch.status === "Active" ? "bg-green-50 text-green-700 border border-green-100" :
                                                        batch.status === "Completed" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                                                            "bg-yellow-50 text-yellow-700 border border-yellow-100"
                                                    }`}>{batch.status || "Active"}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2 pt-1">
                                <button
                                    onClick={() => { setIsViewModalOpen(false); openEditModal(selectedTeacher); }}
                                    className="flex-1 py-2 bg-[#2C4276] text-white rounded-xl text-sm font-bold hover:bg-opacity-90 transition-all shadow-md active:scale-95"
                                >
                                    Modify Profile
                                </button>
                                <button
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="px-5 py-2 border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="max-w-md bg-white rounded-[2rem] p-0 overflow-hidden border-none shadow-2xl">
                    <div className="p-8 text-center bg-white space-y-6">
                        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-red-50/50">
                            <Trash2 className="text-red-600" size={32} />
                        </div>
                        <div className="space-y-2">
                            <AlertDialogTitle className="text-2xl font-black text-gray-900 tracking-tight">
                                Delete Teacher?
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm font-medium text-gray-400">
                                Are you sure you want to delete <span className="text-red-500 font-bold">{deleteId?.name}</span>? This action cannot be undone and will permanently delete the teacher from the system.
                            </AlertDialogDescription>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleDeleteTeacher}
                                disabled={deleteLoading}
                                className="w-full py-4 bg-red-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-red-200 disabled:opacity-50 active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {deleteLoading ? <Loader2 className="animate-spin" size={20} /> : <Trash2 size={18} />}
                                Confirm Delete
                            </button>
                            <button
                                onClick={() => setDeleteId(null)}
                                className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 bg-transparent hover:bg-gray-50 rounded-2xl transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
