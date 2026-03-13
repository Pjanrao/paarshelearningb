"use client";

import { useDeleteSubcategoryMutation } from "@/redux/api/subcategoryApi";
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

export default function DeleteSubcategoryDialog({
  deleteId,
  setDeleteId,
}: Props) {
  const [deleteSubcategory] = useDeleteSubcategoryMutation();

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteSubcategory(deleteId).unwrap();
      toast.success("Subcategory deleted successfully");
      setDeleteId(null);
    } catch (error) {
      toast.error("Failed to delete subcategory");
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
            Delete Subcategory
          </AlertDialogTitle>

          <p className="text-sm text-gray-500 leading-relaxed">
            This action cannot be undone.
            This will permanently delete the subcategory from the system.
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