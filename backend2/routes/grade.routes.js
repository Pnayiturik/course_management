import express from 'express';
import {
  createGrade,
  getAllGrades,
  getGradeById,
  updateGrade,
  publishGrade,
  deleteGrade
} from '../controllers/grade.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Grades
 *   description: Grade management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Grade:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         formative_one:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 100
 *           nullable: true
 *           example: 85.50
 *         formative_two:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 100
 *           nullable: true
 *           example: 92.00
 *         summative:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 100
 *           nullable: true
 *           example: 78.75
 *         final_grade:
 *           type: number
 *           format: float
 *           minimum: 0
 *           maximum: 100
 *           nullable: true
 *           example: 87.25
 *         grade_status:
 *           type: string
 *           enum: [draft, published, archived]
 *           default: "draft"
 *         feedback:
 *           type: string
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *         updated_at:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *     GradeInput:
 *       type: object
 *       properties:
 *         formative_one:
 *           $ref: '#/components/schemas/Grade/properties/formative_one'
 *         formative_two:
 *           $ref: '#/components/schemas/Grade/properties/formative_two'
 *         summative:
 *           $ref: '#/components/schemas/Grade/properties/summative'
 *         final_grade:
 *           $ref: '#/components/schemas/Grade/properties/final_grade'
 *         grade_status:
 *           $ref: '#/components/schemas/Grade/properties/grade_status'
 *         feedback:
 *           $ref: '#/components/schemas/Grade/properties/feedback'
 */

/**
 * @swagger
 * /grades:
 *   post:
 *     summary: Create a new grade record
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GradeInput'
 *     responses:
 *       201:
 *         description: Grade created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grade'
 *       400:
 *         description: Validation error (grades must be 0-100)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, createGrade);

/**
 * @swagger
 * /grades:
 *   get:
 *     summary: Get all grades
 *     tags: [Grades]
 *     parameters:
 *       - in: query
 *         name: grade_status
 *         schema:
 *           type: string
 *           enum: [draft, published, archived]
 *         description: Filter by grade status
 *     responses:
 *       200:
 *         description: List of grades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Grade'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllGrades);

/**
 * @swagger
 * /grades/{id}:
 *   get:
 *     summary: Get a grade by ID
 *     tags: [Grades]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Grade ID
 *     responses:
 *       200:
 *         description: Grade data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grade'
 *       404:
 *         description: Grade not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getGradeById);

/**
 * @swagger
 * /grades/{id}:
 *   put:
 *     summary: Update a grade record
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Grade ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GradeInput'
 *     responses:
 *       200:
 *         description: Grade updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grade'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Grade not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticateToken, updateGrade);

/**
 * @swagger
 * /grades/{id}/publish:
 *   patch:
 *     summary: Publish a grade
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Grade ID
 *     responses:
 *       200:
 *         description: Grade published successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Grade'
 *       400:
 *         description: Grade is already published
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Grade not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:id/publish', authenticateToken, publishGrade);

/**
 * @swagger
 * /grades/{id}:
 *   delete:
 *     summary: Delete a grade record
 *     tags: [Grades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Grade ID
 *     responses:
 *       204:
 *         description: Grade deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Grade not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateToken, deleteGrade);

export default router;