"use client";

import { useDeleteCourseMutation } from "@/redux/api/courseApi";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface Props {
  deleteId: string | null;
  setDeleteId: (id: string | null) => void;
  /** If provided, called instead of the default course-delete mutation */
  onDelete?: (id: string) => Promise<void>;
}

export default function DeleteCourseDialog({
  deleteId,
  setDeleteId,
  onDelete,
}: Props) {
  const [deleteCourse] = useDeleteCourseMutation();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      if (onDelete) {
        await onDelete(deleteId);
      } else {
        await deleteCourse(deleteId).unwrap();
        toast.success("Course deleted successfully");
      }
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
      <AlertDialogContent className="max-w-md bg-white dark:bg-gray-900">

        {/* HEADER */}
        <AlertDialogHeader className="flex flex-col items-center text-center gap-3">

          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <Trash2 className="text-red-600" size={22} />
          </div>

          <AlertDialogTitle className="text-lg font-semibold text-gray-900">
            Delete Course
          </AlertDialogTitle>

          <AlertDialogDescription className="text-sm text-gray-500 leading-relaxed">
            This action cannot be undone.
            This will permanently delete the course from the system.
          </AlertDialogDescription>

        </AlertDialogHeader>

        {/* FOOTER */}
        <AlertDialogFooter className="flex justify-center gap-3 mt-4">

          <Button
            variant="outline"
            onClick={() => setDeleteId(null)}
          >
            Cancel
          </Button>

          <Button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-60"
          >
            {loading && <Loader2 className="animate-spin mr-2" size={16} />}
            Delete
          </Button>

        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  );
}