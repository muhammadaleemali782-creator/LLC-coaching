import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VideoLecture, VideoPlatform } from '../../types';
import { Video, Plus, Trash2, Eye, EyeOff, Play, Share2, Sparkles } from 'lucide-react';
import { Youtube } from '../SocialIcons';

export const YouTubeManager: React.FC = () => {
  const { videos, addVideoLecture, deleteVideoLecture, showToast } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [newVideo, setNewVideo] = useState<{
    title: string;
    videoUrl: string;
    platform: VideoPlatform;
    duration: string;
    subject: string;
    targetClass: string;
    instructor: string;
  }>({
    title: '',
    videoUrl: '',
    platform: 'youtube',
    duration: '15:00',
    subject: 'Mathematics',
    targetClass: 'Class 10',
    instructor: 'Aman Arora'
  });

  const extractEmbedInfo = (url: string, platform: VideoPlatform) => {
    let embedUrl = '';
    let videoId = '';
    let thumbnail = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80';

    if (platform === 'youtube') {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/);
      videoId = match ? match[1] : 'kJQP7kiw5Fk';
      embedUrl = `https://www.youtube.com/embed/${videoId}`;
      thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    } else if (platform === 'instagram') {
      const cleanUrl = url.split('?')[0].replace(/\/+$/, '');
      embedUrl = `${cleanUrl}/embed/`;
      videoId = cleanUrl.split('/').pop() || 'insta';
      thumbnail = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80';
    } else if (platform === 'facebook') {
      embedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0`;
      videoId = 'fb-vid';
      thumbnail = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80';
    }

    return { embedUrl, videoId, thumbnail };
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.title || !newVideo.videoUrl) {
      showToast('Please enter video title and video link.', 'warning');
      return;
    }

    const { videoId, thumbnail } = extractEmbedInfo(newVideo.videoUrl, newVideo.platform);

    await addVideoLecture({
      title: newVideo.title,
      youtubeUrl: newVideo.videoUrl,
      videoUrl: newVideo.videoUrl,
      platform: newVideo.platform,
      videoId,
      youtubeId: videoId,
      thumbnail,
      duration: newVideo.duration,
      subject: newVideo.subject,
      targetClass: newVideo.targetClass,
      instructor: newVideo.instructor,
      isFeatured: true
    });

    setIsAdding(false);
    setNewVideo({
      title: '',
      videoUrl: '',
      platform: 'youtube',
      duration: '15:00',
      subject: 'Mathematics',
      targetClass: 'Class 10',
      instructor: 'Aman Arora'
    });
    showToast(`${newVideo.platform.toUpperCase()} video lecture published!`, 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">Video Lectures & Social Reels Desk</h2>
          <p className="text-xs text-slate-400">Embed lectures and viral reels directly from YouTube, Instagram, and Facebook.</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel' : 'Add Video / Reel'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 animate-in fade-in duration-150">
          <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider">Embed Video (YouTube / Instagram / Facebook)</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Select Platform *</label>
              <select
                value={newVideo.platform}
                onChange={e => setNewVideo({ ...newVideo, platform: e.target.value as VideoPlatform })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              >
                <option value="youtube">YouTube (Video / Shorts)</option>
                <option value="instagram">Instagram (Reel / Post)</option>
                <option value="facebook">Facebook (Video / Reel)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">Video / Reel URL *</label>
              <input
                type="text"
                required
                placeholder={
                  newVideo.platform === 'youtube'
                    ? 'https://www.youtube.com/watch?v=... or shorts URL'
                    : newVideo.platform === 'instagram'
                    ? 'https://www.instagram.com/reel/... or /p/...'
                    : 'https://www.facebook.com/.../videos/... or fb.watch/...'
                }
                value={newVideo.videoUrl}
                onChange={e => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Lecture / Reel Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Class 10 Trigonometry Marathon"
                value={newVideo.title}
                onChange={e => setNewVideo({ ...newVideo, title: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Target Class / Batch *</label>
              <input
                type="text"
                required
                placeholder="e.g. Class 10 / DCA / Spoken English"
                value={newVideo.targetClass}
                onChange={e => setNewVideo({ ...newVideo, targetClass: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Subject / Topic *</label>
              <input
                type="text"
                required
                placeholder="e.g. Mathematics / Science / English"
                value={newVideo.subject}
                onChange={e => setNewVideo({ ...newVideo, subject: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-wider"
            >
              Publish Video
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map(v => {
          const platform = v.platform || (v.youtubeUrl && v.youtubeUrl.includes('instagram') ? 'instagram' : v.youtubeUrl && v.youtubeUrl.includes('facebook') ? 'facebook' : 'youtube');
          
          return (
            <div key={v.id} className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden flex flex-col justify-between shadow-lg">
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                {platform === 'youtube' ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${v.videoId || v.youtubeId || 'kJQP7kiw5Fk'}`}
                    title={v.title}
                    className="w-full h-full border-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full relative">
                    <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="px-3 py-1 rounded-full bg-slate-900/90 text-white text-xs font-bold uppercase border border-slate-700">
                        {platform.toUpperCase()} REEL
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-400 text-[10px] font-mono font-bold">
                    {v.subject} • {v.targetClass}
                  </span>
                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${
                    platform === 'instagram'
                      ? 'bg-pink-500/20 text-pink-400'
                      : platform === 'facebook'
                      ? 'bg-blue-600/20 text-blue-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {platform}
                  </span>
                </div>

                <h4 className="text-xs font-black text-white line-clamp-2">{v.title}</h4>
                
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
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
          );
        })}
      </div>
    </div>
  );
};
