"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateCourseMutation, useUpdateCourseMutation } from "@/state/api";
import { useUser } from "@clerk/nextjs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CustomFormField } from "@/components/CustomFormField";

const addCourseSchema = z.object({
  courseTitle: z.string().min(1, "Title is required"),
  courseDescription: z.string().min(1, "Description is required"),
  courseCategory: z.string().min(1, "Category is required"),
  courseStatus: z.boolean().default(false),
});

type AddCourseFormData = z.infer<typeof addCourseSchema>;

interface AddCourseFormProps {
  onSuccess?: (course: Course) => void;
  onCancel?: () => void;
}

const AddCourseForm: React.FC<AddCourseFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const router = useRouter();
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createCourse] = useCreateCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();

  const form = useForm<AddCourseFormData>({
    resolver: zodResolver(addCourseSchema),
    defaultValues: {
      courseTitle: "",
      courseDescription: "",
      courseCategory: "",
      courseStatus: false,
    },
  });

  const handleSubmit = async (data: AddCourseFormData) => {
    if (!user) {
      toast.error("You must be logged in to create a course");
      return;
    }

    try {
      setIsSubmitting(true);

      // First create the basic course
      const newCourse = await createCourse({
        teacherId: user.id,
        teacherName: user.fullName || "Unknown Teacher",
      }).unwrap();

      // Then update it with the form data
      const formData = new FormData();
      formData.append("title", data.courseTitle);
      formData.append("description", data.courseDescription);
      formData.append("category", data.courseCategory);
      formData.append("status", data.courseStatus ? "Published" : "Draft");
      // Initialize with empty sections array
      formData.append("sections", JSON.stringify([]));

      const updatedCourse = await updateCourse({
        courseId: newCourse.courseId,
        formData,
      }).unwrap();

      toast.success("Course created successfully");

      if (onSuccess) {
        onSuccess(updatedCourse);
      } else {
        router.push(`/teacher/courses/${updatedCourse.courseId}`, {
          scroll: false,
        });
      }
    } catch (error) {
      console.error("Failed to create course:", error);
      toast.error("Failed to create course");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <CustomFormField
          name="courseTitle"
          label="Course Title"
          type="text"
          placeholder="Enter course title"
        />

        <CustomFormField
          name="courseDescription"
          label="Course Description"
          type="textarea"
          placeholder="Describe your course"
        />

        <CustomFormField
          name="courseCategory"
          label="Course Category"
          type="select"
          placeholder="Select a category"
          options={[
            { value: "technology", label: "Technology" },
            { value: "science", label: "Science" },
            { value: "mathematics", label: "Mathematics" },
            {
              value: "Artificial Intelligence",
              label: "Artificial Intelligence",
            },
            { value: "language", label: "Language" },
            { value: "art", label: "Art & Design" },
          ]}
        />

        <CustomFormField
          name="courseStatus"
          label={form.watch("courseStatus") ? "Published" : "Draft"}
          type="switch"
          className="flex items-center space-x-2"
          labelClassName={`text-sm font-medium ${
            form.watch("courseStatus") ? "text-green-500" : "text-yellow-500"
          }`}
          inputClassName="data-[state=checked]:bg-green-500"
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
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Course"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddCourseForm;
