import mongoose from 'mongoose';
import { Review, IReview } from './review.model.js';
import { Restaurant } from '../restaurants/restaurant.model.js';
import { CreateReviewInput, UpdateReviewInput } from './review.validation.js';
import { NotFoundError, ForbiddenError, ConflictError } from '../../shared/errors/appError.js';

export class ReviewService {
  /**
   * Recalculate average rating & totalReviews for a restaurant
   */
  private static async updateRestaurantRating(restaurantId: string): Promise<void> {
    if (mongoose.connection.readyState !== 1) return;

    const stats = await Review.aggregate([
      { $match: { restaurant: new mongoose.Types.ObjectId(restaurantId) } },
      {
        $group: {
          _id: '$restaurant',
          totalReviews: { $sum: 1 },
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    if (stats.length > 0) {
      await Restaurant.findByIdAndUpdate(restaurantId, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        totalReviews: stats[0].totalReviews,
      });
    } else {
      await Restaurant.findByIdAndUpdate(restaurantId, {
        rating: 0,
        totalReviews: 0,
      });
    }
  }

  static async getRestaurantReviews(restaurantId: string, page = 1, limit = 10) {
    if (mongoose.connection.readyState !== 1) {
      return {
        reviews: [],
        pagination: { page, limit, total: 0, pages: 1 },
      };
    }

    let targetId = restaurantId;
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      const rest = await Restaurant.findOne({ slug: restaurantId.toLowerCase() });
      if (rest) {
        targetId = rest._id.toString();
      } else {
        return {
          reviews: [],
          pagination: { page, limit, total: 0, pages: 1 },
        };
      }
    }

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find({ restaurant: targetId })
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments({ restaurant: targetId }),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit) || 1,
      },
    };
  }

  static async createReview(userId: string, input: CreateReviewInput): Promise<IReview> {
    const existing = await Review.findOne({ user: userId, restaurant: input.restaurant });
    if (existing) {
      throw new ConflictError('You have already submitted a review for this restaurant');
    }

    const review = new Review({
      ...input,
      user: userId,
    });

    await review.save();
    await this.updateRestaurantRating(input.restaurant);

    return review;
  }

  static async updateReview(
    reviewId: string,
    userId: string,
    input: UpdateReviewInput
  ): Promise<IReview> {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (review.user.toString() !== userId) {
      throw new ForbiddenError('You can only update your own reviews');
    }

    Object.assign(review, input);
    await review.save();

    await this.updateRestaurantRating(review.restaurant.toString());
    return review;
  }

  static async deleteReview(reviewId: string, userId: string, userRole: string): Promise<void> {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new NotFoundError('Review not found');
    }

    if (userRole !== 'admin' && review.user.toString() !== userId) {
      throw new ForbiddenError('You can only delete your own reviews');
    }

    const restaurantId = review.restaurant.toString();
    await Review.findByIdAndDelete(reviewId);

    await this.updateRestaurantRating(restaurantId);
  }
}
