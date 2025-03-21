import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  BaseQueryApi,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryResult,
} from "@reduxjs/toolkit/query";
import { User } from "@clerk/nextjs/server";
import { Clerk } from "@clerk/clerk-js";
import { toast } from "sonner";

const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: Record<string, unknown>
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001",
    prepareHeaders: async (headers) => {
      const token = await window.Clerk?.session?.getToken();
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  try {
    const result: FetchBaseQueryResult = await baseQuery(
      args,
      api,
      extraOptions
    );

    if (result.error) {
      const errorData = result.error.data;
      const errorMessage =
        errorData?.message ||
        result.error.status.toString() ||
        "An error occurred";
      toast.error(`Error: ${errorMessage}`);
    }

    const isMutationRequest =
      (args as FetchArgs).method && (args as FetchArgs).method !== "GET";

    if (isMutationRequest) {
      const successMessage = result.data?.message;
      if (successMessage) toast.success(successMessage);
    }

    if (result.data) {
      result.data = result.data.data;
    } else if (
      result.error?.status === 204 ||
      result.meta?.response?.status === 24
    ) {
      return { data: null };
    }

    return result;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    return {
      error: {
        status: "FETCH_ERROR",
        error: errorMessage,
      } as FetchBaseQueryError,
    };
  }
};

