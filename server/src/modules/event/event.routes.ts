import { Router } from 'express';
import { EventController } from './event.controller';
import { protect } from '../../middleware/auth';
import { authorize } from '../../middleware/role';
import { upload } from '../../middleware/upload';

const router = Router();
const controller = new EventController();

// Public
router.get('/', controller.getApproved);
router.get('/:id', controller.getById);

// Protected
router.use(protect);
router.post('/', authorize('organizer'), controller.create);
router.get('/list/pending', authorize('admin'), controller.getPending);
router.get('/list/my', authorize('organizer'), controller.getMyEvents);
router.put('/:id', authorize('organizer'), controller.update);
router.delete('/:id', authorize('organizer'), controller.delete);
router.put('/:id/banner', authorize('organizer'), upload.single('banner'), controller.uploadBanner);
router.put('/:id/approve', authorize('admin'), controller.approve);
router.put('/:id/reject', authorize('admin'), controller.reject);
router.get('/:id/qr', authorize('organizer'), controller.getQRCode);

export default router;
