import { Router } from 'express';
import { UserController } from './user.controller.js';
import { AuthController } from '../auth/auth.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/me', protect, AuthController.getMe);

/**
 * @openapi
 * /users:
 *   get:
 *     summary: List platform users (Admin only)
 *     tags: [Users]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: role
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of users
 */
router.get('/', protect, authorize('admin'), UserController.getUsers);

/**
 * @openapi
 * /users/{id}/status:
 *   patch:
 *     summary: Toggle user active / banned status (Admin only)
 *     tags: [Users]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: User status updated
 */
router.patch('/:id/status', protect, authorize('admin'), UserController.updateUserStatus);

/**
 * @openapi
 * /users/{id}/role:
 *   patch:
 *     summary: Update user role (Admin only)
 *     tags: [Users]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: User role updated
 */
router.patch('/:id/role', protect, authorize('admin'), UserController.updateUserRole);

export default router;
