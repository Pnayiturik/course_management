import express from 'express';
import { 
    createModule, 
    getAllModules, 
    getModuleById, 
    updateModule, 
    deleteModule 
} from '../controllers/module.controller.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Modules
 *   description: Course module management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Module:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         code:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         credits:
 *           type: integer
 *         is_active:
 *           type: boolean
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         creator:
 *           $ref: '#/components/schemas/Creator'
 *     Creator:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         email:
 *           type: string
 *     ModuleInput:
 *       type: object
 *       required:
 *         - code
 *         - name
 *         - credits
 *       properties:
 *         code:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         credits:
 *           type: integer
 *           minimum: 1
 *         is_active:
 *           type: boolean
 *     PaginatedModules:
 *       type: object
 *       properties:
 *         total:
 *           type: integer
 *         page:
 *           type: integer
 *         limit:
 *           type: integer
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Module'
 *   parameters:
 *     pageParam:
 *       in: query
 *       name: page
 *       schema:
 *         type: integer
 *         default: 1
 *       description: Page number
 *     limitParam:
 *       in: query
 *       name: limit
 *       schema:
 *         type: integer
 *         default: 10
 *       description: Items per page
 *     activeFilter:
 *       in: query
 *       name: active
 *       schema:
 *         type: boolean
 *       description: Filter by active status
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /modules:
 *   post:
 *     summary: Create a new module (Manager only)
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ModuleInput'
 *     responses:
 *       201:
 *         description: Module created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 code:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 credits:
 *                   type: integer
 *                 is_active:
 *                   type: boolean
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error or module code exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: array
 *                   items:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not a manager)
 *       500:
 *         description: Server error
 */
router.post('/', authenticateToken, authorizeRoles(['manager']), createModule);

/**
 * @swagger
 * /modules:
 *   get:
 *     summary: Get all modules with pagination
 *     tags: [Modules]
 *     parameters:
 *       - $ref: '#/components/parameters/pageParam'
 *       - $ref: '#/components/parameters/limitParam'
 *       - $ref: '#/components/parameters/activeFilter'
 *     responses:
 *       200:
 *         description: Paginated list of modules
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedModules'
 *       500:
 *         description: Server error
 */
router.get('/', getAllModules);

/**
 * @swagger
 * /modules/{id}:
 *   get:
 *     summary: Get a module by ID with creator details
 *     tags: [Modules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Module ID
 *     responses:
 *       200:
 *         description: Module data with creator information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Module'
 *       404:
 *         description: Module not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getModuleById);

/**
 * @swagger
 * /modules/{id}:
 *   put:
 *     summary: Update a module (Manager only)
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Module ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ModuleInput'
 *     responses:
 *       200:
 *         description: Module updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 code:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 credits:
 *                   type: integer
 *                 is_active:
 *                   type: boolean
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: Validation error or module code exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not a manager)
 *       404:
 *         description: Module not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticateToken, authorizeRoles(['manager']), updateModule);

/**
 * @swagger
 * /modules/{id}:
 *   delete:
 *     summary: Delete a module (Manager only)
 *     tags: [Modules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Module ID
 *     responses:
 *       204:
 *         description: Module deleted successfully
 *       400:
 *         description: Cannot delete module with associated classes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 solution:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not a manager)
 *       404:
 *         description: Module not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticateToken, authorizeRoles(['manager']), deleteModule);

export default router;