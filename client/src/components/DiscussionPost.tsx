"use client";

import React from "react";
import { ThumbsUp, Award, MessageSquare, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";

interface DiscussionPostProps {
  post: DiscussionPost;
  isThreadCreator: boolean;
  onReply: (postId: string) => void;
  onReact: (postId: string, reactionType: "likes" | "helpful") => void;
  onMarkAsAnswer: (postId: string) => void;
  onEdit?: (post: DiscussionPost) => void;
  onDelete?: (postId: string) => void;
}

const DiscussionPost: React.FC<DiscussionPostProps> = ({
  post,
  isThreadCreator,
  onReply,
  onReact,
  onMarkAsAnswer,
  onEdit,
  onDelete,
}) => {
  const { user } = useUser();
  const isPostCreator = user?.id === post.userId;

  return (
    <div
      className={cn(
        "discussion-post",
        post.isAnswer && "discussion-post--answer"
      )}
    >
      <div className="discussion-post__header">
        <div className="discussion-post__user-info">
          <span className="discussion-post__username">{post.userName}</span>
          <span className="discussion-post__date">
            {formatDistanceToNow(new Date(post.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        {post.isAnswer && (
          <div className="discussion-post__answer-badge">
            <Award className="discussion-post__answer-icon" />
            <span>Best Answer</span>
          </div>
        )}
      </div>

      <div className="discussion-post__content">
        <p>{post.content}</p>

        {post.images && post.images.length > 0 && (
          <div className="discussion-post__images">
            {post.images.map((image, index) => (
              <div key={index} className="discussion-post__image-container">
                <Image
                  src={image}
                  alt={`Image ${index + 1}`}
                  width={500}
                  height={300}
                  className="discussion-post__image"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="discussion-post__actions">
        <div className="discussion-post__reactions">
          <Button
            variant="ghost"
            size="sm"
            className="discussion-post__reaction"
            onClick={() => onReact(post.postId, "likes")}
          >
            <ThumbsUp className="discussion-post__reaction-icon" />
            <span>{post.reactions.likes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="discussion-post__reaction"
            onClick={() => onReact(post.postId, "helpful")}
          >
            <Award className="discussion-post__reaction-icon" />
            <span>{post.reactions.helpful}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="discussion-post__reaction"
            onClick={() => onReply(post.postId)}
          >
            <MessageSquare className="discussion-post__reaction-icon" />
            <span>Reply</span>
          </Button>
        </div>

        <div className="discussion-post__admin-actions">
          {isThreadCreator && !post.isAnswer && (
            <Button
              variant="ghost"
              size="sm"
              className="discussion-post__mark-answer"
              onClick={() => onMarkAsAnswer(post.postId)}
            >
              <Award className="discussion-post__reaction-icon" />
              <span>Mark as Answer</span>
            </Button>
          )}

          {isPostCreator && (
            <>
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="discussion-post__edit"
                  onClick={() => onEdit(post)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="discussion-post__delete text-red-500 hover:text-red-600 hover:bg-red-100/10"
                  onClick={() => onDelete(post.postId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiscussionPost;
