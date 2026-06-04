import mongoose, { Document, Schema } from 'mongoose';

export interface IAttendance extends Document {
  user: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  registration: mongoose.Types.ObjectId;
  markedAt: Date;
  verificationMethod: 'qr' | 'manual';
}

const attendanceSchema = new Schema<IAttendance>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    registration: { type: Schema.Types.ObjectId, ref: 'Registration' },
    markedAt: { type: Date, default: Date.now },
    verificationMethod: {
      type: String,
      enum: ['qr', 'manual'],
      default: 'qr',
    },
  },
  { timestamps: true }
);

// Prevent duplicate attendance
attendanceSchema.index({ user: 1, event: 1 }, { unique: true });

export default mongoose.model<IAttendance>('Attendance', attendanceSchema);
