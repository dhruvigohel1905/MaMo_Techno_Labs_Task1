import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useAppSelector } from '../../hooks/useRedux';
import { HiOutlineHeart, HiOutlineChatAlt2, HiOutlinePhotograph } from 'react-icons/hi';

const CommunityFeed = () => {
  const { user } = useAppSelector((s) => s.auth);
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = () => {
    api.get('/community/posts').then((r) => setPosts(r.data.data.posts || [])).catch(() => {}).finally(() => setLoading(false));
  };

  const handlePost = async () => {
    if (!content.trim()) return;
    try {
      await api.post('/community/posts', { content });
      setContent('');
      fetchPosts();
    } catch {}
  };

  const handleLike = async (postId: string) => {
    try {
      await api.post(`/community/posts/${postId}/like`);
      fetchPosts();
    } catch {}
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="font-display text-2xl font-bold mb-6">Community Feed</h1>

      {/* Create Post */}
      <div className="card mb-6">
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center text-white font-bold text-sm flex-shrink-0">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
          <div className="flex-1">
            <textarea value={content} onChange={(e) => setContent(e.target.value)} className="input-field resize-none h-20" placeholder="Share something with the community..." />
            <div className="flex items-center justify-between mt-3">
              <button className="btn-secondary !py-1.5 !px-3 text-xs"><HiOutlinePhotograph className="w-4 h-4" /> Photo</button>
              <button onClick={handlePost} disabled={!content.trim()} className="btn-primary !py-1.5 !px-5 text-sm">Post</button>
            </div>
          </div>
        </div>
      </div>

      {/* Posts */}
      {loading ? <div className="space-y-4">{[1,2,3].map((i) => <div key={i} className="card animate-pulse-soft h-32" />)}</div> : posts.length === 0 ? (
        <div className="text-center py-12 text-[var(--text-secondary)]"><HiOutlineChatAlt2 className="w-12 h-12 mx-auto mb-3" /><p>No posts yet. Be the first to share!</p></div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const author = post.author as any;
            return (
              <div key={post._id} className="card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white font-bold text-sm">{author?.firstName?.[0]}{author?.lastName?.[0]}</div>
                  <div><p className="font-semibold text-sm">{author?.firstName} {author?.lastName}</p><p className="text-xs text-[var(--text-tertiary)]">{new Date(post.createdAt).toLocaleDateString()}</p></div>
                </div>
                <p className="text-sm mb-4 whitespace-pre-wrap">{post.content}</p>
                {post.image && <img src={post.image} alt="" className="rounded-xl mb-4 max-h-80 w-full object-cover" />}
                <div className="flex items-center gap-4 pt-3 border-t border-[var(--border-color)]">
                  <button onClick={() => handleLike(post._id)} className={`flex items-center gap-1.5 text-sm transition-colors ${post.likes?.includes(user?._id) ? 'text-red-500' : 'text-[var(--text-secondary)] hover:text-red-500'}`}>
                    <HiOutlineHeart className="w-5 h-5" /> {post.likesCount || 0}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-primary-500 transition-colors">
                    <HiOutlineChatAlt2 className="w-5 h-5" /> {post.commentsCount || 0}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;
