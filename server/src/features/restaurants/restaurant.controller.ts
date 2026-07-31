import { Request, Response, NextFunction } from 'express';
import { RestaurantService } from './restaurant.service.js';

export class RestaurantController {
  static async getRestaurants(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await RestaurantService.getRestaurants(req.query as any);
      res.status(200).json({
        success: true,
        data: result.restaurants,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getFeatured(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const restaurants = await RestaurantService.getFeatured();
      res.status(200).json({
        success: true,
        data: { restaurants },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const restaurant = await RestaurantService.getByIdOrSlug(id);
      res.status(200).json({
        success: true,
        data: { restaurant },
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const restaurant = await RestaurantService.create(req.user!._id.toString(), req.body);
      res.status(201).json({
        success: true,
        message: 'Restaurant created successfully. Pending admin approval.',
        data: { restaurant },
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const restaurant = await RestaurantService.update(
        id,
        req.user!._id.toString(),
        req.user!.role,
        req.body
      );
      res.status(200).json({
        success: true,
        message: 'Restaurant updated successfully',
        data: { restaurant },
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      await RestaurantService.delete(id, req.user!._id.toString(), req.user!.role);
      res.status(200).json({
        success: true,
        message: 'Restaurant deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async approve(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const restaurant = await RestaurantService.approve(id, req.body.isApproved);
      res.status(200).json({
        success: true,
        message: `Restaurant ${req.body.isApproved ? 'approved' : 'rejected'} successfully`,
        data: { restaurant },
      });
    } catch (error) {
      next(error);
    }
  }
}
