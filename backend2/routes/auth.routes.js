import express from 'express';
import {
  registerStudent,
  registerFacilitator,
  registerManager,
  login,
  getProfile
} from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserBase:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - first_name
 *         - last_name
 *       properties:
 *         username:
 *           type: string
 *           minLength: 3
 *           maxLength: 250
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 100
 *         password:
 *           type: string
 *           minLength: 6
 *         first_name:
 *           type: string
 *           maxLength: 250
 *         last_name:
 *           type: string
 *           maxLength: 250
 * 
 *     StudentInput:
 *       allOf:
 *         - $ref: '#/components/schemas/UserBase'
 *         - type: object
 *           required:
 *             - student_id
 *           properties:
 *             student_id:
 *               type: string
 *               maxLength: 250
 * 
 *     FacilitatorInput:
 *       allOf:
 *         - $ref: '#/components/schemas/UserBase'
 *         - type: object
 *           properties:
 *             faculty_position:
 *               type: string
 *               maxLength: 250
 *             specialization:
 *               type: string
 *               maxLength: 200
 * 
 *     ManagerInput:
 *       allOf:
 *         - $ref: '#/components/schemas/UserBase'
 *         - type: object
 *           properties:
 *             department:
 *               type: string
 *               maxLength: 100
 * 
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         user:
 *           $ref: '#/components/schemas/User'
 * 
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [student, facilitator, manager]
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         student_id:
 *           type: string
 *         faculty_position:
 *           type: string
 *         specialization:
 *           type: string
 *         department:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /auth/register/student:
 *   post:
 *     summary: Register a new student
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StudentInput'
 *     responses:
 *       201:
 *         description: Student registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post('/register/student', registerStudent);

/**
 * @swagger
 * /auth/register/facilitator:
 *   post:
 *     summary: Register a new facilitator
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FacilitatorInput'
 *     responses:
 *       201:
 *         description: Facilitator registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post('/register/facilitator', registerFacilitator);

/**
 * @swagger
 * /auth/register/manager:
 *   post:
 *     summary: Register a new manager
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ManagerInput'
 *     responses:
 *       201:
 *         description: Manager registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post('/register/manager', registerManager);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post('/login', login);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/me', authenticateToken, getProfile);

export default router;