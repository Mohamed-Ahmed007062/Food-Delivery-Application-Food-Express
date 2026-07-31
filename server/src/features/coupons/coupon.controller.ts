import { Request, Response, NextFunction } from 'express';
import { CouponService } from './coupon.service.js';

export class CouponController {
  static async validate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await CouponService.validateCoupon(req.body);
      res.status(200).json({
        success: true,
        message: 'Coupon applied successfully',
        data: {
          code: result.coupon.code,
          discountAmount: result.discountAmount,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const coupon = await CouponService.createCoupon(req.body);
      res.status(201).json({
        success: true,
        message: 'Coupon created successfully',
        data: { coupon },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCoupons(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const coupons = await CouponService.getCoupons();
      res.status(200).json({
        success: true,
        data: { coupons },
      });
    } catch (error) {
      next(error);
    }
  }
}
