"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateDiscussionThreadMutation } from "@/state/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";

const CATEGORIES = [
  "Mathematics",
  "Science",
  "Literature",
  "History",
  "Arts",
  "Languages",
  "Computer Science",
  "Other",
];

const CreateDiscussionForm: React.FC = () => {
  const router = useRouter();
  const [createThread, { isLoading }] = useCreateDiscussionThreadMutation();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    tags: [] as string[],
    currentTag: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && formData.currentTag.trim() !== "") {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    if (formData.currentTag.trim() === "") return;

    // Prevent duplicate tags
    if (formData.tags.includes(formData.currentTag.trim())) {
      toast.error("Tag already exists");
      return;
    }

    // Limit to 5 tags
    if (formData.tags.length >= 5) {
      toast.error("Maximum 5 tags allowed");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, prev.currentTag.trim()],
      currentTag: "",
    }));
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title.trim() ||
      !formData.content.trim() ||
      !formData.category
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const result = await createThread({
        title: formData.title,
        content: formData.content,
        category: formData.category,
        tags: formData.tags,
      }).unwrap();

      toast.success("Discussion thread created successfully!");
      router.push(`/discussions/${result.data.threadId}`);
    } catch (error) {
      toast.error("Failed to create discussion thread");
    }
  };

  return (
    <div className="create-discussion-form">
      <h2 className="create-discussion-form__title">Ask a Question</h2>
      <p className="create-discussion-form__description">
        Share your question or topic with the community
      </p>

      <form onSubmit={handleSubmit} className="create-discussion-form__form">
        <div className="create-discussion-form__field">
          <Label htmlFor="title" className="create-discussion-form__label">
            Title
          </Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter a descriptive title"
            className="create-discussion-form__input"
            required
          />
        </div>

        <div className="create-discussion-form__field">
          <Label htmlFor="category" className="create-discussion-form__label">
            Category
          </Label>
          <Select
            value={formData.category}
            onValueChange={handleCategoryChange}
            required
          >
            <SelectTrigger className="create-discussion-form__select">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="create-discussion-form__field">
          <Label htmlFor="content" className="create-discussion-form__label">
            Content
          </Label>
          <Textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Describe your question or topic in detail"
            className="create-discussion-form__textarea"
            rows={6}
            required
          />
        </div>

        <div className="create-discussion-form__field">
          <Label htmlFor="tags" className="create-discussion-form__label">
            Tags (Optional)
          </Label>
          <div className="create-discussion-form__tags-container">
            {formData.tags.map((tag) => (
              <div key={tag} className="create-discussion-form__tag">
                <span>{tag}</span>
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="create-discussion-form__tag-remove"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="create-discussion-form__tags-input-container">
            <Input
              id="currentTag"
              name="currentTag"
              value={formData.currentTag}
              onChange={handleChange}
              placeholder="Add tags (press Enter to add)"
              className="create-discussion-form__tags-input"
              onKeyDown={handleTagKeyDown}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={addTag}
              className="create-discussion-form__tag-add"
              disabled={!formData.currentTag.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <p className="create-discussion-form__tags-help">
            Add up to 5 tags to help others find your discussion
          </p>
        </div>

        <Button
          type="submit"
          className="create-discussion-form__submit"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Discussion"}
        </Button>
      </form>
    </div>
  );
};

export default CreateDiscussionForm;