export const api = createApi({
  baseQuery: customBaseQuery,
  reducerPath: "api",
  tagTypes: ["Courses", "Users", "UserCourseProgress", "Grades", "Discussions"],
  endpoints: (build) => ({
    /* 
    ===============
    USER CLERK
    =============== 
    */
    updateUser: build.mutation<User, Partial<User> & { userId: string }>({
      query: ({ userId, ...updatedUser }) => ({
        url: `users/clerk/${userId}`,
        method: "PUT",
        body: updatedUser,
      }),
      invalidatesTags: ["Users"],
    }),

    /* 
    ===============
    COURSES
    =============== 
    */
    getCourses: build.query<Course[], { category?: string }>({
      query: ({ category }) => ({
        url: "courses",
        params: { category },
      }),
      providesTags: ["Courses"],
    }),

    getCourse: build.query<Course, string>({
      query: (id) => `courses/${id}`,
      providesTags: (result, error, id) => [{ type: "Courses", id }],
    }),

    createCourse: build.mutation<
      Course,
      { teacherId: string; teacherName: string }
    >({
      query: (body) => ({
        url: `courses`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Courses"],
    }),

    updateCourse: build.mutation<
      Course,
      { courseId: string; formData: FormData }
    >({
      query: ({ courseId, formData }) => ({
        url: `courses/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Courses", id: courseId },
      ],
    }),

    deleteCourse: build.mutation<{ message: string }, string>({
      query: (courseId) => ({
        url: `courses/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),

    getUploadVideoUrl: build.mutation<
      { uploadUrl: string; videoUrl: string },
      {
        courseId: string;
        chapterId: string;
        sectionId: string;
        fileName: string;
        fileType: string;
      }
    >({
      query: ({ courseId, sectionId, chapterId, fileName, fileType }) => ({
        url: `courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/get-upload-url`,
        method: "POST",
        body: { fileName, fileType },
      }),
    }),

    /* 
    ===============
    USER COURSE PROGRESS
    =============== 
    */
    enrollCourse: build.mutation<void, { userId: string; courseId: string }>({
      query: (enrollment) => ({
        url: `users/course-progress/enroll`,
        method: "POST",
        body: enrollment,
      }),
      invalidatesTags: ["Courses", "UserCourseProgress"],
    }),

    getUserEnrolledCourses: build.query<Course[], string>({
      query: (userId) => `users/course-progress/${userId}/enrolled-courses`,
      providesTags: ["Courses", "UserCourseProgress"],
    }),

    getUserCourseProgress: build.query<
      UserCourseProgress,
      { userId: string; courseId: string }
    >({
      query: ({ userId, courseId }) =>
        `users/course-progress/${userId}/courses/${courseId}`,
      providesTags: ["UserCourseProgress"],
    }),

    updateUserCourseProgress: build.mutation<
      UserCourseProgress,
      {
        userId: string;
        courseId: string;
        progressData: {
          sections: SectionProgress[];
        };
      }
    >({
      query: ({ userId, courseId, progressData }) => ({
        url: `users/course-progress/${userId}/courses/${courseId}`,
        method: "PUT",
        body: progressData,
      }),
      invalidatesTags: ["UserCourseProgress"],
      async onQueryStarted(
        { userId, courseId, progressData },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          api.util.updateQueryData(
            "getUserCourseProgress",
            { userId, courseId },
            (draft) => {
              Object.assign(draft, {
                ...draft,
                sections: progressData.sections,
              });
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),

    /* 
    ===============
    GRADES
    =============== 
    */
    getGrades: build.query<Grade[], void>({
      query: () => ({
        url: "grades",
        method: "GET",
      }),
      providesTags: ["Grades"],
    }),

    createGrade: build.mutation<Grade, Omit<Grade, "gradeId">>({
      query: (gradeData) => ({
        url: "grades",
        method: "POST",
        body: gradeData,
      }),
      invalidatesTags: ["Grades"],
    }),

    updateGrade: build.mutation<
      Grade,
      { gradeId: string; gradeData: Partial<Omit<Grade, "gradeId">> }
    >({
      query: ({ gradeId, gradeData }) => ({
        url: `grades/${gradeId}`,
        method: "PUT",
        body: gradeData,
      }),
      invalidatesTags: ["Grades"],
    }),

    deleteGrade: build.mutation<{ message: string }, string>({
      query: (gradeId) => ({
        url: `grades/${gradeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Grades"],
    }),

    /* 
    ===============
    DISCUSSIONS
    =============== 
    */
    getDiscussionPosts: build.query<DiscussionPost[], string>({
      query: (courseId) => ({
        url: `discussions/courses/${courseId}/posts`,
        method: "GET",
      }),
      providesTags: (result, error, courseId) => [
        { type: "Discussions", id: courseId },
      ],
    }),

    getDiscussionPost: build.query<
      { post: DiscussionPost; replies: DiscussionReply[] },
      string
    >({
      query: (postId) => ({
        url: `discussions/posts/${postId}`,
        method: "GET",
      }),
      providesTags: (result, error, postId) => [
        { type: "Discussions", id: postId },
      ],
    }),

    createDiscussionPost: build.mutation<
      DiscussionPost,
      CreateDiscussionPostRequest
    >({
      query: (postData) => {
        const formData = new FormData();
        formData.append("courseId", postData.courseId);
        formData.append("userId", postData.userId);
        formData.append("title", postData.title);
        formData.append("content", postData.content);

        if (postData.images && postData.images.length > 0) {
          postData.images.forEach((image, index) => {
            formData.append(`images`, image);
          });
        }

        return {
          url: `discussions/posts`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Discussions", id: courseId },
      ],
    }),

    createDiscussionReply: build.mutation<
      DiscussionReply,
      CreateDiscussionReplyRequest
    >({
      query: (replyData) => {
        const formData = new FormData();
        formData.append("postId", replyData.postId);
        formData.append("userId", replyData.userId);
        formData.append("content", replyData.content);

        if (replyData.images && replyData.images.length > 0) {
          replyData.images.forEach((image, index) => {
            formData.append(`images`, image);
          });
        }

        return {
          url: `discussions/replies`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { postId }) => [
        { type: "Discussions", id: postId },
      ],
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetCoursesQuery,
  useGetCourseQuery,
  useGetUploadVideoUrlMutation,
  useEnrollCourseMutation,
  useGetUserEnrolledCoursesQuery,
  useGetUserCourseProgressQuery,
  useUpdateUserCourseProgressMutation,
  useGetGradesQuery,
  useCreateGradeMutation,
  useUpdateGradeMutation,
  useDeleteGradeMutation,
  useGetDiscussionPostsQuery,
  useGetDiscussionPostQuery,
  useCreateDiscussionPostMutation,
  useCreateDiscussionReplyMutation,
} = api;
