"use client";

import { useForm, useFieldArray } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAddQuestionMutation } from "@/redux/api/questionApi";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

export default function AddQuestionModal({
  open,
  setOpen,
  testId,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  testId: string;
}) {
  const { register, handleSubmit, reset, control, setValue, watch } = useForm({
    defaultValues: {
      questionText: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      marks: 1,
    },
  });

  const [addQuestion, { isLoading }] = useAddQuestionMutation();
  const correctAnswer = watch("correctAnswer");

  const onSubmit = async (data: any) => {
    try {
      await addQuestion({ ...data, testId }).unwrap();
      toast.success("Question added successfully");
      reset();
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to add question");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Question</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Question Text</label>
            <Textarea
              {...register("questionText", { required: true })}
              placeholder="Ex: What is the purpose of the 'useEffect' hook in React?"
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Options (Select the correct one)</label>
            <RadioGroup
              value={correctAnswer.toString()}
              onValueChange={(val) => setValue("correctAnswer", parseInt(val))}
              className="space-y-3"
            >
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="flex items-center gap-3">
                  <RadioGroupItem value={index.toString()} id={`opt-${index}`} />
                  <Input
                    {...register(`options.${index}`, { required: true })}
                    placeholder={`Option ${index + 1}`}
                    className="h-10"
                  />
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Marks</label>
              <Input
                type="number"
                {...register("marks", { required: true, valueAsNumber: true })}
                placeholder="Ex: 1"
              />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-[#2C4276]">
              {isLoading ? "Adding..." : "Add Question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
