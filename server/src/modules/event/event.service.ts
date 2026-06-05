import User from '../user/user.model';
import Event from './event.model';
import Notification from '../notification/notification.model';
import Organization from '../organization/org.model';
import { AppError } from '../../middleware/errorHandler';
import { generateQRCode } from '../../utils/generateQR';

export class EventService {
  async create(data: any, userId: string) {
    const org = await Organization.findOne({ admin: userId, status: 'approved' });
    if (!org) throw new AppError('You need an approved organization to create events', 403);

    // Create event first, then generate QR with the real event ID
    const event = await Event.create({
      ...data,
      organization: org._id,
      createdBy: userId,
    });

    // Generate QR code with the actual event MongoDB _id
    const qrData = JSON.stringify({ eventId: event._id.toString(), type: 'attendance' });
    const qrCode = await generateQRCode(qrData);
    event.qrCode = qrCode;
    await event.save();

    const admins = await User.find({ role: 'admin' });
    const notifications = admins.map(admin => ({
      recipient: admin._id,
      type: 'event_pending',
      title: 'New Event Pending Approval',
      message: `Organization "${org.name}" has submitted an event "${event.title}" for approval.`,
      data: { eventId: event._id },
    }));
    await Notification.insertMany(notifications);

    return event;
  }

  async getApproved(query: any) {
    const { page = 1, limit = 12, search, category, startDate, endDate, organization } = query;
    const filter: any = { status: 'approved' };

    if (search) {
      filter.$text = { $search: search };
    }
    if (category) filter.category = category;
    if (organization) filter.organization = organization;
    if (startDate || endDate) {
      filter.startDate = {};
      if (startDate) filter.startDate.$gte = new Date(startDate);
      if (endDate) filter.startDate.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const events = await Event.find(filter)
      .populate('organization', 'name logo type')
      .populate('createdBy', 'firstName lastName')
      .skip(skip)
      .limit(Number(limit))
      .sort({ startDate: 1 });

    const total = await Event.countDocuments(filter);
    return { events, total, page: Number(page), pages: Math.ceil(total / Number(limit)) };
  }

  async getPending(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const events = await Event.find({ status: 'pending' })
      .populate('organization', 'name logo')
      .populate('createdBy', 'firstName lastName')
      .skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Event.countDocuments({ status: 'pending' });
    return { events, total, page, pages: Math.ceil(total / limit) };
  }

  async getMyEvents(userId: string) {
    const org = await Organization.findOne({ admin: userId });
    if (!org) throw new AppError('No organization found', 404);
    const events = await Event.find({ organization: org._id })
      .populate('organization', 'name logo')
      .sort({ createdAt: -1 });
    return events;
  }

  async getById(eventId: string) {
    const event = await Event.findById(eventId)
      .populate('organization', 'name logo type description website email')
      .populate('createdBy', 'firstName lastName avatar');
    if (!event) throw new AppError('Event not found', 404);
    return event;
  }

  async update(eventId: string, data: any, userId: string) {
    const event = await Event.findById(eventId);
    if (!event) throw new AppError('Event not found', 404);
    if (event.createdBy.toString() !== userId.toString()) throw new AppError('Not authorized', 403);

    Object.assign(event, data);
    if (event.status === 'rejected') event.status = 'pending'; // Re-submit
    await event.save();
    return event;
  }

  async delete(eventId: string, userId: string) {
    const event = await Event.findById(eventId);
    if (!event) throw new AppError('Event not found', 404);
    if (event.createdBy.toString() !== userId.toString()) throw new AppError('Not authorized', 403);
    await Event.findByIdAndDelete(eventId);
    return { message: 'Event deleted successfully' };
  }

  async approve(eventId: string) {
    const event = await Event.findByIdAndUpdate(eventId, { status: 'approved' }, { new: true });
    if (!event) throw new AppError('Event not found', 404);

    await Notification.create({
      recipient: event.createdBy,
      type: 'event_approved',
      title: 'Event Approved',
      message: `Your event "${event.title}" has been approved and is now visible to users!`,
      data: { eventId: event._id },
    });

    return event;
  }

  async reject(eventId: string, reason: string) {
    const event = await Event.findByIdAndUpdate(
      eventId,
      { status: 'rejected', rejectionReason: reason },
      { new: true }
    );
    if (!event) throw new AppError('Event not found', 404);

    await Notification.create({
      recipient: event.createdBy,
      type: 'event_rejected',
      title: 'Event Rejected',
      message: `Your event "${event.title}" was rejected. Reason: ${reason}`,
      data: { eventId: event._id },
    });

    return event;
  }

  async getQRCode(eventId: string, userId: string) {
    const event = await Event.findById(eventId);
    if (!event) throw new AppError('Event not found', 404);
    if (event.createdBy.toString() !== userId.toString()) throw new AppError('Not authorized', 403);

    // Regenerate QR with event ID for scanning
    const qrData = JSON.stringify({ eventId: event._id, type: 'attendance' });
    const qrCode = await generateQRCode(qrData);
    return { qrCode, eventId: event._id };
  }
}
