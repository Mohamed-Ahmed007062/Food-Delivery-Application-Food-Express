import { Router } from 'express';
import { ReviewController } from './review.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createReviewSchema, updateReviewSchema } from './review.validation.js';

const router = Router();

/**
 * @openapi
 * /reviews/restaurant/{restaurantId}:
 *   get:
 *     summary: Get reviews for a restaurant
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: restaurantId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: List of reviews
 */
router.get('/restaurant/:restaurantId', ReviewController.getRestaurantReviews);

/**
 * @openapi
 * /reviews:
 *   post:
 *     summary: Create a review (Customer)
 *     tags: [Reviews]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Review created
 *       409:
 *         description: Review already exists for this restaurant
 */
router.post('/', protect, validate(createReviewSchema), ReviewController.create);

/**
 * @openapi
 * /reviews/{id}:
 *   put:
 *     summary: Update review (Author)
 *     tags: [Reviews]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Review updated
 */
router.put('/:id', protect, validate(updateReviewSchema), ReviewController.update);

/**
 * @openapi
 * /reviews/{id}:
 *   delete:
 *     summary: Delete review (Author/Admin)
 *     tags: [Reviews]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Review deleted
 */
router.delete('/:id', protect, ReviewController.delete);

export default router;
