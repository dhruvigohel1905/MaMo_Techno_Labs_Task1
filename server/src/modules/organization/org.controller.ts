import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { OrgService } from './org.service';
import { uploadToCloudinary } from '../../utils/cloudinaryUpload';

const orgService = new OrgService();

export class OrgController {
  async register(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const org = await orgService.register(req.body, req.user._id);
      res.status(201).json({ success: true, data: org });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const status = req.query.status as string;
      const result = await orgService.getAll(page, limit, status);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const org = await orgService.getById((req.params.id as string));
      res.json({ success: true, data: org });
    } catch (error) {
      next(error);
    }
  }

  async getMyOrg(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const org = await orgService.getMyOrg(req.user._id);
      res.json({ success: true, data: org });
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const org = await orgService.update((req.params.id as string), req.body, req.user._id);
      res.json({ success: true, data: org });
    } catch (error) {
      next(error);
    }
  }

  async uploadLogo(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        res.status(400).json({ success: false, message: 'No file uploaded' });
        return;
      }
      const { url } = await uploadToCloudinary(req.file.buffer, 'logos');
      const Organization = (await import('./org.model')).default;
      const org = await Organization.findOneAndUpdate(
        { _id: (req.params.id as string), admin: req.user._id },
        { logo: url },
        { new: true }
      );
      res.json({ success: true, data: org });
    } catch (error) {
      next(error);
    }
  }

  async approve(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const org = await orgService.approve((req.params.id as string));
      res.json({ success: true, data: org });
    } catch (error) {
      next(error);
    }
  }

  async reject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const org = await orgService.reject((req.params.id as string), req.body.reason || '');
      res.json({ success: true, data: org });
    } catch (error) {
      next(error);
    }
  }
}
