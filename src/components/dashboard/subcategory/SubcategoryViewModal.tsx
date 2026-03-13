"use client";

import { Subcategory } from "@/redux/api/subcategoryApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  subcategory: Subcategory | null;
}

export default function SubcategoryViewModal({
  open,
  setOpen,
  subcategory,
}: Props) {
  if (!subcategory) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">

        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#2C4276]">
            Subcategory Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">

          {/* PROFILE */}
          <div className="flex items-center gap-4 border-b pb-4">

            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#2C4276] to-blue-500 flex items-center justify-center text-white text-lg font-bold">
              {subcategory.name.charAt(0)}
            </div>

            <div>
              <p className="text-lg font-semibold text-gray-900">
                {subcategory.name}
              </p>

              <p className="text-sm text-gray-500">
                Category: {subcategory.category?.name || "N/A"}
              </p>
            </div>

          </div>

          {/* DETAILS */}
          <div className="grid grid-cols-1 gap-5">

            {/* Description */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                Description
              </p>

              <p className="text-sm text-gray-700">
                {subcategory.description || "No description provided"}
              </p>
            </div>

            {/* Status */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                Status
              </p>

              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border
                ${
                  subcategory.isActive
                    ? "bg-green-50 text-green-600 border-green-200"
                    : "bg-red-50 text-red-600 border-red-200"
                }`}
              >
                {subcategory.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Created */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                Created On
              </p>

              <p className="text-sm text-gray-700">
                {new Date(subcategory.createdAt).toLocaleDateString()}
              </p>
            </div>

          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
}