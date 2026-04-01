"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type: "exit" | "submit";
  isLoading?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, type, isLoading }) => {
  const handleConfirm = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Error exiting fullscreen:", error);
    }
    
    // Call onConfirm and wait if it's a promise
    await onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-slate-900 p-0 border-none shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className={`p-8 text-center ${type === 'exit' ? 'bg-red-50 dark:bg-red-900/10' : 'bg-green-50 dark:bg-green-900/10'}`}>
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white dark:border-slate-800 shadow-xl ${type === 'exit' ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-green-100 dark:bg-green-900/30 text-green-600'}`}>
            {type === "exit" ? <XCircle size={40} /> : <CheckCircle2 size={40} />}
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-gray-900 dark:text-white text-center">
              {type === "exit" ? "Exit Examination?" : "Complete Submission?"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-4 leading-relaxed">
            {type === "exit"
              ? "Are you sure you want to terminate this session? You will lose all unsaved progress and will not be able to re-enter."
              : "Verify your answers before final submission. This action is irreversible and will finalize your results database record."}
          </p>
        </div>
        <DialogFooter className="p-8 bg-white dark:bg-slate-900 border-t dark:border-slate-800 flex flex-col-reverse sm:flex-row gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="rounded-xl font-bold h-12 px-6 flex-1 text-gray-400"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`rounded-xl font-black h-12 px-8 shadow-xl flex-1 transition-all active:scale-95 ${
              type === "exit" 
                ? "bg-red-600 hover:bg-red-700 text-white shadow-red-500/20" 
                : "bg-green-600 hover:bg-green-700 text-white shadow-green-500/20"
            }`}
          >
            {isLoading ? <Loader2 className="animate-spin mr-2" /> : type === "exit" ? "Exit Test" : "Submit Test"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};