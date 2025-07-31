import express from 'express';
import {
  createCourseOffering,
  getAllCourseOfferings,
  getCourseOfferingById,
  updateCourseOffering,
  deleteCourseOffering
} from '../controllers/courseOffering.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Course Offerings
 *   description: Course Offering management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CourseOffering:
 *       type: object
 *       required:
 *         - start_date
 *         - end_date
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         start_date:
 *           type: string
 *           format: date
 *           example: "2023-09-01"
 *         end_date:
 *           type: string
 *           format: date
 *           example: "2023-12-15"
 *         status:
 *           type: string
 *           enum: [planned, active, completed, cancelled]
 *           default: "planned"
 *         capacity:
 *           type: integer
 *           minimum: 1
 *           default: 30
 *         current_enrollment:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         created_at:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *         updated_at:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *     CourseOfferingInput:
 *       type: object
 *       required:
 *         - start_date
 *         - end_date
 *       properties:
 *         start_date:
 *           $ref: '#/components/schemas/CourseOffering/properties/start_date'
 *         end_date:
 *           $ref: '#/components/schemas/CourseOffering/properties/end_date'
 *         status:
 *           $ref: '#/components/schemas/CourseOffering/properties/status'
 *         capacity:
 *           $ref: '#/components/schemas/CourseOffering/properties/capacity'
 *         current_enrollment:
 *           $ref: '#/components/schemas/CourseOffering/properties/current_enrollment'
 */

/**
 * @swagger
 * /course-offerings:
 *   post:
 *     summary: Create a new course offering
 *     tags: [Course Offerings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseOfferingInput'
 *     responses:
 *       201:
 *         description: Course offering created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseOffering'
 *       400:
 *         description: Validation error (dates invalid, enrollment exceeds capacity)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, createCourseOffering);

/**
 * @swagger
 * /course-offerings:
 *   get:
 *     summary: Get all course offerings
 *     tags: [Course Offerings]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [planned, active, completed, cancelled]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of course offerings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseOffering'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllCourseOfferings);

/**
 * @swagger
 * /course-offerings/{id}:
 *   get:
 *     summary: Get a course offering by ID
 *     tags: [Course Offerings]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Course offering ID
 *     responses:
 *       200:
 *         description: Course offering data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseOffering'
 *       404:
 *         description: Course offering not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getCourseOfferingById);

/**
 * @swagger
 * /course-offerings/{id}:
 *   put:
 *     summary: Update a course offering
 *     tags: [Course Offerings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Course offering ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CourseOfferingInput'
 *     responses:
 *       200:
 *         description: Course offering updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseOffering'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course offering not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticateToken, updateCourseOffering);

/**
 * @swagger
 * /course-offerings/{id}:
 *   delete:
 *     summary: Delete a course offering
 *     tags: [Course Offerings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Course offering ID
 *     responses:
 *       204:
 *         description: Course offering deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Course offering not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateToken, deleteCourseOffering);

export default router;