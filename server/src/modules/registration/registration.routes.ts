import { Router } from 'express';
import { RegistrationController } from './registration.controller';
import { protect } from '../../middleware/auth';

const router = Router();
const controller = new RegistrationController();

router.use(protect);
router.post('/:eventId', controller.register);
router.delete('/:eventId', controller.cancel);
router.get('/my', controller.getMyRegistrations);
router.get('/event/:eventId', controller.getEventRegistrations);

export default router;
