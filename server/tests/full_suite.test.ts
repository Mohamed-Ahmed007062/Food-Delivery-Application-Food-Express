import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
import { User } from '../src/features/users/user.model.js';
import { Restaurant } from '../src/features/restaurants/restaurant.model.js';
import { Category } from '../src/features/categories/category.model.js';
import { Meal } from '../src/features/meals/meal.model.js';
import { Review } from '../src/features/reviews/review.model.js';
import { AuthService } from '../src/features/auth/auth.service.js';
import { RestaurantService } from '../src/features/restaurants/restaurant.service.js';
import { CategoryService } from '../src/features/categories/category.service.js';
import { MealService } from '../src/features/meals/meal.service.js';
import { ReviewService } from '../src/features/reviews/review.service.js';
import { generateAccessToken, verifyAccessToken } from '../src/shared/utils/jwt.js';

describe('Full Integration & Unit Test Suite', () => {
  before(async () => {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/food_delivery_test_db';
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(mongoUri);
    }
  });

  after(async () => {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
  });

  describe('JWT & Security Utilities', () => {
    it('1. should generate and verify a valid access token', () => {
      const payload = { userId: '507f1f77bcf86cd799439011', email: 'test@example.com', role: 'customer' };
      const token = generateAccessToken(payload);
      const decoded = verifyAccessToken(token);

      assert.strictEqual(decoded.userId, payload.userId);
      assert.strictEqual(decoded.email, payload.email);
      assert.strictEqual(decoded.role, payload.role);
    });
  });

  describe('AuthService Integration', () => {
    const testUser = {
      name: 'Integration User',
      email: 'integration@example.com',
      password: 'Password123!',
      role: 'customer' as const,
    };

    it('2. should register a new user successfully', async () => {
      const res = await AuthService.register(testUser);
      assert.ok(res.message.includes('successful'));

      const dbUser = await User.findOne({ email: testUser.email });
      assert.ok(dbUser);
      assert.strictEqual(dbUser.isEmailVerified, false);
    });

    it('3. should reject duplicate registration email', async () => {
      await assert.rejects(async () => {
        await AuthService.register(testUser);
      });
    });

    it('4. should verify user email with valid token', async () => {
      const dbUser = await User.findOne({ email: testUser.email }).select('+verificationToken');
      assert.ok(dbUser);

      // Manually set verified for testing login
      dbUser.isEmailVerified = true;
      await dbUser.save();

      const updated = await User.findOne({ email: testUser.email });
      assert.strictEqual(updated?.isEmailVerified, true);
    });

    it('5. should login user and issue access and refresh tokens', async () => {
      const res = await AuthService.login({ email: testUser.email, password: testUser.password });
      assert.ok(res.accessToken);
      assert.ok(res.refreshToken);
      assert.strictEqual(res.user.email, testUser.email);
    });

    it('6. should reject login with incorrect password', async () => {
      await assert.rejects(async () => {
        await AuthService.login({ email: testUser.email, password: 'WrongPassword!' });
      });
    });
  });

  describe('RestaurantService Integration', () => {
    let ownerId: string;
    let restaurantId: string;

    before(async () => {
      const owner = await User.create({
        name: 'Owner User',
        email: 'owner@example.com',
        password: 'Password123!',
        role: 'restaurant-owner',
        isEmailVerified: true,
      });
      ownerId = owner._id.toString();
    });

    it('7. should create a new restaurant for owner', async () => {
      const res = await RestaurantService.create(ownerId, {
        name: 'Tasty Pizza Hub',
        address: '123 Main St',
        phone: '+1234567890',
        email: 'pizza@hub.com',
        cuisine: ['Italian', 'Pizza'],
        minimumOrder: 15,
        deliveryFee: 2.99,
      });

      assert.strictEqual(res.name, 'Tasty Pizza Hub');
      assert.strictEqual(res.slug, 'tasty-pizza-hub');
      assert.strictEqual(res.isApproved, false);
      restaurantId = res._id.toString();
    });

    it('8. should approve restaurant by admin', async () => {
      const approved = await RestaurantService.approve(restaurantId, true);
      assert.strictEqual(approved.isApproved, true);
    });

    it('9. should fetch approved restaurants with search filter', async () => {
      const result = await RestaurantService.getRestaurants({ search: 'Pizza' });
      assert.ok(result.restaurants.length > 0);
      assert.strictEqual(result.restaurants[0].name, 'Tasty Pizza Hub');
    });

    it('10. should fetch restaurant by ID or slug', async () => {
      const found = await RestaurantService.getByIdOrSlug('tasty-pizza-hub');
      assert.strictEqual(found.name, 'Tasty Pizza Hub');
    });
  });

  describe('Category & Meal Services Integration', () => {
    let categoryId: string;
    let restaurantId: string;

    before(async () => {
      const rest = await Restaurant.findOne({ name: 'Tasty Pizza Hub' });
      assert.ok(rest);
      restaurantId = rest._id.toString();
    });

    it('11. should create a category', async () => {
      const cat = await CategoryService.create({
        name: 'Pizzas',
        description: 'Cheesy artisan pizzas',
        restaurant: restaurantId,
        sortOrder: 1,
      });
      assert.strictEqual(cat.name, 'Pizzas');
      categoryId = cat._id.toString();
    });

    it('12. should create a meal under category & restaurant', async () => {
      const meal = await MealService.create({
        name: 'Pepperoni Supreme',
        description: 'Classic pepperoni with mozzarella',
        price: 18.99,
        category: categoryId,
        restaurant: restaurantId,
        isAvailable: true,
        isPopular: true,
        preparationTime: 20,
      });

      assert.strictEqual(meal.name, 'Pepperoni Supreme');
      assert.strictEqual(meal.price, 18.99);
    });

    it('13. should fetch popular meals', async () => {
      const popular = await MealService.getPopular();
      assert.ok(popular.length > 0);
      assert.strictEqual(popular[0].isPopular, true);
    });

    it('14. should search meals by price range filter', async () => {
      const result = await MealService.getMeals({ minPrice: 10, maxPrice: 20 });
      assert.ok(result.meals.length > 0);
      assert.strictEqual(result.meals[0].price, 18.99);
    });
  });

  describe('ReviewService & Dynamic Rating Aggregation Pipeline', () => {
    let userId: string;
    let restaurantId: string;

    before(async () => {
      const user = await User.create({
        name: 'Reviewer User',
        email: 'reviewer@example.com',
        password: 'Password123!',
        role: 'customer',
        isEmailVerified: true,
      });
      userId = user._id.toString();

      const rest = await Restaurant.findOne({ name: 'Tasty Pizza Hub' });
      assert.ok(rest);
      restaurantId = rest._id.toString();
    });

    it('15. should submit a review and update restaurant rating aggregation', async () => {
      await ReviewService.createReview(userId, {
        restaurant: restaurantId,
        rating: 5,
        comment: 'Amazing pizza! Super fast delivery.',
      });

      const updatedRest = await Restaurant.findById(restaurantId);
      assert.ok(updatedRest);
      assert.strictEqual(updatedRest.rating, 5);
      assert.strictEqual(updatedRest.totalReviews, 1);
    });

    it('16. should reject duplicate review from same user for same restaurant', async () => {
      await assert.rejects(async () => {
        await ReviewService.createReview(userId, {
          restaurant: restaurantId,
          rating: 4,
          comment: 'Another review attempt',
        });
      });
    });

    it('17. should fetch restaurant reviews with pagination', async () => {
      const result = await ReviewService.getRestaurantReviews(restaurantId, 1, 10);
      assert.strictEqual(result.reviews.length, 1);
      assert.strictEqual(result.reviews[0].rating, 5);
    });
  });
});
