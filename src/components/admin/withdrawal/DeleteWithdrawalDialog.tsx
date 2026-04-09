"use client";

import { useDeleteWithdrawalAdminMutation } from "@/redux/api/referralAdminApi";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface Props {
    deleteId: string | null;
    setDeleteId: (id: string | null) => void;
}

export default function DeleteWithdrawalDialog({
    deleteId,
    setDeleteId,
}: Props) {
    const [deleteWithdrawal, { isLoading }] = useDeleteWithdrawalAdminMutation();

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await deleteWithdrawal(deleteId).unwrap();
            toast.success("Withdrawal request deleted successfully");
            setDeleteId(null);
        } catch (error) {
            toast.error("Failed to delete withdrawal request");
        }
    };

    return (
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
            <AlertDialogContent className="max-w-md bg-white">
                <AlertDialogHeader className="flex flex-col items-center text-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                        <Trash2 className="text-red-600" size={32} />
                    </div>

                    <AlertDialogTitle className="text-xl font-bold text-gray-900">
                        Confirm Deletion
                    </AlertDialogTitle>

                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 flex gap-3 text-left">
                        <AlertTriangle className="text-red-600 shrink-0" size={20} />
                        <div>
                            <p className="text-sm font-semibold text-red-800">Warning</p>
                            <p className="text-xs text-red-700 leading-relaxed">
                                This action cannot be undone. This withdrawal request and all associated records will be permanently removed from the system.
                            </p>
                        </div>
                    </div>
                </AlertDialogHeader>

                <AlertDialogFooter className="flex justify-center gap-3 mt-6">
                    <Button
                        variant="outline"
                        onClick={() => setDeleteId(null)}
                        disabled={isLoading}
                        className="flex-1 rounded-xl h-11 text-sm font-semibold border-gray-200"
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleDelete}
                        disabled={isLoading}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl h-11 text-sm font-semibold transition-all shadow-md shadow-red-100"
                    >
                        {isLoading ? "Deleting..." : "Permanently Delete"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
