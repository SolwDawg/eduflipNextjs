"use client";

import React from "react";
import { useParams } from "next/navigation";
import CreateDiscussionPost from "@/components/discussion/CreateDiscussionPost";

export default function CreateDiscussionPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  return (
    <div className="container mx-auto px-4 py-8">
      <CreateDiscussionPost courseId={courseId} />
    </div>
  );
}
