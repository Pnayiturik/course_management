import express from 'express';
import { 
    createClass, 
    getAllClasses, 
    getClassById, 
    updateClass, 
    deleteClass 
} from '../controllers/class.controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Classes
 *   description: Class management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Class:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Advanced Web Development"
 *         code:
 *           type: string
 *           example: "AWD-2023"
 *         trimester:
 *           type: string
 *           example: "Trimester 1"
 *         intake_period:
 *           type: string
 *           enum: [HT1, HT2, FT]
 *           example: "HT1"
 *         mode:
 *           type: string
 *           enum: [online, in-person, hybrid]
 *           example: "hybrid"
 *         cohort_id:
 *           type: integer
 *           example: 5
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2023-01-15T09:30:00Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2023-01-15T09:30:00Z"
 *         cohort:
 *           $ref: '#/components/schemas/Cohort'
 *     Cohort:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 5
 *         name:
 *           type: string
 *           example: "2023 Spring Cohort"
 *     ClassInput:
 *       type: object
 *       required:
 *         - name
 *         - code
 *         - trimester
 *         - intake_period
 *         - mode
 *         - cohort_id
 *       properties:
 *         name:
 *           type: string
 *           example: "Advanced Web Development"
 *         code:
 *           type: string
 *           example: "AWD-2023"
 *         trimester:
 *           type: string
 *           example: "Trimester 1"
 *         intake_period:
 *           type: string
 *           enum: [HT1, HT2, FT]
 *           example: "HT1"
 *         mode:
 *           type: string
 *           enum: [online, in-person, hybrid]
 *           example: "hybrid"
 *         cohort_id:
 *           type: integer
 *           example: 5
 *     PaginatedClasses:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *           example: 25
 *         page:
 *           type: integer
 *           example: 1
 *         limit:
 *           type: integer
 *           example: 10
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Class'
 *   parameters:
 *     pageParam:
 *       in: query
 *       name: page
 *       schema:
 *         type: integer
 *         default: 1
 *       description: Page number for pagination
 *     limitParam:
 *       in: query
 *       name: limit
 *       schema:
 *         type: integer
 *         default: 10
 *       description: Number of items per page
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /classes:
 *   post:
 *     summary: Create a new class (Manager only)
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClassInput'
 *     responses:
 *       201:
 *         description: Class created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation error"
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Name is required", "Code must be unique"]
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - User is not a manager
 *       404:
 *         description: Cohort not found
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, authorizeRoles(['manager']), createClass);

/**
 * @swagger
 * /classes:
 *   get:
 *     summary: Get all classes with pagination and filtering
 *     tags: [Classes]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - in: query
 *         name: cohort_id
 *         schema:
 *           type: integer
 *         description: Filter by cohort ID
 *       - in: query
 *         name: intake_period
 *         schema:
 *           type: string
 *           enum: [HT1, HT2, FT]
 *         description: Filter by intake period
 *       - in: query
 *         name: mode
 *         schema:
 *           type: string
 *           enum: [online, in-person, hybrid]
 *         description: Filter by delivery mode
 *     responses:
 *       200:
 *         description: Paginated list of classes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedClasses'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllClasses);

/**
 * @swagger
 * /classes/{id}:
 *   get:
 *     summary: Get a class by ID with cohort details
 *     tags: [Classes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the class to get
 *     responses:
 *       200:
 *         description: Class details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 *       404:
 *         description: Class not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', getClassById);

/**
 * @swagger
 * /classes/{id}:
 *   put:
 *     summary: Update a class (Manager only)
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the class to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClassInput'
 *     responses:
 *       200:
 *         description: Class updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Class'
 *       400:
 *         description: Validation error or class code exists
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - User is not a manager
 *       404:
 *         description: Class or cohort not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticateToken, authorizeRoles(['manager']), updateClass);

/**
 * @swagger
 * /classes/{id}:
 *   delete:
 *     summary: Delete a class (Manager only)
 *     tags: [Classes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the class to delete
 *     responses:
 *       204:
 *         description: Class deleted successfully
 *       400:
 *         description: Cannot delete class with enrollments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Bad request"
 *                 message:
 *                   type: string
 *                   example: "Cannot delete class with associated enrollments"
 *                 solution:
 *                   type: string
 *                   example: "Remove all enrollments before deleting this class"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - User is not a manager
 *       404:
 *         description: Class not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateToken, authorizeRoles(['manager']), deleteClass);

export default router;