import { Router } from 'express';
import { AuthController } from './auth.controller';
import { protect } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { upload } from '../../middleware/upload';
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema } from './auth.validation';

const router = Router();
const controller = new AuthController();

router.post('/register', validate(registerSchema), controller.register);
router.post('/login', validate(loginSchema), controller.login);
router.post('/forgot-password', validate(forgotPasswordSchema), controller.forgotPassword);
router.post('/reset-password/:token', validate(resetPasswordSchema), controller.resetPassword);
router.get('/me', protect, controller.getMe);
router.put('/me', protect, controller.updateProfile);
router.put('/me/avatar', protect, upload.single('avatar'), controller.uploadAvatar);

export default router;
