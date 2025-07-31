import express from 'express';
import {
  createCohort,
  getAllCohorts,
  getCohortById,
  updateCohort,
  deleteCohort
} from '../controllers/cohort.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cohorts
 *   description: Cohort management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Cohort:
 *       type: object
 *       required:
 *         - name
 *         - start_date
 *         - end_date
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         name:
 *           type: string
 *           maxLength: 50
 *           example: "2023-FALL-WEB-DEV"
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
 *           enum: [planned, active, completed, archived]
 *           default: "planned"
 *         created_at:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *         updated_at:
 *           type: string
 *           format: date-time
 *           readOnly: true
 *     CohortInput:
 *       type: object
 *       required:
 *         - name
 *         - start_date
 *         - end_date
 *       properties:
 *         name:
 *           $ref: '#/components/schemas/Cohort/properties/name'
 *         start_date:
 *           $ref: '#/components/schemas/Cohort/properties/start_date'
 *         end_date:
 *           $ref: '#/components/schemas/Cohort/properties/end_date'
 *         status:
 *           $ref: '#/components/schemas/Cohort/properties/status'
 */

/**
 * @swagger
 * /cohorts:
 *   post:
 *     summary: Create a new cohort
 *     tags: [Cohorts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CohortInput'
 *     responses:
 *       201:
 *         description: Cohort created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cohort'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, createCohort);

/**
 * @swagger
 * /cohorts:
 *   get:
 *     summary: Get all cohorts
 *     tags: [Cohorts]
 *     responses:
 *       200:
 *         description: List of cohorts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cohort'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllCohorts);

/**
 * @swagger
 * /cohorts/{id}:
 *   get:
 *     summary: Get a cohort by ID
 *     tags: [Cohorts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Cohort ID
 *     responses:
 *       200:
 *         description: Cohort data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cohort'
 *       404:
 *         description: Cohort not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getCohortById);

/**
 * @swagger
 * /cohorts/{id}:
 *   put:
 *     summary: Update a cohort
 *     tags: [Cohorts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Cohort ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CohortInput'
 *     responses:
 *       200:
 *         description: Cohort updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cohort'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cohort not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticateToken, updateCohort);

/**
 * @swagger
 * /cohorts/{id}:
 *   delete:
 *     summary: Delete a cohort
 *     tags: [Cohorts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Cohort ID
 *     responses:
 *       204:
 *         description: Cohort deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Cohort not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateToken, deleteCohort);

export default router;