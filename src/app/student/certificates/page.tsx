"use client";

import { useState, useEffect, useRef } from "react";
import { Award, Download, Eye, Loader2, X, Search } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
    generateCertificateCanvas,
    downloadCertificate,
} from "@/components/admin/certificates/CertificateRenderer";

interface CertificateRecord {
    _id: string;
    certificateNumber: string;
    studentName: string;
    courseName: string;
    completionDate: string;
    createdAt: string;
}

export default function StudentCertificatesPage() {
    const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewCanvas, setPreviewCanvas] = useState<HTMLCanvasElement | null>(null);
    const [previewName, setPreviewName] = useState("");
    const [showPreview, setShowPreview] = useState(false);
    const logoRef = useRef<HTMLImageElement | null>(null);

    const user = useSelector(
        (state: RootState) => state.auth.user || state.auth.studentUser
    );

    // Load logo
    useEffect(() => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = "/images/logo/logo-wide.webp";
        img.onload = () => {
            logoRef.current = img;
        };
    }, []);

    // Fetch student's certificates
    useEffect(() => {
        const getStudentId = () => {
            if (user?._id) return user._id;
            if (user?.id) return user.id;

            // Fallback to localStorage — check all possible keys
            try {
                const studentUser = JSON.parse(localStorage.getItem("studentUser") || "{}");
                if (studentUser._id || studentUser.id) return studentUser._id || studentUser.id;

                const localUser = JSON.parse(localStorage.getItem("user") || "{}");
                return localUser._id || localUser.id || null;
            } catch (e) {
                return null;
            }
        };

        const studentId = getStudentId();
        if (studentId) {
            fetchCertificates(studentId);
        } else {
            // If we've checked and still no ID, stop loading (might be guest or slow load)
            const timer = setTimeout(() => {
                const retryId = getStudentId();
                if (retryId) {
                    fetchCertificates(retryId);
                } else {
                    setLoading(false);
                }
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [user]);

    const fetchCertificates = async (studentId: string) => {
        try {
            setLoading(true);
            const res = await fetch(`/api/certificates?studentId=${studentId}&limit=99999`);
            if (res.ok) {
                const data = await res.json();
                setCertificates(data.certificates || []);
            }
        } catch (error) {
            console.error("Error fetching certificates:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleView = (cert: CertificateRecord) => {
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

    const handleDownload = async (cert: CertificateRecord) => {
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

        // Log this activity
        try {
            await fetch("/api/downloads/log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: `Certificate: ${cert.courseName}`,
                    type: "certificate"
                })
            });
        } catch (err) {
            console.error("Failed to log certificate download:", err);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return isNaN(date.getTime())
            ? "N/A"
            : date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            });
    };

    return (
        <div className="min-h-full">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#2C4276] flex items-center gap-3">
                    <Award className="text-blue-500" size={28} />
                    My Certificates
                </h1>
                <p className="text-gray-500 mt-1 text-sm">
                    View and download your course completion certificates
                </p>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                    <p className="text-gray-500 animate-pulse">Loading certificates...</p>
                </div>
            ) : certificates.length === 0 ? (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Award className="text-blue-300" size={40} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-700 mb-2">No Certificates Yet</h2>
                    <p className="text-gray-400 max-w-md mx-auto">
                        Complete your enrolled courses to receive your industry-recognized certificates. They will appear here once generated by the admin.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((cert) => (
                        <div
                            key={cert._id}
                            className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
                        >
                            {/* Card preview — mini certificate visual */}
                            <div className="bg-gradient-to-br from-[#2C4276] to-blue-500 p-6 text-white relative overflow-hidden">
                                {/* Decorative corner */}
                                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full" />
                                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-tr-full" />

                                <Award size={32} className="mb-3 opacity-80" />
                                <h3 className="font-bold text-lg truncate">{cert.courseName}</h3>
                                <p className="text-blue-200 text-sm mt-1">
                                    Completed on {formatDate(cert.completionDate)}
                                </p>
                                <div className="mt-3 px-2 py-1 bg-white/15 rounded-md inline-block text-xs font-mono">
                                    {cert.certificateNumber}
                                </div>
                            </div>

                            {/* Card body */}
                            <div className="p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Issued</p>
                                        <p className="font-medium text-gray-800 text-sm">
                                            {formatDate(cert.createdAt)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleView(cert)}
                                            className="text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="View Certificate"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDownload(cert)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                            title="Download Certificate"
                                        >
                                            <Download size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Preview Modal */}
            {showPreview && previewCanvas && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden">
                        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold text-[#2C4276] flex items-center gap-2">
                                <Award size={20} />
                                Certificate — {previewName}
                            </h2>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="p-4 bg-gray-100 flex justify-center max-h-[55vh] overflow-y-auto">
                            <img
                                src={previewCanvas.toDataURL("image/png")}
                                alt={`Certificate for ${previewName}`}
                                className="max-w-full max-h-[50vh] object-contain rounded-lg shadow-lg border border-gray-200"
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
                                onClick={() => {
                                    if (previewCanvas) downloadCertificate(previewCanvas, previewName);
                                }}
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
