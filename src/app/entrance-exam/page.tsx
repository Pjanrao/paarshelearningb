"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { AuthView } from "@/components/EntranceExam/AuthView";
import { LoginForm } from "@/components/EntranceExam/LoginForm";
import { RegisterForm } from "@/components/EntranceExam/RegisterForm";
import { Instructions } from "@/components/EntranceExam/Instructions";
import { TestHeader } from "@/components/EntranceExam/TestHeader";
import { QuestionNavigation } from "@/components/EntranceExam/QuestionNavigation";
import { QuestionMeta } from "@/components/EntranceExam/QuestionMeta";
import { Test } from "@/components/EntranceExam/Test";
import {
  useCreateEntranceTestSessionMutation,
  useGetEntranceTestInstructionQuery,
  useStartEntranceTestSessionMutation,
  useSaveEntranceAnswerMutation,
  useSubmitEntranceTestMutation,
} from "@/redux/api";
import { Button } from "@/components/ui/button";
import { Result } from "@/components/EntranceExam/Result";
import { Card } from "@/components/ui/card";

// Define interfaces
interface Question {
  _id: string;
  question: string;
  options: Array<{ text: string; isCorrect: boolean }>;
  correctAnswer: string;
  category: string;
  explanation?: string;
  selectedAnswer: number;
  timeSpent: number;
}

interface TestInfo {
  session: { sessionId: string; startTime: string; duration: number; status: string };
  testDetails: any;
  questions?: Question[];
  hasExpiry: boolean;
  startTime: string;
  endTime: string;
}

const TestSecurityWrapper: React.FC<{ children: React.ReactNode; onSubmit: () => void }> = ({ children, onSubmit }) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const violations = parseInt(localStorage.getItem("entrance_violations") || "0") + 1;
        localStorage.setItem("entrance_violations", violations.toString());
        if (violations >= 10) onSubmit();
        else toast.error(`Warning: Tab switching detected! (${violations}/10)`);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "v" || e.key === "p")) {
        e.preventDefault();
        toast.error("Keyboard shortcuts are disabled during the test");
      }
    };
    const setupFullscreen = async () => {
      try { if (!document.fullscreenElement) await document.documentElement.requestFullscreen(); } catch (err) {}
    };
    setupFullscreen();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onSubmit]);
  return <>{children}</>;
};

