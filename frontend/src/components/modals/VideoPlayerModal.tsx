import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Video, X, Eye, Clock, User, Share2, ExternalLink } from 'lucide-react';
import { recordLearningHistory } from '../../utils/learningHistory';
import { extractVideoId, formatViewCount } from '../../utils/mediaExtractor';

export const VideoPlayerModal: React.FC = () => {
  const { selectedVideoForPlayer, setSelectedVideoForPlayer, showToast, currentStudent } = useApp();

  useEffect(() => {
    if (selectedVideoForPlayer) {
      recordLearningHistory({
        type: 'video',
        itemId: selectedVideoForPlayer.id,
        title: selectedVideoForPlayer.title,
        subject: selectedVideoForPlayer.subject,
        targetClass: selectedVideoForPlayer.targetClass,
        duration: selectedVideoForPlayer.duration
      }, currentStudent?.id || currentStudent?.email);
    }
  }, [selectedVideoForPlayer, currentStudent]);

  if (!selectedVideoForPlayer) return null;

  const rawUrl = selectedVideoForPlayer.videoUrl || selectedVideoForPlayer.youtubeUrl || '';
  const platform = selectedVideoForPlayer.platform || (rawUrl.includes('instagram') ? 'instagram' : rawUrl.includes('facebook') ? 'facebook' : rawUrl.includes('twitter') || rawUrl.includes('x.com') ? 'twitter' : 'youtube');
  const cleanVideoId = extractVideoId(rawUrl, platform) || extractVideoId(selectedVideoForPlayer.videoId || '', platform) || extractVideoId(selectedVideoForPlayer.youtubeId || '', platform) || selectedVideoForPlayer.videoId || selectedVideoForPlayer.youtubeId || 't1a9Kmd_cS8';

  const handleShare = () => {
    const shareUrl = platform === 'youtube' && cleanVideoId
      ? `https://youtu.be/${cleanVideoId}`
      : rawUrl;
    navigator.clipboard.writeText(shareUrl);
    showToast('Video link copied to clipboard!', 'info');
  };

  const directExternalUrl = platform === 'youtube'
    ? `https://www.youtube.com/watch?v=${cleanVideoId}`
    : rawUrl;

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://lcc-coaching-center.vercel.app';
  let playerIframeSrc = `https://www.youtube-nocookie.com/embed/${cleanVideoId}?autoplay=1&rel=0&playsinline=1&enablejsapi=1&origin=${encodeURIComponent(originUrl)}`;
  if (platform === 'instagram') {
    const cleanUrl = rawUrl.split('?')[0].replace(/\/+$/, '');
    playerIframeSrc = `${cleanUrl}/embed/`;
  } else if (platform === 'facebook') {
    playerIframeSrc = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(rawUrl)}&show_text=0`;
  } else if (platform === 'twitter') {
    const tweetMatch = rawUrl.match(/status\/(\d+)/);
    playerIframeSrc = tweetMatch ? `https://platform.twitter.com/embed/Tweet.html?id=${tweetMatch[1]}` : rawUrl;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className={`p-2 rounded-xl shrink-0 ${
              platform === 'instagram'
                ? 'bg-pink-500/20 text-pink-400'
                : platform === 'facebook'
                ? 'bg-blue-500/20 text-blue-400'
                : platform === 'twitter'
                ? 'bg-sky-500/20 text-sky-400'
                : 'bg-red-500/20 text-red-400'
            }`}>
              <Video className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="text-sm font-black text-white truncate">{selectedVideoForPlayer.title}</h3>
              <span className="text-[11px] text-slate-400 font-medium">
                {selectedVideoForPlayer.subject} • {selectedVideoForPlayer.targetClass} • <span className="uppercase text-amber-400 font-bold">{platform}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {platform === 'youtube' && (
              <a
                href={directExternalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
                title="Watch directly on YouTube App"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Open in App</span>
              </a>
            )}
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Share Video"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedVideoForPlayer(null)}
              className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Frame */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          <iframe
            src={playerIframeSrc}
            title={selectedVideoForPlayer.title}
            className="w-full h-full border-0"
            referrerPolicy="no-referrer-when-downgrade"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
            allowFullScreen
          />
        </div>

        {/* Bottom Details */}
        <div className="p-4 sm:p-5 bg-slate-900/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-300">
              <User className="w-3.5 h-3.5 text-[#0066FF]" />
              <strong>{selectedVideoForPlayer.instructor}</strong>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {selectedVideoForPlayer.duration}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {formatViewCount(selectedVideoForPlayer.views)}
            </span>
          </div>

          <span className="text-[11px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            Official L.C.C. Video Archive
          </span>
        </div>

      </div>
    </div>
  );
};
