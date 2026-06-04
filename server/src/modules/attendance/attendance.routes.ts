import { Router } from 'express';
import { AttendanceController } from './attendance.controller';
import { protect } from '../../middleware/auth';

const router = Router();
const controller = new AttendanceController();

router.use(protect);
router.post('/mark', controller.markAttendance);
router.get('/event/:eventId', controller.getEventAttendance);
router.get('/my', controller.getMyAttendance);

export default router;
