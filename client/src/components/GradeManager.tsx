"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  useCreateGradeMutation,
  useDeleteGradeMutation,
  useGetGradesQuery,
  useUpdateGradeMutation,
} from "@/state/api";
import { toast } from "sonner";
import { Pencil, Trash2, X } from "lucide-react";

export default function GradeManager() {
  const { data: grades, isLoading, refetch } = useGetGradesQuery();
  const [createGrade, { isLoading: isCreating }] = useCreateGradeMutation();
  const [updateGrade, { isLoading: isUpdating }] = useUpdateGradeMutation();
  const [deleteGrade, { isLoading: isDeleting }] = useDeleteGradeMutation();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    order: 0,
    status: "Active" as const,
  });

  const [editingGradeId, setEditingGradeId] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "order" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createGrade(formData).unwrap();
      setFormData({
        name: "",
        description: "",
        order: 0,
        status: "Active",
      });
      toast.success("Grade created successfully!");
      refetch();
    } catch {
      toast.error("Failed to create grade");
    }
  };

  const handleEdit = (grade: Grade) => {
    setEditingGradeId(grade.gradeId);
    setFormData({
      name: grade.name,
      description: grade.description || "",
      order: grade.order,
      status: grade.status as "Active",
    });
  };

  const handleCancelEdit = () => {
    setEditingGradeId(null);
    setFormData({
      name: "",
      description: "",
      order: 0,
      status: "Active",
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingGradeId || isUpdating) return;

    try {
      await updateGrade({
        gradeId: editingGradeId,
        gradeData: formData,
      }).unwrap();

      setEditingGradeId(null);
      setFormData({
        name: "",
        description: "",
        order: 0,
        status: "Active",
      });

      toast.success("Grade updated successfully!");
      refetch();
    } catch (error: unknown) {
      const errorObj = error as { status?: number };

      if (errorObj?.status === 404) {
        toast.error("Grade not found");
      } else {
        toast.error("Failed to update grade");
      }
    }
  };

  const handleDelete = async (gradeId: string) => {
    if (isDeleting) return;

    try {
      await deleteGrade(gradeId).unwrap();
      toast.success("Grade deleted successfully!");

      // If we're editing a grade that was deleted, reset the form
      if (editingGradeId === gradeId) {
        handleCancelEdit();
      }

      refetch();
    } catch (error: unknown) {
      // Handle different error types based on status code
      const errorObj = error as { status?: number };

      if (errorObj?.status === 400) {
        toast.error("Cannot delete grade with associated courses");
      } else if (errorObj?.status === 404) {
        toast.error("Grade not found");
        // Refresh the list to reflect current state
        refetch();
      } else {
        toast.error("Failed to delete grade");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {editingGradeId ? "Edit Grade" : "Create Grade"}
          </h2>
          <form
            onSubmit={editingGradeId ? handleUpdate : handleSubmit}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="name">Grade Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="order">Order</Label>
              <Input
                id="order"
                name="order"
                type="number"
                value={formData.order.toString()}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isCreating || isUpdating}
                className="flex-1"
              >
                {editingGradeId
                  ? isUpdating
                    ? "Updating..."
                    : "Update Grade"
                  : isCreating
                  ? "Creating..."
                  : "Create Grade"}
              </Button>

              {editingGradeId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1"
                >
                  <X className="h-4 w-4" /> Cancel
                </Button>
              )}
            </div>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Available Grades</h2>
          {isLoading ? (
            <p>Loading grades...</p>
          ) : (
            <div className="space-y-2">
              {grades?.map((grade) => (
                <div
                  key={grade.gradeId}
                  className={`p-4 border rounded-lg hover:bg-white-50/5 flex justify-between ${
                    editingGradeId === grade.gradeId
                      ? "border-primary-500 bg-white-50/5"
                      : ""
                  }`}
                >
                  <div>
                    <h3 className="text-lg font-medium">{grade.name}</h3>
                    <p className="text-sm text-customgreys-dirtyGrey">
                      {grade.description}
                    </p>
                    <div className="flex gap-4 mt-2">
                      <span className="text-xs">Order: {grade.order}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          grade.status === "Active"
                            ? "bg-green-500/20 text-green-400"
                            : "bg-red-500/20 text-red-400"
                        }`}
                      >
                        {grade.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(grade)}
                      disabled={isUpdating || isDeleting}
                      className="text-blue-500 hover:text-blue-400 hover:bg-blue-900/20"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(grade.gradeId)}
                      disabled={isDeleting}
                      className="text-red-500 hover:text-red-400 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {!grades?.length && (
                <p className="text-customgreys-dirtyGrey">
                  No grades available.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