function EntranceExamContent() {
  const searchParams = useSearchParams();
  const testId = searchParams?.get("testId") ?? null;
  const collegeId = searchParams?.get("collegeId") ?? null;
  const batchName = searchParams?.get("batchName") ?? null;
  
  const [step, setStep] = useState<any>("auth");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [testInfo, setTestInfo] = useState<TestInfo | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [result, setResult] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [markedQuestions, setMarkedQuestions] = useState<{ [key: string]: boolean }>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [createSession, { isLoading: isCreatingSession }] = useCreateEntranceTestSessionMutation();
  const { data: testInfoData, isLoading: testInfoLoading, error: testInfoError } = useGetEntranceTestInstructionQuery({ sessionId, testId, collegeId, token: token ?? undefined }, { skip: !sessionId || !testId || !collegeId });
  const [startSession, { isLoading: isStartingTest }] = useStartEntranceTestSessionMutation();
  const [submitTest] = useSubmitEntranceTestMutation();

  useEffect(() => {
    if (!testId || !collegeId || !batchName) {
      setMessage("Invalid test link. Please contact your administrator.");
      setStep("expired");
    }
  }, [testId, collegeId, batchName]);

  useEffect(() => {
    if (testInfoData && step === "instructions") {
      if (testInfoData.hasExpiry) {
        const now = new Date();
        const start = new Date(testInfoData.startTime);
        const end = new Date(testInfoData.endTime);
        if (now < start) {
          setMessage(`This test is scheduled to begin at ${start.toLocaleString()}.`);
          setStep("not-started");
          return;
        }
        if (now > end) {
          setMessage(`This test ended at ${end.toLocaleString()}.`);
          setStep("expired");
          return;
        }
      }
      setTestInfo(testInfoData);
      setTimeRemaining(testInfoData.session.duration * 60);
    }
    if (testInfoError) {
      setMessage("Failed to load test instructions. Please try again.");
      setStep("expired");
    }
  }, [testInfoData, testInfoError, step]);

  const handleAutoSubmit = useCallback(async () => {
    try {
      const answers = questions.map(q => ({ questionId: q._id, selectedAnswer: q.selectedAnswer, timeSpent: q.timeSpent }));
      const res = await submitTest({ sessionId, answers, token: token ?? undefined }).unwrap();
      setResult(res);
      setStep("result");
      localStorage.removeItem("entrance_session");
      localStorage.removeItem("entrance_violations");
    } catch (err) {
      toast.error("Failed to submit test automatically");
    }
  }, [questions, sessionId, submitTest]);

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0 && step === "test") {
      const timer = setInterval(() => setTimeRemaining(prev => (prev !== null ? prev - 1 : prev)), 1000);
      return () => clearInterval(timer);
    } else if (timeRemaining === 0 && step === "test") {
      handleAutoSubmit();
    }
  }, [timeRemaining, step, handleAutoSubmit]);

  const handleAuthSuccess = async (studentId: string, token: string) => {
    try {
      setStep("loading");
      console.log("Creating session with:", { studentId, testId, collegeId, batchName });
      const res = await createSession({ 
        studentId: studentId!, 
        testId: testId!, 
        collegeId: collegeId!, 
        batchName: batchName || "", 
        token 
      }).unwrap();
      console.log("Session created successfully:", res.data.sessionId);
      setSessionId(res.data.sessionId);
      setToken(token);
      setStep("instructions");
    } catch (err: any) {
      console.error("Create session failed:", err?.data ? JSON.stringify(err.data) : err?.message || err);
      toast.error(err?.data?.error || err?.error || "Failed to create session");
      setStep("auth");
    }
  };

  const handleStartTest = async () => {
    try {
      const res = await startSession({ sessionId: sessionId!, testId: testId!, collegeId: collegeId!, token: token ?? undefined }).unwrap();
      setQuestions(res.data.questions.map((q:any) => ({ ...q, selectedAnswer: -1, timeSpent: 0 })));
      setStep("test");
    } catch (err: any) {
      toast.error(err?.data?.error || "Failed to start test");
    }
  };

  const handleExit = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (err) {}
    localStorage.removeItem("entrance_session");
    localStorage.removeItem("entrance_violations");
    setStep("auth");
  };

  // Status calculation for navigation
  const questionStatus = questions.reduce((acc, q, i) => {
    acc[i + 1] = { answered: q.selectedAnswer !== -1, marked: markedQuestions[q._id] || false };
    return acc;
  }, {} as any);

  if (step === "loading") return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600">Setting up your session...</p>
      </div>
    </div>
  );

  if (step === "expired" || step === "not-started") return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto text-blue-600">
           <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h1 className="text-2xl font-bold">{step === "expired" ? "Test Window Closed" : "Test Scheduled"}</h1>
        <p className="text-gray-600">{message}</p>
        <Button onClick={() => setStep("auth")} className="w-full bg-blue-600 hover:bg-blue-700">Return to Home</Button>
      </Card>
    </div>
  );

  if (step === "auth") return <AuthView onShowLogin={() => setStep("login")} onShowRegister={() => setStep("register")} testName="Entrance Exam" />;
  if (step === "login") return <LoginForm onLogin={handleAuthSuccess} onBack={() => setStep("auth")} testId={testId} collegeId={collegeId} />;
  if (step === "register") return <RegisterForm onRegister={(id, token) => { setShowSuccessModal(true); setTimeout(() => { setShowSuccessModal(false); setStep("login"); }, 2000); }} onBack={() => setStep("auth")} testId={testId} collegeId={collegeId} />;
  
  if (showSuccessModal) return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
       <Card className="p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
          <h2 className="text-xl font-bold">Registration Successful!</h2>
          <p className="text-gray-600">Setting up your test session...</p>
       </Card>
    </div>
  );

  if (step === "instructions") return <Instructions testDetails={testInfo?.testDetails} onStartTest={handleStartTest} isLoading={testInfoLoading || isStartingTest || !testInfo} />;
  
  if (step === "test") return (
    <TestSecurityWrapper onSubmit={handleAutoSubmit}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <TestHeader 
          testName={testInfo?.testDetails?.name || "Entrance Exam"} 
          college="Paarsh Elearning" 
          onExit={handleExit} 
          timeRemaining={timeRemaining} 
        />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <Test 
                questions={questions} 
                sessionId={sessionId!} 
                timeRemaining={timeRemaining} 
                onSubmitTest={(r) => {setResult(r); setStep("result");}} 
                setQuestions={setQuestions} 
                token={token!}
                onMarkForReview={(id) => setMarkedQuestions(p => ({...p, [id]: !p[id]}))} 
                markedQuestions={markedQuestions} 
                currentQuestionIndex={currentQuestionIndex} 
                setCurrentQuestionIndex={setCurrentQuestionIndex} 
              />
            </div>
            <div className="lg:col-span-1 space-y-6">
               <QuestionNavigation totalQuestions={questions.length} currentQuestionIndex={currentQuestionIndex} setCurrentQuestionIndex={setCurrentQuestionIndex} questionStatus={questionStatus} isLoading={false} />
               <QuestionMeta totalQuestions={questions.length} attempted={questions.filter(q => q.selectedAnswer !== -1).length} notAttempted={questions.filter(q => q.selectedAnswer === -1).length} marked={Object.values(markedQuestions).filter(Boolean).length} />
            </div>
          </div>
        </div>
      </div>
    </TestSecurityWrapper>
  );
  
  if (step === "result") return <Result testDetails={{name: testInfo?.testDetails?.name || "Entrance Exam", college: "Paarsh Elearning"}} onRedirect={() => { setStep("auth"); setResult(null); }} />;

  return null;
}

export default function EntranceExamPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <EntranceExamContent />
      </Suspense>
    </div>
  );
}
