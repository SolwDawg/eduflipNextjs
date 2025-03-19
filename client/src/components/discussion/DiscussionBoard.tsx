"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetDiscussionPostsQuery } from "@/state/api";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus, MessageSquare } from "lucide-react";
import Loading from "@/components/Loading";
import DiscussionPostItem from "./DiscussionPostItem";
import { formatDistanceToNow } from "date-fns";

interface DiscussionBoardProps {
  courseId: string;
}

const DiscussionBoard: React.FC<DiscussionBoardProps> = ({ courseId }) => {
  const router = useRouter();
  const { data: posts, isLoading } = useGetDiscussionPostsQuery(courseId);

  const handleCreatePost = () => {
    router.push(`/user/courses/${courseId}/discussions/create`, {
      scroll: false,
    });
  };

  const handleViewPost = (postId: string) => {
    router.push(`/user/courses/${courseId}/discussions/${postId}`, {
      scroll: false,
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="discussion">
      <div className="discussion__header">
        <h2 className="discussion__title">Course Discussions</h2>
        <Button
          onClick={handleCreatePost}
          className="discussion__create-button"
        >
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          New Discussion
        </Button>
      </div>

      {posts && posts.length > 0 ? (
        <div className="discussion__posts">
          {posts.map((post) => (
            <DiscussionPostItem
              key={post.postId}
              post={post}
              onClick={() => handleViewPost(post.postId)}
            />
          ))}
        </div>
      ) : (
        <div className="discussion__empty">
          <MessageSquare className="discussion__empty-icon" />
          <p className="discussion__empty-text">
            No discussions yet. Be the first to start a conversation!
          </p>
        </div>
      )}
    </div>
  );
};

export default DiscussionBoard;
