"use client";

import { useState, useMemo } from "react";
import { 
  Eye, 
  Search, 
  Loader2, 
  X, 
  Filter, 
  RotateCcw, 
  User, 
  Building2, 
  Calendar, 
  Trash2, 
  TrendingUp, 
  Clock,
  Download
} from "lucide-react";
import { toast } from "sonner";
import { 
  useGetGlobalPracticeTestLogsQuery, 
  useDeleteGlobalPracticeTestLogMutation 
} from "@/redux/api/practiceTestApi";
import { format } from "date-fns";

const TestLogs = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState<number | "all">(10);
    const [selectedSession, setSelectedSession] = useState<any>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const [filters, setFilters] = useState({
        studentName: "",
        testName: "",
        status: "all",
        date: ""
    });

    const queryParams = useMemo(() => ({
        page,
        limit: limit === "all" ? 99999 : limit,
        studentName: filters.studentName || undefined,
        testName: filters.testName || undefined,
        status: filters.status !== "all" ? filters.status : undefined,
        date: filters.date || undefined,
    }), [page, limit, filters]);

    const { data: apiResponse, isLoading } = useGetGlobalPracticeTestLogsQuery(queryParams);
    const [deleteLog, { isLoading: isDeleting }] = useDeleteGlobalPracticeTestLogMutation();

    const logs = apiResponse?.testLogs || [];
    const pagination = apiResponse?.pagination || { totalPages: 0, totalRecords: 0, hasMore: false };

    const formatTimeSpent = (start?: string, end?: string) => {
        if (!start || !end) return "N/A";
        const diff = new Date(end).getTime() - new Date(start).getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        return `${minutes}m ${seconds}s`;
    };

    const formatDate = (date?: string) => {
        if (!date) return "N/A";
        return format(new Date(date), "MMM d, yyyy hh:mm a");
    };

    const handleExport = () => {
        if (logs.length === 0) return toast.error("No data to export");
        const headers = ["Student", "Batch", "Test Name", "Score", "Percentage", "Passed", "Date"];
        const csvContent = [headers, ...logs.map((log: any) => [
            log.userId?.name || "N/A",
            log.userId?.batchName || "N/A",
            log.testId?.name || "N/A",
            log.score,
            `${((log.score / log.totalMarks) * 100).toFixed(1)}%`,
            log.status === "completed" ? "Yes" : "No",
            formatDate(log.createdAt)
        ])].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `practice-logs-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        toast.success("Logs exported to CSV");
    };

    const clearFilters = () => {
        setFilters({ studentName: "", testName: "", status: "all", date: "" });
        setPage(1);
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        try {
            const res = await deleteLog(deleteId).unwrap();
            if (res.success) {
                toast.success("Test log deleted successfully");
                setDeleteDialogOpen(false);
                setDeleteId(null);
            }
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to delete test log");
        }
    };

    return (
        <div className="bg-gray-50 h-full">
            <div className="mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#2C4276]">Practice Test Logs</h1>
                        <p className="text-gray-500 text-sm mt-1">Review student performance and practice test history</p>
                    </div>
                    <div className="flex gap-4 w-full md:w-auto">
                        <button
                            onClick={handleExport}
                            className="bg-[#2C4276] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 shadow-sm font-medium"
                        >
                            <Download size={18} />
                            Export CSV
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border">
                <div className="flex items-center gap-2 mb-4 text-gray-700 font-semibold">
                    <Filter size={18} />
                    <span>Quick Filters</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Student name..."
                            value={filters.studentName}
                            onChange={e => { setFilters({ ...filters, studentName: e.target.value }); setPage(1); }}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-600 bg-gray-50/50"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Test name..."
                            value={filters.testName}
                            onChange={e => { setFilters({ ...filters, testName: e.target.value }); setPage(1); }}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-600 bg-gray-50/50"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    </div>
                    <select
                        value={filters.status}
                        onChange={e => { setFilters({ ...filters, status: e.target.value }); setPage(1); }}
                        className="h-10 border rounded-lg px-3 text-sm bg-gray-50/50 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="timeout">Timeout</option>
                    </select>
                    <input
                        type="date"
                        className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none text-sm text-gray-600 bg-gray-50/50"
                        value={filters.date}
                        onChange={e => { setFilters({ ...filters, date: e.target.value }); setPage(1); }}
                    />
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold flex items-center gap-2 justify-center border border-dashed border-gray-300"
                    >
                        <RotateCcw size={14} /> Reset
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <Loader2 className="animate-spin text-blue-600" size={40} />
                        <p className="text-gray-500 animate-pulse">Loading test logs...</p>
                    </div>
                ) : logs.length === 0 ? (
                    <div className="text-center py-20 px-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Search className="text-gray-400" size={32} />
                        </div>
                        <p className="text-gray-500 text-lg font-medium">No test logs found</p>
                        <p className="text-gray-400 text-sm mt-2 max-w-sm mx-auto">Try adjusting your filters or wait for students to take exams.</p>
                    </div>
                ) : (
                    <>
                        <div className="custom-scrollbar-container overflow-y-auto h-[295px] sm:max-h-[600px] border rounded-lg pb-4 sm:pb-0">
                            <table className="w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50 border-b sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-[12px] font-bold text-[#2C4276] uppercase tracking-wider">Student Performance</th>
                                        <th className="px-6 py-4 text-left text-[12px] font-bold text-[#2C4276] uppercase tracking-wider">Test Identification</th>
                                        <th className="px-6 py-4 text-left text-[12px] font-bold text-[#2C4276] uppercase tracking-wider">Result Analysis</th>
                                        <th className="px-6 py-4 text-left text-[12px] font-bold text-[#2C4276] uppercase tracking-wider">Timeline</th>
                                        <th className="px-6 py-4 text-center text-[12px] font-bold text-[#2C4276] uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {logs.map((log: any) => {
                                        const percentage = (log.score / log.totalMarks) * 100;
                                        const isPass = percentage >= 50;

                                        return (
                                            <tr key={log._id} className="hover:bg-gray-50/50 transition-colors border-b last:border-0 border-gray-100">
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-[#2C4276] shadow-sm border border-indigo-100">
                                                            <User className="opacity-70" size={24} />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="text-base font-bold text-[#2C4276]">{log.userId?.name || "N/A"}</div>
                                                            <div className="text-xs text-gray-500 font-medium text-purple-600 bg-purple-50 px-1.5 rounded-md border border-purple-100 w-fit">
                                                              {log.userId?.batchName || "No Batch"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <div className="space-y-1.5">
                                                        <div className="text-sm font-mono font-bold text-gray-700 bg-gray-50 px-2 py-1 rounded inline-block">
                                                          {log.testId?.name || "N/A"}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium lowercase italic">
                                                          ID: {log._id.slice(-6)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <div className="flex items-center gap-4">
                                                        <div className="text-center bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
                                                            <div className="text-[10px] text-gray-400 font-bold uppercase">Score</div>
                                                            <div className="text-sm font-bold text-[#2C4276]">{log.score}/{log.totalMarks}</div>
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-1.5 mb-1">
                                                                <TrendingUp size={12} className="text-blue-400" />
                                                                <span className="text-sm font-bold text-[#2C4276]">{percentage.toFixed(1)}%</span>
                                                            </div>
                                                            <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                                <div className={`h-full ${isPass ? "bg-green-500" : "bg-red-500"}`} style={{ width: `${percentage}%` }}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-xs text-[#2C4276] font-medium">
                                                            <Calendar size={14} className="text-gray-300" />
                                                            {formatDate(log.createdAt)}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-[10px] text-[#2C4276] opacity-60 font-medium">
                                                            <Clock size={12} className="text-gray-300" />
                                                            Spent: {formatTimeSpent(log.startedAt, log.submittedAt)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-6 whitespace-nowrap text-center">
                                                    <button
                                                        onClick={() => { setSelectedSession(log); setViewDialogOpen(true); }}
                                                        className="p-2.5 text-blue-500 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                                                        title="View Details"
                                                    >
                                                        <Eye size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() => { setDeleteId(log._id); setDeleteDialogOpen(true); }}
                                                        className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100">
                                                        <Trash2 size={20} />
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t bg-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="text-sm text-gray-600">
                                    Showing <span className="font-bold text-gray-900">{(page - 1) * (limit === "all" ? pagination.totalRecords : limit) + (logs.length > 0 ? 1 : 0)}</span> to <span className="font-bold text-gray-900">{Math.min(page * (limit === "all" ? pagination.totalRecords : limit), pagination.totalRecords)}</span> of <span className="font-bold text-gray-900">{pagination.totalRecords}</span> logs
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <span>Show:</span>
                                    <select
                                        value={limit}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setLimit(val === "all" ? "all" : Number(val));
                                            setPage(1);
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
                                    disabled={page === 1}
                                    onClick={() => setPage(p => p - 1)}
                                    className="px-4 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                >
                                    Previous
                                </button>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(pagination.totalPages || 1, 5) }, (_, i) => {
                                        let pageNum;
                                        const tp = pagination.totalPages || 1;
                                        if (tp <= 5) pageNum = i + 1;
                                        else if (page <= 3) pageNum = i + 1;
                                        else if (page >= tp - 2) pageNum = tp - 4 + i;
                                        else pageNum = page - 2 + i;

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setPage(pageNum)}
                                                className={`w-10 h-10 rounded-lg text-sm transition-colors ${page === pageNum ? "bg-[#2C4276] text-white" : "border bg-white hover:bg-gray-50 text-gray-700"}`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>
                                <button
                                    disabled={page === pagination.totalPages || pagination.totalRecords === 0}
                                    onClick={() => setPage(p => p + 1)}
                                    className="px-4 py-2 text-sm rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* View Detail Modal */}
            {viewDialogOpen && selectedSession && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-[#2C4276]">Test Result Summary</h2>
                            <button onClick={() => setViewDialogOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2C4276] to-blue-500 flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-xl border-4 border-white">
                                    {selectedSession.userId?.name?.charAt(0) || "?"}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">{selectedSession.userId?.name}</h3>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest border border-blue-100">
                                      {selectedSession.testId?.name || "N/A"}
                                    </span>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${((selectedSession.score / selectedSession.totalMarks) * 100) >= 50 ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}>
                                        {((selectedSession.score / selectedSession.totalMarks) * 100) >= 50 ? "Pass" : "Fail"}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Score</p>
                                        <p className="text-xl font-bold text-gray-900">{selectedSession.score}/{selectedSession.totalMarks}</p>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-gray-400 text-[10px] font-bold uppercase mb-1">Percentage</p>
                                        <p className="text-xl font-bold text-gray-900">{((selectedSession.score / selectedSession.totalMarks) * 100).toFixed(1)}%</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-medium">Batch</span>
                                        <span className="text-gray-900 font-bold">{selectedSession.userId?.batchName || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-medium">Test Duration</span>
                                        <span className="text-gray-900 font-bold">{selectedSession.testId?.duration} mins</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500 font-medium">Attempted On</span>
                                        <span className="text-gray-900 font-bold">{formatDate(selectedSession.createdAt)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={() => setViewDialogOpen(false)}
                                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200"
                                >
                                    Dismiss Record
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteDialogOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8 text-center">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white shadow-sm">
                                <Trash2 className="text-red-500" size={40} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Delete Record?</h3>
                            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
                                Are you sure you want to permanently delete this practice test session log? This action cannot be undone.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteDialogOpen(false)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                                >
                                    {isDeleting ? <Loader2 className="animate-spin" size={20} /> : "Delete"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TestLogs;
