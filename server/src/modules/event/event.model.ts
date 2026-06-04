import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  category: string;
  location: string;
  isOnline: boolean;
  meetingLink: string;
  startDate: Date;
  endDate: Date;
  time: string;
  maxParticipants: number;
  banner: string;
  organization: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled';
  rejectionReason: string;
  registrationCount: number;
  attendanceCount: number;
  qrCode: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: [true, 'Event title is required'], trim: true, index: true },
    description: { type: String, required: [true, 'Description is required'] },
    category: {
      type: String,
      enum: ['workshop', 'seminar', 'hackathon', 'webinar', 'conference', 'meetup', 'cultural', 'sports', 'other'],
      required: [true, 'Category is required'],
    },
    location: { type: String, default: '' },
    isOnline: { type: Boolean, default: false },
    meetingLink: { type: String, default: '' },
    startDate: { type: Date, required: [true, 'Start date is required'] },
    endDate: { type: Date, required: [true, 'End date is required'] },
    time: { type: String, default: '' },
    maxParticipants: { type: Number, default: 0 },
    banner: { type: String, default: '' },
    organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected', 'cancelled'],
      default: 'pending',
    },
    rejectionReason: { type: String, default: '' },
    registrationCount: { type: Number, default: 0 },
    attendanceCount: { type: Number, default: 0 },
    qrCode: { type: String, default: '' },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Indexes for search and filtering
eventSchema.index({ title: 'text', description: 'text' });
eventSchema.index({ category: 1, status: 1 });
eventSchema.index({ startDate: 1 });
eventSchema.index({ organization: 1 });

export default mongoose.model<IEvent>('Event', eventSchema);
