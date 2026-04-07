"use client";

import { useState, useEffect, useCallback } from "react";
import { useGetQuestionsByTestIdQuery } from "@/redux/api/questionApi";
import { useGetPracticeTestByIdQuery } from "@/redux/api/practiceTestApi";
import { useStartAttemptMutation, useSubmitAttemptMutation } from "@/redux/api/attemptApi";
import { Button } from "@/components/ui/button";
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import ResultView from "./ResultView";

export default function TestInterface({ testId }: { testId: string }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // in seconds
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  const { data: test, isLoading: isTestLoading } = useGetPracticeTestByIdQuery(testId);
  const { data: questions, isLoading: isQuestionsLoading } = useGetQuestionsByTestIdQuery(testId);
  const [startAttempt] = useStartAttemptMutation();
  const [submitAttempt, { isLoading: isSubmitting }] = useSubmitAttemptMutation();

  // Initialize Attempt
  useEffect(() => {
    const initAttempt = async () => {
      try {
        const res = await startAttempt({ testId }).unwrap();
        setAttemptId(res._id);
        if (test?.duration) {
          setTimeLeft(test.duration * 60);
        }
      } catch (err) {
        toast.error("Failed to initialize test attempt.");
      }
    };
    if (testId && !attemptId && test) {
      initAttempt();
    }
  }, [testId, startAttempt, attemptId, test]);

  // Handle Answer Selection
  const handleAnswerSelect = (optIndex: number) => {
    const newAnswers = [...answers];
    const existing = newAnswers.findIndex((a) => a.questionId === questions![currentIdx]._id);
    if (existing > -1) {
      newAnswers[existing].selectedOption = optIndex;
    } else {
      newAnswers.push({
        questionId: questions![currentIdx]._id,
        selectedOption: optIndex,
      });
    }
    setAnswers(newAnswers);
  };

  // Submit Logic
  const handleSubmit = useCallback(async () => {
    if (isSubmitted || !attemptId) return;
    try {
      const res = await submitAttempt({ attemptId, answers }).unwrap();
      setResult(res);
      setIsSubmitted(true);
      toast.success("Test submitted successfully!");
    } catch (err) {
      toast.error("Failed to submit test.");
    }
  }, [attemptId, answers, isSubmitted, submitAttempt]);

  // Timer Effect
  useEffect(() => {
    if (timeLeft === null || isSubmitted) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, handleSubmit]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (isTestLoading || isQuestionsLoading) {
    return <div className="p-12 text-center">Loading Test...</div>;
  }

  if (isSubmitted && result) {
    return <ResultView result={result} testName={test?.name} />;
  }

  if (!questions || questions.length === 0) {
    return <div className="p-12 text-center text-gray-500">No questions found for this test.</div>;
  }

  const currentQuestion = questions[currentIdx];
  const selectedOption = answers.find((a) => a.questionId === currentQuestion?._id)?.selectedOption;

  return (
    <div className="p-6 space-y-6">
      {/* TEST HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 mb-6 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-6 z-10">
        <div>
          <h2 className="text-xl font-bold text-[#2C4276] line-clamp-1">{test?.name}</h2>
          <p className="text-sm text-gray-500">
            Question {currentIdx + 1} of {questions.length}
          </p>
        </div>
        <div className={`flex items-center gap-3 px-6 py-2 rounded-xl border-2 transition-colors ${timeLeft && timeLeft < 60 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-blue-50 border-blue-100 text-[#2C4276]'
          }`}>
          <Clock size={24} />
          <span className="text-2xl font-black tabular-nums">
            {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
          </span>
        </div>
        <Button
          onClick={() => {
            if (confirm("Are you sure you want to submit the test?")) {
              handleSubmit();
            }
          }}
          disabled={isSubmitting}
          className="bg-[#2C4276] text-white py-2 rounded-lg hover:bg-blue-600"
        >
          {isSubmitting ? "Submitting..." : "Submit Test"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* MAIN QUESTION AREA */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-4"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-[#2C4276] text-white w-7 h-7 text-sm rounded-md flex items-center justify-center font-bold">
                  {currentIdx + 1}
                </span>

                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {currentQuestion.marks} Marks
                </span>
              </div>

              <h3 className="text-base font-semibold text-gray-800 mb-4">
                {currentQuestion.questionText}
              </h3>

              <div className="space-y-2">
                {currentQuestion.options.map((option: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => handleAnswerSelect(i)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-lg border text-sm transition ${selectedOption === i
                      ? "bg-blue-50 border-blue-400 text-[#2C4276]"
                      : "bg-white border-gray-200 hover:bg-gray-50"
                      }`}
                  >
                    <div className={`w-6 h-6 text-xs rounded-md flex items-center justify-center border ${selectedOption === i
                      ? "bg-[#2C4276] text-white border-[#2C4276]"
                      : "text-gray-400"
                      }`}>
                      {String.fromCharCode(65 + i)}
                    </div>

                    <span className="text-sm">{option}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* NAVIGATION BUTTONS */}
          <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <Button
              variant="outline"
              onClick={() => setCurrentIdx(prev => prev - 1)}
              disabled={currentIdx === 0}
              className="rounded-xl h-12 px-6 gap-2 border-gray-200 font-bold"
            >
              <ChevronLeft size={20} /> Previous
            </Button>
            <div className="flex gap-2">
              {currentIdx === questions.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-xl h-12 px-8 font-bold shadow-lg shadow-green-100"
                >
                  Complete Test
                </Button>
              ) : (
                <Button
                  onClick={() => setCurrentIdx(prev => prev + 1)}
                  className="bg-[#2C4276] text-white py-2 rounded-lg hover:bg-blue-600"
                >
                  Next <ChevronRight size={20} />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* SIDEBAR NAVIGATION GRID */}
        <div className="bg-white rounded-xl shadow-sm border sticky top-20">

          <div className="p-3 border-b text-sm font-semibold text-[#2C4276]">
            Question Map
          </div>

          <div className="p-3">

            <div className="grid grid-cols-6 gap-2">
              {questions.map((_, i) => {
                const isAnswered = answers.some(a => a.questionId === questions[i]._id);
                const isCurrent = currentIdx === i;

                return (
                  <button
                    key={i}
                    className={`w-8 h-8 text-xs rounded-md font-bold ${isCurrent
                      ? "bg-blue-600 text-white"
                      : isAnswered
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400"
                      }`}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 text-xs space-y-1">
              <p>✔ {answers.length} Answered</p>
              <p>○ {questions.length - answers.length} Unanswered</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
