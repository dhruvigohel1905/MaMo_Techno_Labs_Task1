import crypto from 'crypto';
import User, { IUser } from '../user/user.model';
import { generateAccessToken, generateRefreshToken } from '../../utils/generateToken';
import { sendPasswordResetEmail } from '../../utils/sendEmail';
import { AppError } from '../../middleware/errorHandler';
import { env } from '../../config/env';

export class AuthService {
  async register(data: { firstName: string; lastName: string; email: string; password: string; role?: string }) {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    const user = await User.create(data);
    const accessToken = generateAccessToken(user._id as unknown as string);
    const refreshToken = generateRefreshToken(user._id as unknown as string);

    return {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new AppError('Account has been deactivated', 401);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    const accessToken = generateAccessToken(user._id as unknown as string);
    const refreshToken = generateRefreshToken(user._id as unknown as string);

    return {
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        organization: user.organization,
      },
      accessToken,
      refreshToken,
    };
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError('No account with that email', 404);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
    await user.save();

    const resetUrl = `${env.CLIENT_URL}/reset-password/${resetToken}`;
    await sendPasswordResetEmail(user.email, resetUrl);

    return { message: 'Password reset email sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+password');

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    user.password = newPassword;
    user.resetPasswordToken = '';
    user.resetPasswordExpire = undefined as any;
    await user.save();

    return { message: 'Password reset successful' };
  }

  async getMe(userId: string) {
    const user = await User.findById(userId).populate('organization');
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  async updateProfile(userId: string, data: Partial<IUser>) {
    const user = await User.findByIdAndUpdate(
      userId,
      { firstName: data.firstName, lastName: data.lastName },
      { new: true, runValidators: true }
    );
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }
}
