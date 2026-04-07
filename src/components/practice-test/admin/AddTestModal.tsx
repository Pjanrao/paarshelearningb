"use client";

import { useForm } from "react-hook-form";
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
import { useCreatePracticeTestMutation } from "@/redux/api/practiceTestApi";
import { useGetCoursesQuery } from "@/redux/api/courseApi";
import { toast } from "sonner";

export default function AddTestModal({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [createTest, { isLoading }] = useCreatePracticeTestMutation();
  const { data: coursesData } = useGetCoursesQuery({});

  const onSubmit = async (data: any) => {
    try {
      await createTest(data).unwrap();
      toast.success("Practice Test created successfully");
      reset();
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create test");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Practice Test</DialogTitle>
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
              <Select onValueChange={(val) => setValue("level", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Level" />
                </SelectTrigger>
                <SelectContent className="bg-white">
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
              <Select onValueChange={(val) => setValue("status", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2 space-y-1">
              <label className="text-sm font-medium">Associated Courses</label>
              <Select
                onValueChange={(val) => setValue("courseIds", [val])} // For now single select, if MultiSelect exists I'll swap it
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent className="bg-white">
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
              {isLoading ? "Creating..." : "Create Test"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
