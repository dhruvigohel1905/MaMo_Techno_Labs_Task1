import mongoose, { Document, Schema } from 'mongoose';

export interface IPost extends Document {
  author: mongoose.Types.ObjectId;
  content: string;
  image: string;
  event: mongoose.Types.ObjectId | null;
  likes: mongoose.Types.ObjectId[];
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: [true, 'Post content is required'], trim: true },
    image: { type: String, default: '' },
    event: { type: Schema.Types.ObjectId, ref: 'Event', default: null },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1 });

export default mongoose.model<IPost>('Post', postSchema);
