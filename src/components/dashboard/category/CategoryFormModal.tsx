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
  }, [editing]);

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        keywords: form.keywords.split(",").map((k) => k.trim()),
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Category" : "Add Category"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Category Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input
            placeholder="Keywords (comma separated)"
            value={form.keywords}
            onChange={(e) => setForm({ ...form, keywords: e.target.value })}
          />
          <div className="flex justify-between items-center">
            <span>Status</span>
            <Switch
  checked={form.isActive}
  onCheckedChange={(val) =>
    setForm({ ...form, isActive: val })
  }
  className="data-[state=checked]:bg-blue-900"
/>
          </div>

<Button
  onClick={handleSubmit}
  className="w-full bg-blue-900 hover:bg-blue-800 text-white"
>            {editing ? "Update" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}