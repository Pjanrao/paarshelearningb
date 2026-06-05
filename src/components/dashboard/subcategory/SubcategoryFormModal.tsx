"use client";

import { useEffect, useState } from "react";
import {
  useCreateSubcategoryMutation,
  useUpdateSubcategoryMutation,
} from "@/redux/api/subcategoryApi";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  editing: any;
}

export default function SubcategoryFormModal({
  open,
  setOpen,
  editing,
}: Props) {
  const { data: categories = [] } = useGetCategoriesQuery();
  const [createSubcategory] = useCreateSubcategoryMutation();
  const [updateSubcategory] = useUpdateSubcategoryMutation();

  const [form, setForm] = useState({
    category: "",
    name: "",
    description: "",
    keywords: "",
  });

  const [errors, setErrors] = useState({
    category: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    if (editing) {
      setForm({
        category: editing.category?._id || "",
        name: editing.name,
        description: editing.description,
        keywords: (editing.keywords || []).join(", "),
      });
    } else {
      setForm({
        category: "",
        name: "",
        description: "",
        keywords: "",
      });
    }
    setErrors({ category: "", name: "", description: "" });
  }, [editing, open]);

  const validate = () => {
    const newErrors = { category: "", name: "", description: "" };
    let isValid = true;

    if (!form.category) {
      newErrors.category = "Please select a category";
      isValid = false;
    }
    if (!form.name.trim()) {
      newErrors.name = "Subcategory Name is required";
      isValid = false;
    }
    if (!form.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const payload = {
        ...form,
        keywords: form.keywords.split(",").map((k) => k.trim()).filter(k => k),
      };

      if (editing) {
        await updateSubcategory({
          id: editing._id,
          data: payload,
        }).unwrap();
        toast.success("Subcategory updated");
      } else {
        await createSubcategory(payload).unwrap();
        toast.success("Subcategory created");
      }

      setOpen(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Error occurred");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Subcategory" : "Add Subcategory"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Category*</label>
            <select
              className={`w-full border rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-900 transition-colors ${errors.category ? "border-red-500 bg-red-50" : "border-gray-200"
                }`}
              value={form.category}
              onChange={(e) => {
                setForm({ ...form, category: e.target.value });
                if (errors.category) setErrors({ ...errors, category: "" });
              }}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-xs text-red-500">{errors.category}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Subcategory Name*</label>
            <Input
              placeholder="Enter subcategory name"
              value={form.name}
              onChange={(e) => {
                setForm({ ...form, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
              className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Description*</label>
            <Textarea
              placeholder="Enter description"
              value={form.description}
              onChange={(e) => {
                setForm({ ...form, description: e.target.value });
                if (errors.description) setErrors({ ...errors, description: "" });
              }}
              className={errors.description ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Keywords (comma separated)</label>
            <Input
              placeholder="e.g. basics, advanced, tutorial"
              value={form.keywords}
              onChange={(e) =>
                setForm({ ...form, keywords: e.target.value })
              }
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-6"
          >
            {editing ? "Update Subcategory" : "Create Subcategory"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}