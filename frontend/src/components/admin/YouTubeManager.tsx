import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VideoLecture, VideoPlatform } from '../../types';
import { Video, Plus, Trash2, Eye, EyeOff, Play, Share2, Sparkles, Pencil, X, Check } from 'lucide-react';
import { Youtube } from '../SocialIcons';
import { ImageUploaderInput } from '../common/ImageUploaderInput';
import { detectPlatform, extractVideoId, extractThumbnailFromUrl, fetchMediaDetails } from '../../utils/mediaExtractor';

export const YouTubeManager: React.FC = () => {
  const { videos, addVideoLecture, updateVideoLecture, deleteVideoLecture, showToast } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoLecture | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [newVideo, setNewVideo] = useState<{
    title: string;
    videoUrl: string;
    platform: VideoPlatform;
    thumbnail: string;
    duration: string;
    subject: string;
    targetClass: string;
    instructor: string;
  }>({
    title: '',
    videoUrl: '',
    platform: 'youtube',
    thumbnail: '',
    duration: '15:00',
    subject: 'Mathematics',
    targetClass: 'Class 10',
    instructor: 'Aman Arora'
  });

  const handleNewUrlChange = (url: string) => {
    const detected = detectPlatform(url);
    const autoThumb = extractThumbnailFromUrl(url, detected);

    setNewVideo(prev => ({
      ...prev,
      videoUrl: url,
      platform: detected,
      thumbnail: autoThumb || prev.thumbnail
    }));

    if (url.trim().startsWith('http')) {
      fetchMediaDetails(url).then(info => {
        setNewVideo(prev => ({
          ...prev,
          title: prev.title ? prev.title : (info.title || prev.title),
          thumbnail: info.thumbnail || prev.thumbnail
        }));
      }).catch(() => {});
    }
  };

  const handleEditUrlChange = (url: string) => {
    if (!editingVideo) return;
    const detected = detectPlatform(url);
    const autoThumb = extractThumbnailFromUrl(url, detected);

    setEditingVideo({
      ...editingVideo,
      videoUrl: url,
      youtubeUrl: url,
      platform: detected,
      thumbnail: autoThumb || editingVideo.thumbnail
    });

    if (url.trim().startsWith('http')) {
      fetchMediaDetails(url).then(info => {
        setEditingVideo(prev => {
          if (!prev) return null;
          return {
            ...prev,
            title: prev.title ? prev.title : (info.title || prev.title),
            thumbnail: info.thumbnail || prev.thumbnail
          };
        });
      }).catch(() => {});
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.title || !newVideo.videoUrl) {
      showToast('Please enter video title and video link.', 'warning');
      return;
    }

    const platform = newVideo.platform || detectPlatform(newVideo.videoUrl);
    const videoId = extractVideoId(newVideo.videoUrl, platform) || 'video';
    const thumbnail = newVideo.thumbnail || extractThumbnailFromUrl(newVideo.videoUrl, platform);

    await addVideoLecture({
      title: newVideo.title,
      youtubeUrl: newVideo.videoUrl,
      videoUrl: newVideo.videoUrl,
      platform,
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
      thumbnail: '',
      duration: '15:00',
      subject: 'Mathematics',
      targetClass: 'Class 10',
      instructor: 'Aman Arora'
    });
    showToast(`${platform.toUpperCase()} video lecture published!`, 'success');
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVideo) return;
    setIsSaving(true);
    try {
      const url = editingVideo.videoUrl || editingVideo.youtubeUrl || '';
      const platform = editingVideo.platform || detectPlatform(url);
      const videoId = extractVideoId(url, platform) || 'video';
      const thumbnail = editingVideo.thumbnail || extractThumbnailFromUrl(url, platform);

      await updateVideoLecture(editingVideo.id, {
        title: editingVideo.title,
        videoUrl: url,
        youtubeUrl: url,
        platform,
        targetClass: editingVideo.targetClass,
        subject: editingVideo.subject,
        instructor: editingVideo.instructor,
        duration: editingVideo.duration,
        videoId,
        youtubeId: videoId,
        thumbnail
      });
      setEditingVideo(null);
    } finally {
      setIsSaving(false);
    }
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

      {/* Edit Video Modal */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-2xl shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Pencil className="w-5 h-5" />
                <h3 className="text-base font-black uppercase tracking-wider">Edit Video Lecture</h3>
              </div>
              <button
                onClick={() => setEditingVideo(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Select Platform</label>
                  <select
                    value={editingVideo.platform || 'youtube'}
                    onChange={e => setEditingVideo({ ...editingVideo, platform: e.target.value as VideoPlatform })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
                  >
                    <option value="youtube">YouTube (Video / Shorts)</option>
                    <option value="instagram">Instagram (Reel / Post)</option>
                    <option value="facebook">Facebook (Video / Reel)</option>
                    <option value="twitter">Twitter / X (Video / Post)</option>
                    <option value="other">Other Video Link</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-300 block mb-1">Video / Reel URL *</label>
                  <input
                    type="text"
                    required
                    value={editingVideo.videoUrl || editingVideo.youtubeUrl || ''}
                    onChange={e => handleEditUrlChange(e.target.value)}
                    placeholder="Paste YouTube, Instagram, Facebook, or Twitter video link..."
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div className="md:col-span-3">
                  <ImageUploaderInput
                    label="Thumbnail Image (Auto-extracted from link or Upload Custom)"
                    value={editingVideo.thumbnail || ''}
                    onChange={url => setEditingVideo({ ...editingVideo, thumbnail: url })}
                    placeholder="Auto-extracted from video link or click upload..."
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="text-xs font-bold text-slate-300 block mb-1">Lecture / Reel Title *</label>
                  <input
                    type="text"
                    required
                    value={editingVideo.title}
                    onChange={e => setEditingVideo({ ...editingVideo, title: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Target Class / Batch</label>
                  <input
                    type="text"
                    required
                    value={editingVideo.targetClass}
                    onChange={e => setEditingVideo({ ...editingVideo, targetClass: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Subject / Topic</label>
                  <input
                    type="text"
                    required
                    value={editingVideo.subject}
                    onChange={e => setEditingVideo({ ...editingVideo, subject: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Instructor / Speaker</label>
                  <input
                    type="text"
                    required
                    value={editingVideo.instructor}
                    onChange={e => setEditingVideo({ ...editingVideo, instructor: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="px-5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                <option value="twitter">Twitter / X (Video / Post)</option>
                <option value="other">Other Video Link</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">Video / Reel URL *</label>
              <input
                type="text"
                required
                placeholder="Paste video link (YouTube, Instagram Reel, Facebook, or Twitter)..."
                value={newVideo.videoUrl}
                onChange={e => handleNewUrlChange(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            <div className="md:col-span-3">
              <ImageUploaderInput
                label="Thumbnail Image (Auto-extracted from video link or Upload Custom)"
                value={newVideo.thumbnail}
                onChange={url => setNewVideo({ ...newVideo, thumbnail: url })}
                placeholder="Auto-extracted thumbnail image from video link or upload file..."
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
                        {(platform || 'video').toUpperCase()} REEL
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
                      : platform === 'twitter'
                      ? 'bg-sky-500/20 text-sky-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {platform}
                  </span>
                </div>

                <h4 className="text-xs font-black text-white line-clamp-2">{v.title}</h4>
                
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400">{v.instructor}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingVideo(v)}
                      className="p-1.5 rounded-lg text-blue-400 hover:bg-blue-500/20 cursor-pointer transition-colors"
                      title="Edit Video"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteVideoLecture(v.id)}
                      className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 cursor-pointer transition-colors"
                      title="Delete Video"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
