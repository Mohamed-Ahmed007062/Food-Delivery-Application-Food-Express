import { Router } from 'express';
import { CouponController } from './coupon.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createCouponSchema, validateCouponSchema } from './coupon.validation.js';

const router = Router();

/**
 * @openapi
 * /coupons/validate:
 *   post:
 *     summary: Validate coupon code for checkout
 *     tags: [Coupons]
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [code, cartTotal]
 *             properties:
 *               code: { type: string, example: "SAVE20" }
 *               cartTotal: { type: number, example: 35.50 }
 *               restaurantId: { type: string }
 *     responses:
 *       200:
 *         description: Coupon validated and discount computed
 *       400:
 *         description: Invalid or expired coupon
 */
router.post('/validate', protect, validate(validateCouponSchema), CouponController.validate);

/**
 * @openapi
 * /coupons:
 *   get:
 *     summary: List active public coupons
 *     tags: [Coupons]
 *     responses:
 *       200:
 *         description: List of active coupons
 */
router.get('/', CouponController.getCoupons);

/**
 * @openapi
 * /coupons:
 *   post:
 *     summary: Create new coupon (Admin only)
 *     tags: [Coupons]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       201:
 *         description: Coupon created
 */
router.post('/', protect, authorize('admin'), validate(createCouponSchema), CouponController.create);

export default router;
