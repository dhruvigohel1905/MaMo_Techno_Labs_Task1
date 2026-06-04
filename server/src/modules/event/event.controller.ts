import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { EventService } from './event.service';
import { uploadToCloudinary } from '../../utils/cloudinaryUpload';
import Event from './event.model';

const eventService = new EventService();

export class EventController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const event = await eventService.create(req.body, req.user._id);
      res.status(201).json({ success: true, data: event });
    } catch (error) {
      next(error);
    }
  }

  async getApproved(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await eventService.getApproved(req.query);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getPending(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const result = await eventService.getPending(page);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getMyEvents(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const events = await eventService.getMyEvents(req.user._id);
      res.json({ success: true, data: events });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventService.getById(req.params.id);
      res.json({ success: true, data: event });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const event = await eventService.update(req.params.id, req.body, req.user._id);
      res.json({ success: true, data: event });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await eventService.delete(req.params.id, req.user._id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async approve(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const event = await eventService.approve(req.params.id);
      res.json({ success: true, data: event });
    } catch (error) {
      next(error);
    }
  }

  async reject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const event = await eventService.reject(req.params.id, req.body.reason);
      res.json({ success: true, data: event });
    } catch (error) {
      next(error);
    }
  }

  async uploadBanner(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }
      const { url } = await uploadToCloudinary(req.file.buffer, 'banners');
      const event = await Event.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user._id },
        { banner: url },
        { new: true }
      );
      res.json({ success: true, data: event });
    } catch (error) {
      next(error);
    }
  }

  async getQRCode(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await eventService.getQRCode(req.params.id, req.user._id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
