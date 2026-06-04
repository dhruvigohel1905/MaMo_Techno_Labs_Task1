import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';

// Route imports
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/user/user.routes';
import orgRoutes from './modules/organization/org.routes';
import eventRoutes from './modules/event/event.routes';
import registrationRoutes from './modules/registration/registration.routes';
import attendanceRoutes from './modules/attendance/attendance.routes';
import certificateRoutes from './modules/certificate/certificate.routes';
import communityRoutes from './modules/community/community.routes';
import notificationRoutes from './modules/notification/notification.routes';
import aiRoutes from './modules/ai/ai.routes';
import adminRoutes from './modules/admin/admin.routes';

const app = express();

// Disable ETag to prevent 304 Not Modified responses (always return 200 OK)
app.disable('etag');

// Middleware
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/organizations', orgRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/admin', adminRoutes);

// Error handling
app.use(errorHandler);

export default app;
