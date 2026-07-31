import { Router } from 'express';
import { CartController } from './cart.controller.js';
import { protect } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { addToCartSchema, updateCartItemSchema } from './cart.validation.js';

const router = Router();

/**
 * @openapi
 * /cart:
 *   get:
 *     summary: Get user's server-side cart
 *     tags: [Cart]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Cart details with items and subtotal/tax/delivery totals
 */
router.get('/', protect, CartController.getCart);

/**
 * @openapi
 * /cart/items:
 *   post:
 *     summary: Add item to cart (Enforces single-restaurant rule)
 *     tags: [Cart]
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [mealId]
 *             properties:
 *               mealId: { type: string }
 *               quantity: { type: number, default: 1 }
 *     responses:
 *       200:
 *         description: Item added
 */
router.post('/items', protect, validate(addToCartSchema), CartController.addItem);

/**
 * @openapi
 * /cart/items/{mealId}:
 *   put:
 *     summary: Update cart item quantity
 *     tags: [Cart]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Item quantity updated
 */
router.put('/items/:mealId', protect, validate(updateCartItemSchema), CartController.updateQuantity);

/**
 * @openapi
 * /cart/items/{mealId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Item removed
 */
router.delete('/items/:mealId', protect, CartController.removeItem);

/**
 * @openapi
 * /cart:
 *   delete:
 *     summary: Clear cart items
 *     tags: [Cart]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Cart cleared
 */
router.delete('/', protect, CartController.clearCart);

/**
 * @openapi
 * /cart/coupon:
 *   post:
 *     summary: Apply coupon code to cart
 *     tags: [Cart]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Coupon applied to cart
 */
router.post('/coupon', protect, CartController.applyCoupon);

/**
 * @openapi
 * /cart/coupon:
 *   delete:
 *     summary: Remove coupon code from cart
 *     tags: [Cart]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Coupon removed from cart
 */
router.delete('/coupon', protect, CartController.removeCoupon);

export default router;
