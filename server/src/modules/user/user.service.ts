import User from './user.model';
import { AppError } from '../../middleware/errorHandler';

export class UserService {
  async getAllUsers(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const users = await User.find().select('-password').skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await User.countDocuments();
    return { users, total, page, pages: Math.ceil(total / limit) };
  }

  async getUserById(userId: string) {
    const user = await User.findById(userId).select('-password').populate('organization');
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async toggleUserStatus(userId: string) {
    const user = await User.findById(userId);
    if (!user) throw new AppError('User not found', 404);
    user.isActive = !user.isActive;
    await user.save();
    return user;
  }

  async deleteUser(userId: string) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) throw new AppError('User not found', 404);
    return { message: 'User deleted successfully' };
  }
}
