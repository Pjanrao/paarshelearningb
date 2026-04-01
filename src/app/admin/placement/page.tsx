"use client";

import { useState } from "react";
import {
    Briefcase,
    Building2,
    Users,
    TrendingUp,
    Search,
    Plus,
    Calendar,
    CheckCircle2,
    Clock,
    ExternalLink,
    Eye,
    Pencil,
    Trash2,
    Download,
    Loader2,
    X
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
import { motion } from "framer-motion";
import {
    useGetPlacementsQuery,
    useGetPlacementStatsQuery,
    useCreatePlacementMutation,
    useUpdatePlacementMutation,
    useDeletePlacementMutation 
} from "@/redux/api/placementApi";
import { toast } from "sonner";
 
function StatCard({ stat }: { stat: any }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div className="flex justify-between items-start">
                <div className={`p-3 rounded-xl bg-opacity-10 
          ${stat.color === 'blue' ? 'bg-blue-600 text-blue-600' : ''}
          ${stat.color === 'indigo' ? 'bg-indigo-600 text-indigo-600' : ''}
          ${stat.color === 'emerald' ? 'bg-emerald-600 text-emerald-600' : ''}
          ${stat.color === 'amber' ? 'bg-amber-600 text-amber-600' : ''}
        `}>
                    {stat.title === "Total Placed" ? <Users size={24} /> :
                        stat.title === "Partner Companies" ? <Building2 size={24} /> :
                            stat.title === "Avg. Package" ? <TrendingUp size={24} /> :
                                <Briefcase size={24} />}
                </div>
                <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full uppercase tracking-wider tabular-nums">Syncing</span>
            </div>
            <div className="mt-4">
                <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className={`text-xs mt-2 font-medium text-blue-600`}>
                    {stat.trend || "Updated just now"}
                </p>
            </div>
        </motion.div>
    );
}

