"use client";

import React from "react";
import { useParams } from "next/navigation";
import DiscussionDetail from "@/components/discussion/DiscussionDetail";

export default function DiscussionPostPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const postId = params.postId as string;

  return (
    <div className="container mx-auto px-4 py-8">
      <DiscussionDetail courseId={courseId} postId={postId} />
    </div>
  );
}
