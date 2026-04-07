"use client";

import { useGetQuestionsByTestIdQuery } from "@/redux/api/questionApi";
import { Button } from "@/components/ui/button";
import { Award, CheckCircle2, XCircle, Home, RefreshCcw, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ResultView({
  result,
  testName,
}: {
  result: any;
  testName?: string;
}) {
  const { data: questions, isLoading } = useGetQuestionsByTestIdQuery(result.testId);

  const percentage = Math.round((result.score / result.totalMarks) * 100);
  const isPassed = percentage >= 40; // Assuming 40% is passing for practice tests

  if (isLoading) return <div className="p-12 text-center">Loading Result Details...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* SUMMARY CARD */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-blue-50 overflow-hidden relative group">
        <div className={`h-2 w-full ${isPassed ? 'bg-green-500' : 'bg-red-500'}`} />
        <div className="p-8 md:p-12 flex flex-col items-center text-center">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className={`w-28 h-28 rounded-3xl flex items-center justify-center mb-6 shadow-2xl ${
                isPassed ? 'bg-green-100 text-green-600 shadow-green-100' : 'bg-red-100 text-red-600 shadow-red-100'
                }`}
            >
                <Award size={56} className="drop-shadow-sm" />
            </motion.div>

            <h2 className="text-3xl md:text-4xl font-black text-[#2C4276] mb-2 uppercase tracking-tight">
                {isPassed ? "Outstanding Performance!" : "Keep Practicing!"}
            </h2>
            <p className="text-gray-500 font-bold mb-10 uppercase tracking-widest text-sm">
                Result for {testName || "Practice Test"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl mb-12">
                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 group-hover:scale-105 transition-transform duration-300">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Score</p>
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-4xl font-black text-[#2C4276]">{result.score}</span>
                        <span className="text-gray-300 text-2xl">/</span>
                        <span className="text-xl font-bold text-gray-400">{result.totalMarks}</span>
                    </div>
                </div>
                <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100 group-hover:scale-105 transition-transform duration-300">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-2">Percentage</p>
                    <span className="text-4xl font-black text-blue-600">{percentage}%</span>
                </div>
                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 group-hover:scale-105 transition-transform duration-300">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Questions</p>
                    <span className="text-4xl font-black text-[#2C4276]">{result.answers.length}</span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                <Link href="/student/tests" className="flex-1 max-w-[240px]">
                    <Button className="w-full bg-[#2C4276] hover:bg-[#1e2e52] rounded-2xl h-14 font-black flex items-center justify-center gap-2 group-hover:shadow-2xl transition-all shadow-lg">
                        <Home size={20} /> Dashboard
                    </Button>
                </Link>
                <Button
                    onClick={() => window.location.reload()}
                    variant="outline"
                    className="flex-1 max-w-[240px] rounded-2xl h-14 border-2 font-black border-gray-100 text-gray-500 hover:bg-gray-50"
                >
                    <RefreshCcw size={20} className="mr-2" /> Retake Test
                </Button>
            </div>
        </div>
      </div>

      {/* QUESTION BREAKDOWN */}
      <div className="space-y-4">
        <h3 className="text-2xl font-black text-[#2C4276] uppercase tracking-tight ml-2">Review Answers</h3>
        {result.answers.map((ans: any, i: number) => {
          const question = questions?.find((q) => q._id === ans.questionId);
          if (!question) return null;

          return (
            <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden p-6 md:p-8 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <span className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg ${
                    ans.isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                }`}>
                    {i + 1}
                </span>
                <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                    ans.isCorrect ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'
                }`}>
                    {ans.isCorrect ? "Correct" : "Incorrect"}
                </span>
              </div>

              <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-8 leading-relaxed">
                {question.questionText}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {question.options.map((opt: string, optIdx: number) => {
                  const isUserSelected = ans.selectedOption === optIdx;
                  const isCorrectAnswer = question.correctAnswer === optIdx;

                  let borderClass = "border-gray-100";
                  let bgClass = "bg-gray-50/50";
                  let icon = null;

                  if (isCorrectAnswer) {
                    borderClass = "border-green-300 shadow-sm";
                    bgClass = "bg-green-50/80 text-green-700";
                    icon = <CheckCircle2 size={20} className="text-green-600" />;
                  } else if (isUserSelected && !isCorrectAnswer) {
                    borderClass = "border-red-300 shadow-sm";
                    bgClass = "bg-red-50/80 text-red-700";
                    icon = <XCircle size={20} className="text-red-600" />;
                  }

                  return (
                    <div
                      key={optIdx}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${borderClass} ${bgClass}`}
                    >
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs border ${
                        isCorrectAnswer ? "bg-green-600 text-white border-green-600" :
                        isUserSelected ? "bg-red-600 text-white border-red-600" :
                        "bg-white text-gray-400 border-gray-100"
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="flex-1 text-sm font-bold">{opt}</span>
                      {icon}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
