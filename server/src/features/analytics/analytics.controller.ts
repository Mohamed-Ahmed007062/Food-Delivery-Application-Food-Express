import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service.js';

export class AnalyticsController {
  static async getAdminAnalytics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const analytics = await AnalyticsService.getAdminAnalytics();
      res.status(200).json({
        success: true,
        data: { analytics },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getOwnerAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const analytics = await AnalyticsService.getOwnerAnalytics(req.user!._id.toString());
      res.status(200).json({
        success: true,
        data: { analytics },
      });
    } catch (error) {
      next(error);
    }
  }
}
