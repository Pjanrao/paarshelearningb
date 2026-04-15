"use client";

import { useState, useEffect } from "react";
import { Eye, Pencil, Trash2, Plus, Search, Loader2, X } from "lucide-react";
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

interface Student {
    _id: string;
    name: string;
    email: string;
    contact: string;
    avatar?: string;
    status: string;
    deletionReason?: string;
    createdAt: string;
}

interface StudentFormData {
    name: string;
    email: string;
    contact: string;
    avatar: string;
}

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const [studentsPerPage, setStudentsPerPage] = useState<number | "all">(10);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<{ id: string, name: string } | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const [formData, setFormData] = useState<StudentFormData>({
        name: "",
        email: "",
        contact: "",
        avatar: "",
    });

    const fetchStudents = async () => {
        try {
            setLoading(true);
            setErrorMsg(null);
            const limit = studentsPerPage === "all" ? 99999 : studentsPerPage;
            const response = await fetch(
                `/api/students?search=${searchQuery}&page=${currentPage}&limit=${limit}`
            );

            if (!response.ok) {
                if (response.status === 404) throw new Error("API endpoint not found (404)");
                throw new Error(`Failed to fetch: ${response.statusText}`);
            }

            const data = await response.json();
            setStudents(data.students || []);
            setTotalPages(data.pagination?.totalPages || 1);
            setTotal(data.pagination?.total || 0);
        } catch (error: any) {
            console.error("Error fetching students:", error);
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchStudents();
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery, currentPage, studentsPerPage]);

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);

        try {
            const response = await fetch("/api/students", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsAddModalOpen(false);
                resetForm();
                fetchStudents();
            } else {
                alert("Failed to create student");
            }
        } catch (error) {
            console.error("Error creating student:", error);
            alert("Failed to create student");
        } finally {
            setFormLoading(false);
        }
    };

    const handleEditStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStudent) return;

        setFormLoading(true);

        try {
            const response = await fetch(`/api/students/${selectedStudent._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setIsEditModalOpen(false);
                resetForm();
                fetchStudents();
            } else {
                alert("Failed to update student");
            }
        } catch (error) {
            console.error("Error updating student:", error);
            alert("Failed to update student");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteStudent = async () => {
        if (!deleteId) return;
        setDeleteLoading(true);
        try {
            const response = await fetch(`/api/students/${deleteId.id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchStudents();
                setDeleteId(null);
            } else {
                alert("Failed to delete student");
            }
        } catch (error) {
            console.error("Error deleting student:", error);
            alert("Failed to delete student");
        } finally {
            setDeleteLoading(false);
        }
    };

    // const openAddModal = () => {
    //     resetForm();
    //     setIsAddModalOpen(true);
    // };

    const openEditModal = (student: Student) => {
        setSelectedStudent(student);
        setFormData({
            name: student.name,
            email: student.email,
            contact: student.contact || "",
            avatar: student.avatar || "",
        });
        setIsEditModalOpen(true);
    };

    const openViewModal = (student: Student) => {
        setSelectedStudent(student);
        setIsViewModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            contact: "",
            avatar: "",
        });
        setSelectedStudent(null);
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-3xl font-bold text-[#2C4276]">Student Management</h1>
                    <div className="flex gap-4 w-full md:w-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="pl-10 pr-4 py-2 rounded-lg border-0 focus:ring-2 focus:ring-white w-64 shadow-md"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                        </div>
                        {/* <button
                            onClick={openAddModal}
                            className="bg-[#2C4276] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 shadow-sm font-medium">
                            <Plus size={20} />
                            Add Student
                        </button> */}
                    </div>
                </div>
            </div>

            {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
                    <p>Error: {errorMsg}</p>
                    <button onClick={fetchStudents} className="text-sm font-bold underline">Retry</button>
                </div>
            )}

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-blue-600" size={40} />
                        <p className="text-gray-500 animate-pulse">Loading students...</p>
                    </div>
                ) : students.length === 0 ? (
                    <div className="text-center py-20 px-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-gray-400" size={32} />
                        </div>
                        <p className="text-gray-500 text-lg font-medium">No students found</p>
                        <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">
                            {searchQuery
                                ? "We couldn't find any students matching your search. Try a different term."
                                : "The student directory is currently empty."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="custom-scrollbar-container overflow-y-auto h-[450px] sm:max-h-[600px] border rounded-lg pb-4 sm:pb-0">
                            <table className="w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 border-b sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student Account Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {students.map((student, index) => (
                                        <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                                {(currentPage - 1) * studentsPerPage + index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2C4276] to-blue-500 flex items-center justify-center text-white font-bold shadow-inner uppercase">
                                                        {student.avatar ? (
                                                            <img
                                                                src={student.avatar}
                                                                alt={student.name}
                                                                className="w-full h-full rounded-full object-cover"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                                }}
                                                            />
                                                        ) : (
                                                            student.name.charAt(0).toUpperCase()
                                                        )}
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{student.contact || "N/A"}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(student.createdAt)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {student.status === "deleted" ? (
                                                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase tracking-wider">Account Deleted</span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">Account Active</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-2">
                                                    <button onClick={() => openViewModal(student)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="View Details"><Eye size={18} /></button>
                                                    <button onClick={() => openEditModal(student)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Student"><Pencil size={18} /></button>
                                                    <button onClick={() => setDeleteId({ id: student._id, name: student.name })} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Student"><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="text-sm text-gray-600">
                                    {total === 0 ? (
                                        "Showing 0 to 0 of 0 students"
                                    ) : (
                                        <>
                                            Showing <span className="font-medium">{(currentPage - 1) * studentsPerPage + 1}</span> to{" "}
                                            <span className="font-medium">{Math.min(currentPage * studentsPerPage, total)}</span> of{" "}
                                            <span className="font-medium">{total}</span> students
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <span>Show:</span>
                                    <select
                                        value={studentsPerPage}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setStudentsPerPage(val === "all" ? "all" : Number(val));
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
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                >
                                    Previous
                                </button>
                                <div className="flex items-center gap-1">
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
                                                className={`w-10 h-10 rounded-lg text-sm transition-colors ${currentPage === pageNum ? "bg-[#2C4276] text-white" : "border bg-white hover:bg-gray-50 text-gray-700"
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
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
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-[#2C4276]">{isAddModalOpen ? "Register New Student" : "Update Student Info"}</h2>
                            <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                        </div>
                        <form onSubmit={isAddModalOpen ? handleAddStudent : handleEditStudent} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
                                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Enter full name" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="email@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Contact Number</label>
                                <input type="text" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="+1 234 567 890" />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                                <button type="submit" disabled={formLoading} className="px-6 py-2 bg-[#2C4276] text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 flex items-center gap-2 shadow-md transition-all font-semibold">
                                    {formLoading && <Loader2 className="animate-spin" size={16} />}
                                    {isAddModalOpen ? "Create Student" : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isViewModalOpen && selectedStudent && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-[#2C4276]">Student Profile</h2>
                            <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2C4276] to-blue-500 flex items-center justify-center text-white text-4xl font-bold mb-4 shadow-lg border-4 border-white">
                                    {selectedStudent.avatar ? (
                                        <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-full h-full rounded-full object-cover" />
                                    ) : (
                                        selectedStudent.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">{selectedStudent.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider">Student</span>
                                </div>
                            </div>
                            <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div className="flex justify-between items-center group">
                                    <span className="text-gray-500 text-sm font-medium">Email</span>
                                    <span className="text-gray-900 font-semibold">{selectedStudent.email}</span>
                                </div>
                                <div className="flex justify-between items-center group">
                                    <span className="text-gray-500 text-sm font-medium">Contact</span>
                                    <span className="text-gray-900 font-semibold">{selectedStudent.contact || "N/A"}</span>
                                </div>
                                <div className="flex justify-between items-center group">
                                    <span className="text-gray-500 text-sm font-medium">Member Since</span>
                                    <span className="text-gray-900 font-semibold">{formatDate(selectedStudent.createdAt)}</span>
                                </div>
                                <div className="flex justify-between items-center group">
                                    <span className="text-gray-500 text-sm font-medium">User ID</span>
                                    <span className="text-gray-900 font-mono text-xs">{selectedStudent._id}</span>
                                </div>
                                {selectedStudent.status === "deleted" && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <span className="text-red-500 text-sm font-bold uppercase tracking-wider block mb-2">Reason of account delete</span>
                                        <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-gray-700 text-sm italic">
                                            "{selectedStudent.deletionReason || "No reason provided"}"
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => { setIsViewModalOpen(false); openEditModal(selectedStudent); }}
                                    className="flex-1 px-4 py-2 bg-[#2C4276] text-white rounded-lg hover:bg-opacity-90 font-bold shadow-md transition-all"
                                >
                                    Edit Profile
                                </button>
                                <button
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                                >
                                    Close
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
                            Delete Student
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-gray-500 leading-relaxed">
                            Are you sure you want to delete <span className="font-bold text-gray-800">{deleteId?.name}</span>? This action cannot be undone and will permanently delete the student from the system.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex justify-center gap-3 mt-4">
                        <Button variant="outline" onClick={() => setDeleteId(null)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteStudent}
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
