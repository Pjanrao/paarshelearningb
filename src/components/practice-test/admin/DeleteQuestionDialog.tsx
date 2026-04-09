"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteQuestionMutation } from "@/redux/api/questionApi";
import { toast } from "sonner";

export default function DeleteQuestionDialog({
  question,
  setQuestion,
}: {
  question: any | null;
  setQuestion: (q: any | null) => void;
}) {
  const [deleteQuestion, { isLoading }] = useDeleteQuestionMutation();

  const handleDelete = async () => {
    if (!question) return;
    try {
      await deleteQuestion({ id: question._id, testId: question.testId }).unwrap();
      toast.success("Question deleted successfully");
      setQuestion(null);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete question");
    }
  };

  return (
    <AlertDialog open={!!question} onOpenChange={(open) => !open && setQuestion(null)}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the question
            from this practice test.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setQuestion(null)}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
