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

  useEffect(() => {
    if (editing) {
      setForm({
        category: editing.category?._id,
        name: editing.name,
        description: editing.description,
        keywords: editing.keywords.join(", "),
      });
    } else {
      setForm({
        category: "",
        name: "",
        description: "",
        keywords: "",
      });
    }
  }, [editing]);

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        keywords: form.keywords.split(",").map((k) => k.trim()),
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editing ? "Edit Subcategory" : "Add Subcategory"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <select
            className="w-full border rounded-md p-2 focus:ring-2 focus:ring-blue-900"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <Input
            placeholder="Subcategory Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
          />

          <Textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />

          <Input
            placeholder="Keywords (comma separated)"
            value={form.keywords}
            onChange={(e) =>
              setForm({ ...form, keywords: e.target.value })
            }
          />

          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-900 hover:bg-blue-800 text-white"
          >
            {editing ? "Update" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}