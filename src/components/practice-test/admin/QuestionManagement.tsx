"use client";

import { useState, useRef } from "react";
import { useGetQuestionsByTestIdQuery } from "@/redux/api/questionApi";
import { useGetPracticeTestByIdQuery, useBulkUploadQuestionsMutation } from "@/redux/api/practiceTestApi";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ArrowLeft, 
  CheckCircle2, 
  Upload, 
  FileSearch, 
  BookOpen, 
  X, 
  Download, 
  Loader2,
  AlertCircle
} from "lucide-react";
import AddQuestionModal from "./AddQuestionModal";
import EditQuestionModal from "./EditQuestionModal";
import DeleteQuestionDialog from "./DeleteQuestionDialog";
import Link from "next/link";
import { toast } from "sonner";

export default function QuestionManagement({ testId }: { testId: string }) {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<any>(null);
  const [deletingQuestion, setDeletingQuestion] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showProtocol, setShowProtocol] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: test, isLoading: isTestLoading } = useGetPracticeTestByIdQuery(testId);
  const { data: questions, isLoading: isQuestionsLoading } = useGetQuestionsByTestIdQuery(testId);
  const [bulkUpload] = useBulkUploadQuestionsMutation();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const isCSV = selectedFile.type === "text/csv" || selectedFile.name.endsWith(".csv");
      const isJSON = selectedFile.type === "application/json" || selectedFile.name.endsWith(".json");
      
      if (isCSV || isJSON) {
        setFile(selectedFile);
        toast.success(`File "${selectedFile.name}" selected`);
      } else {
        toast.error("Invalid file format. Please upload CSV or JSON.");
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const content = e.target?.result as string;
        const fileType = file.name.endsWith(".json") ? "json" : "csv";

        try {
          const result = await bulkUpload({
            testId,
            fileContent: content,
            fileType: fileType as "csv" | "json"
          }).unwrap();

          if (result.success) {
            toast.success(`${result.count} questions uploaded successfully!`);
            setFile(null);
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

  const downloadCSVSample = () => {
    const headers = "questionText,option1,option2,option3,option4,correctIndex,marks";
    const sampleRow = "\nWhat is the capital of France?,London,Berlin,Paris,Madrid,2,1";
    const csvContent = headers + sampleRow;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sample_questions_${test?.name || "test"}.csv`;
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
    link.download = `sample_questions_${test?.name || "test"}.json`;
    link.click();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/practice-tests">
            <Button variant="outline" size="icon" className="rounded-full">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#2C4276]">
              {isTestLoading ? "Loading..." : `Manage Questions: ${test?.name}`}
            </h1>
            <p className="text-gray-500 text-sm">
              {questions?.length || 0} Questions Total
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowProtocol(true)}
            className="flex items-center gap-2 border-gray-200 hover:bg-gray-50 text-[#2C4276] font-bold"
          >
            <BookOpen size={18} /> View Protocol
          </Button>
          <Button
            onClick={() => setAddOpen(true)}
            className="bg-[#2C4276] hover:bg-[#1e2e52] text-white flex items-center gap-2 font-bold"
          >
            <Plus size={18} /> Add Question
          </Button>
        </div>
      </div>

      {/* DIRECT UPLOAD AREA */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 w-full">
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all cursor-pointer ${
                file ? "border-green-400 bg-green-50/30" : "border-gray-200 hover:border-blue-400 hover:bg-blue-50/30"
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept=".csv,.json" 
                className="hidden" 
              />
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                file ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
              }`}>
                {file ? <CheckCircle2 size={24} /> : <Upload size={24} />}
              </div>
              <h3 className="text-sm font-bold text-gray-900">
                {file ? "File Ready: " + file.name : "Upload Question File"}
              </h3>
              <p className="text-xs text-gray-400 mt-1 italic">
                {file ? `${(file.size / 1024).toFixed(1)} KB` : "Supports CSV or JSON (aligned with protocols)"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <Button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className={`h-14 px-8 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-all ${
                !file || isUploading ? "bg-gray-100 text-gray-400" : "bg-[#2C4276] text-white hover:bg-[#1e2e52]"
              }`}
            >
              {isUploading ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
              {isUploading ? "Uploading..." : "Confirm & Import"}
            </Button>
            {file && (
              <Button
                variant="ghost"
                onClick={() => { setFile(null); if(fileInputRef.current) fileInputRef.current.value = ""; }}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 font-bold"
              >
                Clear Selection
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* QUESTIONS LIST */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isQuestionsLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-50 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : questions?.length === 0 ? (
          <div className="p-20 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4 border-2 border-dashed">
              <FileSearch size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Repository Empty</h3>
            <p className="text-gray-400 text-sm mt-1 max-w-xs mx-auto">
              Please upload a question file above or add questions manually to populate this test.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#2C4276]/5 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#2C4276] uppercase tracking-widest">#</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#2C4276] uppercase tracking-widest">Question Details</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#2C4276] uppercase tracking-widest">Options (Correct in Green)</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#2C4276] uppercase tracking-widest text-center">Marks</th>
                  <th className="px-6 py-4 text-[11px] font-bold text-[#2C4276] uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {questions?.map((q: any, index: number) => (
                  <tr key={q._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-bold text-gray-400 font-mono italic">
                      {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-[#2C4276] leading-relaxed max-w-md">
                        {q.questionText}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {q.options.map((option: string, optIndex: number) => (
                          <span
                            key={optIndex}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                              q.correctAnswer === optIndex
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm"
                                : "bg-white text-gray-400 border-gray-100"
                            }`}
                          >
                            {String.fromCharCode(65 + optIndex)}. {option}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg text-[10px] font-bold border border-blue-100 uppercase tracking-tighter">
                        {q.marks} {q.marks === 1 ? 'Pt' : 'Pts'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditingQuestion(q);
                            setEditOpen(true);
                          }}
                          className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-transparent hover:border-blue-100"
                          title="Edit"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => setDeletingQuestion(q)}
                          className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PROTOCOL MODAL */}
      {showProtocol && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="bg-[#1D2B4A] text-white px-8 py-6 flex justify-between items-center bg-gradient-to-r from-[#1D2B4A] to-[#2C4276]">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Ingestion Protocol Specifications</h2>
                <p className="text-blue-200 text-xs mt-1 font-medium italic">Standard formatting requirements for bulk question imports</p>
              </div>
              <button 
                onClick={() => setShowProtocol(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            <div className="p-10 grid md:grid-cols-2 gap-8">
              {/* JSON Card */}
              <div className="border border-gray-100 rounded-3xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                    <FileSearch size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-[#1D2B4A]">JSON Protocol</h3>
                </div>
                <p className="text-sm text-gray-500 mb-8 leading-relaxed font-medium">
                  Array of objects containing question text, multiple choice options, correct answer index, and point value.
                </p>
                <button
                  onClick={downloadJSONSample}
                  className="w-full border-2 border-gray-100 rounded-2xl py-4 hover:border-blue-200 hover:bg-blue-50/30 font-bold text-[#1D2B4A] transition-all flex items-center justify-center gap-3 group-hover:scale-[1.02] active:scale-95"
                >
                  <Download size={20} className="text-blue-500" />
                  Download JSON Sample
                </button>
              </div>

              {/* CSV Card */}
              <div className="border border-gray-100 rounded-3xl p-8 bg-white shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                    <Download size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-[#1D2B4A]">CSV Protocol</h3>
                </div>
                <p className="text-sm text-gray-500 mb-8 leading-relaxed font-medium">
                  Columns: questionText, option1, option2, option3, option4, correctIndex (0-3), and marks.
                </p>
                <button
                  onClick={downloadCSVSample}
                  className="w-full border-2 border-gray-100 rounded-2xl py-4 hover:border-blue-200 hover:bg-blue-50/30 font-bold text-[#1D2B4A] transition-all flex items-center justify-center gap-3 group-hover:scale-[1.02] active:scale-95"
                >
                  <Download size={20} className="text-emerald-500" />
                  Download CSV Sample
                </button>
              </div>
            </div>

            <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex justify-center px-10">
              <button
                onClick={() => setShowProtocol(false)}
                className="bg-[#1D2B4A] text-white px-12 py-3.5 rounded-2xl font-bold hover:bg-[#152038] transition-all shadow-xl shadow-blue-100 active:scale-95"
              >
                Got it, Thank you!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}
      <AddQuestionModal open={addOpen} setOpen={setAddOpen} testId={testId} />
      <EditQuestionModal open={editOpen} setOpen={setEditOpen} question={editingQuestion} />
      <DeleteQuestionDialog question={deletingQuestion} setQuestion={setDeletingQuestion} />
    </div>
  );
}
