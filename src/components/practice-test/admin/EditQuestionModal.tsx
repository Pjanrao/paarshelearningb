"use client";

import { useForm } from "react-hook-form";
import { useEffect } from "react";
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
import { useUpdateQuestionMutation } from "@/redux/api/questionApi";
import { toast } from "sonner";

export default function EditQuestionModal({
  open,
  setOpen,
  question,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  question: any;
}) {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [updateQuestion, { isLoading }] = useUpdateQuestionMutation();
  const correctAnswer = watch("correctAnswer");

  useEffect(() => {
    if (question) {
      reset({
        questionText: question.questionText,
        options: question.options,
        correctAnswer: question.correctAnswer,
        marks: question.marks,
      });
    }
  }, [question, reset]);

  const onSubmit = async (data: any) => {
    try {
      await updateQuestion({ id: question._id, data: { ...data, testId: question.testId } }).unwrap();
      toast.success("Question updated successfully");
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update question");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Question</DialogTitle>
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
              value={correctAnswer?.toString()}
              onValueChange={(val) => setValue("correctAnswer", parseInt(val))}
              className="space-y-3"
            >
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="flex items-center gap-3">
                  <RadioGroupItem value={index.toString()} id={`edit-opt-${index}`} />
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
              {isLoading ? "Updating..." : "Update Question"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
