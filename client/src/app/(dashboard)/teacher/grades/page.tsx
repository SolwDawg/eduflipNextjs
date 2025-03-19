"use client";

import React from "react";
import GradeManager from "@/components/GradeManager";
import Header from "@/components/Header";

export default function GradesPage() {
  return (
    <div className="p-4">
      <Header
        title="Grades Management"
        subtitle="Create and manage grade levels for courses"
      />
      <div className="mt-6">
        <GradeManager />
      </div>
    </div>
  );
}
