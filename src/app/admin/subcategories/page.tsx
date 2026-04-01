"use client";

import { useState } from "react";
import {
  useGetSubcategoriesQuery,
  Subcategory,
} from "@/redux/api/subcategoryApi";

import SubcategoryTable from "@/components/dashboard/subcategory/SubcategoryTable";
import SubcategoryFormModal from "@/components/dashboard/subcategory/SubcategoryFormModal";
import DeleteSubcategoryDialog from "@/components/dashboard/subcategory/DeleteSubcategoryDialog";

export default function SubcategoryPage() {
  const {
    data: subcategories = [],
    isLoading,
    isError,
  } = useGetSubcategoriesQuery();

  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Subcategory | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (isError) {
    return (
      <div className="p-6 text-red-500">
        Failed to load subcategories.
      </div>
    );
  }

  return (
    <>
      <SubcategoryTable
        subcategories={subcategories}
        isLoading={isLoading}
        onAdd={() => {
          setEditing(null);
          setOpenForm(true);
        }}
        onEdit={(subcategory) => {
          setEditing(subcategory);
          setOpenForm(true);
          setOpenForm(true);
          setOpenForm(true);
        }}
        onDelete={(id) => setDeleteId(id)}
      />

      <SubcategoryFormModal
        open={openForm}
        setOpen={setOpenForm}
        editing={editing}
      />

      <DeleteSubcategoryDialog
        deleteId={deleteId}
        setDeleteId={setDeleteId}
      />
    </>
  );
}