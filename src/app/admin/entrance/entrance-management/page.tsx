"use client";

import { useState, useEffect, useMemo } from "react";
import { Copy, Plus, Trash2, Pencil, Search, Calendar, Clock, Loader2, X, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useFetchEntranceCollegesQuery } from "@/redux/api";
import {
    useLazyGetEntranceTestsQuery,
    useCreateEntranceTestMutation,
    useUpdateEntranceTestMutation,
    useDeleteEntranceTestMutation,
} from "@/redux/api/entranceTestApi";
import { Info } from "lucide-react";
import EntranceExamGuide from "@/components/practice-test/admin/EntranceExamGuide";

interface Test {
    testId: string;
    college: string;
    batchName: string;
    testDuration: number;
    testSettings: {
        questionsPerTest: number;
        passingScore: number;
        allowRetake: boolean;
    };
    createdAt: string;
    testLink: string;
    hasExpiry: boolean;
    startTime?: string;
    endTime?: string;
    status?: string;
}

interface College {
    _id: string;
    name: string;
}

interface TestWithCollegeName extends Test {
    collegeName: string;
}

const EntranceExamManagement = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTest, setEditingTest] = useState<TestWithCollegeName | null>(null);

    const [deleteTestDialogOpen, setDeleteTestDialogOpen] = useState(false);
    const [testToDelete, setTestToDelete] = useState<{ testId: string; collegeId: string } | null>(null);
    const [guideOpen, setGuideOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [testsPerPage, setTestsPerPage] = useState<number | "all">(10);

    const [testForm, setTestForm] = useState({
        collegeId: "",
        batchName: "",
        testDuration: "60",
        questionsPerTest: "50",
        passingScore: "40",
        allowRetake: false,
        hasExpiry: false,
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
    });

    const { data: collegesData, isLoading: isLoadingColleges } = useFetchEntranceCollegesQuery(undefined);
    const [triggerGetTests, { data: testsData, isLoading: isLoadingTestsQuery }] = useLazyGetEntranceTestsQuery();
    const [createTest, { isLoading: isCreatingTest }] = useCreateEntranceTestMutation();
    const [updateTest, { isLoading: isUpdatingTest }] = useUpdateEntranceTestMutation();
    const [deleteTest, { isLoading: isDeletingTest }] = useDeleteEntranceTestMutation();

    const colleges = useMemo(() => collegesData?.colleges || [], [collegesData]);

    useEffect(() => {
        if (colleges.length > 0) {
            triggerGetTests("all");
        }
    }, [colleges, triggerGetTests]);

    const allTests = useMemo(() => {
        if (!testsData) return [];
        const tests: Test[] = Array.isArray(testsData) ? testsData : (testsData as any)?.data || [];
        const collegeMap = colleges.reduce((map, college: College) => {
            map[college._id] = college.name;
            return map;
        }, {} as Record<string, string>);

        return tests.map((test: Test) => ({
            ...test,
            collegeName: collegeMap[test.college] || "Unknown",
        }));
    }, [testsData, colleges]);

    const filteredTests = allTests.filter(
        (test: TestWithCollegeName) =>
            test.testId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.collegeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.batchName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const effectiveLimit = testsPerPage === "all" ? filteredTests.length : testsPerPage;
    const totalPages = testsPerPage === "all" ? 1 : Math.max(1, Math.ceil(filteredTests.length / effectiveLimit));
    const displayedTests = filteredTests.slice((currentPage - 1) * effectiveLimit, currentPage * effectiveLimit);

    const handleOpenCreate = () => {
        setEditingTest(null);
        setTestForm({
            collegeId: "",
            batchName: "",
            testDuration: "60",
            questionsPerTest: "50",
            passingScore: "40",
            allowRetake: false,
            hasExpiry: false,
            startDate: "",
            startTime: "",
            endDate: "",
            endTime: "",
        });
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (test: TestWithCollegeName) => {
        setEditingTest(test);
        let sDate = "", sTime = "", eDate = "", eTime = "";
        if (test.startTime) {
            const d = new Date(test.startTime);
            sDate = d.toISOString().split('T')[0];
            sTime = d.toTimeString().split(' ')[0].substring(0, 5);
        }
        if (test.endTime) {
            const d = new Date(test.endTime);
            eDate = d.toISOString().split('T')[0];
            eTime = d.toTimeString().split(' ')[0].substring(0, 5);
        }
        setTestForm({
            collegeId: test.college,
            batchName: test.batchName,
            testDuration: test.testDuration.toString(),
            questionsPerTest: test.testSettings.questionsPerTest.toString(),
            passingScore: test.testSettings.passingScore.toString(),
            allowRetake: test.testSettings.allowRetake,
            hasExpiry: test.hasExpiry,
            startDate: sDate,
            startTime: sTime,
            endDate: eDate,
            endTime: eTime,
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async () => {
        const {
            collegeId,
            batchName,
            testDuration,
            questionsPerTest,
            passingScore,
            allowRetake,
            hasExpiry,
            startDate,
            startTime,
            endDate,
            endTime
        } = testForm;

        if (!collegeId || !batchName || !testDuration || !questionsPerTest || !passingScore) {
            return toast.error("Required fields missing");
        }

        let startDateTime = "";
        let endDateTime = "";

        if (hasExpiry) {
            if (!startDate || !startTime || !endDate || !endTime) {
                return toast.error("Please complete schedule window");
            }

            startDateTime = new Date(`${startDate}T${startTime}`).toISOString();
            endDateTime = new Date(`${endDate}T${endTime}`).toISOString();

            if (new Date(endDateTime) <= new Date(startDateTime)) {
                return toast.error("End time must be after start time");
            }
        }

        const payload = {
            collegeId,
            batchName,
            testDuration: Number(testDuration),
            testSettings: {
                questionsPerTest: Number(questionsPerTest),
                passingScore: Number(passingScore),
                allowRetake,
            },
            hasExpiry,
            startDateTime,
            endDateTime,
        };

        try {
            if (editingTest) {
                await updateTest({ testId: editingTest.testId, ...payload }).unwrap();
                toast.success("Exam updated successfully");
            } else {
                await createTest(payload).unwrap();
                toast.success("Exam created successfully");
            }

            setIsDialogOpen(false);
            triggerGetTests("all");

        } catch (err: any) {
            toast.error(err?.data?.message || "Operation failed");
        }
    };

    const handleDelete = async () => {
        if (!testToDelete) return;
        try {
            await deleteTest(testToDelete).unwrap();
            setDeleteTestDialogOpen(false);
            toast.success("Exam deleted");
            triggerGetTests("all");
        } catch (err: any) {
            toast.error("Failed to delete");
        }
    };

    const handleCopyLink = async (testLink: string) => {
        try {
            await navigator.clipboard.writeText(testLink);
            toast.success("Link copied to clipboard");
        } catch (err) {
            toast.error("Failed to copy link");
        }
    };

    return (
        <div className="bg-gray-50 h-full">
            <div className="mb-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-[#2C4276]">Entrance Exam Management</h1>
                        <p className="text-gray-500 text-sm mt-1">Configure and manage entrance tests for colleges</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                        <button
                            onClick={() => setGuideOpen(true)}
                            className="border-[#2C4276] text-[#2C4276] hover:bg-blue-50 border-2 px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm font-bold active:scale-95 whitespace-nowrap"
                        >
                            <Info size={20} />
                            <span>How it Works</span>
                        </button>
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Search exams..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2.5 rounded-xl border-0 focus:ring-2 focus:ring-[#2C4276]/20 w-full shadow-sm bg-white text-gray-600 outline-none transition-all"
                            />
                            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        </div>
                        <button
                            onClick={handleOpenCreate}
                            className="bg-[#2C4276] text-white px-5 py-2.5 rounded-xl hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 shadow-md font-semibold active:scale-95 whitespace-nowrap"
                        >
                            <Plus size={20} />
                            <span>New Exam</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg -mt-3 relative overflow-hidden">
                {(isLoadingTestsQuery || isLoadingColleges) ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4">
                        <Loader2 className="animate-spin text-blue-600" size={40} />
                        <p className="text-gray-500 animate-pulse font-medium">Fetching exams...</p>
                    </div>
                ) : displayedTests.length === 0 ? (
                    <div className="text-center py-24 px-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="text-gray-400" size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No exams found</h3>
                        <p className="text-gray-400 text-sm max-w-sm mx-auto">
                            {searchTerm ? "No exams match your search criteria. Try a different term." : "No exams created yet. Click 'New Exam' to get started."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="custom-scrollbar-container overflow-auto h-[445px] sm:max-h-[600px] border-x rounded-t-xl">
                            <table className="w-full divide-y divide-gray-100 min-w-[900px]">
                                <thead className="bg-gray-50 border-b sticky top-0 z-10">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">#</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">College Details</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Exam ID</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Batch</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Configuration</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-500 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 bg-white">
                                    {displayedTests.map((test, idx) => (
                                        <tr key={test.testId} className="hover:bg-blue-50/30 transition-all group">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">{(currentPage - 1) * effectiveLimit + idx + 1}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#2C4276] to-blue-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 uppercase transform group-hover:scale-110 transition-transform">
                                                        {test.collegeName.charAt(0)}
                                                    </div>
                                                    <div className="text-sm font-bold text-gray-900">{test.collegeName}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{test.testId}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-700">{test.batchName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-gray-800">{test.testDuration} mins</span>
                                                    <span className="text-[10px] text-gray-400 uppercase font-extrabold">{test.testSettings.questionsPerTest} Qs / {test.testSettings.passingScore} Pass</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-tight border shadow-sm ${test.status === 'expired'
                                                    ? 'bg-red-50 text-red-700 border-red-100'
                                                    : test.status === 'scheduled'
                                                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                                                        : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                    }`}>
                                                    {test.status || 'Active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button onClick={() => handleCopyLink(test.testLink)} className="p-2.5 text-[#2C4276] hover:bg-[#2C4276] hover:text-white rounded-xl transition-all shadow-sm bg-white border border-gray-100" title="Copy Link"><Copy size={16} /></button>
                                                    <button onClick={() => handleOpenEdit(test)} className="p-2.5 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl transition-all shadow-sm bg-white border border-gray-100" title="Edit"><Pencil size={18} /></button>
                                                    <button onClick={() => { setTestToDelete({ testId: test.testId, collegeId: test.college }); setDeleteTestDialogOpen(true); }} className="p-2.5 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm bg-white border border-gray-100" title="Delete"><Trash2 size={18} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 border-t bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3 order-2 md:order-1">
                                <div className="text-sm text-gray-600 font-medium whitespace-nowrap">
                                    Showing <span className="font-bold text-gray-900">{(currentPage - 1) * effectiveLimit + (displayedTests.length > 0 ? 1 : 0)}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * effectiveLimit, filteredTests.length)}</span> of <span className="font-bold text-gray-900">{filteredTests.length}</span> exams
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <span>Show:</span>
                                    <select
                                        value={testsPerPage}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setTestsPerPage(val === "all" ? "all" : Number(val));
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
                                    disabled={currentPage === totalPages || (filteredTests.length === 0)}
                                    className="px-4 py-2 text-sm font-bold rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-50 transition-all shadow-sm active:scale-95"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Create/Edit Modal */}
            {isDialogOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold text-[#2C4276]">{editingTest ? "Update Exam" : "Create New Exam"}</h2>
                            <button onClick={() => setIsDialogOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={24} /></button>
                        </div>
                        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-gray-700">College <span className="text-red-500">*</span></label>
                                    <select
                                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-medium"
                                        value={testForm.collegeId}
                                        onChange={e => setTestForm({ ...testForm, collegeId: e.target.value })}
                                        disabled={!!editingTest}
                                    >
                                        <option value="">Select college</option>
                                        {colleges.map((c: College) => (<option key={c._id} value={c._id}>{c.name}</option>))}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-gray-700">Batch Name <span className="text-red-500">*</span></label>
                                    <input type="text" placeholder="e.g. Summer-2024-B1" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={testForm.batchName} onChange={e => setTestForm({ ...testForm, batchName: e.target.value })} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-gray-700">Duration (mins) <span className="text-red-500">*</span></label>
                                    <input type="number" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={testForm.testDuration} onChange={e => setTestForm({ ...testForm, testDuration: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-gray-700">Questions <span className="text-red-500">*</span></label>
                                    <input type="number" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={testForm.questionsPerTest} onChange={e => setTestForm({ ...testForm, questionsPerTest: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-sm font-semibold text-gray-700">Pass Score <span className="text-red-500">*</span></label>
                                    <input type="number" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" value={testForm.passingScore} onChange={e => setTestForm({ ...testForm, passingScore: e.target.value })} />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                                    <input type="checkbox" id="allowRetake" className="w-4 h-4 accent-[#2C4276] cursor-pointer" checked={testForm.allowRetake} onChange={e => setTestForm({ ...testForm, allowRetake: e.target.checked })} />
                                    <label htmlFor="allowRetake" className="text-sm font-medium text-gray-700 cursor-pointer">Allow candidates to retake the exam</label>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                                    <input type="checkbox" id="hasExpiry" className="w-4 h-4 accent-[#2C4276] cursor-pointer" checked={testForm.hasExpiry} onChange={e => setTestForm({ ...testForm, hasExpiry: e.target.checked })} />
                                    <label htmlFor="hasExpiry" className="text-sm font-medium text-gray-700 cursor-pointer">Set schedule window (start/end time)</label>
                                </div>
                            </div>

                            {testForm.hasExpiry && (
                                <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-tight">Exam Start Window</label>
                                        <div className="flex gap-2">
                                            <input type="date" className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={testForm.startDate} onChange={e => setTestForm({ ...testForm, startDate: e.target.value })} />
                                            <input type="time" className="w-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={testForm.startTime} onChange={e => setTestForm({ ...testForm, startTime: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <label className="block text-sm font-bold text-gray-600 mb-2 uppercase tracking-tight">Exam End Window</label>
                                        <div className="flex gap-2">
                                            <input type="date" className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={testForm.endDate} onChange={e => setTestForm({ ...testForm, endDate: e.target.value })} />
                                            <input type="time" className="w-32 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={testForm.endTime} onChange={e => setTestForm({ ...testForm, endTime: e.target.value })} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-3 p-6 pt-4 border-t bg-gray-50">
                            <button type="button" onClick={() => setIsDialogOpen(false)} className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                            <button
                                onClick={handleSubmit}
                                disabled={isCreatingTest || isUpdatingTest}
                                className="px-6 py-2 bg-[#2C4276] text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50 flex items-center gap-2 shadow-md transition-all font-semibold"
                            >
                                {(isCreatingTest || isUpdatingTest) && <Loader2 className="animate-spin" size={16} />}
                                {editingTest ? "Update Exam" : "Create Exam"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {deleteTestDialogOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 text-center">
                        <div className="p-8">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertCircle className="text-red-600" size={32} />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Exam?</h2>
                            <p className="text-gray-500 text-sm">Are you sure you want to delete exam <strong>{testToDelete?.testId}</strong>? This action cannot be undone.</p>
                        </div>
                        <div className="flex gap-3 p-6 pt-0 justify-center">
                            <button onClick={() => setDeleteTestDialogOpen(false)} className="px-6 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeletingTest}
                                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2 shadow-md transition-all font-semibold"
                            >
                                {isDeletingTest && <Loader2 className="animate-spin" size={16} />}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <EntranceExamGuide open={guideOpen} onOpenChange={setGuideOpen} />
        </div>
    );
};

export default EntranceExamManagement;
