import { Router } from 'express';
import { CertificateController } from './certificate.controller';
import { protect } from '../../middleware/auth';

const router = Router();
const controller = new CertificateController();

router.get('/verify/:code', controller.verify);

router.use(protect);
router.post('/generate/:eventId', controller.generate);
router.get('/my', controller.getMyCertificates);
router.get('/:id/download', controller.download);

export default router;
