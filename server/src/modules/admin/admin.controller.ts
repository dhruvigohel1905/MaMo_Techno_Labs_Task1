import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { AdminService } from './admin.service';
import { CommunityService } from '../community/community.service';

const adminService = new AdminService();
const communityService = new CommunityService();

export class AdminController {
  async getDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await adminService.getDashboard();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await communityService.deletePost(req.params.id, req.user._id, true);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async promoteUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await adminService.promoteToAdmin(req.params.id);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getApprovals(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = await adminService.getPendingApprovals();
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async moderateOrg(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const data = await adminService.moderateOrganization(req.params.id, status);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  async moderateEvt(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { status } = req.body;
      const data = await adminService.moderateEvent(req.params.id, status);
      res.json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
