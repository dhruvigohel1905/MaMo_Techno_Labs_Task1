import { Router } from 'express';
import { AIController } from './ai.controller';
import { protect } from '../../middleware/auth';
import { authorize } from '../../middleware/role';

const router = Router();
const controller = new AIController();

router.use(protect);
router.post('/generate-description', authorize('organizer', 'admin'), controller.generateDescription);
router.post('/generate-schedule', authorize('organizer', 'admin'), controller.generateSchedule);
router.post('/generate-certificate-content', authorize('organizer', 'admin'), controller.generateCertificateContent);

export default router;
