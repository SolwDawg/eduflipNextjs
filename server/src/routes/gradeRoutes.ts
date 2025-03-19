import express from "express";
import { requireAuth } from "@clerk/express";
import {
  createGrade,
  deleteGrade,
  getGrade,
  getGradeCourses,
  listGrades,
  updateGrade,
} from "../controllers/gradeController";

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Grade:
 *       type: object
 *       required:
 *         - gradeId
 *         - name
 *         - order
 *       properties:
 *         gradeId:
 *           type: string
 *           description: The auto-generated id of the grade
 *         name:
 *           type: string
 *           description: The grade name
 *         description:
 *           type: string
 *           description: Grade description
 *         order:
 *           type: number
 *           description: The sorting order of the grade
 *         status:
 *           type: string
 *           description: Grade status
 *           enum: [Active, Inactive]
 *       example:
 *         gradeId: grade-10
 *         name: Grade 10
 *         description: Secondary school grade for students aged 15-16
 *         order: 10
 *         status: Active
 */

/**
 * @swagger
 * tags:
 *   name: Grades
 *   description: Grade management API
 */

/**
 * @swagger
 * /grades:
 *   get:
 *     summary: Returns the list of all grades
 *     tags: [Grades]
 *     responses:
 *       200:
 *         description: The list of grades
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
 *                     $ref: '#/components/schemas/Grade'
 */
router.get("/", listGrades);

/**
 * @swagger
 * /grades/{gradeId}:
 *   get:
 *     summary: Get a grade by id
 *     tags: [Grades]
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         schema:
 *           type: string
 *         required: true
 *         description: The grade id
 *     responses:
 *       200:
 *         description: The grade description by id
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Grade'
 *       404:
 *         description: The grade was not found
 */
router.get("/:gradeId", getGrade);

/**
 * @swagger
 * /grades/{gradeId}/courses:
 *   get:
 *     summary: Get all courses for a specific grade
 *     tags: [Grades]
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         schema:
 *           type: string
 *         required: true
 *         description: The grade id
 *     responses:
 *       200:
 *         description: The list of courses for the grade
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     grade:
 *                       $ref: '#/components/schemas/Grade'
 *                     courses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Course'
 *       404:
 *         description: The grade was not found
 */
router.get("/:gradeId/courses", getGradeCourses);

/**
 * @swagger
 * /grades:
 *   post:
 *     summary: Create a new grade
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - order
 *             properties:
 *               name:
 *                 type: string
 *                 description: The grade name
 *               description:
 *                 type: string
 *                 description: The grade description
 *               order:
 *                 type: number
 *                 description: The sorting order
 *               status:
 *                 type: string
 *                 description: Grade status
 *                 enum: [Active, Inactive]
 *     responses:
 *       201:
 *         description: The grade was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Grade'
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 */
router.post("/", requireAuth(), createGrade);

/**
 * @swagger
 * /grades/{gradeId}:
 *   put:
 *     summary: Update a grade
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         schema:
 *           type: string
 *         required: true
 *         description: The grade id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               order:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: The grade was updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Grade'
 *       404:
 *         description: The grade was not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:gradeId", requireAuth(), updateGrade);

/**
 * @swagger
 * /grades/{gradeId}:
 *   delete:
 *     summary: Delete a grade
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gradeId
 *         schema:
 *           type: string
 *         required: true
 *         description: The grade id
 *     responses:
 *       200:
 *         description: The grade was deleted
 *       400:
 *         description: Cannot delete grade with associated courses
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: The grade was not found
 */
router.delete("/:gradeId", requireAuth(), deleteGrade);

export default router;
