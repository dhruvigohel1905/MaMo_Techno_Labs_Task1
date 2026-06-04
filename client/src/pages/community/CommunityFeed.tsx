import { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import { useAppSelector } from '../../hooks/useRedux';
import { HiOutlineHeart, HiOutlineChatAlt2, HiOutlinePhotograph, HiOutlineX } from 'react-icons/hi';

const CommunityFeed = () => {
  const { user } = useAppSelector((s) => s.auth);
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = () => {
    api.get('/community/posts').then((r) => setPosts(r.data.data.posts || [])).catch(() => {}).finally(() => setLoading(false));
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be less than 5MB');
      return;
    }
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handlePost = async () => {
    if (!content.trim() && !selectedImage) return;
    try {
      setPosting(true);
      const formData = new FormData();
      formData.append('content', content);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }
      await api.post('/community/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setContent('');
      removeImage();
      fetchPosts();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to create post');
    } finally {
      setPosting(false);
    }
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

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative mt-3 rounded-xl overflow-hidden border border-[var(--border-color)]">
                <img src={imagePreview} alt="Preview" className="max-h-48 w-full object-cover" />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <HiOutlineX className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex items-center justify-between mt-3">
              <button onClick={handlePhotoClick} className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5">
                <HiOutlinePhotograph className="w-4 h-4" /> Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
                className="hidden"
              />
              <button onClick={handlePost} disabled={(!content.trim() && !selectedImage) || posting} className="btn-primary !py-1.5 !px-5 text-sm">
                {posting ? 'Posting...' : 'Post'}
              </button>
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
