import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VideoLecture } from '../../types';
import { Video, Plus, Trash2, Eye, EyeOff, Play } from 'lucide-react';

export const YouTubeManager: React.FC = () => {
  const { videos, addVideoLecture, deleteVideoLecture, toggleVideoLecture, showToast } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [newVideo, setNewVideo] = useState({
    title: '',
    youtubeUrl: '',
    duration: '40:00',
    subject: 'Mathematics',
    targetClass: 'Class 10',
    instructor: 'Aman Arora'
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.title || !newVideo.youtubeUrl) {
      showToast('Please enter video title and YouTube URL.', 'warning');
      return;
    }

    await addVideoLecture(newVideo as any);
    setIsAdding(false);
    setNewVideo({
      title: '',
      youtubeUrl: '',
      duration: '40:00',
      subject: 'Mathematics',
      targetClass: 'Class 10',
      instructor: 'Aman Arora'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">YouTube Video Lectures</h2>
          <p className="text-xs text-slate-400">Add, organize, and publish video lectures with instant YouTube embed validation.</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel' : 'Add YouTube Lecture'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 animate-in fade-in duration-150">
          <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider">Embed New YouTube Lecture</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Lecture Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Class 10 Trigonometry Zero to Hero"
                value={newVideo.title}
                onChange={e => setNewVideo({ ...newVideo, title: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">YouTube URL *</label>
              <input
                type="text"
                required
                placeholder="https://www.youtube.com/watch?v=..."
                value={newVideo.youtubeUrl}
                onChange={e => setNewVideo({ ...newVideo, youtubeUrl: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-wider"
            >
              Add Video
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(v => (
          <div key={v.id} className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between">
            <div className="relative aspect-video bg-slate-900">
              <iframe
                src={`https://www.youtube.com/embed/${v.videoId || v.youtubeId}`}
                title={v.title}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-4 space-y-2">
              <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-[10px] font-mono font-bold">
                {v.subject} • {v.targetClass}
              </span>
              <h4 className="text-xs font-black text-white line-clamp-1">{v.title}</h4>
              
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">{v.instructor}</span>
                <button
                  onClick={() => deleteVideoLecture(v.id)}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 cursor-pointer"
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
