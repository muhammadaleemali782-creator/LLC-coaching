import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Notice } from '../../types';
import { Plus, Trash2, Bell, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export const NoticeManager: React.FC = () => {
  const { notices, addNotice, deleteNotice, showToast } = useApp();
  const [isAdding, setIsAdding] = useState(false);

  const [newNotice, setNewNotice] = useState<Partial<Notice>>({
    title: '',
    category: 'admission',
    date: new Date().toISOString().split('T')[0],
    isImportant: true,
    badgeText: 'ANNOUNCEMENT',
    description: ''
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.description) {
      showToast('Notice title and description are required.', 'warning');
      return;
    }
    await addNotice(newNotice as Notice);
    setIsAdding(false);
    setNewNotice({
      title: '',
      category: 'admission',
      date: new Date().toISOString().split('T')[0],
      isImportant: true,
      badgeText: 'ANNOUNCEMENT',
      description: ''
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-400" />
            <span>Notice Board & Top Ticker Alerts</span>
          </h2>
          <p className="text-xs text-slate-400">Post admissions open alerts, exam timetables, fee discount deadlines, and marquee ticker messages.</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel' : 'Post New Notice'}</span>
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 animate-in fade-in duration-150">
          <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider">Publish Notice Alert</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">Notice Headline *</label>
              <input
                type="text"
                required
                placeholder="e.g. Admission Open for Session 2026-2027 (Scholarship Test on Sunday)"
                value={newNotice.title}
                onChange={e => setNewNotice({ ...newNotice, title: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Category</label>
              <select
                value={newNotice.category}
                onChange={e => setNewNotice({ ...newNotice, category: e.target.value as any })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="admission">Admissions Alert</option>
                <option value="exam">Exam Schedule</option>
                <option value="result">Topper Results</option>
                <option value="holiday">Holiday Notice</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Badge Tag</label>
              <input
                type="text"
                placeholder="e.g. ADMISSIONS OPEN / EXAM ALERT"
                value={newNotice.badgeText}
                onChange={e => setNewNotice({ ...newNotice, badgeText: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">Full Announcement Details *</label>
              <textarea
                rows={3}
                required
                placeholder="Write detailed announcement for parents and students..."
                value={newNotice.description}
                onChange={e => setNewNotice({ ...newNotice, description: e.target.value })}
                className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black uppercase tracking-wider shadow-md"
            >
              Post Notice
            </button>
          </div>
        </form>
      )}

      {/* Grid of Notices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {notices.map(n => (
          <div key={n.id} className="bg-slate-950 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between space-y-3 shadow-xl">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-black uppercase">
                  {n.badgeText || n.category}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{n.date}</span>
              </div>
              <h4 className="text-sm font-black text-white">{n.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{n.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => deleteNotice(n.id)}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                title="Delete Notice"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
