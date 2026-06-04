export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  role: 'admin' | 'organizer' | 'user';
  organization: string | Organization | null;
  isActive: boolean;
  fullName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  _id: string;
  name: string;
  email: string;
  logo: string;
  description: string;
  website: string;
  type: 'college' | 'ngo' | 'company' | 'community' | 'club';
  status: 'pending' | 'approved' | 'rejected';
  admin: string | User;
  members: (string | User)[];
  rejectionReason: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  category: EventCategory;
  location: string;
  isOnline: boolean;
  meetingLink: string;
  startDate: string;
  endDate: string;
  time: string;
  maxParticipants: number;
  banner: string;
  organization: string | Organization;
  createdBy: string | User;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled';
  rejectionReason: string;
  registrationCount: number;
  attendanceCount: number;
  qrCode: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type EventCategory =
  | 'workshop'
  | 'seminar'
  | 'hackathon'
  | 'webinar'
  | 'conference'
  | 'meetup'
  | 'cultural'
  | 'sports'
  | 'other';

export interface Registration {
  _id: string;
  user: string | User;
  event: string | Event;
  status: 'registered' | 'cancelled' | 'attended';
  registeredAt: string;
  cancelledAt: string;
}

export interface Attendance {
  _id: string;
  user: string | User;
  event: string | Event;
  registration: string | Registration;
  markedAt: string;
  verificationMethod: 'qr' | 'manual';
}

export interface Certificate {
  _id: string;
  certificateId: string;
  user: string | User;
  event: string | Event;
  organization: string | Organization;
  issuedAt: string;
  downloadUrl: string;
  qrVerificationCode: string;
}

export interface Post {
  _id: string;
  author: string | User;
  content: string;
  image: string;
  event: string | Event | null;
  likes: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  _id: string;
  post: string;
  author: string | User;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  recipient: string;
  type: string;
  title: string;
  message: string;
  data: {
    eventId?: string;
    organizationId?: string;
    certificateId?: string;
  };
  isRead: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pages: number;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalOrganizations: number;
  pendingOrgs: number;
  approvedOrgs: number;
  totalEvents: number;
  approvedEvents: number;
  pendingEvents: number;
  totalRegistrations: number;
  totalAttendance: number;
  totalCertificates: number;
  totalPosts: number;
}
