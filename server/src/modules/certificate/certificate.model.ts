import mongoose, { Document, Schema } from 'mongoose';

export interface ICertificate extends Document {
  certificateId: string;
  user: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  organization: mongoose.Types.ObjectId;
  issuedAt: Date;
  downloadUrl: string;
  qrVerificationCode: string;
}

const certificateSchema = new Schema<ICertificate>(
  {
    certificateId: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    issuedAt: { type: Date, default: Date.now },
    downloadUrl: { type: String, default: '' },
    qrVerificationCode: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

certificateSchema.index({ user: 1, event: 1 }, { unique: true });

export default mongoose.model<ICertificate>('Certificate', certificateSchema);
