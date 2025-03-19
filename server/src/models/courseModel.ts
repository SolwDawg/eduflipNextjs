import { Schema, model } from "dynamoose";

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - courseId
 *         - title
 *         - category
 *         - level
 *         - status
 *       properties:
 *         courseId:
 *           type: string
 *           description: The auto-generated id of the course
 *         title:
 *           type: string
 *           description: Course title
 *         description:
 *           type: string
 *           description: Course description
 *         category:
 *           type: string
 *           description: Course category
 *         gradeId:
 *           type: string
 *           description: ID of the grade this course belongs to
 *         image:
 *           type: string
 *           description: URL to course image
 *         level:
 *           type: string
 *           enum: [Beginner, Intermediate, Advanced]
 *           description: Course difficulty level
 *         status:
 *           type: string
 *           enum: [Draft, Published]
 *           description: Course publication status
 *         sections:
 *           type: array
 *           description: Course sections containing chapters
 *         enrollments:
 *           type: array
 *           description: Students enrolled in the course
 *       example:
 *         courseId: "5f8d0a5f-dc3a-4c56-9c01-7e8c32de7df8"
 *         title: "Mathematics for Grade 10"
 *         description: "Comprehensive mathematics course for Grade 10 students"
 *         category: "Mathematics"
 *         gradeId: "grade-10"
 *         image: "https://example.com/math-grade10.jpg"
 *         level: "Intermediate"
 *         status: "Published"
 */

const commentSchema = new Schema({
  commentId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
});

const chapterSchema = new Schema({
  chapterId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["Text", "Quiz", "Video"],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  comments: {
    type: Array,
    schema: [commentSchema],
  },
  video: {
    type: String,
  },
});

const sectionSchema = new Schema({
  sectionId: {
    type: String,
    required: true,
  },
  sectionTitle: {
    type: String,
    required: true,
  },
  sectionDescription: {
    type: String,
  },
  chapters: {
    type: Array,
    schema: [chapterSchema],
  },
});

const courseSchema = new Schema(
  {
    courseId: {
      type: String,
      hashKey: true,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    gradeId: {
      type: String,
      index: {
        name: "GradeCoursesIndex",
        type: "global",
      },
    },
    image: {
      type: String,
    },
    level: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    status: {
      type: String,
      required: true,
      enum: ["Draft", "Published"],
    },
    sections: {
      type: Array,
      schema: [sectionSchema],
    },
    enrollments: {
      type: Array,
      schema: [
        new Schema({
          userId: {
            type: String,
            required: true,
          },
        }),
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Course = model("Course", courseSchema);
export default Course;
