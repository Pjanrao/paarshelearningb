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
    Search,
    Loader2,
    Trash2,
    Eye,
    Pencil,
    BookOpen,
    CheckCircle2,
    AlertCircle,
    X
} from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { useBulkUploadEntranceQuestionsMutation, useFetchEntranceQuestionsQuery, useDeleteEntranceQuestionMutation } from "@/redux/api";

interface QuestionPreview {
    question: string;
    options: { text: string; isCorrect: boolean }[];
    correctAnswer: string;
    category: string;
    explanation?: string;
}

export default function EntranceBulkUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<QuestionPreview[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [repoSearchTerm, setRepoSearchTerm] = useState("");
    const [repoCategoryFilter, setRepoCategoryFilter] = useState("all");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [showProtocol, setShowProtocol] = useState(false);

    const [bulkUpload] = useBulkUploadEntranceQuestionsMutation();
    const { data: allQuestions = [], isLoading: isLoadingQuestions, refetch } = useFetchEntranceQuestionsQuery();
    const [deleteQuestion] = useDeleteEntranceQuestionMutation();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            const isExcel = selectedFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            const isCSV = selectedFile.type === "text/csv";
            if (isExcel || isCSV) {
                setFile(selectedFile);
                parseFile(selectedFile);
            } else {
                toast.error("Invalid file format. Please upload XLSX or CSV.");
            }
        }
    };

    const downloadCSVSample = () => {
        const csvContent = `question,option1,option2,option3,option4,correctAnswer,category,explanation
What is 2+2?,2,3,4,5,4,quantitative,Basic addition`;

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "sample_questions.csv";
        link.click();
    };
    const downloadJSONSample = () => {
        const jsonData = [
            {
                question: "What is 2+2?",
                options: [
                    { text: "2", isCorrect: false },
                    { text: "3", isCorrect: false },
                    { text: "4", isCorrect: true },
                    { text: "5", isCorrect: false }
                ],
                category: "quantitative",
                explanation: "Basic addition",
                correctAnswer: "4",

            }
        ];

        const blob = new Blob([JSON.stringify(jsonData, null, 2)], {
            type: "application/json"
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "sample_questions.json";
        link.click();
    };

    const parseFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target?.result;
            const workbook = XLSX.read(data, { type: "binary" });
            let allParsedQuestions: QuestionPreview[] = [];

            // Loop through all sheets in the workbook
            workbook.SheetNames.forEach(sheetName => {
                const sheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(sheet) as any[];

                const sheetQuestions = jsonData.map((row: any) => {
                    // Normalize keys for flexible header matching
                    const normalizedRow: any = {};
                    Object.keys(row).forEach(key => {
                        const normalizedKey = key.toLowerCase().replace(/[\s_]/g, '');
                        normalizedRow[normalizedKey] = row[key];
                    });

                    const qText = normalizedRow.question || normalizedRow.ques || normalizedRow.q || "";
                    let correctAnsValue = (normalizedRow.correctanswer || normalizedRow.answer || "").toString().trim();

                    const optA = (normalizedRow.optiona || normalizedRow.option1)?.toString() || "";
                    const optB = (normalizedRow.optionb || normalizedRow.option2)?.toString() || "";
                    const optC = (normalizedRow.optionc || normalizedRow.option3)?.toString() || "";
                    const optD = (normalizedRow.optiond || normalizedRow.option4)?.toString() || "";

                    // Answer Detection: Check if it's a reference (A,B,C,D) or the actual text
                    let correctAnswerText = correctAnsValue;
                    const normalizedAns = correctAnsValue.toUpperCase();

                    if (normalizedAns === "A" || normalizedAns === "OPTIONA" || normalizedAns === "1") correctAnswerText = optA;
                    else if (normalizedAns === "B" || normalizedAns === "OPTIONB" || normalizedAns === "2") correctAnswerText = optB;
                    else if (normalizedAns === "C" || normalizedAns === "OPTIONC" || normalizedAns === "3") correctAnswerText = optC;
                    else if (normalizedAns === "D" || normalizedAns === "OPTIOND" || normalizedAns === "4") correctAnswerText = optD;

                    const opts = [
                        { text: optA, isCorrect: optA === correctAnswerText && optA !== "" },
                        { text: optB, isCorrect: optB === correctAnswerText && optB !== "" },
                        { text: optC, isCorrect: optC === correctAnswerText && optC !== "" },
                        { text: optD, isCorrect: optD === correctAnswerText && optD !== "" },
                    ].filter(o => o.text);

                    // Use row category or default to sheet name if sheet name matches our categories
                    let category = (normalizedRow.category)?.toString().toLowerCase() || sheetName.toLowerCase().split(' ')[0];

                    return {
                        question: qText.toString().trim(),
                        options: opts,
                        correctAnswer: correctAnswerText,
                        category: category,
                        explanation: (normalizedRow.explanation)?.toString() || "",
                    };
                }).filter(q => {
                    const hasCorrectOption = q.options.some(o => o.isCorrect);
                    return q.question && q.correctAnswer && q.options.length >= 2 && hasCorrectOption;
                });

                allParsedQuestions = [...allParsedQuestions, ...sheetQuestions];
            });

            setPreview(allParsedQuestions);
            if (allParsedQuestions.length > 0) {
                toast.success(`${allParsedQuestions.length} questions parsed from ${workbook.SheetNames.length} sheets`);
            }
        };
        reader.readAsBinaryString(file);
    };

    const handleUpload = async () => {
        if (preview.length === 0) return;
        setIsUploading(true);
        try {
            await bulkUpload({ questions: preview }).unwrap();
            toast.success("Questions uploaded successfully");
            setFile(null);
            setPreview([]);
            if (fileInputRef.current) fileInputRef.current.value = "";
            refetch(); // Refresh the list of all questions
        } catch (err: any) {
            toast.error(err?.data?.message || "Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteQuestion = async (id: string) => {
        if (!confirm("Are you sure you want to delete this question?")) return;
        try {
            await deleteQuestion(id).unwrap();
            toast.success("Question deleted successfully");
            refetch();
        } catch (err: any) {
            toast.error("Delete failed");
        }
    };

    const filteredPreview = preview.filter(q => {
        const matchesSearch = q.question.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === "all" || q.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const filteredRepo = allQuestions.filter((q: any) => {
        const matchesSearch = q.question.toLowerCase().includes(repoSearchTerm.toLowerCase());
        const matchesCategory = repoCategoryFilter === "all" || q.category === repoCategoryFilter;
        return matchesSearch && matchesCategory;
    });



    const getCategoryColor = (category: string) => {
        switch (category) {
            // case "aptitude": return "bg-blue-100 text-blue-700";
            case "logical": return "bg-purple-100 text-purple-700";
            case "quantitative": return "bg-green-100 text-green-700";
            case "verbal": return "bg-yellow-100 text-yellow-700";
            case "technical": return "bg-orange-100 text-orange-700";
            default: return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="bg-gray-50 h-full">
            <div className="mb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <h1 className="text-3xl font-bold text-[#2C4276]">
                        Bulk Upload Questions
                    </h1>

                    <div className="flex gap-3">
                        {/* NEW BUTTON */}
                        <button
                            onClick={() => setShowProtocol(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm font-medium shadow-sm"
                        >
                            <BookOpen size={18} />
                            View Protocols
                        </button>

                        {preview.length > 0 && (
                            <button
                                onClick={handleUpload}
                                disabled={isUploading}
                                className="bg-[#2C4276] text-white px-4 py-2 rounded-lg flex items-center gap-2"
                            >
                                {isUploading ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                                {isUploading ? "Uploading..." : `Upload ${preview.length} Questions`}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Upload Area */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
                <div className="p-8">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer hover:border-[#2C4276] hover:bg-gray-50 ${file ? "border-green-400 bg-green-50/30" : "border-gray-200"}`}
                    >
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx,.csv,.json" className="hidden" />
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${file ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                            {file ? <CheckCircle2 size={32} /> : <Upload size={32} />}
                        </div>
                        <h2 className="text-lg font-bold text-gray-900 mb-1">
                            {file ? "File Loaded Successfully" : "Upload Question File"}
                        </h2>
                        <p className="text-gray-400 text-sm text-center max-w-sm">
                            {file ? `${file.name} — ${preview.length} questions parsed` : "Drag & drop or click to select an XLSX or CSV file"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Header Mismatch Alert */}
            {file && preview.length === 0 && (
                <div className="mx-8 mb-6 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="text-orange-500 shrink-0" size={20} />
                    <div>
                        <h3 className="text-sm font-bold text-orange-800">No questions could be parsed</h3>
                        <p className="text-xs text-orange-700 mt-1">
                            Your file might have missing headers or incorrect column names.
                            The system looks for: <code className="bg-orange-100 px-1 rounded">Question</code>,
                            <code className="bg-orange-100 px-1 rounded">CorrectAnswer</code>, and
                            <code className="bg-orange-100 px-1 rounded">OptionA</code> through <code className="bg-orange-100 px-1 rounded">OptionD</code>.
                        </p>
                    </div>
                </div>
            )}

            {/* Questions Preview Table */}
            {preview.length > 0 && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-4 border-b bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="text-sm font-medium text-gray-600">
                            {filteredPreview.length} of {preview.length} questions
                        </div>
                        <div className="flex gap-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search questions..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none text-sm w-56 text-gray-600"
                                />
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                            </div>
                            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                <SelectTrigger className="h-10 w-40 border rounded-lg text-sm">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem value="aptitude">Aptitude</SelectItem>
                                    <SelectItem value="logical">Logical</SelectItem>
                                    <SelectItem value="quantitative">Quantitative</SelectItem>
                                    <SelectItem value="verbal">Verbal</SelectItem>
                                    <SelectItem value="technical">Technical</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="custom-scrollbar-container overflow-x-scroll overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 h-[430px] sm:max-h-[600px] border-t pb-4 sm:pb-0">
                        <table className="w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 border-b sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">#</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Question</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Options</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredPreview.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-20">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <AlertCircle className="text-gray-400" size={32} />
                                            </div>
                                            <p className="text-gray-500 text-lg font-medium">No questions match your filter</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPreview.map((q, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{idx + 1}</td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-gray-900 max-w-md">{q.question}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {q.options.map((opt, i) => (
                                                        <span
                                                            key={i}
                                                            className={`px-2 py-0.5 rounded text-[11px] font-medium border ${opt.isCorrect ? "bg-green-50 border-green-200 text-green-700 font-bold" : "bg-white border-gray-200 text-gray-500"}`}
                                                        >
                                                            {String.fromCharCode(65 + i)}. {opt.text}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(q.category)}`}>
                                                    {q.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => setPreview(prev => prev.filter((_, i) => i !== idx))}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Remove"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* All Questions Repository */}
            <div className="mt-12 mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-[#2C4276]">Question Repository</h2>
                    <p className="text-sm text-gray-500">View and manage all uploaded entrance exam questions</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-xl shadow-sm border text-sm font-bold text-[#2C4276]">
                    Total: {allQuestions.length} Questions
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-10">
                <div className="p-4 border-b bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="text-sm font-medium text-gray-600">
                        {filteredRepo.length} of {allQuestions.length} questions
                    </div>
                    <div className="flex gap-3">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search repository..."
                                value={repoSearchTerm}
                                onChange={e => setRepoSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none text-sm w-56 text-gray-600"
                            />
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        </div>
                        <Select value={repoCategoryFilter} onValueChange={setRepoCategoryFilter}>
                            <SelectTrigger className="h-10 w-40 border rounded-lg text-sm">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                <SelectItem value="aptitude">Aptitude</SelectItem>
                                <SelectItem value="logical">Logical</SelectItem>
                                <SelectItem value="quantitative">Quantitative</SelectItem>
                                <SelectItem value="verbal">Verbal</SelectItem>
                                <SelectItem value="technical">Technical</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {isLoadingQuestions ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="animate-spin text-[#2C4276]" size={40} />
                        <p className="text-gray-500 font-medium italic">Synchronizing repository...</p>
                    </div>
                ) : allQuestions.length === 0 ? (
                    <div className="text-center py-20 border-b">
                        <AlertCircle className="mx-auto text-gray-300 mb-4" size={48} />
                        <p className="text-gray-500 text-lg font-medium">No questions found in database</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto max-h-[600px] custom-scrollbar-container">
                        <table className="w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50 border-b sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">#</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Question</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Options</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredRepo.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-20">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <AlertCircle className="text-gray-400" size={32} />
                                            </div>
                                            <p className="text-gray-500 text-lg font-medium">No archived questions match your filter</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredRepo.map((q: any, idx: number) => (
                                        <tr key={q._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{idx + 1}</td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-medium text-gray-900 max-w-md">{q.question}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {q.options?.map((opt: any, i: number) => (
                                                        <span
                                                            key={i}
                                                            className={`px-2 py-0.5 rounded text-[11px] font-medium border ${opt.isCorrect ? "bg-green-50 border-green-200 text-green-700 font-bold" : "bg-white border-gray-200 text-gray-500"}`}
                                                        >
                                                            {String.fromCharCode(65 + i)}. {opt.text}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getCategoryColor(q.category)}`}>
                                                    {q.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => handleDeleteQuestion(q._id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    )))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
            {showProtocol && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg overflow-hidden">

                        {/* HEADER */}
                        <div className="bg-[#1E2A4A] text-white px-6 py-4 flex justify-between items-center">
                            <h2 className="text-lg font-bold">Ingestion Protocol Specifications</h2>
                            <button onClick={() => setShowProtocol(false)}>
                                <X />
                            </button>
                        </div>

                        {/* BODY */}
                        <div className="p-6 grid md:grid-cols-2 gap-6">

                            {/* JSON */}
                            <div className="border rounded-xl p-4">
                                <h3 className="font-bold mb-2">JSON Protocol</h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Array of objects with question, options and correctness flag.
                                </p>

                                <button
                                    onClick={downloadJSONSample}
                                    className="w-full border rounded-lg py-2 hover:bg-gray-50 font-medium"
                                >
                                    Download JSON Sample
                                </button>
                            </div>

                            {/* CSV */}
                            <div className="border rounded-xl p-4">
                                <h3 className="font-bold mb-2">CSV Protocol</h3>
                                <p className="text-sm text-gray-500 mb-4">
                                    Headers: question, option1–4, correctAnswer, category, explanation
                                </p>

                                <button
                                    onClick={downloadCSVSample}
                                    className="w-full border rounded-lg py-2 hover:bg-gray-50 font-medium"
                                >
                                    Download CSV Sample
                                </button>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="p-4 flex justify-end">
                            <button
                                onClick={() => setShowProtocol(false)}
                                className="bg-[#1E2A4A] text-white px-6 py-2 rounded-lg"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
