import Notification from './notification.model';

export class NotificationService {
  async getNotifications(userId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const notifications = await Notification.find({ recipient: userId })
      .skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Notification.countDocuments({ recipient: userId });
    const unreadCount = await Notification.countDocuments({ recipient: userId, isRead: false });
    return { notifications, total, unreadCount, page, pages: Math.ceil(total / limit) };
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { isRead: true },
      { new: true }
    );
    return notification;
  }

  async markAllAsRead(userId: string) {
    await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
    return { message: 'All notifications marked as read' };
  }
}
