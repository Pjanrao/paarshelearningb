"use client";

import { useState, useMemo } from "react";
import {
    Trash2,
    Loader2,
    Download,
    Search,
    User,
    X,
    Filter,
    RotateCcw,
    GraduationCap,
    Building2,
    Phone
} from "lucide-react";
import {
    useFetchEntranceStudentsQuery,
    useDeleteEntranceStudentMutation,
} from "@/redux/api";
import { toast } from "sonner";

interface Student {
    _id: string;
    name: string;
    email: string;
    phone: string;
    degree: string;
    university: string;
    city: string;
    college?: {
        name: string;
        _id: string;
    };
    createdAt: string;
}

export default function EntranceStudentsLogs() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState<number | "all">(10);
    const [filters, setFilters] = useState({ college: "all" });

    const { data: studentsData, isLoading: studentsLoading } = useFetchEntranceStudentsQuery(undefined);
    const [deleteStudent, { isLoading: isDeleting }] = useDeleteEntranceStudentMutation();

    const students = Array.isArray(studentsData?.data) ? (studentsData.data as Student[]) : [];

    const uniqueColleges = useMemo(() => {
        return Array.from(
            new Set(
                students
                    .map((student) => student.college?.name)
                    .filter((name): name is string => typeof name === "string" && name.length > 0)
            )
        ).sort();
    }, [students]);

    const filteredStudents = students.filter((student) => {
        const searchString = searchTerm.toLowerCase();
        const matchesSearch =
            (student?.name?.toLowerCase() || "").includes(searchString) ||
            (student?.email?.toLowerCase() || "").includes(searchString) ||
            (student?.phone || "").includes(searchString) ||
            (student?.city?.toLowerCase() || "").includes(searchString);
        if (!matchesSearch) return false;
        if (filters.college !== "all" && student?.college?.name !== filters.college) return false;
        return true;
    });

    const effectiveLimit = itemsPerPage === "all" ? filteredStudents.length : itemsPerPage;
    const totalPages = itemsPerPage === "all" ? 1 : Math.max(1, Math.ceil(filteredStudents.length / effectiveLimit));
    const startIndex = (currentPage - 1) * effectiveLimit;
    const displayedStudents = filteredStudents.slice(startIndex, startIndex + effectiveLimit);

    const handleConfirmDelete = async () => {
        if (!studentToDelete) return;
        try {
            const response = await deleteStudent(studentToDelete).unwrap();
            if (response.success) {
                toast.success("Student deleted successfully");
                setIsDeleteModalOpen(false);
            }
        } catch (error: any) {
            toast.error(error.data?.message || "Failed to remove student");
        }
    };

    const exportToCSV = () => {
        const headers = ["Name", "Email", "Phone", "Degree", "City", "College", "Joined Date"];
        const csvData = filteredStudents.map(student => [
            student.name,
            student.email,
            student.phone,
            student.degree,
            student.city,
            student.college?.name || "N/A",
            new Date(student.createdAt).toLocaleDateString()
        ]);
        const csvContent = [headers, ...csvData].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `entrance-students-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        toast.success("Students list exported to CSV");
    };

    const clearFilters = () => {
        setSearchTerm("");
        setFilters({ college: "all" });
        setCurrentPage(1);
    };

    return (
        <div className=" bg-gray-50 h-full">
            <div className="mb-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C4276]">Entrance Students</h1>
                        <p className="text-gray-500 text-sm mt-1 font-medium">Manage and track students registered for entrance exams</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchTerm}
                                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="pl-10 pr-4 py-2.5 rounded-xl border-0 focus:ring-2 focus:ring-[#2C4276]/20 w-full shadow-sm bg-white text-gray-600 outline-none transition-all"
                            />
                            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        </div>
                        <button
                            onClick={exportToCSV}
                            className="bg-[#2C4276] text-white px-5 py-2.5 rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-md font-semibold active:scale-95 whitespace-nowrap"
                        >
                            <Download size={18} />
                            <span>Export CSV</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border flex flex-col sm:flex-row items-center gap-4">
                <div className="flex items-center gap-2 text-[#2C4276] font-bold whitespace-nowrap">
                    <Filter size={18} />
                    <span>Filter By:</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                    <select
                        value={filters.college}
                        onChange={e => { setFilters({ ...filters, college: e.target.value }); setCurrentPage(1); }}
                        className="h-11 border rounded-xl px-4 text-sm bg-gray-50/50 focus:ring-2 focus:ring-[#2C4276]/20 outline-none w-full sm:min-w-[240px] font-medium"
                    >
                        <option value="all">All Colleges</option>
                        {uniqueColleges.map((c: string) => <option key={c} value={c}>{c}</option>)}
                    </select>

                    {(searchTerm || filters.college !== "all") && (
                        <button
                            onClick={clearFilters}
                            className="w-full sm:w-auto px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-all font-bold flex items-center justify-center gap-2 active:scale-95"
                        >
                            <RotateCcw size={14} /> Reset Filters
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {studentsLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-blue-600" size={40} />
                        <p className="text-gray-500 animate-pulse">Loading students...</p>
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="text-center py-20 px-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="text-gray-400" size={32} />
                        </div>
                        <p className="text-gray-500 text-lg font-medium">No students found</p>
                        <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">
                            {searchTerm || filters.college !== "all"
                                ? "No students match your current filters. Try resetting them."
                                : "No students registered yet for entrance exams."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="custom-scrollbar-container overflow-auto h-[335px] sm:max-h-[600px] border-x rounded-t-xl">
                            <table className="w-full divide-y divide-gray-200 min-w-[1000px]">
                                <thead className="bg-gray-50 border-b sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-[12px] font-bold text-[#2C4276] uppercase tracking-wider">Student Information</th>
                                        <th className="px-6 py-4 text-left text-[12px] font-bold text-[#2C4276] uppercase tracking-wider">Academic Background</th>
                                        <th className="px-6 py-4 text-left text-[12px] font-bold text-[#2C4276] uppercase tracking-wider">Assigned College</th>
                                        <th className="px-6 py-4 text-center text-[12px] font-bold text-[#2C4276] uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {displayedStudents.map((student) => (
                                        <tr key={student._id} className="hover:bg-gray-50/50 transition-colors border-b last:border-0 border-gray-100">
                                            <td className="px-6 py-6 whitespace-nowrap">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#2C4276] shadow-sm border border-indigo-100 font-bold uppercase">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="text-base font-bold text-[#2C4276]">{student.name}</div>
                                                        <div className="flex items-center gap-2 text-xs text-[#2C4276] opacity-70 font-medium">
                                                            <Phone size={12} className="text-gray-300" />
                                                            <span>{student.phone}</span>
                                                            <span className="text-gray-200">|</span>
                                                            <span>{student.email}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 whitespace-nowrap">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-1.5 bg-blue-50 rounded-lg">
                                                        <GraduationCap className="text-blue-500" size={18} />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold text-[#2C4276]">{student.degree}</div>
                                                        <div className="text-xs text-[#2C4276] opacity-60 font-medium">{student.university || student.city}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 whitespace-nowrap">
                                                <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-gray-50 rounded-2xl border border-gray-100 text-[#2C4276] font-bold text-[11px] uppercase tracking-wider shadow-sm">
                                                    <Building2 className="text-gray-400" size={16} />
                                                    {student.college?.name || "Independent"}
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 whitespace-nowrap text-center">
                                                <button
                                                    onClick={() => { setStudentToDelete(student._id); setIsDeleteModalOpen(true); }}
                                                    className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Delete Student"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3 order-2 md:order-1">
                                <div className="text-sm text-gray-600 font-medium whitespace-nowrap">
                                    Showing <span className="font-bold text-gray-900">{filteredStudents.length > 0 ? startIndex + 1 : 0}</span> to <span className="font-bold text-gray-900">{Math.min(startIndex + effectiveLimit, filteredStudents.length)}</span> of <span className="font-bold text-gray-900">{filteredStudents.length}</span> students
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <span>Show:</span>
                                    <select
                                        value={itemsPerPage}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setItemsPerPage(val === "all" ? "all" : Number(val));
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
                                                className={`w-10 h-10 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95 ${currentPage === pageNum ? "bg-[#2C4276] text-white" : "border bg-white hover:bg-gray-50 text-gray-700"}`}
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
                                    disabled={currentPage === totalPages || filteredStudents.length === 0}
                                    className="px-4 py-2 text-sm font-bold rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm active:scale-95"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 text-center">
                        <div className="p-8">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="text-red-600" size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Student?</h2>
                            <p className="text-gray-500 text-sm">This will permanently remove the student record and all associated test history. This action cannot be undone.</p>
                        </div>
                        <div className="flex gap-3 p-6 pt-0 justify-center">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 shadow-md transition-all font-semibold"
                            >
                                {isDeleting && <Loader2 className="animate-spin" size={16} />}
                                Delete Student
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
