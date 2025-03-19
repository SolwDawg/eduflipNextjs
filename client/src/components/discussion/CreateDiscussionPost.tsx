"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCreateDiscussionPostMutation } from "@/state/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Image, X, ArrowLeft } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { toast } from "sonner";

interface CreateDiscussionPostProps {
  courseId: string;
}

const CreateDiscussionPost: React.FC<CreateDiscussionPostProps> = ({
  courseId,
}) => {
  const router = useRouter();
  const { user } = useUser();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [createDiscussionPost] = useCreateDiscussionPostMutation();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      if (files.length + selectedImages.length > 4) {
        toast.error("You can only upload up to 4 images");
        return;
      }

      setSelectedImages([...selectedImages, ...files]);

      // Create URL previews
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...selectedImages];
    const newPreviews = [...imagePreviews];

    // Revoke the object URL to prevent memory leaks
    URL.revokeObjectURL(imagePreviews[index]);

    newImages.splice(index, 1);
    newPreviews.splice(index, 1);

    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("You must be logged in to create a discussion");
      return;
    }

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await createDiscussionPost({
        courseId,
        userId: user.id,
        title,
        content,
        images: selectedImages,
      }).unwrap();

      toast.success("Discussion created successfully");

      // Clean up the previews
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));

      // Navigate back to discussions
      router.push(`/user/courses/${courseId}/discussions`, { scroll: false });
    } catch (error) {
      console.error("Failed to create discussion:", error);
      toast.error("Failed to create discussion");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    // Clean up the previews
    imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    router.push(`/user/courses/${courseId}/discussions`, { scroll: false });
  };

  return (
    <div className="discussion-create">
      <div className="discussion-create__header">
        <button onClick={handleCancel} className="discussion-detail__back">
          <ArrowLeft className="discussion-detail__back-icon" />
          Back to Discussions
        </button>
        <h2 className="discussion-create__title">Create New Discussion</h2>
      </div>

      <form onSubmit={handleSubmit} className="discussion-create__form">
        <div>
          <label htmlFor="title" className="discussion-create__label">
            Title
          </label>
          <Input
            id="title"
            placeholder="Enter a title for your discussion"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="discussion-create__input"
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label htmlFor="content" className="discussion-create__label">
            Content
          </label>
          <Textarea
            id="content"
            placeholder="Write your question or discussion topic here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="discussion-create__textarea"
            disabled={isSubmitting}
          />
        </div>

        <div className="discussion-create__file-upload">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="discussion-create__file-button"
            disabled={isSubmitting}
          >
            <Image className="h-5 w-5" />
            {selectedImages.length === 0 ? "Add Images" : "Add More Images"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageSelect}
            className="discussion-create__file-input"
            disabled={isSubmitting}
          />
          <span className="ml-2 text-sm text-customgreys-dirtyGrey">
            {selectedImages.length} of 4 images selected
          </span>
        </div>

        {imagePreviews.length > 0 && (
          <div className="discussion-create__file-preview">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="discussion-create__preview-item">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  width={200}
                  height={200}
                  className="discussion-create__preview-image"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="discussion-create__preview-remove"
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="discussion-create__actions">
          <Button
            type="button"
            onClick={handleCancel}
            className="discussion-create__cancel"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="discussion-create__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Discussion"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateDiscussionPost;
