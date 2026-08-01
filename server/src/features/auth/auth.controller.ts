import { Request, Response, NextFunction, CookieOptions } from 'express';
import { AuthService } from './auth.service.js';

// Cross-origin cookie config: frontend and backend are on different Vercel domains,
// so we need sameSite='none' + secure=true for cookies to be sent cross-origin.
const getRefreshCookieOptions = (): CookieOptions => ({
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { message, user, accessToken, refreshToken } = await AuthService.register(req.body);

      if (refreshToken) {
        res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());
      }

      res.status(201).json({
        success: true,
        message,
        data: {
          accessToken,
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.params.token as string;
      const result = await AuthService.verifyEmail(token);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { user, accessToken, refreshToken } = await AuthService.login(req.body);

      // Set HTTP-Only Cookie for Refresh Token
      res.cookie('refreshToken', refreshToken, getRefreshCookieOptions());

      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        data: {
          accessToken,
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
      if (!incomingRefreshToken) {
        res.status(401).json({ success: false, message: 'Refresh token missing' });
        return;
      }

      const { accessToken, refreshToken: newRefreshToken } =
        await AuthService.refreshToken(incomingRefreshToken);

      res.cookie('refreshToken', newRefreshToken, getRefreshCookieOptions());

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.user) {
        await AuthService.logout(req.user._id.toString());
      }

      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none' as const,
      });

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.forgotPassword(req.body);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.params.token as string;
      const result = await AuthService.resetPassword(token, req.body);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await AuthService.changePassword(req.user!._id.toString(), req.body);
      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await AuthService.getProfile(req.user!._id.toString());
      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await AuthService.updateProfile(req.user!._id.toString(), req.body);
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
}
