import { Request, Response, NextFunction } from 'express';
import { OrderService } from './order.service.js';

export class OrderController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { order, clientSecret } = await OrderService.createOrder(
        req.user!._id.toString(),
        req.body
      );
      res.status(201).json({
        success: true,
        message: 'Order placed successfully',
        data: {
          order,
          ...(clientSecret && { clientSecret }),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getUserOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '100', 10);
      const result = await OrderService.getUserOrders(
        req.user!._id.toString(),
        req.user!.role,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        data: result.orders,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const order = await OrderService.getOrderById(
        id,
        req.user!._id.toString(),
        req.user!.role
      );
      res.status(200).json({
        success: true,
        data: { order },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const order = await OrderService.updateOrderStatus(
        id,
        req.body,
        req.user!._id.toString(),
        req.user!.role
      );
      res.status(200).json({
        success: true,
        message: `Order status updated to '${order.status}'`,
        data: { order },
      });
    } catch (error) {
      next(error);
    }
  }

  static async cancel(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const order = await OrderService.cancelOrder(
        id,
        req.user!._id.toString(),
        req.body.reason
      );
      res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        data: { order },
      });
    } catch (error) {
      next(error);
    }
  }

  static async reorder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      await OrderService.reorder(id, req.user!._id.toString());
      res.status(200).json({
        success: true,
        message: 'Cart updated with items from previous order',
      });
    } catch (error) {
      next(error);
    }
  }

  static async confirmPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { paymentIntentId } = req.body;
      const order = await OrderService.confirmPayment(
        id,
        req.user!._id.toString(),
        paymentIntentId
      );
      res.status(200).json({
        success: true,
        message: 'Payment confirmed successfully',
        data: { order },
      });
    } catch (error) {
      next(error);
    }
  }
}
