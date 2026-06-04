import { Router } from 'express';
import { OrgController } from './org.controller';
import { protect } from '../../middleware/auth';
import { authorize } from '../../middleware/role';
import { upload } from '../../middleware/upload';

const router = Router();
const controller = new OrgController();

router.get('/:id', controller.getById);

router.use(protect);
router.post('/', controller.register);
router.get('/', authorize('admin'), controller.getAll);
router.get('/my/org', authorize('organizer'), controller.getMyOrg);
router.put('/:id', authorize('organizer'), controller.update);
router.put('/:id/logo', authorize('organizer'), upload.single('logo'), controller.uploadLogo);
router.put('/:id/approve', authorize('admin'), controller.approve);
router.put('/:id/reject', authorize('admin'), controller.reject);

export default router;
