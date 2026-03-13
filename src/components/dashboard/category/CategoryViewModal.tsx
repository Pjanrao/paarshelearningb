"use client";

import { Category } from "@/redux/api/categoryApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Folder } from "lucide-react";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  category: Category | null;
}

export default function CategoryViewModal({
  open,
  setOpen,
  category,
}: Props) {
  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-xl">

        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-[#2C4276]">
            Category Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">

          {/* CATEGORY PROFILE */}
          <div className="flex items-center gap-4 border-b pb-4">

            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#2C4276] to-blue-500 flex items-center justify-center text-white text-lg font-
bold">
              {category.name.charAt(0)}
            </div>

            <div>
              <p className="text-lg font-semibold text-gray-900">
                {category.name}
              </p>

              <span
                className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold border
                ${
                  category.isActive
                    ? "bg-green-50 text-green-600 border-green-200"
                    : "bg-red-50 text-red-600 border-red-200"
                }`}
              >
                {category.isActive ? "Active" : "Inactive"}
              </span>
            </div>

          </div>

          {/* DETAILS */}
          <div className="grid grid-cols-1 gap-5">

            {/* Description */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                Description
              </p>

              <p className="text-sm text-gray-700 leading-relaxed">
                {category.description || "No description provided"}
              </p>
            </div>

            {/* Keywords */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                Keywords
              </p>

              <div className="flex flex-wrap gap-2">
                {category.keywords?.length > 0 ? (
                  category.keywords.map((key, i) => (
                    <Badge
                      key={i}
                      className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      {key}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-gray-400">
                    No keywords added
                  </span>
                )}
              </div>
            </div>

            {/* Created */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                Created On
              </p>

              <p className="text-sm text-gray-700">
                {new Date(category.createdAt).toLocaleDateString()}
              </p>
            </div>

          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}