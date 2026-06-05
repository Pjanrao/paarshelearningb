"use client";

import { useEffect, useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  Category,
} from "@/redux/api/categoryApi";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface Props {
  open: boolean;
  setOpen: (value: boolean) => void;
  editing: Category | null;
}

export default function CategoryFormModal({ open, setOpen, editing }: Props) {
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const [form, setForm] = useState({
    name: "",
    description: "",
    keywords: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name,
        description: editing.description,
        keywords: editing.keywords.join(", "),
        isActive: editing.isActive,
      });
    } else {
      setForm({ name: "", description: "", keywords: "", isActive: true });
    }
    setErrors({ name: "", description: "" });
  }, [editing, open]);

  const validate = () => {
    const newErrors = { name: "", description: "" };
    let isValid = true;

    if (!form.name.trim()) {
      newErrors.name = "Category Name is required";
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
        await updateCategory({ id: editing._id, data: payload }).unwrap();
        toast.success("Category updated");
      } else {
        await createCategory(payload).unwrap();
        toast.success("Category created");
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
            {editing ? "Edit Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Category Name*</label>
            <Input
              placeholder="Enter category name"
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
              placeholder="e.g. programming, web, react"
              value={form.keywords}
              onChange={(e) => setForm({ ...form, keywords: e.target.value })}
            />
          </div>

          <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
            <span className="text-sm font-medium text-gray-700">Active Status</span>
            <Switch
              checked={form.isActive}
              onCheckedChange={(val) => setForm({ ...form, isActive: val })}
              className="data-[state=checked]:bg-blue-900"
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-6"
          >
            {editing ? "Update Category" : "Create Category"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}