import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { protect } from '../../middleware/auth';

const router = Router();
const controller = new NotificationController();

router.use(protect);
router.get('/', controller.getNotifications);
router.put('/:id/read', controller.markAsRead);
router.put('/read-all', controller.markAllAsRead);

export default router;