export default function PlacementPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingPlacement, setEditingPlacement] = useState<any>(null);
    const [viewingPlacement, setViewingPlacement] = useState<any>(null);
    const [deleteId, setDeleteId] = useState<{ id: string, name: string } | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    // RTK Query hooks
    const { data: statsData, isLoading: statsLoading } = useGetPlacementStatsQuery();
    const { data, isLoading, isFetching } = useGetPlacementsQuery({
        search: searchQuery,
        status: activeTab,
        page: currentPage,
        limit: 10
    });

    const [createPlacement, { isLoading: isCreating }] = useCreatePlacementMutation();
    const [updatePlacement, { isLoading: isUpdating }] = useUpdatePlacementMutation();
    const [deletePlacement] = useDeletePlacementMutation();

    const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const payload = {
            studentName: formData.get("studentName"),
            course: formData.get("course"),
            company: formData.get("company"),
            package: formData.get("package"),
            date: formData.get("date"),
            status: formData.get("status"),
            logo: `https://ui-avatars.com/api/?name=${formData.get("company")}&background=random&color=fff`
        };

        try {
            if (editingPlacement) {
                await updatePlacement({ id: editingPlacement._id, data: payload }).unwrap();
            } else {
                await createPlacement(payload).unwrap();
            }
            setIsModalOpen(false);
            setEditingPlacement(null);
        } catch (err) {
            alert("Error saving placement");
        }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setDeleteLoading(true);
        try {
            await deletePlacement(deleteId.id);
            setDeleteId(null);
        } catch (error) {
            console.error("Error deleting placement:", error);
        } finally {
            setDeleteLoading(false);
        }
    };

    const exportToCSV = () => {
        if (!data?.placements || data.placements.length === 0) {
            toast.error("No data available to export");
            return;
        }

        const headers = ["Student Name", "Course", "Company", "Package", "Date", "Status"];
        const csvData = data.placements.map((row: any) => [
            row.studentName,
            row.course,
            row.company,
            row.package,
            new Date(row.date).toLocaleDateString(),
            row.status
        ]);

        const csvContent = [headers, ...csvData].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `placements-report-${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        toast.success("Placements report exported successfully");
    };


    return (
        <>
            <div className="md:p-2 bg-gray-50/30 min-h-screen space-y-8 animate-in fade-in duration-500">

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C4276]">Placement Management</h1>
                        <p className="text-gray-500 mt-1 text-sm sm:text-base">Track and manage student career successes</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                        <button
                            onClick={exportToCSV}
                            className="w-full sm:w-auto bg-[#2C4276] text-white px-5 py-2.5 rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-md font-semibold active:scale-95 whitespace-nowrap"
                        >
                            <Download size={18} />
                            <span>Export CSV</span>
                        </button>
                        <button
                            onClick={() => { setEditingPlacement(null); setIsModalOpen(true); }}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2C4276] text-white rounded-xl font-semibold hover:opacity-90 transition-all shadow-md active:scale-95 whitespace-nowrap"
                        >
                            <Plus size={18} />
                            <span>Add New</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statsLoading ? (
                        Array(4).fill(0).map((_, i) => <div key={i} className="h-32 bg-white animate-pulse rounded-2xl" />)
                    ) : (
                        statsData?.map((stat: any, idx: number) => (
                            <StatCard key={idx} stat={stat} />
                        ))
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">

                    <div className="p-4 sm:p-6 border-b flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 bg-white shrink-0">
                        <div className="flex items-center p-1 bg-gray-50 rounded-xl w-full xl:w-fit overflow-x-auto no-scrollbar">
                            {["all", "Placed", "Offered", "Interviewing", "Pending"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => { setActiveTab(tab.toLowerCase()); setCurrentPage(1); }}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all capitalize whitespace-nowrap flex-1 sm:flex-none
                  ${(activeTab === tab.toLowerCase() || (activeTab === 'all' && tab === 'all'))
                                            ? "bg-white text-[#2C4276] shadow-sm"
                                            : "text-gray-500 hover:text-gray-900"}
                `}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
                            <div className="relative w-full sm:w-64">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                                    className="pl-10 pr-4 py-2.5 rounded-xl border-0 focus:ring-2 focus:ring-[#2C4276]/20 w-full shadow-sm bg-gray-50 text-gray-600 outline-none transition-all"
                                />
                                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                            </div>
                            {isFetching && <Loader2 className="animate-spin text-blue-600" size={20} />}
                        </div>
                    </div>

                    <div className="custom-scrollbar-container overflow-auto h-[450px] sm:max-h-[600px] border-x rounded-t-xl">
                        {isLoading ? (
                            <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
                        ) : (
                            <table className="w-full text-left min-w-[900px]">
                                <thead className="bg-gray-50 border-b sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Student</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Package</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    {data?.placements.map((row: any) => (
                                        <tr key={row._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">{row.studentName}</p>
                                                    <p className="text-[11px] text-gray-500 font-medium">{row.course}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-sm font-semibold text-gray-700">{row.company}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-sm font-bold text-[#2C4276] tabular-nums">{row.package}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-2 text-gray-500 text-[13px] font-medium">
                                                    <Calendar size={14} />
                                                    {new Date(row.date).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className={`
                        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide
                        ${row.status === 'Placed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : ''}
                        ${row.status === 'Offered' ? 'bg-blue-50 text-blue-600 border border-blue-100' : ''}
                        ${row.status === 'Interviewing' ? 'bg-amber-50 text-amber-600 border border-amber-100' : ''}
                        ${row.status === 'Pending' ? 'bg-gray-50 text-gray-600 border border-gray-100' : ''}
                      `}>
                                                    {row.status === 'Placed' && <CheckCircle2 size={12} />}
                                                    {row.status === 'Offered' && <ExternalLink size={12} />}
                                                    {row.status === 'Interviewing' && <Clock size={12} />}
                                                    {row.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex items-center justify-end gap-2 transition-all">
                                                    <button
                                                        onClick={() => { setViewingPlacement(row); setIsViewModalOpen(true); }}
                                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Eye size={18} /></button>
                                                    <button
                                                        onClick={() => { setEditingPlacement(row); setIsModalOpen(true); }}
                                                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Pencil size={18} /></button>
                                                    <button
                                                        onClick={() => setDeleteId({ id: row._id, name: row.studentName })}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="px-6 py-4 border-t bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="text-sm text-gray-600 font-medium order-2 md:order-1">
                            Showing <span className="font-bold text-gray-900">{(currentPage - 1) * 10 + 1}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * 10, data?.total || 0)}</span> of <span className="font-bold text-gray-900">{data?.total || 0}</span> records
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
                                {Array.from({ length: Math.min(Math.ceil((data?.total || 0) / 10), 5) }, (_, i) => {
                                    const totalPages = Math.ceil((data?.total || 0) / 10);
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
                                {currentPage} / {Math.ceil((data?.total || 0) / 10) || 1}
                            </div>
                            <button
                                onClick={() => setCurrentPage(Math.min(Math.ceil((data?.total || 0) / 10), currentPage + 1))}
                                disabled={data && currentPage * 10 >= data.total}
                                className="px-4 py-2 text-sm font-bold rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm active:scale-95"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-[#2C4276]">{editingPlacement ? "Update Placement" : "Add New Placement"}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Student Name</label>
                                    <input name="studentName" defaultValue={editingPlacement?.studentName} required className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#2C4276]/10" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Course</label>
                                    <input name="course" defaultValue={editingPlacement?.course} required className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#2C4276]/10" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Company</label>
                                    <input name="company" defaultValue={editingPlacement?.company} required className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#2C4276]/50" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Package (e.g. 5.5 LPA)</label>
                                    <input name="package" defaultValue={editingPlacement?.package} required className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#2C4276]/50" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date</label>
                                    <input name="date" type="date" defaultValue={editingPlacement?.date?.split('T')[0]} required className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#2C4276]/10" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status</label>
                                    <select name="status" defaultValue={editingPlacement?.status || "Pending"} className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-[#2C4276]/10">
                                        <option>Placed</option>
                                        <option>Offered</option>
                                        <option>Interviewing</option>
                                        <option>Pending</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-4">
                                <button
                                    disabled={isCreating || isUpdating}
                                    className="w-full py-3 bg-[#2C4276] text-white rounded-xl font-bold shadow-lg hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
                                    {(isCreating || isUpdating) && <Loader2 className="animate-spin" size={20} />}
                                    {editingPlacement ? "Save Changes" : "Create Record"}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {isViewModalOpen && viewingPlacement && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4 animate-in fade-in duration-200">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-[#2C4276]">Placement Details</h2>
                            <button onClick={() => setIsViewModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                        </div>
                        <div className="p-8 space-y-6">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="w-16 h-16 rounded-full bg-[#2C4276] flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                    {viewingPlacement.studentName.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">{viewingPlacement.studentName}</h3>
                                    <p className="text-sm text-gray-500 font-medium">{viewingPlacement.course}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Company</p>
                                    <div className="flex items-center gap-2">
                                        <Building2 size={16} className="text-gray-400" />
                                        <p className="text-sm font-bold text-gray-800">{viewingPlacement.company}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Salary Package</p>
                                    <div className="flex items-center gap-2">
                                        <TrendingUp size={16} className="text-[#2C4276]" />
                                        <p className="text-sm font-bold text-[#2C4276]">{viewingPlacement.package}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Placement Date</p>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-gray-400" />
                                        <p className="text-sm font-bold text-gray-800">{new Date(viewingPlacement.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Status</p>
                                    <span className={`
                                        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                                        ${viewingPlacement.status === 'Placed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : ''}
                                        ${viewingPlacement.status === 'Offered' ? 'bg-blue-50 text-blue-600 border border-blue-100' : ''}
                                        ${viewingPlacement.status === 'Interviewing' ? 'bg-amber-50 text-amber-600 border border-amber-100' : ''}
                                        ${viewingPlacement.status === 'Pending' ? 'bg-gray-50 text-gray-600 border border-gray-100' : ''}
                                    `}>
                                        {viewingPlacement.status}
                                    </span>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={() => setIsViewModalOpen(false)}
                                    className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all">
                                    Close Details
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent className="max-w-md bg-white dark:bg-gray-900">
                    <AlertDialogHeader className="flex flex-col items-center text-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                            <Trash2 className="text-red-600" size={22} />
                        </div>
                        <AlertDialogTitle className="text-lg font-semibold text-gray-900">
                            Delete Placement Record
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-gray-500 leading-relaxed">
                            Are you sure you want to delete the placement record for <span className="font-bold text-gray-800">{deleteId?.name}</span>? This action cannot be undone.
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
        </>
    );
}
