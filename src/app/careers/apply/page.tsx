"use client";

import { useApplyJobMutation } from "@/redux/api/jobApi";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Send, CheckCircle, ChevronLeft, FileText } from "lucide-react";
import Link from "next/link";

function ApplyForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const jobId = searchParams.get("jobId");

    const [applyJob, { isLoading }] = useApplyJobMutation();
    const [isSuccess, setIsSuccess] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        jobId: jobId || "",
    });
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resumeFile) {
            alert("Please upload your resume.");
            return;
        }

        try {
            // 1. Upload the file
            const formData = new FormData();
            formData.append("file", resumeFile);

            const uploadRes = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) throw new Error("Upload failed");
            const { url: resumeUrl } = await uploadRes.json();

            // 2. Submit application
            await applyJob({
                ...form,
                resumeUrl: resumeUrl,
            }).unwrap();

            setIsSuccess(true);
            setTimeout(() => {
                router.push("/careers");
            }, 3000);
        } catch (error) {
            alert("Failed to submit application. Please try again.");
            console.error(error);
        }
    };

    if (isSuccess) {
        return (
            <div className="text-center py-12 px-6">
                <div className="mx-auto w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-2xl font-bold text-midnight_text mb-2">Application Submitted!</h3>
                <p className="text-grey mb-8">Thank you for applying. We will review your application and get back to you soon.</p>
                <Link href="/careers" className="inline-flex items-center text-primary font-medium hover:text-primary/80">
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Back to careers
                </Link>
            </div>
        );
    }

    return (
        <div className="p-8 sm:p-10">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-midnight_text mb-2">Submit Application</h2>
                <p className="text-grey text-sm">Please fill out the form below to apply for this position.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            placeholder="John Doe"
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                placeholder="john@example.com"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </div>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="phone"
                                type="tel"
                                required
                                placeholder="+1 (555) 000-0000"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                            Resume Upload <span className="text-red-500">*</span>
                        </label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-primary transition-colors cursor-pointer relative">
                            <div className="space-y-1 text-center">
                                <FileText className={`mx-auto h-12 w-12 ${resumeFile ? "text-primary" : "text-gray-400"}`} />
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="resume"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none"
                                    >
                                        <span>{resumeFile ? "Change Resume" : "Upload a file"}</span>
                                        <input
                                            id="resume"
                                            name="resume"
                                            type="file"
                                            className="sr-only"
                                            required={!resumeFile}
                                            accept=".pdf,.doc,.docx"
                                            onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                                        />
                                    </label>
                                    {!resumeFile && <p className="pl-1">or drag and drop</p>}
                                </div>
                                <p className="text-xs text-gray-500">
                                    {resumeFile ? resumeFile.name : "PDF, DOC, DOCX up to 10MB"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center px-6 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
                    >
                        {isLoading ? (
                            <div className="flex items-center">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                Submitting...
                            </div>
                        ) : (
                            <>
                                Submit Application
                                <Send className="w-4 h-4 ml-2" />
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function Apply() {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-section py-12 px-4 sm:px-6 flex items-center justify-center relative overflow-hidden">
            {/* Background elements to match brand styling */}
            <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] z-0 pointer-events-none"></div>

            <div className="max-w-xl w-full z-10 relative">
                <button
                    onClick={() => router.back()}
                    className="inline-flex items-center text-sm font-medium text-grey hover:text-primary mb-6 transition-colors pl-2"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                </button>
                <div className="bg-white/80 backdrop-blur-xl rounded-[40px] shadow-deatail_shadow border border-white/40 overflow-hidden">
                    <Suspense fallback={<div className="p-12 pl-12 text-center text-grey">Loading form...</div>}>
                        <ApplyForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}