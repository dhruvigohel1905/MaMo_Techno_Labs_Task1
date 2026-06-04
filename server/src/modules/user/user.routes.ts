import { Router } from 'express';
import { UserController } from './user.controller';
import { protect } from '../../middleware/auth';
import { authorize } from '../../middleware/role';

const router = Router();
const controller = new UserController();

router.use(protect);
router.get('/', authorize('admin'), controller.getAllUsers);
router.get('/:id', authorize('admin'), controller.getUserById);
router.put('/:id/status', authorize('admin'), controller.toggleUserStatus);
router.delete('/:id', authorize('admin'), controller.deleteUser);

export default router;
