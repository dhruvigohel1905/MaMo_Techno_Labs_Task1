import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { RegistrationService } from './registration.service';

const registrationService = new RegistrationService();

export class RegistrationController {
  async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const registration = await registrationService.register(req.params.eventId, req.user._id);
      res.status(201).json({ success: true, data: registration });
    } catch (error) {
      next(error);
    }
  }

  async cancel(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await registrationService.cancel(req.params.eventId, req.user._id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getMyRegistrations(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const registrations = await registrationService.getMyRegistrations(req.user._id);
      res.json({ success: true, data: registrations });
    } catch (error) {
      next(error);
    }
  }

  async getEventRegistrations(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const registrations = await registrationService.getEventRegistrations(req.params.eventId, req.user._id);
      res.json({ success: true, data: registrations });
    } catch (error) {
      next(error);
    }
  }
}
