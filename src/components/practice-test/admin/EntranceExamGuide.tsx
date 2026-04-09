"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  Building2, 
  User, 
  Link as LinkIcon, 
  LogIn, 
  Pencil, 
  ClipboardList, 
  Upload,
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

interface EntranceExamGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EntranceExamGuide({ open, onOpenChange }: EntranceExamGuideProps) {
  const steps = [
    {
      title: "1. College Management",
      description: "Register the partnering college or institution in the system.",
      icon: <Building2 className="text-blue-600" size={24} />,
      details: "Go to College Management and click 'Add College'."
    },
    {
      title: "2. Student Access",
      description: "Students must have access to their dashboard for registration.",
      icon: <User className="text-emerald-600" size={24} />,
      details: "Ensure students have active login credentials."
    },
    {
      title: "3. Entrance Management",
      description: "Create the exam and generate the unique participation link.",
      icon: <LinkIcon className="text-amber-600" size={24} />,
      details: "Create 'New Exam' and use the 'Copy Link' icon to share it."
    },
    {
      title: "4. Link Registration",
      description: "Candidates use the shared link to register for the specific exam.",
      icon: <LogIn className="text-indigo-600" size={24} />,
      details: "Students will log in or register directly via the copied URL."
    },
    {
      title: "5. Attempt Test",
      description: "Candidates participate in the test during the scheduled window.",
      icon: <Pencil className="text-red-600" size={24} />,
      details: "Ensure the test status is 'Active' or within the start/end time."
    },
    {
      title: "6. Entrance Test Log",
      description: "Review detailed results and performance of all candidates.",
      icon: <ClipboardList className="text-purple-600" size={24} />,
      details: "Navigate to Entrance Test Logs to view scores and attempts."
    },
    {
      title: "7. Bulk Upload",
      description: "Efficiently manage massive question banks via CSV/Excel.",
      icon: <Upload className="text-gray-600" size={24} />,
      details: "Use 'Bulk Upload Questions' to add hundreds of questions at once."
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#2C4276] flex items-center gap-2">
            <CheckCircle2 className="text-green-500" />
            Entrance Exam Operating Guide
          </DialogTitle>
          <DialogDescription className="text-gray-500 font-medium">
            A comprehensive guide to managing college entrance exams and candidate evaluations.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100">
                {step.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[#2C4276] text-base">{step.title}</h4>
                <p className="text-gray-600 text-xs mt-1 leading-relaxed">{step.description}</p>
                <div className="mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-start gap-1">
                  <span className="text-blue-500">ACTION:</span>
                  <span>{step.details}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 p-4 rounded-xl bg-blue-50 border border-blue-100 flex gap-3">
          <AlertCircle className="text-blue-600 flex-shrink-0" size={20} />
          <div className="text-sm">
            <p className="font-bold text-blue-800">Administrator Note</p>
            <p className="text-blue-700 mt-0.5">
              The <strong>Test Link</strong> is the most critical part. Once copied, it can be shared with students via email, WhatsApp, or College portals for direct registration.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
