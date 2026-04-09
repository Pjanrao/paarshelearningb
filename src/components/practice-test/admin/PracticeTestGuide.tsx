"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { UserPlus, CreditCard, Users, FileText, CheckCircle2, AlertCircle } from "lucide-react";

interface PracticeTestGuideProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PracticeTestGuide({ open, onOpenChange }: PracticeTestGuideProps) {
  const steps = [
    {
      title: "1. Enroll Student",
      description: "Register the student in the system via Student Management.",
      icon: <UserPlus className="text-blue-600" size={24} />,
      details: "Ensure the email is correct as it's the primary identifier."
    },
    {
      title: "2. Payment & Course",
      description: "Record a payment to officially assign a course to the student.",
      icon: <CreditCard className="text-emerald-600" size={24} />,
      details: "Select the Student and the target Course in the Add Payment modal."
    },
    {
      title: "3. Create Batch",
      description: "Group students into a batch for the assigned course.",
      icon: <Users className="text-amber-600" size={24} />,
      details: "Only students with an assigned course can be added to a batch."
    },
    {
      title: "4. Practice Test",
      description: "Create and manage tests for specific courses.",
      icon: <FileText className="text-indigo-600" size={24} />,
      details: "Students will see tests automatically based on their enrolled Course."
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#2C4276] flex items-center gap-2">
            <CheckCircle2 className="text-green-500" />
            Practice Test Operating Guide
          </DialogTitle>
          <DialogDescription className="text-gray-500 font-medium">
            Follow these steps to ensure students can access their tests seamlessly.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100">
                {step.icon}
              </div>
              <div>
                <h4 className="font-bold text-[#2C4276] text-lg">{step.title}</h4>
                <p className="text-gray-600 text-sm mt-1">{step.description}</p>
                <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-2">
                  Pro Tip: {step.details}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-2 p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3">
          <AlertCircle className="text-amber-600 flex-shrink-0" size={20} />
          <div className="text-sm">
            <p className="font-bold text-amber-800">Quick Fix</p>
            <p className="text-amber-700 mt-0.5">
              If a student cannot see their test, ensure they are added to a <strong>Batch</strong> and the test is linked to the <strong>correct Course</strong>.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
