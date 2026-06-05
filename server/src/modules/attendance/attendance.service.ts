import Attendance from './attendance.model';
import Registration from '../registration/registration.model';
import Event from '../event/event.model';
import { CertificateService } from '../certificate/certificate.service';
import { AppError } from '../../middleware/errorHandler';

const certificateService = new CertificateService();

export class AttendanceService {
  async markAttendance(eventId: string, userId: string, method: 'qr' | 'manual' = 'qr') {
    const event = await Event.findById(eventId);
    if (!event) throw new AppError('Event not found', 404);

    const now = new Date().getTime();
    const eventStartTime = new Date(event.startDate).getTime();
    
    // Allow check-in up to 2 hours before the event starts
    if (now < eventStartTime - (2 * 60 * 60 * 1000)) {
      throw new AppError('Attendance cannot be marked before the event starts.', 400);
    }
    
    // Prevent check-in if the event ended more than 24 hours ago
    const eventEndTime = new Date(event.endDate).getTime();
    if (now > eventEndTime + (24 * 60 * 60 * 1000)) {
      throw new AppError('This event has already ended.', 400);
    }

    const registration = await Registration.findOne({ user: userId, event: eventId, status: 'registered' });
    if (!registration) throw new AppError('User is not registered for this event', 400);

    const existing = await Attendance.findOne({ user: userId, event: eventId });
    if (existing) throw new AppError('Attendance already marked', 409);

    const attendance = await Attendance.create({
      user: userId,
      event: eventId,
      registration: registration._id,
      verificationMethod: method,
    });

    // Update registration status
    registration.status = 'attended';
    await registration.save();

    // Update event attendance count
    await Event.findByIdAndUpdate(eventId, { $inc: { attendanceCount: 1 } });

    // Auto-generate certificate upon successful attendance verification
    try {
      await certificateService.generate(eventId, userId);
    } catch (certError) {
      console.error('Failed to auto-generate certificate:', certError);
    }

    return attendance;
  }

  async getEventAttendance(eventId: string, userId: string) {
    const event = await Event.findById(eventId);
    if (!event) throw new AppError('Event not found', 404);
    if (event.createdBy.toString() !== userId.toString()) throw new AppError('Not authorized', 403);

    const attendance = await Attendance.find({ event: eventId })
      .populate('user', 'firstName lastName email avatar')
      .sort({ markedAt: -1 });
    return attendance;
  }

  async getMyAttendance(userId: string) {
    const attendance = await Attendance.find({ user: userId })
      .populate({ path: 'event', populate: { path: 'organization', select: 'name logo' } })
      .sort({ markedAt: -1 });
    return attendance;
  }
}
