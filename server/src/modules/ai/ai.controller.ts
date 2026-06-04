import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { AIService } from './ai.service';

const aiService = new AIService();

export class AIController {
  async generateDescription(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { title, category } = req.body;
      if (!title || !category) {
        res.status(400).json({ success: false, message: 'Title and category are required' });
        return;
      }
      const description = await aiService.generateDescription(title, category);
      res.json({ success: true, data: { description } });
    } catch (error) {
      next(error);
    }
  }

  async generateSchedule(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { eventType, duration } = req.body;
      if (!eventType || !duration) {
        res.status(400).json({ success: false, message: 'Event type and duration are required' });
        return;
      }
      const schedule = await aiService.generateSchedule(eventType, duration);
      res.json({ success: true, data: { schedule } });
    } catch (error) {
      next(error);
    }
  }

  async generateCertificateContent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { eventName, organizationName } = req.body;
      if (!eventName || !organizationName) {
        res.status(400).json({ success: false, message: 'Event name and organization name are required' });
        return;
      }
      const content = await aiService.generateCertificateContent(eventName, organizationName);
      res.json({ success: true, data: { content } });
    } catch (error) {
      next(error);
    }
  }
}
