"use client";

import { useState, useRef } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Upload,
    Loader2,
    CheckCircle2,
    AlertCircle,
    X,
    FileSearch,
    Download,
    BookOpen
} from "lucide-react";
import { toast } from "sonner";
import { useGetPracticeTestsQuery, useBulkUploadQuestionsMutation } from "@/redux/api/practiceTestApi";

const BulkUploadQuestions = () => {
    const [file, setFile] = useState<File | null>(null);
    const [selectedTestId, setSelectedTestId] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);
    const [showProtocol, setShowProtocol] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data: testsData } = useGetPracticeTestsQuery({ limit: 100 });
    const [bulkUpload] = useBulkUploadQuestionsMutation();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const isCSV = selectedFile.type === "text/csv" || selectedFile.name.endsWith(".csv");
            const isJSON = selectedFile.type === "application/json" || selectedFile.name.endsWith(".json");
            
            if (isCSV || isJSON) {
                setFile(selectedFile);
            } else {
                toast.error("Invalid file format. Please upload CSV or JSON.");
            }
        }
    };

    const downloadCSVSample = () => {
        const headers = "questionText,option1,option2,option3,option4,correctIndex,marks";
        const sampleRow = "\nWhat is the capital of France?,London,Berlin,Paris,Madrid,2,1";
        const csvContent = headers + sampleRow;
        
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "practice_questions_sample.csv";
        link.click();
    };

    const downloadJSONSample = () => {
        const jsonData = {
            questions: [
                {
                    questionText: "What is the capital of France?",
                    option1: "London",
                    option2: "Berlin",
                    option3: "Paris",
                    option4: "Madrid",
                    correctIndex: 2,
                    marks: 1
                }
            ]
        };

        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "practice_questions_sample.json";
        link.click();
    };

    const handleUpload = async () => {
        if (!selectedTestId) {
            toast.error("Please select a practice test first");
            return;
        }
        if (!file) {
            toast.error("Please select a file to upload");
            return;
        }

        setIsUploading(true);
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const content = e.target?.result as string;
                const fileType = file.name.endsWith(".json") ? "json" : "csv";

                try {
                    const result = await bulkUpload({
                        testId: selectedTestId,
                        fileContent: content,
                        fileType: fileType as "csv" | "json"
                    }).unwrap();

                    if (result.success) {
                        toast.success(`${result.count} questions uploaded successfully!`);
                        setFile(null);
                        setSelectedTestId("");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                    }
                } catch (err: any) {
                    toast.error(err?.data?.message || "Upload failed. Please check your file format.");
                } finally {
                    setIsUploading(false);
                }
            };
            reader.readAsText(file);
        } catch (error) {
            toast.error("Error reading file");
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50">
                <div>
                    <h2 className="text-xl font-bold text-[#2C4276] flex items-center gap-2">
                        <Upload size={20} className="text-blue-500" />
                        Bulk Upload Questions
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5 font-medium">Add multiple questions to a practice test at once</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button
                        onClick={downloadCSVSample}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-bold text-[#2C4276] transition-all shadow-sm"
                    >
                        <Download size={16} />
                        Sample CSV
                    </button>
                    <button
                        onClick={() => setShowProtocol(true)}
                        className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-bold text-[#2C4276] transition-all shadow-sm"
                    >
                        <BookOpen size={16} />
                        View Protocols
                    </button>
                </div>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left: Test Selection & Info */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-[#2C4276] mb-2 px-1 text-secondary-text">Select Practice Test</label>
                            <Select value={selectedTestId} onValueChange={setSelectedTestId}>
                                <SelectTrigger className="h-12 bg-gray-50 border-gray-100 rounded-xl focus:ring-[#2C4276] text-secondary-text">
                                    <SelectValue placeholder="Choose a test..." />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {testsData?.tests.map((test: any) => (
                                        <SelectItem key={test._id} value={test._id}>
                                            {test.name} ({test.skill})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4">
                            <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
                                <AlertCircle size={16} />
                                File Requirements
                            </h4>
                            <ul className="text-xs space-y-2 text-blue-600 font-medium">
                                <li className="flex items-center gap-2">• CSV Headers: <span className="font-mono bg-blue-100 px-1 rounded text-[10px]">questionText, option1, option2, option3, option4, correctIndex, marks</span></li>
                                <li className="flex items-center gap-2">• <span className="font-bold underline italic">correctIndex</span> should be <span className="font-mono bg-blue-100 px-1 rounded text-[10px]">0, 1, 2, or 3</span></li>
                                <li className="flex items-center gap-2">• UTF-8 encoding recommended</li>
                            </ul>
                        </div>
                    </div>

                    {/* Right: Dropzone */}
                    <div className="relative group">
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className={`h-full min-h-[180px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 transition-all cursor-pointer ${
                                file 
                                ? "border-green-400 bg-green-50/20" 
                                : "border-gray-100 bg-gray-50/30 hover:border-blue-300 hover:bg-blue-50/20"
                            }`}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept=".csv,.json"
                                className="hidden"
                            />
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-sm transition-transform group-hover:scale-110 ${
                                file ? "bg-green-100 text-green-600" : "bg-white text-blue-500"
                            }`}>
                                {file ? <CheckCircle2 size={30} /> : <FileSearch size={30} />}
                            </div>
                            <h3 className="text-sm font-bold text-gray-900 mb-1">
                                {file ? file.name : "Drag & Drop Question File"}
                            </h3>
                            <p className="text-[11px] text-gray-400 font-medium italic">
                                {file ? `${(file.size / 1024).toFixed(1)} KB — Ready to upload` : "Supports CSV and JSON formats"}
                            </p>

                            {file && (
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setFile(null); if(fileInputRef.current) fileInputRef.current.value = ""; }}
                                    className="absolute top-3 right-3 p-1.5 bg-white text-gray-400 hover:text-red-500 rounded-lg border border-gray-100 shadow-sm transition-colors"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-50 flex justify-end">
                    <button
                        onClick={handleUpload}
                        disabled={isUploading || !file || !selectedTestId}
                        className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg ${
                            isUploading || !file || !selectedTestId
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-[#2C4276] text-white hover:bg-[#1e2e52] shadow-blue-200"
                        }`}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Upload size={18} />
                                Confirm & Upload Questions
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Protocol Modal */}
            {showProtocol && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="bg-[#1D2B4A] text-white px-8 py-5 flex justify-between items-center">
                            <h2 className="text-xl font-bold tracking-tight">Ingestion Protocol Specifications</h2>
                            <button 
                                onClick={() => setShowProtocol(false)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-10 grid md:grid-cols-2 gap-8">
                            {/* JSON Card */}
                            <div className="border border-gray-100 rounded-2xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-xl font-bold text-[#1D2B4A] mb-3">JSON Protocol</h3>
                                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                                    Array of objects with question, options and correctness flag.
                                </p>
                                <button
                                    onClick={downloadJSONSample}
                                    className="w-full border-2 border-gray-100 rounded-xl py-4 hover:bg-gray-50 font-bold text-[#1D2B4A] transition-all flex items-center justify-center gap-2"
                                >
                                    <Download size={18} />
                                    Download JSON Sample
                                </button>
                            </div>

                            {/* CSV Card */}
                            <div className="border border-gray-100 rounded-2xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-xl font-bold text-[#1D2B4A] mb-3">CSV Protocol</h3>
                                <p className="text-sm text-gray-500 mb-8 leading-relaxed">
                                    Headers: question, option1–4, correctAnswer, category, explanation
                                </p>
                                <button
                                    onClick={downloadCSVSample}
                                    className="w-full border-2 border-gray-100 rounded-xl py-4 hover:bg-gray-50 font-bold text-[#1D2B4A] transition-all flex items-center justify-center gap-2"
                                >
                                    <Download size={18} />
                                    Download CSV Sample
                                </button>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-end px-10">
                            <button
                                onClick={() => setShowProtocol(false)}
                                className="bg-[#1D2B4A] text-white px-10 py-3 rounded-xl font-bold hover:bg-[#152038] transition-all shadow-lg shadow-blue-100"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BulkUploadQuestions;
