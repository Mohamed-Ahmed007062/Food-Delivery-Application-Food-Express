import { describe, it } from 'node:test';
import assert from 'node:assert';
import { queryRestaurantSchema } from '../src/features/restaurants/restaurant.validation.js';
import { queryMealSchema } from '../src/features/meals/meal.validation.js';
import { createReviewSchema } from '../src/features/reviews/review.validation.js';

describe('Marketplace Validation Schemas', () => {
  it('should validate and set default pagination for restaurant queries', async () => {
    const validQuery = {
      query: {
        page: '2',
        limit: '15',
        search: 'Pizza',
        cuisine: 'Italian',
      },
    };

    const result = await queryRestaurantSchema.parseAsync(validQuery);
    assert.strictEqual(result.query.page, '2');
    assert.strictEqual(result.query.search, 'Pizza');
  });

  it('should validate meal queries with price filters', async () => {
    const validQuery = {
      query: {
        minPrice: '10',
        maxPrice: '50',
        isPopular: 'true',
      },
    };

    const result = await queryMealSchema.parseAsync(validQuery);
    assert.strictEqual(result.query.minPrice, '10');
    assert.strictEqual(result.query.maxPrice, '50');
  });

  it('should validate review payload', async () => {
    const validPayload = {
      body: {
        restaurant: '60c72b2f9b1d8b0015f8e9a1',
        rating: 5,
        comment: 'Delicious food and rapid delivery!',
      },
    };

    const result = await createReviewSchema.parseAsync(validPayload);
    assert.strictEqual(result.body.rating, 5);
  });
});
