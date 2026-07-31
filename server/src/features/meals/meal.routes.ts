import { Router } from 'express';
import { MealController } from './meal.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createMealSchema, updateMealSchema, queryMealSchema } from './meal.validation.js';

const router = Router();

/**
 * @openapi
 * /meals:
 *   get:
 *     summary: List & search meals with filters
 *     tags: [Meals]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: string, default: "1" }
 *       - in: query
 *         name: limit
 *         schema: { type: string, default: "12" }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: restaurantId
 *         schema: { type: string }
 *       - in: query
 *         name: categoryId
 *         schema: { type: string }
 *       - in: query
 *         name: minPrice
 *         schema: { type: string }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of meals
 */
router.get('/', validate(queryMealSchema), MealController.getMeals);
router.get('/list', validate(queryMealSchema), MealController.getMeals);

/**
 * @openapi
 * /meals/popular:
 *   get:
 *     summary: Get popular trending meals
 *     tags: [Meals]
 *     responses:
 *       200:
 *         description: List of popular meals
 */
router.get('/popular', MealController.getPopular);

router.get('/areas', MealController.getAreas);

/**
 * @openapi
 * /meals/{id}:
 *   get:
 *     summary: Get meal details by ID
 *     tags: [Meals]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Meal details
 *       404:
 *         description: Meal not found
 */
router.get('/:id', MealController.getById);

/**
 * @openapi
 * /meals:
 *   post:
 *     summary: Create meal (Owner/Admin)
 *     tags: [Meals]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Meal created
 */
router.post(
  '/',
  protect,
  authorize('restaurant-owner', 'admin'),
  validate(createMealSchema),
  MealController.create
);

/**
 * @openapi
 * /meals/{id}:
 *   put:
 *     summary: Update meal (Owner/Admin)
 *     tags: [Meals]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Meal updated
 */
router.put(
  '/:id',
  protect,
  authorize('restaurant-owner', 'admin'),
  validate(updateMealSchema),
  MealController.update
);

/**
 * @openapi
 * /meals/{id}:
 *   delete:
 *     summary: Delete meal (Owner/Admin)
 *     tags: [Meals]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Meal deleted
 */
router.delete(
  '/:id',
  protect,
  authorize('restaurant-owner', 'admin'),
  MealController.delete
);

export default router;
