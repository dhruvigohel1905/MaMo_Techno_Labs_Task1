import { Router } from 'express';
import { AdminController } from './admin.controller';
import { protect } from '../../middleware/auth';
import { authorize } from '../../middleware/role';

const router = Router();
const controller = new AdminController();

router.use(protect, authorize('admin'));
router.get('/dashboard', controller.getDashboard);
router.get('/approvals', controller.getApprovals);
router.put('/users/:id/promote', controller.promoteUser);
router.put('/organizations/:id/moderate', controller.moderateOrg);
router.put('/events/:id/moderate', controller.moderateEvt);
router.delete('/posts/:id', controller.deletePost);

export default router;
