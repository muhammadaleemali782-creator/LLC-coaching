import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GalleryItem } from '../../types';
import { Plus, Trash2, Image, Layers, Sparkles, ExternalLink, X, Save, Pencil, Check, Download, Lock, ShieldCheck } from 'lucide-react';
import { ImageUploaderInput } from '../common/ImageUploaderInput';
import { normalizeImageUrl } from '../../utils/imageCompressor';

export const GalleryManager: React.FC = () => {
  const { galleryItems, addGalleryItem, updateGalleryItem, deleteGalleryItem, showToast } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [newItem, setNewItem] = useState<Partial<GalleryItem>>({
    title: '',
    category: 'classroom',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    date: 'August 2026',
    description: 'Modern digital classrooms with live doubt sessions.',
    allowDownload: true
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title || !newItem.imageUrl) {
      showToast('Title and Image URL are required.', 'warning');
      return;
    }
    addGalleryItem({
      title: newItem.title!,
      category: newItem.category || 'classroom',
      imageUrl: normalizeImageUrl(newItem.imageUrl!),
      date: newItem.date || 'August 2026',
      description: newItem.description || 'Campus photo from Learning Coaching Center.',
      allowDownload: newItem.allowDownload !== false
    });
    setIsAdding(false);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsSaving(true);
    try {
      await updateGalleryItem(editingItem.id, {
        title: editingItem.title,
        category: editingItem.category,
        imageUrl: normalizeImageUrl(editingItem.imageUrl),
        date: editingItem.date,
        description: editingItem.description,
        allowDownload: editingItem.allowDownload !== false
      });
      setEditingItem(null);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    deleteGalleryItem(id);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Image className="w-6 h-6 text-purple-400" />
            <span>Campus Photo Gallery Manager</span>
          </h2>
          <p className="text-xs text-slate-400">Upload and curate felicitation day photos, digital lab pictures, topper ceremonies, and events.</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel' : 'Upload Gallery Photo'}</span>
        </button>
      </div>

      {/* Edit Gallery Photo Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-purple-400">
                <Pencil className="w-5 h-5" />
                <h3 className="text-base font-black uppercase tracking-wider">Edit Campus Photo</h3>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={editingItem.title}
                  onChange={e => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={e => setEditingItem({ ...editingItem, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="toppers">🏆 Toppers & Awards</option>
                    <option value="classroom">📚 Classroom in Session</option>
                    <option value="lab">💻 Computer & Science Lab</option>
                    <option value="event">🎉 Events & Functions</option>
                    <option value="events">🎉 Events & Seminars</option>
                    <option value="students">🗣️ Student Activities</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Event Date</label>
                  <input
                    type="text"
                    value={editingItem.date}
                    onChange={e => setEditingItem({ ...editingItem, date: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <ImageUploaderInput
                  label="Photo Image (File Upload or Google Drive / URL)"
                  value={editingItem.imageUrl}
                  onChange={url => setEditingItem({ ...editingItem, imageUrl: url })}
                  placeholder="Paste Google Drive link, web URL, or upload file..."
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingItem.description}
                  onChange={e => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-2xl">
                <div>
                  <label className="text-xs font-bold text-slate-200 block">Allow Visitors to Download Photo</label>
                  <p className="text-[11px] text-slate-400">When enabled, students and parents can download the high-resolution photo.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.allowDownload !== false}
                    onChange={e => setEditingItem({ ...editingItem, allowDownload: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 animate-in fade-in duration-150">
          <h3 className="text-sm font-black text-purple-400 uppercase tracking-wider">Add Campus Photo</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">Photo Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Annual Felicitation & Merit Award Ceremony 2026"
                value={newItem.title}
                onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
              <select
                value={newItem.category}
                onChange={e => setNewItem({ ...newItem, category: e.target.value as any })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="toppers">🏆 Toppers & Awards</option>
                <option value="classroom">📚 Classroom in Session</option>
                <option value="lab">💻 Computer & Science Lab</option>
                <option value="events">🎉 Events & Seminars</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Event Date</label>
              <input
                type="text"
                placeholder="e.g. August 2026"
                value={newItem.date}
                onChange={e => setNewItem({ ...newItem, date: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="sm:col-span-2">
              <ImageUploaderInput
                label="Photo Image (File Upload or URL)"
                value={newItem.imageUrl || ''}
                onChange={url => setNewItem({ ...newItem, imageUrl: url })}
                placeholder="Upload campus photo file or paste image URL..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">Description</label>
              <textarea
                rows={2}
                value={newItem.description}
                onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-between p-3.5 bg-slate-900 border border-slate-800 rounded-2xl">
              <div>
                <label className="text-xs font-bold text-slate-200 block">Allow Visitors to Download Photo</label>
                <p className="text-[11px] text-slate-400">Default is enabled. Turn off if you wish to restrict downloads for this photo.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={newItem.allowDownload !== false}
                  onChange={e => setNewItem({ ...newItem, allowDownload: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-wider shadow-md"
            >
              Add to Gallery
            </button>
          </div>
        </form>
      )}

      {/* Grid of Gallery Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {galleryItems.map(item => (
          <div key={item.id} className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
            <div className="relative h-48 overflow-hidden bg-slate-900">
              <img src={normalizeImageUrl(item.imageUrl)} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
              <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-black uppercase">
                {item.category}
              </span>
              <span className="absolute bottom-2.5 right-3 text-[10px] text-slate-300 font-mono">
                {item.date}
              </span>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="text-sm font-black text-white line-clamp-1">{item.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => updateGalleryItem(item.id, { allowDownload: item.allowDownload === false ? true : false })}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                    item.allowDownload !== false
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20'
                  }`}
                  title="Click to toggle download permission for visitors"
                >
                  {item.allowDownload !== false ? <Download className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                  <span>{item.allowDownload !== false ? 'Download: On' : 'Download: Off'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 cursor-pointer transition-colors"
                    title="Edit Photo"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer transition-colors"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
