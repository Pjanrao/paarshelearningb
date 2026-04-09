"use client";

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
import { useDeleteMeetingMutation } from "@/redux/api/meetingApi";

interface Props {
    deleteId: string | null;
    setDeleteId: (id: string | null) => void;
    onDelete?: (id: string) => Promise<void>;
}

export default function DeleteMeetingModal({
    deleteId,
    setDeleteId,
    onDelete,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [deleteMeeting, { isLoading }] = useDeleteMeetingMutation();

    const handleDelete = async () => {
        if (!deleteId) return;

        try {
            await deleteMeeting(deleteId).unwrap();
            setDeleteId(null); // ✅ auto refresh
        } catch (err) {
            console.error(err);
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
                        Delete Meeting
                    </AlertDialogTitle>

                    <AlertDialogDescription className="text-sm text-gray-500 leading-relaxed">
                        This action cannot be undone.
                        This will permanently delete the meeting from the system.
                    </AlertDialogDescription>

                </AlertDialogHeader>

                {/* FOOTER */}
                <AlertDialogFooter className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
                    <Button
                        variant="outline"
                        onClick={() => setDeleteId(null)}
                        className="w-full sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDelete}
                        disabled={loading}
                        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white disabled:opacity-60"
                    >
                        {loading && <Loader2 className="animate-spin mr-2" size={16} />}
                        Delete
                    </Button>
                </AlertDialogFooter>

            </AlertDialogContent>
        </AlertDialog>
    );
}