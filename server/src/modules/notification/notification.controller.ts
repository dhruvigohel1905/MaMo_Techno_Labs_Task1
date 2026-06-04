import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { NotificationService } from './notification.service';

const notificationService = new NotificationService();

export class NotificationController {
  async getNotifications(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const result = await notificationService.getNotifications(req.user._id, page);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const notification = await notificationService.markAsRead(req.params.id, req.user._id);
      res.json({ success: true, data: notification });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await notificationService.markAllAsRead(req.user._id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
