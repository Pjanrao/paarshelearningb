"use client";

import { useState, useEffect, useRef } from "react";
import {
    Award,
    Search,
    Loader2,
    Download,
    Eye,
    CheckCircle2,
    X,
    Users,
    BookOpen,
    Filter,
} from "lucide-react";
import {
    generateCertificateCanvas,
    downloadCertificate,
} from "@/components/admin/certificates/CertificateRenderer";

interface BatchData {
    _id: string;
    name: string;
    courseId: { _id: string; name: string } | null;
    students: { _id: string; name: string; email: string; contact: string }[];
    startDate: string;
    endDate: string;
    status: string;
}

interface CertificateRecord {
    _id: string;
    certificateNumber: string;
    studentId: { _id: string; name: string; email: string } | string;
    batchId: { _id: string; name: string } | string;
    courseId: { _id: string; name: string } | string;
    studentName: string;
    courseName: string;
    completionDate: string;
    createdAt: string;
}

export default function CertificatesPage() {
    const [batches, setBatches] = useState<BatchData[]>([]);
    const [selectedBatch, setSelectedBatch] = useState<BatchData | null>(null);
    const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [previewCanvas, setPreviewCanvas] = useState<HTMLCanvasElement | null>(null);
    const [previewName, setPreviewName] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLImageElement | null>(null);

    // Load logo image once
    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = "/images/logo/logo-wide.webp";
        img.onload = () => {
            logoRef.current = img;
        };
    }, []);

    // Fetch completed batches
    useEffect(() => {
        fetchBatches();
    }, []);

    // Fetch certificates when batch changes
    useEffect(() => {
        if (selectedBatch) {
            fetchCertificates();
        }
    }, [selectedBatch]);

    const fetchBatches = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/batches/completed");
            if (res.ok) {
                const data = await res.json();
                setBatches(data);
            }
        } catch (error) {
            console.error("Error fetching batches:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCertificates = async () => {
        try {
            const res = await fetch("/api/certificates?limit=99999");
            if (res.ok) {
                const data = await res.json();
                setCertificates(data.certificates || []);
            }
        } catch (error) {
            console.error("Error fetching certificates:", error);
        }
    };

    const getCertificateForStudent = (studentId: string) => {
        return certificates.find((c) => {
            const certStudentId = typeof c.studentId === "string" ? c.studentId : c.studentId?._id;
            const certBatchId = typeof c.batchId === "string" ? c.batchId : c.batchId?._id;
            return certStudentId === studentId && certBatchId === selectedBatch?._id;
        });
    };

    const handleGenerate = async (student: { _id: string; name: string; email: string }) => {
        if (!selectedBatch) return;

        setGenerating(student._id);
        try {
            const res = await fetch("/api/certificates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId: student._id,
                    batchId: selectedBatch._id,
                    courseId: selectedBatch.courseId?._id,
                    studentName: student.name,
                    courseName: selectedBatch.courseId?.name || "Course",
                    completionDate: selectedBatch.endDate,
                }),
            });

            if (res.ok || res.status === 409) {
                await fetchCertificates();
                const data = await res.json();
                const cert = data.certificate || data;
                showCertificatePreview(cert);
            } else {
                const err = await res.json();
                alert(err.error || "Failed to generate certificate");
            }
        } catch (error) {
            console.error("Error generating certificate:", error);
            alert("Failed to generate certificate");
        } finally {
            setGenerating(null);
        }
    };

    const showCertificatePreview = (cert: CertificateRecord) => {
        const canvas = generateCertificateCanvas(
            {
                studentName: cert.studentName,
                courseName: cert.courseName,
                completionDate: cert.completionDate,
                certificateNumber: cert.certificateNumber,
            },
            logoRef.current
        );
        setPreviewCanvas(canvas);
        setPreviewName(cert.studentName);
        setShowPreview(true);
    };

    const handleDownload = () => {
        if (previewCanvas) {
            downloadCertificate(previewCanvas, previewName);
        }
    };

    const handleBulkGenerate = async () => {
        if (!selectedBatch) return;
        const students = filteredStudents.filter((s) => !getCertificateForStudent(s._id));
        if (students.length === 0) {
            alert("All certificates have already been generated!");
            return;
        }

        if (!confirm(`Generate certificates for ${students.length} students?`)) return;

        for (const student of students) {
            await handleGenerate(student);
        }
    };

    const students = selectedBatch?.students || [];
    const filteredStudents = students.filter(
        (s) =>
            s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const generatedCount = filteredStudents.filter((s) => getCertificateForStudent(s._id)).length;

    return (
        <div className="bg-gray-50 min-h-full">
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#2C4276] flex items-center gap-3">
                            <Award className="text-blue-500" size={32} />
                            Certificate Management
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">
                            Generate and manage course completion certificates
                        </p>
                    </div>
                </div>
            </div>

            {/* Batch Selector Card */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-100">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="flex items-center gap-2 text-[#2C4276] font-semibold">
                        <Filter size={18} />
                        <span>Select Completed Batch:</span>
                    </div>
                    <select
                        value={selectedBatch?._id || ""}
                        onChange={(e) => {
                            const batch = batches.find((b) => b._id === e.target.value);
                            setSelectedBatch(batch || null);
                            setSearchQuery("");
                        }}
                        className="flex-1 border border-gray-200 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white min-w-[300px]"
                    >
                        <option value="">-- Choose a batch --</option>
                        {batches.map((b) => (
                            <option key={b._id} value={b._id}>
                                {b.name} — {b.courseId?.name || "Unknown Course"} ({b.students?.length || 0} students)
                            </option>
                        ))}
                    </select>
                </div>

                {loading && (
                    <div className="flex items-center gap-2 mt-4 text-gray-500">
                        <Loader2 className="animate-spin" size={18} />
                        Loading batches...
                    </div>
                )}

                {!loading && batches.length === 0 && (
                    <div className="mt-4 text-center py-8 text-gray-400">
                        <BookOpen size={40} className="mx-auto mb-3 opacity-50" />
                        <p className="font-medium">No completed batches found</p>
                        <p className="text-sm mt-1">Certificates can only be generated for completed batches</p>
                    </div>
                )}
            </div>

            {/* Students Table */}
            {selectedBatch && (
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                    {/* Table Header */}
                    <div className="p-6 border-b bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h2 className="text-lg font-bold text-[#2C4276]">
                                    {selectedBatch.name}
                                </h2>
                                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <BookOpen size={14} />
                                        {selectedBatch.courseId?.name}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users size={14} />
                                        {students.length} students
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <CheckCircle2 size={14} className="text-green-500" />
                                        {generatedCount}/{filteredStudents.length} generated
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <div className="relative flex-1 md:flex-none">
                                    <input
                                        type="text"
                                        placeholder="Search students..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-64"
                                    />
                                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                </div>
                                <button
                                    onClick={handleBulkGenerate}
                                    disabled={!!generating}
                                    className="bg-[#2C4276] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 shadow-sm font-medium disabled:opacity-50 whitespace-nowrap"
                                >
                                    <Award size={18} />
                                    Generate All
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        #
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Student
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Course
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredStudents.map((student, index) => {
                                    const cert = getCertificateForStudent(student._id);
                                    const isGenerating = generating === student._id;

                                    return (
                                        <tr key={student._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2C4276] to-blue-500 flex items-center justify-center text-white font-bold shadow-inner uppercase">
                                                        {student.name.charAt(0)}
                                                    </div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {student.name}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {student.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {selectedBatch.courseId?.name || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {cert ? (
                                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1">
                                                        <CheckCircle2 size={12} />
                                                        Generated
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider">
                                                        Pending
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="flex items-center gap-2">
                                                    {cert ? (
                                                        <>
                                                            <button
                                                                onClick={() => showCertificatePreview(cert)}
                                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                title="View Certificate"
                                                            >
                                                                <Eye size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    const canvas = generateCertificateCanvas(
                                                                        {
                                                                            studentName: cert.studentName,
                                                                            courseName: cert.courseName,
                                                                            completionDate: cert.completionDate,
                                                                            certificateNumber: cert.certificateNumber,
                                                                        },
                                                                        logoRef.current
                                                                    );
                                                                    downloadCertificate(canvas, cert.studentName);
                                                                }}
                                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                                title="Download Certificate"
                                                            >
                                                                <Download size={18} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleGenerate(student)}
                                                            disabled={isGenerating}
                                                            className="px-4 py-1.5 bg-[#2C4276] text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                                                        >
                                                            {isGenerating ? (
                                                                <Loader2 className="animate-spin" size={14} />
                                                            ) : (
                                                                <Award size={14} />
                                                            )}
                                                            {isGenerating ? "Generating..." : "Generate"}
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {filteredStudents.length === 0 && (
                        <div className="text-center py-16 text-gray-400">
                            <Search size={40} className="mx-auto mb-3 opacity-50" />
                            <p className="font-medium">No students found</p>
                        </div>
                    )}
                </div>
            )}

            {/* Certificate Preview Modal */}
            {showPreview && previewCanvas && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold text-[#2C4276] flex items-center gap-2">
                                <Award size={20} />
                                Certificate Preview — {previewName}
                            </h2>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-6 bg-gray-100 flex justify-center" ref={previewRef}>
                            <img
                                src={previewCanvas.toDataURL("image/png")}
                                alt={`Certificate for ${previewName}`}
                                className="max-w-full rounded-lg shadow-lg border border-gray-200"
                            />
                        </div>
                        <div className="p-4 border-t flex justify-end gap-3 bg-gray-50">
                            <button
                                onClick={() => setShowPreview(false)}
                                className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                            >
                                Close
                            </button>
                            <button
                                onClick={handleDownload}
                                className="px-6 py-2 bg-[#2C4276] text-white rounded-lg hover:bg-opacity-90 font-bold shadow-md transition-all flex items-center gap-2"
                            >
                                <Download size={18} />
                                Download PNG
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
