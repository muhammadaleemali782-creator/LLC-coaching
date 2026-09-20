import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InstagramPost } from '../../types';
import { Plus, Edit3, Trash2, Heart, MessageCircle, ExternalLink, Save, X } from 'lucide-react';
import { Instagram } from '../SocialIcons';
import { ImageUploaderInput } from '../common/ImageUploaderInput';
import { extractThumbnailFromUrl } from '../../utils/mediaExtractor';
import { INITIAL_INSTAGRAM_POSTS } from '../../data/initialData';

export const InstagramManager: React.FC = () => {
  const { instagramPosts, addInstagramPost, updateInstagramPost, deleteInstagramPost, showToast } = useApp();
  const [editingPost, setEditingPost] = useState<InstagramPost | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newPost, setNewPost] = useState<Partial<InstagramPost>>({
    caption: '',
    imageUrl: '',
    likes: 1250,
    comments: 48,
    postUrl: '',
    timestamp: 'Just now'
  });

  const handlePostUrlChange = (url: string) => {
    const autoThumb = extractThumbnailFromUrl(url, 'instagram');
    setNewPost(prev => ({
      ...prev,
      postUrl: url,
      imageUrl: autoThumb || prev.imageUrl,
      type: url.includes('/reel/') ? 'reel' : 'post'
    }));
  };

  const handleEditPostUrlChange = (url: string) => {
    if (!editingPost) return;
    const autoThumb = extractThumbnailFromUrl(url, 'instagram');
    setEditingPost({
      ...editingPost,
      postUrl: url,
      imageUrl: autoThumb || editingPost.imageUrl,
      type: url.includes('/reel/') ? 'reel' : editingPost.type
    });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalImage = newPost.imageUrl || extractThumbnailFromUrl(newPost.postUrl || '', 'instagram');
    if (!newPost.caption || !finalImage) {
      showToast('Caption and image URL are required.', 'warning');
      return;
    }
    setIsSubmitting(true);
    try {
      await addInstagramPost({
        imageUrl: finalImage,
        caption: newPost.caption,
        title: newPost.caption,
        likes: Number(newPost.likes) || 100,
        comments: Number(newPost.comments) || 10,
        postUrl: newPost.postUrl || 'https://instagram.com',
        timestamp: newPost.timestamp || 'Just now',
        date: newPost.timestamp || 'Just now',
        type: newPost.postUrl?.includes('/reel/') ? 'reel' : 'post'
      });
      setIsAdding(false);
      setNewPost({
        caption: '',
        imageUrl: '',
        likes: 1250,
        comments: 48,
        postUrl: '',
        timestamp: 'Just now'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingPost) return;
    setIsSubmitting(true);
    try {
      await updateInstagramPost(editingPost.id, editingPost);
      setEditingPost(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteInstagramPost(id);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Instagram className="w-6 h-6 text-pink-500" />
            <span>Instagram Feed & Reels Manager</span>
          </h2>
          <p className="text-xs text-slate-400">Control campus celebrations, viral reels, like counts, and direct Instagram post links.</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel' : 'Add Instagram Post / Reel'}</span>
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 animate-in fade-in duration-150">
          <h3 className="text-sm font-black text-pink-400 uppercase tracking-wider">Publish New Instagram Post</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">Instagram Post / Reel URL</label>
              <input
                type="text"
                placeholder="https://www.instagram.com/reel/... or /p/..."
                value={newPost.postUrl}
                onChange={e => handlePostUrlChange(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
              />
              <span className="text-[11px] text-pink-400 mt-1 block">✨ Paste link above to automatically grab post image preview.</span>
            </div>

            <div className="sm:col-span-2">
              <ImageUploaderInput
                label="Post Image (Auto-extracted or Upload Custom)"
                value={newPost.imageUrl || ''}
                onChange={url => setNewPost({ ...newPost, imageUrl: url })}
                placeholder="Auto-extracted from Instagram link or click upload..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">Post Caption *</label>
              <textarea
                rows={2}
                required
                placeholder="Celebration of District Toppers at L.C.C. Annual Felicitation Day!..."
                value={newPost.caption}
                onChange={e => setNewPost({ ...newPost, caption: e.target.value })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Like Count</label>
              <input
                type="number"
                value={newPost.likes}
                onChange={e => setNewPost({ ...newPost, likes: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Comments Count</label>
              <input
                type="number"
                value={newPost.comments}
                onChange={e => setNewPost({ ...newPost, comments: Number(e.target.value) })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-black uppercase tracking-wider shadow-md disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Saving to Database...' : 'Add to Feed'}
            </button>
          </div>
        </form>
      )}

      {/* Grid of Posts or Empty State */}
      {instagramPosts.length === 0 ? (
        <div className="p-12 text-center bg-slate-950 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center">
            <Instagram className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">No Instagram Posts in Feed</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Add your official campus celebration posts or viral reels above.
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setIsAdding(true)}
              className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-black uppercase tracking-wider cursor-pointer shadow-lg"
            >
              Add New Post / Reel
            </button>
            <button
              onClick={async () => {
                for (const p of INITIAL_INSTAGRAM_POSTS) {
                  await addInstagramPost(p);
                }
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer"
            >
              Restore Sample Feed
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {instagramPosts.map(post => (
            <div key={post.id} className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
              <div className="relative h-56 overflow-hidden bg-slate-900">
                <img
                  src={post.imageUrl}
                  alt={post.caption || post.title || 'Instagram post'}
                  onError={(e: any) => {
                    e.target.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80';
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                <div className="absolute top-3 right-3 p-1.5 rounded-full bg-pink-600 text-white shadow-md">
                  <Instagram className="w-3.5 h-3.5" />
                </div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-bold">
                  <span className="flex items-center gap-1 text-pink-400">
                    <Heart className="w-3.5 h-3.5 fill-current" /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1 text-slate-300">
                    <MessageCircle className="w-3.5 h-3.5" /> {post.comments}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{post.timestamp || post.date || 'Recent'}</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{post.caption || post.title}</p>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <a
                    href={post.postUrl || 'https://instagram.com'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-pink-400 hover:text-pink-300 flex items-center gap-1 font-bold"
                  >
                    <span>View on Instagram</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingPost({ ...post })}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 cursor-pointer"
                      title="Edit Post"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                      title="Delete Post"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-950 text-white rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-pink-400" />
                <h3 className="text-sm font-black uppercase">Edit Instagram Post</h3>
              </div>
              <button onClick={() => setEditingPost(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Instagram Post / Reel URL</label>
                <input
                  type="text"
                  value={editingPost.postUrl || ''}
                  onChange={e => handleEditPostUrlChange(e.target.value)}
                  placeholder="https://www.instagram.com/reel/... or /p/..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <ImageUploaderInput
                  label="Post Image (Auto-extracted or Upload Custom)"
                  value={editingPost.imageUrl || ''}
                  onChange={url => setEditingPost({ ...editingPost, imageUrl: url })}
                  placeholder="Auto-extracted or click upload..."
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Caption</label>
                <textarea
                  rows={3}
                  value={editingPost.caption}
                  onChange={e => setEditingPost({ ...editingPost, caption: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Likes Count</label>
                  <input
                    type="number"
                    value={editingPost.likes}
                    onChange={e => setEditingPost({ ...editingPost, likes: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Comments Count</label>
                  <input
                    type="number"
                    value={editingPost.comments}
                    onChange={e => setEditingPost({ ...editingPost, comments: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setEditingPost(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-6 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Post</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
