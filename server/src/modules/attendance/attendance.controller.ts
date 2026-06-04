import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { AttendanceService } from './attendance.service';

const attendanceService = new AttendanceService();

export class AttendanceController {
  async markAttendance(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { eventId, userId, method } = req.body;
      const targetUserId = userId || req.user._id;
      const attendance = await attendanceService.markAttendance(eventId, targetUserId, method || 'qr');
      res.status(201).json({ success: true, data: attendance });
    } catch (error) {
      next(error);
    }
  }

  async getEventAttendance(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const attendance = await attendanceService.getEventAttendance(req.params.eventId, req.user._id);
      res.json({ success: true, data: attendance });
    } catch (error) {
      next(error);
    }
  }

  async getMyAttendance(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const attendance = await attendanceService.getMyAttendance(req.user._id);
      res.json({ success: true, data: attendance });
    } catch (error) {
      next(error);
    }
  }
}
