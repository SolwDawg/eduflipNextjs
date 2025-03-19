"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import AddUserCourseModal from "@/components/AddUserCourseModal";
import { useGetUserEnrolledCoursesQuery } from "@/state/api";
import TeacherCourseCard from "@/components/TeacherCourseCard";
import Loading from "@/components/Loading";

export default function ManageEnrollmentsPage() {
  const [userId, setUserId] = useState("");
  const [searchUserId, setSearchUserId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    data: enrolledCourses,
    isLoading,
    refetch,
  } = useGetUserEnrolledCoursesQuery(searchUserId, {
    skip: !searchUserId,
  });

  const handleSearch = () => {
    if (userId) {
      setSearchUserId(userId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleEnrollmentSuccess = () => {
    refetch();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Header
        title="Manage Course Enrollments"
        subtitle="Add courses to users or view enrolled courses"
        rightElement={
          <Button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-700 hover:bg-primary-600"
            disabled={!searchUserId}
          >
            Add Course to User
          </Button>
        }
      />

      <div className="mt-6 flex items-center gap-4">
        <Input
          placeholder="Enter User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          onKeyDown={handleKeyDown}
          className="max-w-md"
        />
        <Button onClick={handleSearch}>Search User</Button>
      </div>

      {searchUserId && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">
            Enrolled Courses for User: {searchUserId}
          </h2>

          {isLoading ? (
            <Loading />
          ) : !enrolledCourses || enrolledCourses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No enrolled courses found for this user.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <TeacherCourseCard
                  key={course.courseId}
                  course={course}
                  isOwner={false}
                  onEdit={() => {}}
                  onDelete={() => {}}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <AddUserCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleEnrollmentSuccess}
        userId={searchUserId}
      />
    </div>
  );
}
