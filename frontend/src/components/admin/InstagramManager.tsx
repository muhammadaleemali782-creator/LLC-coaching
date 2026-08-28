import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InstagramPost } from '../../types';
import { Plus, Edit3, Trash2, Heart, MessageCircle, ExternalLink, Save, X } from 'lucide-react';
import { Instagram } from '../SocialIcons';

export const InstagramManager: React.FC = () => {
  const { instagramPosts, setInstagramPosts, showToast } = useApp();
  const [editingPost, setEditingPost] = useState<InstagramPost | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const [newPost, setNewPost] = useState<Partial<InstagramPost>>({
    caption: '',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    likes: 1250,
    comments: 48,
    postUrl: 'https://instagram.com/lcc_coaching_official',
    timestamp: 'Just now'
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.caption || !newPost.imageUrl) {
      showToast('Caption and image URL are required.', 'warning');
      return;
    }
    const created: InstagramPost = {
      id: `ig-${Date.now()}`,
      imageUrl: newPost.imageUrl,
      caption: newPost.caption,
      likes: Number(newPost.likes) || 100,
      comments: Number(newPost.comments) || 10,
      postUrl: newPost.postUrl || 'https://instagram.com',
      timestamp: newPost.timestamp || 'Just now'
    };
    setInstagramPosts(prev => [created, ...prev]);
    setIsAdding(false);
    showToast('Instagram post added to feed!', 'success');
  };

  const handleSaveEdit = () => {
    if (!editingPost) return;
    setInstagramPosts(prev => prev.map(p => p.id === editingPost.id ? editingPost : p));
    setEditingPost(null);
    showToast('Instagram post updated successfully!', 'success');
  };

  const handleDelete = (id: string) => {
    setInstagramPosts(prev => prev.filter(p => p.id !== id));
    showToast('Instagram post removed from feed.', 'info');
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
              <label className="text-xs font-bold text-slate-300 block mb-1">Post Image URL *</label>
              <input
                type="text"
                required
                placeholder="https://images.unsplash.com/..."
                value={newPost.imageUrl}
                onChange={e => setNewPost({ ...newPost, imageUrl: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
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

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">Instagram Post URL</label>
              <input
                type="text"
                placeholder="https://instagram.com/p/..."
                value={newPost.postUrl}
                onChange={e => setNewPost({ ...newPost, postUrl: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-black uppercase tracking-wider shadow-md"
            >
              Add to Feed
            </button>
          </div>
        </form>
      )}

      {/* Grid of Posts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {instagramPosts.map(post => (
          <div key={post.id} className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
            <div className="relative h-56 overflow-hidden bg-slate-900">
              <img src={post.imageUrl} alt={post.caption} className="w-full h-full object-cover" />
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
                <span className="text-[10px] text-slate-400 font-mono">{post.timestamp}</span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <p className="text-xs text-slate-300 line-clamp-2">{post.caption}</p>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <a
                  href={post.postUrl}
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
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400"
                    title="Edit Post"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
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
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Image URL</label>
                <input
                  type="text"
                  value={editingPost.imageUrl}
                  onChange={e => setEditingPost({ ...editingPost, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-pink-500"
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
