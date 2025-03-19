"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useGetDiscussionPostQuery,
  useCreateDiscussionReplyMutation,
} from "@/state/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Image, X, ArrowLeft } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface DiscussionDetailProps {
  courseId: string;
  postId: string;
}

const DiscussionDetail: React.FC<DiscussionDetailProps> = ({
  courseId,
  postId,
}) => {
  const router = useRouter();
  const { user } = useUser();
  const [content, setContent] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data: post, isLoading } = useGetDiscussionPostQuery(postId);
  const [createReply] = useCreateDiscussionReplyMutation();

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
      toast.error("You must be logged in to reply");
      return;
    }

    if (!content.trim() && selectedImages.length === 0) {
      toast.error("Please provide a reply or upload images");
      return;
    }

    try {
      setIsSubmitting(true);

      await createReply({
        postId,
        userId: user.id,
        content,
        images: selectedImages,
      }).unwrap();

      toast.success("Reply posted successfully");

      // Clean up the previews
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));

      // Reset form
      setContent("");
      setSelectedImages([]);
      setImagePreviews([]);
    } catch (error) {
      console.error("Failed to post reply:", error);
      toast.error("Failed to post reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Discussion not found</div>;
  }

  return (
    <div className="discussion-detail">
      <div className="discussion-detail__header">
        <button
          onClick={() =>
            router.push(`/user/courses/${courseId}/discussions`, {
              scroll: false,
            })
          }
          className="discussion-detail__back"
        >
          <ArrowLeft className="discussion-detail__back-icon" />
          Back to Discussions
        </button>
        <h2 className="discussion-detail__title">{post.title}</h2>
      </div>

      <div className="discussion-detail__post">
        <div className="discussion-detail__post-header">
          <div className="discussion-detail__user">
            <Image
              src={post.userAvatar || "/default-avatar.png"}
              alt={post.userName}
              width={40}
              height={40}
              className="discussion-detail__avatar"
            />
            <div>
              <div className="discussion-detail__user-name">
                {post.userName}
              </div>
              <div className="discussion-detail__timestamp">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="discussion-detail__content">{post.content}</div>

        {post.images && post.images.length > 0 && (
          <div className="discussion-detail__images">
            {post.images.map((image, index) => (
              <div key={index} className="discussion-detail__image-container">
                <Image
                  src={image}
                  alt={`Image ${index + 1}`}
                  width={300}
                  height={300}
                  className="discussion-detail__image"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="discussion-detail__replies">
        <h3 className="discussion-detail__replies-title">
          Replies ({post.replies?.length || 0})
        </h3>

        {post.replies?.map((reply) => (
          <div key={reply.replyId} className="discussion-detail__reply">
            <div className="discussion-detail__reply-header">
              <div className="discussion-detail__user">
                <Image
                  src={reply.userAvatar || "/default-avatar.png"}
                  alt={reply.userName}
                  width={32}
                  height={32}
                  className="discussion-detail__avatar"
                />
                <div>
                  <div className="discussion-detail__user-name">
                    {reply.userName}
                  </div>
                  <div className="discussion-detail__timestamp">
                    {formatDistanceToNow(new Date(reply.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="discussion-detail__content">{reply.content}</div>

            {reply.images && reply.images.length > 0 && (
              <div className="discussion-detail__images">
                {reply.images.map((image, index) => (
                  <div
                    key={index}
                    className="discussion-detail__image-container"
                  >
                    <Image
                      src={image}
                      alt={`Image ${index + 1}`}
                      width={200}
                      height={200}
                      className="discussion-detail__image"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="discussion-detail__reply-form">
        <div>
          <label htmlFor="reply" className="discussion-detail__label">
            Your Reply
          </label>
          <Textarea
            id="reply"
            placeholder="Write your reply here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="discussion-detail__textarea"
            disabled={isSubmitting}
          />
        </div>

        <div className="discussion-detail__file-upload">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="discussion-detail__file-button"
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
            className="discussion-detail__file-input"
            disabled={isSubmitting}
          />
          <span className="ml-2 text-sm text-customgreys-dirtyGrey">
            {selectedImages.length} of 4 images selected
          </span>
        </div>

        {imagePreviews.length > 0 && (
          <div className="discussion-detail__file-preview">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="discussion-detail__preview-item">
                <Image
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  width={200}
                  height={200}
                  className="discussion-detail__preview-image"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="discussion-detail__preview-remove"
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <Button
          type="submit"
          className="discussion-detail__submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Post Reply"}
        </Button>
      </form>
    </div>
  );
};

export default DiscussionDetail;
