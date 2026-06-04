import User from '../user/user.model';
import Organization from '../organization/org.model';
import Event from '../event/event.model';
import Registration from '../registration/registration.model';
import Attendance from '../attendance/attendance.model';
import Certificate from '../certificate/certificate.model';
import Post from '../community/post.model';

export class AdminService {
  async getDashboard() {
    const [
      totalUsers,
      totalOrganizations,
      pendingOrgs,
      approvedOrgs,
      totalEvents,
      approvedEvents,
      pendingEvents,
      totalRegistrations,
      totalAttendance,
      totalCertificates,
      totalPosts,
      recentUsers,
      recentEvents,
    ] = await Promise.all([
      User.countDocuments(),
      Organization.countDocuments(),
      Organization.countDocuments({ status: 'pending' }),
      Organization.countDocuments({ status: 'approved' }),
      Event.countDocuments(),
      Event.countDocuments({ status: 'approved' }),
      Event.countDocuments({ status: 'pending' }),
      Registration.countDocuments({ status: 'registered' }),
      Attendance.countDocuments(),
      Certificate.countDocuments(),
      Post.countDocuments(),
      User.find().select('firstName lastName email role createdAt').sort({ createdAt: -1 }).limit(5),
      Event.find().populate('organization', 'name').select('title status createdAt').sort({ createdAt: -1 }).limit(5),
    ]);

    return {
      stats: {
        totalUsers,
        totalOrganizations,
        pendingOrgs,
        approvedOrgs,
        totalEvents,
        approvedEvents,
        pendingEvents,
        totalRegistrations,
        totalAttendance,
        totalCertificates,
        totalPosts,
      },
      recentUsers,
      recentEvents,
    };
  }

  async promoteToAdmin(userId: string) {
    const user = await User.findByIdAndUpdate(userId, { role: 'admin' }, { new: true });
    if (!user) throw new Error('User not found');
    return user;
  }

  async getPendingApprovals() {
    const [organizations, events] = await Promise.all([
      Organization.find({ status: 'pending' }).populate('owner', 'firstName lastName email').sort({ createdAt: -1 }),
      Event.find({ status: 'pending' }).populate('organization', 'name').sort({ createdAt: -1 })
    ]);
    return { organizations, events };
  }

  async moderateOrganization(orgId: string, status: 'approved' | 'rejected') {
    const org = await Organization.findByIdAndUpdate(orgId, { status }, { new: true });
    if (!org) throw new Error('Organization not found');
    return org;
  }

  async moderateEvent(eventId: string, status: 'approved' | 'rejected') {
    const event = await Event.findByIdAndUpdate(eventId, { status }, { new: true });
    if (!event) throw new Error('Event not found');
    return event;
  }
}
