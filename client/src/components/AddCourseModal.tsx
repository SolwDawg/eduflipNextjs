"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddCourseForm from "./AddCourseForm";

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (course: Course) => void;
}

const AddCourseModal: React.FC<AddCourseModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const handleSuccess = (course: Course) => {
    if (onSuccess) {
      onSuccess(course);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add New Course
          </DialogTitle>
        </DialogHeader>
        <AddCourseForm onSuccess={handleSuccess} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default AddCourseModal;
