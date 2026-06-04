import Certificate from './certificate.model';
import Attendance from '../attendance/attendance.model';
import Event from '../event/event.model';
import User from '../user/user.model';
import Organization from '../organization/org.model';
import Notification from '../notification/notification.model';
import { AppError } from '../../middleware/errorHandler';
import { generateCertificatePDF } from '../../utils/generateCertificate';
import { v4 as uuidv4 } from 'uuid';

export class CertificateService {
  async generate(eventId: string, userId: string) {
    // Verify attendance
    const attendance = await Attendance.findOne({ user: userId, event: eventId });
    if (!attendance) throw new AppError('Attendance not verified for this event', 400);

    // Check if already generated
    const existing = await Certificate.findOne({ user: userId, event: eventId });
    if (existing) return existing;

    const event = await Event.findById(eventId);
    const user = await User.findById(userId);
    const org = await Organization.findById(event?.organization);

    if (!event || !user || !org) throw new AppError('Data not found', 404);

    const certificateId = `CERT-${new Date().getFullYear()}-${uuidv4().slice(0, 8).toUpperCase()}`;
    const qrVerificationCode = uuidv4();

    const certificate = await Certificate.create({
      certificateId,
      user: userId,
      event: eventId,
      organization: org._id,
      qrVerificationCode,
    });

    await Notification.create({
      recipient: userId,
      type: 'certificate_available',
      title: 'Certificate Available',
      message: `Your certificate for "${event.title}" is ready to download!`,
      data: { eventId: event._id, certificateId: certificate._id },
    });

    return certificate;
  }

  async getMyCertificates(userId: string) {
    const certificates = await Certificate.find({ user: userId })
      .populate('event', 'title startDate category banner')
      .populate('organization', 'name logo')
      .sort({ issuedAt: -1 });
    return certificates;
  }

  async downloadCertificate(certId: string) {
    const certificate = await Certificate.findById(certId)
      .populate('user', 'firstName lastName')
      .populate('event', 'title startDate')
      .populate('organization', 'name');

    if (!certificate) throw new AppError('Certificate not found', 404);

    const user = certificate.user as any;
    const event = certificate.event as any;
    const org = certificate.organization as any;

    const pdfBuffer = await generateCertificatePDF({
      participantName: `${user.firstName} ${user.lastName}`,
      eventName: event.title,
      organizationName: org.name,
      eventDate: new Date(event.startDate).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      }),
      certificateId: certificate.certificateId,
      qrVerificationCode: certificate.qrVerificationCode,
    });

    return pdfBuffer;
  }

  async verifyCertificate(code: string) {
    const certificate = await Certificate.findOne({ qrVerificationCode: code })
      .populate('user', 'firstName lastName')
      .populate('event', 'title startDate')
      .populate('organization', 'name');

    if (!certificate) throw new AppError('Certificate not found or invalid', 404);

    return {
      valid: true,
      certificateId: certificate.certificateId,
      participant: certificate.user,
      event: certificate.event,
      organization: certificate.organization,
      issuedAt: certificate.issuedAt,
    };
  }
}
