"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useEnrollCourseMutation, useGetCoursesQuery } from "@/state/api";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CustomFormField } from "@/components/CustomFormField";

const addUserCourseSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  courseId: z.string().min(1, "Course is required"),
});

type AddUserCourseFormData = z.infer<typeof addUserCourseSchema>;

interface AddUserCourseFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  userId?: string;
}

const AddUserCourseForm: React.FC<AddUserCourseFormProps> = ({
  onSuccess,
  onCancel,
  userId = "",
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [enrollCourse] = useEnrollCourseMutation();
  const { data: courses, isLoading: isCoursesLoading } = useGetCoursesQuery({
    category: "all",
  });

  const form = useForm<AddUserCourseFormData>({
    resolver: zodResolver(addUserCourseSchema),
    defaultValues: {
      userId: userId,
      courseId: "",
    },
  });

  const handleSubmit = async (data: AddUserCourseFormData) => {
    try {
      setIsSubmitting(true);

      // Enroll the user in the course
      await enrollCourse({
        userId: data.userId,
        courseId: data.courseId,
      }).unwrap();

      toast.success("Course successfully added to user");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Failed to add course to user:", error);
      toast.error("Failed to add course to user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const courseOptions = courses
    ? courses.map((course) => ({
        value: course.courseId,
        label: course.title,
      }))
    : [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <CustomFormField
          name="userId"
          label="User ID"
          type="text"
          placeholder="Enter user ID"
          disabled={!!userId}
        />

        <CustomFormField
          name="courseId"
          label="Course"
          type="select"
          placeholder="Select a course"
          options={courseOptions}
          disabled={isCoursesLoading || isSubmitting}
        />

        <div className="flex justify-end space-x-4">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            className="bg-primary-700 hover:bg-primary-600"
            disabled={isSubmitting || isCoursesLoading}
          >
            {isSubmitting ? "Adding..." : "Add Course to User"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddUserCourseForm;
