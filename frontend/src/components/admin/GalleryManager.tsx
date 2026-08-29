import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GalleryItem } from '../../types';
import { Plus, Trash2, Image, Layers, Sparkles, ExternalLink, X, Save } from 'lucide-react';

export const GalleryManager: React.FC = () => {
  const { galleryItems, setGalleryItems, showToast } = useApp();
  const [isAdding, setIsAdding] = useState(false);

  const [newItem, setNewItem] = useState<Partial<GalleryItem>>({
    title: '',
    category: 'classroom',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    date: 'August 2026',
    description: 'Modern digital classrooms with live doubt sessions.'
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title || !newItem.imageUrl) {
      showToast('Title and Image URL are required.', 'warning');
      return;
    }
    const item: GalleryItem = {
      id: `gal-${Date.now()}`,
      title: newItem.title,
      category: newItem.category || 'classroom',
      imageUrl: newItem.imageUrl,
      date: newItem.date || 'Recent Event',
      description: newItem.description || 'Campus photo from Learning Coaching Center.'
    };
    setGalleryItems(prev => [item, ...prev]);
    setIsAdding(false);
    showToast('Photo added to campus gallery!', 'success');
  };

  const handleDelete = (id: string) => {
    setGalleryItems(prev => prev.filter(g => g.id !== id));
    showToast('Photo removed from gallery.', 'info');
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
              <label className="text-xs font-bold text-slate-300 block mb-1">Image URL *</label>
              <input
                type="text"
                required
                placeholder="https://images.unsplash.com/..."
                value={newItem.imageUrl}
                onChange={e => setNewItem({ ...newItem, imageUrl: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
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
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
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

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                  title="Delete Photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
