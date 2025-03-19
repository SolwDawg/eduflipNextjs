"use client";

import React from "react";
import { useParams } from "next/navigation";
import DiscussionBoard from "@/components/discussion/DiscussionBoard";

export default function CourseDiscussionsPage() {
  const params = useParams();
  const courseId = params.courseId as string;

  return (
    <div className="container mx-auto px-4 py-8">
      <DiscussionBoard courseId={courseId} />
    </div>
  );
}
