import express from "express";
import {
  getCourse,
  listCourses,
  createCourse,
  updateCourse,
} from "../controllers/courseController";
import { requireAuth } from "@clerk/express";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management API
 */

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Returns the list of all courses
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter courses by category
 *       - in: query
 *         name: gradeId
 *         schema:
 *           type: string
 *         description: Filter courses by grade
 *     responses:
 *       200:
 *         description: The list of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 */
router.get("/", listCourses);

/**
 * @swagger
 * /courses/{courseId}:
 *   get:
 *     summary: Get a course by id
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: string
 *         required: true
 *         description: The course id
 *     responses:
 *       200:
 *         description: The course description by id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *       404:
 *         description: The course was not found
 */
router.get("/:courseId", getCourse);

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - level
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               gradeId:
 *                 type: string
 *               image:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced]
 *               sections:
 *                 type: array
 *     responses:
 *       201:
 *         description: The course was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 */
router.post("/", requireAuth(), createCourse);

/**
 * @swagger
 * /courses/{courseId}:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         schema:
 *           type: string
 *         required: true
 *         description: The course id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               gradeId:
 *                 type: string
 *               image:
 *                 type: string
 *               level:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced]
 *               status:
 *                 type: string
 *                 enum: [Draft, Published]
 *               sections:
 *                 type: array
 *     responses:
 *       200:
 *         description: The course was updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *       404:
 *         description: The course was not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not the teacher of this course
 */
router.put("/:courseId", requireAuth(), updateCourse);

// Note: The following routes are documented but not implemented yet
// Uncomment when the controller functions are available

/*
router.get("/teacher/my-courses", requireAuth(), getTeacherCourses);
router.post("/:courseId/sections", requireAuth(), addCourseSection);
router.put("/:courseId/sections/:sectionId", requireAuth(), updateCourseSection);
router.post("/:courseId/sections/:sectionId/chapters", requireAuth(), addChapterToSection);
*/

export default router;
