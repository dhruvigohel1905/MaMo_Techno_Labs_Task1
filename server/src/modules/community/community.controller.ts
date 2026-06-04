import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { CommunityService } from './community.service';

const communityService = new CommunityService();

export class CommunityController {
  async createPost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const post = await communityService.createPost(req.body, req.user._id);
      res.status(201).json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  }

  async getPosts(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await communityService.getPosts(page, limit);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async getPostById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const post = await communityService.getPostById(req.params.id);
      res.json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  }

  async deletePost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await communityService.deletePost(
        req.params.id, req.user._id, req.user.role === 'admin'
      );
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async toggleLike(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const post = await communityService.toggleLike(req.params.id, req.user._id);
      res.json({ success: true, data: post });
    } catch (error) {
      next(error);
    }
  }

  async addComment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const comment = await communityService.addComment(req.params.id, req.body.content, req.user._id);
      res.status(201).json({ success: true, data: comment });
    } catch (error) {
      next(error);
    }
  }

  async getComments(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const result = await communityService.getComments(req.params.id, page);
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async deleteComment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await communityService.deleteComment(
        req.params.id, req.user._id, req.user.role === 'admin'
      );
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }
}
