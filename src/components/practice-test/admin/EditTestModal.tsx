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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdatePracticeTestMutation } from "@/redux/api/practiceTestApi";
import { useGetCoursesQuery } from "@/redux/api/courseApi";
import { toast } from "sonner";

export default function EditTestModal({
  open,
  setOpen,
  test,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  test: any;
}) {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [updateTest, { isLoading }] = useUpdatePracticeTestMutation();
  const { data: coursesData } = useGetCoursesQuery({});

  useEffect(() => {
    if (test) {
      reset({
        name: test.name,
        skill: test.skill,
        level: test.level,
        duration: test.duration,
        status: test.status,
        courseIds: test.courseIds?.map((c: any) => c._id || c),
      });
    }
  }, [test, reset]);

  const onSubmit = async (data: any) => {
    try {
      await updateTest({ id: test._id, data }).unwrap();
      toast.success("Practice Test updated successfully");
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update test");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Practice Test</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1">
              <label className="text-sm font-medium">Test Name</label>
              <Input
                {...register("name", { required: true })}
                placeholder="Ex: CSS Fundamentals"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Skill</label>
              <Input
                {...register("skill", { required: true })}
                placeholder="Ex: Web Development"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Level</label>
              <Select
                onValueChange={(val) => setValue("level", val)}
                defaultValue={test?.level}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Duration (Minutes)</label>
              <Input
                type="number"
                {...register("duration", { required: true, valueAsNumber: true })}
                placeholder="Ex: 30"
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Status</label>
              <Select
                onValueChange={(val) => setValue("status", val)}
                defaultValue={test?.status}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-1">
              <label className="text-sm font-medium">Associated Courses</label>
              <Select
                onValueChange={(val) => setValue("courseIds", [val])}
                defaultValue={test?.courseIds?.[0]?._id || test?.courseIds?.[0]}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {coursesData?.courses.map((course: any) => (
                    <SelectItem key={course._id} value={course._id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {isLoading ? "Updating..." : "Update Test"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
