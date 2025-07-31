import express from 'express';
import {
  createActivityLog,
  getAllActivityLogs,
  getActivityLogById,
  updateActivityLog,
  deleteActivityLog
} from '../controllers/activityLog.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ActivityLogs
 *   description: Activity Log management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ActivityLog:
 *       type: object
 *       required:
 *         - week_number
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         week_number:
 *           type: integer
 *           minimum: 1
 *           maximum: 52
 *           example: 5
 *         attendance:
 *           type: array
 *           items:
 *             type: object
 *           default: []
 *         formative_one_grading:
 *           type: string
 *           enum: [Done, Pending, Not Started]
 *           default: "Not Started"
 *         formative_two_grading:
 *           type: string
 *           enum: [Done, Pending, Not Started]
 *           default: "Not Started"
 *         summative_grading:
 *           type: string
 *           enum: [Done, Pending, Not Started]
 *           default: "Not Started"
 *         course_moderation:
 *           type: string
 *           enum: [Done, Pending, Not Started]
 *           default: "Not Started"
 *         intranet_sync:
 *           type: string
 *           enum: [Done, Pending, Not Started]
 *           default: "Not Started"
 *         gradebook_status:
 *           type: string
 *           enum: [Done, Pending, Not Started]
 *           default: "Not Started"
 *         notes:
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
 *     ActivityLogInput:
 *       type: object
 *       required:
 *         - week_number
 *       properties:
 *         week_number:
 *           $ref: '#/components/schemas/ActivityLog/properties/week_number'
 *         attendance:
 *           $ref: '#/components/schemas/ActivityLog/properties/attendance'
 *         formative_one_grading:
 *           $ref: '#/components/schemas/ActivityLog/properties/formative_one_grading'
 *         formative_two_grading:
 *           $ref: '#/components/schemas/ActivityLog/properties/formative_two_grading'
 *         summative_grading:
 *           $ref: '#/components/schemas/ActivityLog/properties/summative_grading'
 *         course_moderation:
 *           $ref: '#/components/schemas/ActivityLog/properties/course_moderation'
 *         intranet_sync:
 *           $ref: '#/components/schemas/ActivityLog/properties/intranet_sync'
 *         gradebook_status:
 *           $ref: '#/components/schemas/ActivityLog/properties/gradebook_status'
 *         notes:
 *           $ref: '#/components/schemas/ActivityLog/properties/notes'
 */

/**
 * @swagger
 * /activity-logs:
 *   post:
 *     summary: Create a new activity log
 *     tags: [ActivityLogs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActivityLogInput'
 *     responses:
 *       201:
 *         description: Activity log created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActivityLog'
 *       400:
 *         description: Validation error (invalid week number)
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, createActivityLog);

/**
 * @swagger
 * /activity-logs:
 *   get:
 *     summary: Get all activity logs
 *     tags: [ActivityLogs]
 *     parameters:
 *       - in: query
 *         name: week_number
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 52
 *         description: Filter by week number
 *     responses:
 *       200:
 *         description: List of activity logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ActivityLog'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllActivityLogs);

/**
 * @swagger
 * /activity-logs/{id}:
 *   get:
 *     summary: Get an activity log by ID
 *     tags: [ActivityLogs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Activity log ID
 *     responses:
 *       200:
 *         description: Activity log data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActivityLog'
 *       404:
 *         description: Activity log not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getActivityLogById);

/**
 * @swagger
 * /activity-logs/{id}:
 *   put:
 *     summary: Update an activity log
 *     tags: [ActivityLogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Activity log ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActivityLogInput'
 *     responses:
 *       200:
 *         description: Activity log updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActivityLog'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Activity log not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticateToken, updateActivityLog);

/**
 * @swagger
 * /activity-logs/{id}:
 *   delete:
 *     summary: Delete an activity log
 *     tags: [ActivityLogs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Activity log ID
 *     responses:
 *       204:
 *         description: Activity log deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Activity log not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateToken, deleteActivityLog);

export default router;