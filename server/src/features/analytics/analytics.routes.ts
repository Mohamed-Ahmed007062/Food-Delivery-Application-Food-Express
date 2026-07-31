import { Router } from 'express';
import { AnalyticsController } from './analytics.controller.js';
import { protect, authorize } from '../../middleware/auth.middleware.js';

const router = Router();

/**
 * @openapi
 * /analytics/admin:
 *   get:
 *     summary: Get platform analytics and statistics (Admin only)
 *     tags: [Analytics]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: System metrics, revenue, daily trend, status breakdown
 */
router.get('/admin', protect, authorize('admin'), AnalyticsController.getAdminAnalytics);

/**
 * @openapi
 * /analytics/owner:
 *   get:
 *     summary: Get restaurant owner business metrics
 *     tags: [Analytics]
 *     security: [{ BearerAuth: [] }]
 *     responses:
 *       200:
 *         description: Revenue, today orders, rating, meal counts, order trend
 */
router.get(
  '/owner',
  protect,
  authorize('restaurant-owner', 'admin'),
  AnalyticsController.getOwnerAnalytics
);

export default router;
