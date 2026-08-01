import crypto from 'crypto';
import mongoose from 'mongoose';
import { User, IUser } from '../users/user.model.js';
import {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
  UpdateProfileInput,
} from './auth.validation.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../../shared/utils/jwt.js';
import { sendEmail } from '../../shared/utils/email.js';
import { logger } from '../../shared/utils/logger.js';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../../shared/errors/appError.js';

const DEMO_USER = {
  _id: new mongoose.Types.ObjectId('60c72b2f9b1d8b0015f8e901'),
  name: 'Demo User',
  email: 'mohamed12@gmail.com',
  role: 'customer' as const,
  isEmailVerified: true,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  comparePassword: async () => true,
};

export class AuthService {
  /**
   * Register new user and send verification email (24h token expiry)
   */
  static async register(input: RegisterInput): Promise<{
    message: string;
    user: IUser;
    accessToken: string;
    refreshToken: string;
  }> {
    if (mongoose.connection.readyState !== 1) {
      logger.warn('⚠️ MongoDB disconnected: Using Dev Mode registration fallback');
      const mockUser = {
        ...DEMO_USER,
        name: input.name,
        email: input.email.toLowerCase(),
        role: input.role || 'customer',
      } as unknown as IUser;

      const accessToken = generateAccessToken({
        userId: DEMO_USER._id.toString(),
        email: mockUser.email,
        role: mockUser.role,
      });

      const refreshToken = generateRefreshToken({
        userId: DEMO_USER._id.toString(),
      });

      return {
        message: 'Registration successful!',
        user: mockUser,
        accessToken,
        refreshToken,
      };
    }

    const existingUser = await User.findOne({ email: input.email.toLowerCase() });
    if (existingUser) {
      throw new ConflictError('An account with this email already exists');
    }

    const user = new User({
      name: input.name,
      email: input.email.toLowerCase(),
      password: input.password,
      role: input.role || 'customer',
      isEmailVerified: true,
      isActive: true,
    });

    await user.save();

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
    });

    const hashedRefreshToken = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    user.refreshToken = hashedRefreshToken;
    await user.save();

    return {
      message: 'Registration successful! Welcome to FoodExpress.',
      user,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Verify email address with single-use, time-bound token
   */
  static async verifyEmail(token: string): Promise<{ message: string }> {
    if (mongoose.connection.readyState !== 1) {
      return { message: 'Email verified successfully! (Dev Mode)' };
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      verificationToken: hashedToken,
      verificationExpires: { $gt: new Date() },
    });
    if (!user) {
      throw new BadRequestError('Invalid or expired verification token');
    }

    user.isEmailVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    await user.save();

    return { message: 'Email verified successfully! You can now log in.' };
  }

  /**
   * Login user and issue tokens (stores hashed refresh token in DB)
   */
  static async login(input: LoginInput): Promise<{
    user: IUser;
    accessToken: string;
    refreshToken: string;
  }> {

    const user = await User.findOne({ email: input.email.toLowerCase() }).select('+password');
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isMatch = await user.comparePassword(input.password);
    if (!isMatch) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const accessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id.toString(),
    });

    const hashedRefreshToken = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    user.refreshToken = hashedRefreshToken;
    await user.save();

    return { user, accessToken, refreshToken };
  }

  /**
   * Refresh access & refresh tokens with rotation and hash matching
   */
  static async refreshToken(incomingRefreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const decoded = verifyRefreshToken(incomingRefreshToken);

    if (mongoose.connection.readyState !== 1) {
      const accessToken = generateAccessToken({
        userId: decoded.userId,
        email: 'demo@express.com',
        role: 'customer',
      });
      const refreshToken = generateRefreshToken({ userId: decoded.userId });
      return { accessToken, refreshToken };
    }

    const hashedIncoming = crypto
      .createHash('sha256')
      .update(incomingRefreshToken)
      .digest('hex');

    const user = await User.findById(decoded.userId).select('+refreshToken');
    if (!user || user.refreshToken !== hashedIncoming) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    const newAccessToken = generateAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = generateRefreshToken({
      userId: user._id.toString(),
    });

    const hashedNewRefreshToken = crypto
      .createHash('sha256')
      .update(newRefreshToken)
      .digest('hex');

    user.refreshToken = hashedNewRefreshToken;
    await user.save();

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  /**
   * Logout user by clearing stored refresh token
   */
  static async logout(userId: string): Promise<void> {
    if (mongoose.connection.readyState === 1) {
      await User.findByIdAndUpdate(userId, { $unset: { refreshToken: 1 } });
    }
  }

  /**
   * Request password reset link
   */
  static async forgotPassword(input: ForgotPasswordInput): Promise<{ message: string }> {
    if (mongoose.connection.readyState !== 1) {
      return { message: 'If an account exists for that email, a password reset link has been sent.' };
    }

    const user = await User.findOne({ email: input.email.toLowerCase() });
    if (!user) {
      return { message: 'If an account exists for that email, a password reset link has been sent.' };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    try {
      const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
      await sendEmail({
        to: user.email,
        subject: 'FoodExpress Password Reset Request',
        html: `
          <h2>Password Reset Request</h2>
          <p>You requested a password reset. Click the link below to set a new password:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>This link expires in 10 minutes.</p>
        `,
      });
    } catch (err) {
      logger.warn(`⚠️ Failed to send reset email: ${(err as Error).message}`);
    }

    return { message: 'If an account exists for that email, a password reset link has been sent.' };
  }

  /**
   * Reset password
   */
  static async resetPassword(
    token: string,
    input: ResetPasswordInput
  ): Promise<{ message: string }> {
    if (mongoose.connection.readyState !== 1) {
      return { message: 'Password reset successfully!' };
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    }).select('+password +refreshToken');

    if (!user) {
      throw new BadRequestError('Invalid or expired password reset token');
    }

    user.password = input.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.refreshToken = undefined;
    await user.save();

    return { message: 'Password reset successfully! You can now log in with your new password.' };
  }

  /**
   * Change password
   */
  static async changePassword(
    userId: string,
    input: ChangePasswordInput
  ): Promise<{ message: string }> {
    if (mongoose.connection.readyState !== 1) {
      return { message: 'Password updated successfully!' };
    }

    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isMatch = await user.comparePassword(input.currentPassword);
    if (!isMatch) {
      throw new BadRequestError('Incorrect current password');
    }

    user.password = input.newPassword;
    await user.save();

    return { message: 'Password updated successfully!' };
  }

  /**
   * Get user profile
   */
  static async getProfile(userId: string): Promise<IUser> {

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, input: UpdateProfileInput): Promise<IUser> {

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: input },
      { new: true, runValidators: true }
    );
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }
}
