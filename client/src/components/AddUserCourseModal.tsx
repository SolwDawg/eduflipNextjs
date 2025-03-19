"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddUserCourseForm from "./AddUserCourseForm";

interface AddUserCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  userId?: string;
}

const AddUserCourseModal: React.FC<AddUserCourseModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userId,
}) => {
  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add Course to User
          </DialogTitle>
        </DialogHeader>
        <AddUserCourseForm
          onSuccess={handleSuccess}
          onCancel={onClose}
          userId={userId}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddUserCourseModal;
