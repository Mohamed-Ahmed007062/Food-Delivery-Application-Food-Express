import { Request, Response, NextFunction } from 'express';
import { ReviewService } from './review.service.js';

export class ReviewController {
  static async getRestaurantReviews(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const restaurantId = req.params.restaurantId as string;
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '10', 10);
      const result = await ReviewService.getRestaurantReviews(restaurantId, page, limit);

      res.status(200).json({
        success: true,
        data: result.reviews,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const review = await ReviewService.createReview(req.user!._id.toString(), req.body);
      res.status(201).json({
        success: true,
        message: 'Review created successfully',
        data: { review },
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const review = await ReviewService.updateReview(
        id,
        req.user!._id.toString(),
        req.body
      );
      res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        data: { review },
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      await ReviewService.deleteReview(
        id,
        req.user!._id.toString(),
        req.user!.role
      );
      res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
