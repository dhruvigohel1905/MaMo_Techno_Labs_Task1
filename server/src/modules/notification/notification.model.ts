import mongoose, { Document, Schema } from 'mongoose';

export type NotificationType =
  | 'event_pending'
  | 'event_approved'
  | 'event_rejected'
  | 'registration_success'
  | 'event_reminder'
  | 'certificate_available'
  | 'org_approved'
  | 'org_rejected';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  data: {
    eventId?: mongoose.Types.ObjectId;
    organizationId?: mongoose.Types.ObjectId;
    certificateId?: mongoose.Types.ObjectId;
  };
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: [
        'event_pending',
        'event_approved',
        'event_rejected',
        'registration_success',
        'event_reminder',
        'certificate_available',
        'org_approved',
        'org_rejected',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    data: {
      eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
      organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
      certificateId: { type: Schema.Types.ObjectId, ref: 'Certificate' },
    },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

export default mongoose.model<INotification>('Notification', notificationSchema);
