"use client";

import { useState } from "react";
import {
  useGetCategoriesQuery,
  Category,
} from "@/redux/api/categoryApi";

import CategoryTable from "@/components/dashboard/category/CategoryTable";
import CategoryFormModal from "@/components/dashboard/category/CategoryFormModal";
import DeleteCategoryDialog from "@/components/dashboard/category/DeleteCategoryDialog";

export default function CategoryPage() {

  const [searchQuery, setSearchQuery] = useState("");
  // 🔹 Fetch data
  const {
    data: categories = [],
    isLoading,
    isError,
    error,
  } = useGetCategoriesQuery();

  // 🔹 UI States
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // 🔹 Optional Error UI
  if (isError) {
    console.error("Category fetch error:", error);
    return (
      <div className="p-6 text-red-500">
        Failed to load categories.
      </div>
    );
  }

  return (
    <>
      {/* 🔹 Table Section */}
      <CategoryTable
        categories={categories}
        isLoading={isLoading}
        onAdd={() => {
          setEditing(null);
          setOpenForm(true);
        }}
        onEdit={(category) => {
          setEditing(category);
          setOpenForm(true);
        }}
        onDelete={(id) => setDeleteId(id)}
      />



      {/* 🔹 Add / Edit Modal */}
      <CategoryFormModal
        open={openForm}
        setOpen={setOpenForm}
        editing={editing}
      />

      {/* 🔹 Delete Confirmation Dialog */}
      <DeleteCategoryDialog
        deleteId={deleteId}
        setDeleteId={setDeleteId}
      />


    </>
  );
}