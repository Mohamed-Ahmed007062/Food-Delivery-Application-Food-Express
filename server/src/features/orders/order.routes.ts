import { Router } from 'express';
import { OrderController } from './order.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createOrderSchema, updateOrderStatusSchema, cancelOrderSchema } from './order.validation.js';

const router = Router();

/**
 * @openapi
 * /orders:
 *   post:
 *     summary: Create an order from cart
 *     tags: [Orders]
 *     security: [{ BearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [deliveryAddress, paymentMethod]
 *             properties:
 *               deliveryAddress:
 *                 type: object
 *                 properties:
 *                   title: { type: string }
 *                   street: { type: string }
 *                   city: { type: string }
 *                   state: { type: string }
 *                   zipCode: { type: string }
 *               paymentMethod: { type: string, enum: [stripe, cod] }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Order created
 */
router.post('/', protect, validate(createOrderSchema), OrderController.create);

/**
 * @openapi
 * /orders:
 *   get:
 *     summary: Get customer's order history
 *     tags: [Orders]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of user orders
 */
router.get('/', protect, OrderController.getUserOrders);

/**
 * @openapi
 * /orders/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags: [Orders]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order details
 */
router.get('/:id', protect, OrderController.getById);

/**
 * @openapi
 * /orders/{id}/status:
 *   patch:
 *     summary: Update order status (Owner/Admin)
 *     tags: [Orders]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Status updated
 */
router.patch(
  '/:id/status',
  protect,
  authorize('restaurant-owner', 'admin'),
  validate(updateOrderStatusSchema),
  OrderController.updateStatus
);

/**
 * @openapi
 * /orders/{id}/cancel:
 *   post:
 *     summary: Cancel order (Customer)
 *     tags: [Orders]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Order cancelled
 */
router.post('/:id/cancel', protect, validate(cancelOrderSchema), OrderController.cancel);

/**
 * @openapi
 * /orders/{id}/reorder:
 *   post:
 *     summary: Reorder previous order (Copies items to cart)
 *     tags: [Orders]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Items copied to cart
 */
router.post('/:id/reorder', protect, OrderController.reorder);

/**
 * @openapi
 * /orders/{id}/confirm-payment:
 *   post:
 *     summary: Confirm Stripe payment completion for an order
 *     tags: [Orders]
 *     security: [{ BearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Payment confirmed
 */
router.post('/:id/confirm-payment', protect, OrderController.confirmPayment);

export default router;
