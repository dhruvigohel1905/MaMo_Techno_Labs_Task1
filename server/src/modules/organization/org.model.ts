import mongoose, { Document, Schema } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  email: string;
  logo: string;
  description: string;
  website: string;
  type: 'college' | 'ngo' | 'company' | 'community' | 'club';
  status: 'pending' | 'approved' | 'rejected';
  admin: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  rejectionReason: string;
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: [true, 'Organization name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    logo: { type: String, default: '' },
    description: { type: String, default: '' },
    website: { type: String, default: '' },
    type: {
      type: String,
      enum: ['college', 'ngo', 'company', 'community', 'club'],
      required: [true, 'Organization type is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    admin: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    rejectionReason: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<IOrganization>('Organization', organizationSchema);
