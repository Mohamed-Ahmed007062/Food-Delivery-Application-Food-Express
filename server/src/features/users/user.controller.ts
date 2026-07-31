import { Request, Response, NextFunction } from 'express';
import { User } from './user.model.js';
import { NotFoundError } from '../../shared/errors/appError.js';

export class UserController {
  static async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt((req.query.page as string) || '1', 10);
      const limit = parseInt((req.query.limit as string) || '10', 10);
      const role = req.query.role as string;
      const search = req.query.search as string;

      const filter: Record<string, unknown> = {};
      if (role) filter.role = role;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
        ];
      }

      const skip = (page - 1) * limit;
      const [users, total] = await Promise.all([
        User.find(filter).select('-password').skip(skip).limit(limit).lean(),
        User.countDocuments(filter),
      ]);

      res.status(200).json({
        success: true,
        data: users,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUserStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { isActive } = req.body;

      const user = await User.findByIdAndUpdate(id, { isActive }, { new: true }).select(
        '-password'
      );
      if (!user) throw new NotFoundError('User not found');

      res.status(200).json({
        success: true,
        message: `User status updated to ${isActive ? 'active' : 'banned'}`,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateUserRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { role } = req.body;

      const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
      if (!user) throw new NotFoundError('User not found');

      res.status(200).json({
        success: true,
        message: `User role updated to ${role}`,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
}
