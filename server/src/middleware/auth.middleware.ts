import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { verifyAccessToken } from '../shared/utils/jwt.js';
import { User, UserRole } from '../features/users/user.model.js';
import { UnauthorizedError, ForbiddenError } from '../shared/errors/appError.js';

export const protect = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new UnauthorizedError('Authentication token missing');
    }

    const decoded = verifyAccessToken(token);

    // Offline Dev Mode Fallback when MongoDB is disconnected
    if (mongoose.connection.readyState !== 1) {
      req.user = {
        _id: new mongoose.Types.ObjectId(
          mongoose.Types.ObjectId.isValid(decoded.userId)
            ? decoded.userId
            : '60c72b2f9b1d8b0015f8e901'
        ),
        name: decoded.email ? decoded.email.split('@')[0] : 'Demo User',
        email: decoded.email || 'demo@express.com',
        role: (decoded.role as UserRole) || 'customer',
        isActive: true,
        isEmailVerified: true,
      } as any;
      return next();
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new UnauthorizedError('User belonging to this token no longer exists');
    }

    if (!user.isActive) {
      throw new UnauthorizedError('Account has been suspended. Please contact support.');
    }

    req.user = user;
    next();
  } catch (error) {
    if ((error as Error).name === 'JsonWebTokenError') {
      next(new UnauthorizedError('Invalid token'));
    } else if ((error as Error).name === 'TokenExpiredError') {
      next(new UnauthorizedError('Token expired'));
    } else {
      next(error);
    }
  }
};

export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('User not authenticated'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenError('You do not have permission to perform this action')
      );
    }

    next();
  };
};
