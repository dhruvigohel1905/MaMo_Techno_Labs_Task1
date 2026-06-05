import Organization from './org.model';
import User from '../user/user.model';
import Notification from '../notification/notification.model';
import { AppError } from '../../middleware/errorHandler';

export class OrgService {
  async register(data: any, userId: string) {
    const existing = await Organization.findOne({ email: data.email });
    if (existing) throw new AppError('Organization email already registered', 409);

    const org = await Organization.create({ ...data, admin: userId, members: [userId] });

    // Update user role to organizer
    await User.findByIdAndUpdate(userId, { role: 'organizer', organization: org._id });

    return org;
  }

  async getAll(page: number = 1, limit: number = 20, status?: string) {
    const query: any = {};
    if (status) query.status = status;
    const skip = (page - 1) * limit;
    const orgs = await Organization.find(query).populate('admin', 'firstName lastName email').skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Organization.countDocuments(query);
    return { organizations: orgs, total, page, pages: Math.ceil(total / limit) };
  }

  async getById(orgId: string) {
    const org = await Organization.findById(orgId).populate('admin', 'firstName lastName email').populate('members', 'firstName lastName email avatar');
    if (!org) throw new AppError('Organization not found', 404);
    return org;
  }

  async getMyOrg(userId: string) {
    const org = await Organization.findOne({ admin: userId }).populate('members', 'firstName lastName email avatar');
    if (!org) throw new AppError('No organization found', 404);
    return org;
  }

  async update(orgId: string, data: any, userId: string) {
    const org = await Organization.findById(orgId);
    if (!org) throw new AppError('Organization not found', 404);
    if (org.admin.toString() !== userId.toString()) throw new AppError('Not authorized', 403);

    Object.assign(org, data);
    await org.save();
    return org;
  }

  async approve(orgId: string) {
    const org = await Organization.findByIdAndUpdate(orgId, { status: 'approved' }, { new: true });
    if (!org) throw new AppError('Organization not found', 404);

    await Notification.create({
      recipient: org.admin,
      type: 'org_approved',
      title: 'Organization Approved',
      message: `Your organization "${org.name}" has been approved!`,
      data: { organizationId: org._id },
    });

    return org;
  }

  async reject(orgId: string, reason: string) {
    const org = await Organization.findByIdAndUpdate(orgId, { status: 'rejected', rejectionReason: reason }, { new: true });
    if (!org) throw new AppError('Organization not found', 404);

    await Notification.create({
      recipient: org.admin,
      type: 'org_rejected',
      title: 'Organization Rejected',
      message: `Your organization "${org.name}" has been rejected. Reason: ${reason}`,
      data: { organizationId: org._id },
    });

    return org;
  }
}
