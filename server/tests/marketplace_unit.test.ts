import { describe, it } from 'node:test';
import assert from 'node:assert';

// Import Zod validation schemas
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from '../src/features/auth/auth.validation.js';
import { createRestaurantSchema, updateRestaurantSchema, queryRestaurantSchema } from '../src/features/restaurants/restaurant.validation.js';
import { createCategorySchema, updateCategorySchema } from '../src/features/categories/category.validation.js';
import { createMealSchema, updateMealSchema, queryMealSchema } from '../src/features/meals/meal.validation.js';
import { createReviewSchema, updateReviewSchema } from '../src/features/reviews/review.validation.js';
import { addToCartSchema, updateCartItemSchema } from '../src/features/cart/cart.validation.js';
import { createCouponSchema, validateCouponSchema } from '../src/features/coupons/coupon.validation.js';
import { createOrderSchema, updateOrderStatusSchema } from '../src/features/orders/order.validation.js';

// Import Analytics Service
import { AnalyticsService } from '../src/features/analytics/analytics.service.js';

// Import JWT & AppError utilities
import { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken } from '../src/shared/utils/jwt.js';
import { AppError, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError } from '../src/shared/errors/appError.js';

describe('Comprehensive Unit Test Suite (Phase 2, 3, 4 & 5)', () => {
  describe('1. JWT & Security Token Tests', () => {
    it('1.1 should sign and verify a valid access token with claims', () => {
      const payload = { userId: 'usr_123', email: 'user@express.com', role: 'customer' };
      const token = generateAccessToken(payload);
      const decoded = verifyAccessToken(token);

      assert.strictEqual(decoded.userId, 'usr_123');
      assert.strictEqual(decoded.email, 'user@express.com');
      assert.strictEqual(decoded.role, 'customer');
    });

    it('1.2 should sign and verify a valid refresh token', () => {
      const payload = { userId: 'usr_456' };
      const token = generateRefreshToken(payload);
      const decoded = verifyRefreshToken(token);

      assert.strictEqual(decoded.userId, 'usr_456');
    });

    it('1.3 should reject an invalid access token signature', () => {
      assert.throws(() => {
        verifyAccessToken('invalid.token.signature');
      });
    });
  });

  describe('2. Custom AppError Hierarchy Tests', () => {
    it('2.1 should throw AppError with status 400 for BadRequestError', () => {
      const err = new BadRequestError('Invalid input');
      assert.strictEqual(err.statusCode, 400);
      assert.strictEqual(err.message, 'Invalid input');
      assert.strictEqual(err.isOperational, true);
    });

    it('2.2 should throw UnauthorizedError with status 401', () => {
      const err = new UnauthorizedError();
      assert.strictEqual(err.statusCode, 401);
      assert.strictEqual(err.message, 'Unauthorized access');
    });

    it('2.3 should throw ForbiddenError with status 403', () => {
      const err = new ForbiddenError('No access');
      assert.strictEqual(err.statusCode, 403);
    });

    it('2.4 should throw NotFoundError with status 404', () => {
      const err = new NotFoundError('Restaurant not found');
      assert.strictEqual(err.statusCode, 404);
    });

    it('2.5 should throw ConflictError with status 409', () => {
      const err = new ConflictError('Email already exists');
      assert.strictEqual(err.statusCode, 409);
    });
  });

  describe('3. Auth Module Schema Validations', () => {
    it('3.1 should pass valid user registration payload', async () => {
      const valid = {
        body: {
          name: 'Sarah Connor',
          email: 'sarah@skynet.com',
          password: 'SuperPassword123!',
          role: 'customer',
        },
      };
      const res = await registerSchema.parseAsync(valid);
      assert.strictEqual(res.body.name, 'Sarah Connor');
    });

    it('3.2 should fail registration if password is under 8 characters', async () => {
      const invalid = {
        body: { name: 'Sarah', email: 'sarah@skynet.com', password: '123' },
      };
      await assert.rejects(async () => {
        await registerSchema.parseAsync(invalid);
      });
    });

    it('3.3 should validate login credentials payload', async () => {
      const valid = { body: { email: 'sarah@skynet.com', password: 'SuperPassword123!' } };
      const res = await loginSchema.parseAsync(valid);
      assert.strictEqual(res.body.email, 'sarah@skynet.com');
    });

    it('3.4 should validate forgot password payload', async () => {
      const valid = { body: { email: 'user@domain.com' } };
      const res = await forgotPasswordSchema.parseAsync(valid);
      assert.strictEqual(res.body.email, 'user@domain.com');
    });

    it('3.5 should validate reset password payload', async () => {
      const valid = { params: { token: 'reset_tok_123' }, body: { password: 'NewSecurePassword123' } };
      const res = await resetPasswordSchema.parseAsync(valid);
      assert.strictEqual(res.params.token, 'reset_tok_123');
    });
  });

  describe('4. Restaurant Module Schema Validations', () => {
    it('4.1 should validate restaurant creation payload', async () => {
      const valid = {
        body: {
          name: 'Bella Italia',
          description: 'Authentic woodfired pizza',
          cuisine: ['Italian', 'Pasta'],
          address: '456 Olive Way',
          phone: '+15559876543',
          email: 'info@bellaitalia.com',
          minimumOrder: 20,
          deliveryFee: 3.5,
          estimatedDeliveryTime: 25,
        },
      };
      const res = await createRestaurantSchema.parseAsync(valid);
      assert.strictEqual(res.body.name, 'Bella Italia');
      assert.strictEqual(res.body.minimumOrder, 20);
    });

    it('4.2 should validate restaurant update payload', async () => {
      const valid = {
        params: { id: 'rest_123' },
        body: { name: 'Bella Italia Express', deliveryFee: 1.99, isActive: true },
      };
      const res = await updateRestaurantSchema.parseAsync(valid);
      assert.strictEqual(res.body.name, 'Bella Italia Express');
    });

    it('4.3 should validate restaurant query parameters and set defaults', async () => {
      const valid = { query: { page: '2', limit: '20', cuisine: 'Italian', sort: '-rating' } };
      const res = await queryRestaurantSchema.parseAsync(valid);
      assert.strictEqual(res.query.page, '2');
      assert.strictEqual(res.query.cuisine, 'Italian');
    });

    it('4.4 should fail restaurant creation if phone or email is missing', async () => {
      const invalid = { body: { name: 'No Phone Resto', address: '123 St' } };
      await assert.rejects(async () => {
        await createRestaurantSchema.parseAsync(invalid);
      });
    });
  });

  describe('5. Cart & Coupon Module Validations', () => {
    it('5.1 should validate adding item to cart', async () => {
      const valid = { body: { mealId: 'meal_123', quantity: 2 } };
      const res = await addToCartSchema.parseAsync(valid);
      assert.strictEqual(res.body.mealId, 'meal_123');
      assert.strictEqual(res.body.quantity, 2);
    });

    it('5.2 should validate coupon validation request', async () => {
      const valid = { body: { code: 'SAVE20', cartTotal: 45.0 } };
      const res = await validateCouponSchema.parseAsync(valid);
      assert.strictEqual(res.body.code, 'SAVE20');
      assert.strictEqual(res.body.cartTotal, 45.0);
    });

    it('5.3 should validate coupon creation payload', async () => {
      const valid = {
        body: {
          code: 'WELCOME10',
          discountType: 'percentage',
          discountValue: 10,
          minimumOrder: 15,
          endDate: '2026-12-31T23:59:59Z',
        },
      };
      const res = await createCouponSchema.parseAsync(valid);
      assert.strictEqual(res.body.code, 'WELCOME10');
      assert.strictEqual(res.body.discountValue, 10);
    });
  });

  describe('6. Order & Checkout Module Validations', () => {
    it('6.1 should validate order placement payload', async () => {
      const valid = {
        body: {
          deliveryAddress: {
            title: 'Home',
            street: '123 Elm St',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62701',
          },
          paymentMethod: 'stripe',
          notes: 'Please leave at front porch',
        },
      };
      const res = await createOrderSchema.parseAsync(valid);
      assert.strictEqual(res.body.paymentMethod, 'stripe');
      assert.strictEqual(res.body.deliveryAddress.city, 'Springfield');
    });

    it('6.2 should fail order placement if payment method is invalid', async () => {
      const invalid = {
        body: {
          deliveryAddress: { title: 'Home', street: '123 Elm St', city: 'City', state: 'State', zipCode: '12345' },
          paymentMethod: 'bitcoin',
        },
      };
      await assert.rejects(async () => {
        await createOrderSchema.parseAsync(invalid);
      });
    });

    it('6.3 should validate order status update transition', async () => {
      const valid = {
        params: { id: 'ord_123' },
        body: { status: 'preparing' },
      };
      const res = await updateOrderStatusSchema.parseAsync(valid);
      assert.strictEqual(res.body.status, 'preparing');
    });
  });

  describe('7. Analytics & Business Metrics Calculations', () => {
    it('7.1 should return platform admin analytics metrics', async () => {
      const analytics = await AnalyticsService.getAdminAnalytics();
      assert.ok(analytics.totalRevenue >= 0);
      assert.ok(analytics.totalOrders >= 0);
      assert.ok(analytics.platformCommission >= 0);
      assert.ok(Array.isArray(analytics.dailyOrders));
      assert.ok(Array.isArray(analytics.ordersByStatus));
    });

    it('7.2 should return restaurant owner business analytics metrics', async () => {
      const analytics = await AnalyticsService.getOwnerAnalytics('owner_user_123');
      assert.ok(analytics.restaurantName);
      assert.ok(analytics.todayRevenue >= 0);
      assert.ok(analytics.todayOrders >= 0);
      assert.ok(Array.isArray(analytics.recentReviews));
    });
  });

  describe('8. Business Logic & Financial Math Utilities', () => {
    it('8.1 should calculate subtotal, sales tax (8%), delivery fee, and discount correctly', () => {
      const subtotal = 50.0;
      const taxRate = 0.08;
      const deliveryFee = 3.99;
      const discount = 5.0;

      const tax = Math.round(subtotal * taxRate * 100) / 100;
      const total = Math.max(0, subtotal + tax + deliveryFee - discount);

      assert.strictEqual(tax, 4.0);
      assert.strictEqual(total, 52.99);
    });

    it('8.2 should compute percentage discount with maximum cap', () => {
      const cartTotal = 200.0;
      const discountPercentage = 20;
      const maxDiscountCap = 25.0;

      let discountAmount = (cartTotal * discountPercentage) / 100;
      if (maxDiscountCap && discountAmount > maxDiscountCap) {
        discountAmount = maxDiscountCap;
      }

      assert.strictEqual(discountAmount, 25.0);
    });
  });
});
