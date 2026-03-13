"use client";

import { useDeleteCategoryMutation } from "@/redux/api/categoryApi";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface Props {
  deleteId: string | null;
  setDeleteId: (id: string | null) => void;
}

export default function DeleteCategoryDialog({
  deleteId,
  setDeleteId,
}: Props) {
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteCategory(deleteId).unwrap();
      toast.success("Category deleted successfully");
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
      <AlertDialogContent className="max-w-md">

        {/* HEADER */}
        <AlertDialogHeader className="flex flex-col items-center text-center gap-3">

          <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
            <Trash2 className="text-red-600" size={22} />
          </div>

          <AlertDialogTitle className="text-lg font-semibold text-gray-900">
            Delete Category
          </AlertDialogTitle>

          <p className="text-sm text-gray-500 leading-relaxed">
            This action cannot be undone.
            This will permanently delete the category from the system.
          </p>

        </AlertDialogHeader>

        {/* FOOTER */}
        <AlertDialogFooter className="flex justify-center gap-3 mt-4">

          <Button
            variant="outline"
            onClick={() => setDeleteId(null)}
            className="px-5"
          >
            Cancel
          </Button>

          <Button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-5"
          >
            Delete
          </Button>

        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  );
}