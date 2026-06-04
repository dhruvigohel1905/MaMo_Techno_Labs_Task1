import { Router } from 'express';
import { CommunityController } from './community.controller';
import { protect } from '../../middleware/auth';

const router = Router();
const controller = new CommunityController();

router.use(protect);
router.post('/posts', controller.createPost);
router.get('/posts', controller.getPosts);
router.get('/posts/:id', controller.getPostById);
router.delete('/posts/:id', controller.deletePost);
router.post('/posts/:id/like', controller.toggleLike);
router.post('/posts/:id/comments', controller.addComment);
router.get('/posts/:id/comments', controller.getComments);
router.delete('/comments/:id', controller.deleteComment);

export default router;
