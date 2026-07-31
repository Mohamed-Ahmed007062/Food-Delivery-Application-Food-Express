import { Router } from 'express';
import { CategoryController } from './category.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createCategorySchema, updateCategorySchema } from './category.validation.js';

const router = Router();

/**
 * @openapi
 * /categories:
 *   get:
 *     summary: List categories
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: restaurantId
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of food categories
 */
router.get('/', CategoryController.getCategories);

/**
 * @openapi
 * /categories/{id}:
 *   get:
 *     summary: Get category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Category details
 */
router.get('/:id', CategoryController.getById);

/**
 * @openapi
 * /categories:
 *   post:
 *     summary: Create category (Owner/Admin)
 *     tags: [Categories]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Category created
 */
router.post(
  '/',
  protect,
  authorize('restaurant-owner', 'admin'),
  validate(createCategorySchema),
  CategoryController.create
);

/**
 * @openapi
 * /categories/{id}:
 *   put:
 *     summary: Update category (Owner/Admin)
 *     tags: [Categories]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Category updated
 */
router.put(
  '/:id',
  protect,
  authorize('restaurant-owner', 'admin'),
  validate(updateCategorySchema),
  CategoryController.update
);

/**
 * @openapi
 * /categories/{id}:
 *   delete:
 *     summary: Delete category (Admin/Owner)
 *     tags: [Categories]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Category deleted
 */
router.delete(
  '/:id',
  protect,
  authorize('restaurant-owner', 'admin'),
  CategoryController.delete
);

export default router;
