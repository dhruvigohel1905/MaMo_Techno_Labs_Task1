import Registration from './registration.model';
import Event from '../event/event.model';
import Notification from '../notification/notification.model';
import { AppError } from '../../middleware/errorHandler';

export class RegistrationService {
  async register(eventId: string, userId: string) {
    const event = await Event.findById(eventId);
    if (!event) throw new AppError('Event not found', 404);
    if (event.status !== 'approved') throw new AppError('Event is not available for registration', 400);

    if (event.maxParticipants > 0 && event.registrationCount >= event.maxParticipants) {
      throw new AppError('Event is full', 400);
    }

    const existing = await Registration.findOne({ user: userId, event: eventId });
    if (existing && existing.status === 'registered') {
      throw new AppError('Already registered for this event', 409);
    }

    let registration;
    if (existing && existing.status === 'cancelled') {
      existing.status = 'registered';
      existing.registeredAt = new Date();
      existing.cancelledAt = undefined as any;
      registration = await existing.save();
    } else {
      registration = await Registration.create({ user: userId, event: eventId });
    }

    await Event.findByIdAndUpdate(eventId, { $inc: { registrationCount: 1 } });

    await Notification.create({
      recipient: userId,
      type: 'registration_success',
      title: 'Registration Successful',
      message: `You have successfully registered for "${event.title}"`,
      data: { eventId: event._id },
    });

    return registration;
  }

  async cancel(eventId: string, userId: string) {
    const registration = await Registration.findOne({ user: userId, event: eventId, status: 'registered' });
    if (!registration) throw new AppError('Registration not found', 404);

    registration.status = 'cancelled';
    registration.cancelledAt = new Date();
    await registration.save();

    await Event.findByIdAndUpdate(eventId, { $inc: { registrationCount: -1 } });

    return { message: 'Registration cancelled' };
  }

  async getMyRegistrations(userId: string) {
    const registrations = await Registration.find({ user: userId, status: { $ne: 'cancelled' } })
      .populate({ path: 'event', populate: { path: 'organization', select: 'name logo' } })
      .sort({ registeredAt: -1 });
    return registrations;
  }

  async getEventRegistrations(eventId: string, userId: string) {
    const event = await Event.findById(eventId);
    if (!event) throw new AppError('Event not found', 404);
    if (event.createdBy.toString() !== userId) throw new AppError('Not authorized', 403);

    const registrations = await Registration.find({ event: eventId, status: 'registered' })
      .populate('user', 'firstName lastName email avatar')
      .sort({ registeredAt: -1 });
    return registrations;
  }
}
