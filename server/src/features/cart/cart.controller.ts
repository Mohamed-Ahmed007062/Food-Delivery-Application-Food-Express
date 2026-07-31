import { Request, Response, NextFunction } from 'express';
import { CartService } from './cart.service.js';

export class CartController {
  static async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cart = await CartService.getCart(req.user!._id.toString());
      res.status(200).json({
        success: true,
        data: { cart },
      });
    } catch (error) {
      next(error);
    }
  }

  static async addItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cart = await CartService.addItem(req.user!._id.toString(), req.body);
      res.status(200).json({
        success: true,
        message: 'Item added to cart',
        data: { cart },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateQuantity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mealId = req.params.mealId as string;
      const cart = await CartService.updateQuantity(
        req.user!._id.toString(),
        mealId,
        req.body.quantity
      );
      res.status(200).json({
        success: true,
        message: 'Cart item quantity updated',
        data: { cart },
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const mealId = req.params.mealId as string;
      const cart = await CartService.removeItem(req.user!._id.toString(), mealId);
      res.status(200).json({
        success: true,
        message: 'Item removed from cart',
        data: { cart },
      });
    } catch (error) {
      next(error);
    }
  }

  static async clearCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cart = await CartService.clearCart(req.user!._id.toString());
      res.status(200).json({
        success: true,
        message: 'Cart cleared',
        data: { cart },
      });
    } catch (error) {
      next(error);
    }
  }

  static async applyCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { code } = req.body;
      const { cart, discountAmount } = await CartService.applyCoupon(req.user!._id.toString(), code);
      res.status(200).json({
        success: true,
        message: 'Coupon applied successfully',
        data: { cart, code, discountAmount },
      });
    } catch (error) {
      next(error);
    }
  }

  static async removeCoupon(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cart = await CartService.removeCoupon(req.user!._id.toString());
      res.status(200).json({
        success: true,
        message: 'Coupon removed',
        data: { cart },
      });
    } catch (error) {
      next(error);
    }
  }
}
