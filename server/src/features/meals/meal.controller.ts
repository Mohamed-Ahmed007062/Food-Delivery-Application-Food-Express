import { Request, Response, NextFunction } from 'express';
import { MealService } from './meal.service.js';
import { Restaurant } from '../restaurants/restaurant.model.js';

export class MealController {
  static async getMeals(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await MealService.getMeals(req.query as any);
      res.status(200).json({
        success: true,
        data: result.meals,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getPopular(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const meals = await MealService.getPopular();
      res.status(200).json({
        success: true,
        data: { meals },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAreas(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const areas = await MealService.getAreas();
      res.status(200).json({ success: true, data: { areas } });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const meal = await MealService.getById(id);
      res.status(200).json({
        success: true,
        data: { meal },
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (typeof req.body.price === 'string') {
        req.body.price = parseFloat(req.body.price);
      }

      if (!req.body.restaurant) {
        if (req.user?._id) {
          const ownerRest = await Restaurant.findOne({ owner: req.user._id });
          if (ownerRest) {
            req.body.restaurant = ownerRest._id.toString();
          }
        }

        if (!req.body.restaurant) {
          let defaultRest = await Restaurant.findOne();
          if (!defaultRest) {
            defaultRest = await Restaurant.create({
              name: 'Global Kitchen Express',
              slug: 'global-kitchen-express',
              cuisineType: ['Global'],
              address: { street: '123 Gourmet St', city: 'Cairo', state: 'Cairo', zipCode: '11511', country: 'Egypt' },
              phone: '+201000000000',
              email: 'info@globalkitchen.com',
              owner: req.user?._id,
            });
          }
          req.body.restaurant = defaultRest._id.toString();
        }
      }

      const meal = await MealService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Meal created successfully',
        data: { meal },
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const meal = await MealService.update(
        id,
        req.body,
        req.user!._id.toString(),
        req.user!.role
      );
      res.status(200).json({
        success: true,
        message: 'Meal updated successfully',
        data: { meal },
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      await MealService.delete(id, req.user!._id.toString(), req.user!.role);
      res.status(200).json({
        success: true,
        message: 'Meal deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
