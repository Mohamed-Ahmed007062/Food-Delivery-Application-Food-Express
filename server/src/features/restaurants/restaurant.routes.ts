import { Router } from 'express';
import { RestaurantController } from './restaurant.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  createRestaurantSchema,
  updateRestaurantSchema,
  queryRestaurantSchema,
  approveRestaurantSchema,
} from './restaurant.validation.js';

const router = Router();

/**
 * @openapi
 * /restaurants:
 *   get:
 *     summary: List restaurants with pagination, search, and filtering
 *     tags: [Restaurants]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: string, default: "1" }
 *       - in: query
 *         name: limit
 *         schema: { type: string, default: "10" }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: cuisine
 *         schema: { type: string }
 *       - in: query
 *         name: minRating
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of active and approved restaurants
 */
router.get('/', validate(queryRestaurantSchema), RestaurantController.getRestaurants);

/**
 * @openapi
 * /restaurants/featured:
 *   get:
 *     summary: Get top-rated featured restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: List of featured restaurants
 */
router.get('/featured', RestaurantController.getFeatured);

/**
 * @openapi
 * /restaurants/{id}:
 *   get:
 *     summary: Get restaurant details by ID or slug
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Restaurant details
 *       404:
 *         description: Restaurant not found
 */
router.get('/:id', RestaurantController.getById);

/**
 * @openapi
 * /restaurants:
 *   post:
 *     summary: Create a new restaurant (Owner only)
 *     tags: [Restaurants]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Restaurant created, pending admin approval
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  protect,
  authorize('restaurant-owner', 'admin'),
  validate(createRestaurantSchema),
  RestaurantController.create
);

/**
 * @openapi
 * /restaurants/{id}:
 *   put:
 *     summary: Update restaurant details (Owner/Admin)
 *     tags: [Restaurants]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Restaurant updated
 */
router.put(
  '/:id',
  protect,
  authorize('restaurant-owner', 'admin'),
  validate(updateRestaurantSchema),
  RestaurantController.update
);

/**
 * @openapi
 * /restaurants/{id}:
 *   delete:
 *     summary: Delete restaurant (Owner/Admin)
 *     tags: [Restaurants]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Restaurant deleted
 */
router.delete(
  '/:id',
  protect,
  authorize('restaurant-owner', 'admin'),
  RestaurantController.delete
);

/**
 * @openapi
 * /restaurants/{id}/approve:
 *   patch:
 *     summary: Approve or reject restaurant listing (Admin only)
 *     tags: [Restaurants]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Approval status updated
 */
router.patch(
  '/:id/approve',
  protect,
  authorize('admin'),
  validate(approveRestaurantSchema),
  RestaurantController.approve
);

export default router;
