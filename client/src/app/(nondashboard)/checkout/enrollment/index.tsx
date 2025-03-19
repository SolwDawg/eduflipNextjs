"use client";

import React, { useEffect, useState } from "react";
import { useCheckoutNavigation } from "@/hooks/useCheckoutNavigation";
import { useCurrentCourse } from "@/hooks/useCurrentCourse";
import { useUser } from "@clerk/nextjs";
import CoursePreview from "@/components/CoursePreview";
import { Button } from "@/components/ui/button";
import { useEnrollCourseMutation } from "@/state/api";
import { toast } from "sonner";
import Loading from "@/components/Loading";

const EnrollmentPage = () => {
  const { navigateToStep } = useCheckoutNavigation();
  const { course, courseId } = useCurrentCourse();
  const { user } = useUser();
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollCourse] = useEnrollCourseMutation();

  useEffect(() => {
    // Auto-enroll when component loads
    handleEnroll();
  }, []);

  const handleEnroll = async () => {
    if (!user || !courseId || isEnrolling) return;

    try {
      setIsEnrolling(true);

      await enrollCourse({
        userId: user.id,
        courseId: courseId,
      }).unwrap();

      toast.success("Successfully enrolled in course!");
      navigateToStep(3);
    } catch (error) {
      console.error("Enrollment failed:", error);
      toast.error("Failed to enroll in course. Please try again.");
    } finally {
      setIsEnrolling(false);
    }
  };

  if (!course) return null;

  return (
    <div className="enrollment">
      <div className="enrollment__container">
        {/* Course Summary */}
        <div className="enrollment__preview">
          <CoursePreview course={course} />
        </div>

        {/* Enrollment Content */}
        <div className="enrollment__content-container">
          <div className="enrollment__content">
            <h1 className="enrollment__title">Enrolling in Course</h1>
            <p className="enrollment__subtitle">
              Please wait while we enroll you in this course.
            </p>

            <div className="enrollment__status">
              {isEnrolling ? (
                <Loading />
              ) : (
                <div className="enrollment__actions">
                  <Button
                    onClick={handleEnroll}
                    className="enrollment__submit"
                    disabled={isEnrolling}
                  >
                    {isEnrolling ? "Enrolling..." : "Enroll Now"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentPage;
