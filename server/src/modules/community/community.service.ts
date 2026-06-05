import Post from './post.model';
import Comment from './comment.model';
import { AppError } from '../../middleware/errorHandler';

export class CommunityService {
  async createPost(data: { content: string; image?: string; event?: string }, userId: string) {
    const post = await Post.create({ ...data, author: userId });
    return Post.findById(post._id).populate('author', 'firstName lastName avatar role');
  }

  async getPosts(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const posts = await Post.find()
      .populate('author', 'firstName lastName avatar role')
      .populate('event', 'title banner')
      .skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Post.countDocuments();
    return { posts, total, page, pages: Math.ceil(total / limit) };
  }

  async getPostById(postId: string) {
    const post = await Post.findById(postId)
      .populate('author', 'firstName lastName avatar role')
      .populate('event', 'title banner');
    if (!post) throw new AppError('Post not found', 404);
    return post;
  }

  async deletePost(postId: string, userId: string, isAdmin: boolean = false) {
    const post = await Post.findById(postId);
    if (!post) throw new AppError('Post not found', 404);
    if (post.author.toString() !== userId.toString() && !isAdmin) {
      throw new AppError('Not authorized', 403);
    }
    await Post.findByIdAndDelete(postId);
    await Comment.deleteMany({ post: postId });
    return { message: 'Post deleted' };
  }

  async toggleLike(postId: string, userId: string) {
    const post = await Post.findById(postId);
    if (!post) throw new AppError('Post not found', 404);

    const likeIndex = post.likes.findIndex((id) => id.toString() === userId);
    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
      post.likesCount = Math.max(0, post.likesCount - 1);
    } else {
      post.likes.push(userId as any);
      post.likesCount += 1;
    }
    await post.save();
    return post;
  }

  async addComment(postId: string, content: string, userId: string) {
    const post = await Post.findById(postId);
    if (!post) throw new AppError('Post not found', 404);

    const comment = await Comment.create({ post: postId, author: userId, content });
    post.commentsCount += 1;
    await post.save();

    return Comment.findById(comment._id).populate('author', 'firstName lastName avatar');
  }

  async getComments(postId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const comments = await Comment.find({ post: postId })
      .populate('author', 'firstName lastName avatar')
      .skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Comment.countDocuments({ post: postId });
    return { comments, total, page, pages: Math.ceil(total / limit) };
  }

  async deleteComment(commentId: string, userId: string, isAdmin: boolean = false) {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new AppError('Comment not found', 404);
    if (comment.author.toString() !== userId.toString() && !isAdmin) {
      throw new AppError('Not authorized', 403);
    }
    await Comment.findByIdAndDelete(commentId);
    await Post.findByIdAndUpdate(comment.post, { $inc: { commentsCount: -1 } });
    return { message: 'Comment deleted' };
  }
}
