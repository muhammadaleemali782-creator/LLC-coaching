import React from 'react';
import { useApp } from '../../context/AppContext';
import { Video, X, Eye, Clock, User, Share2 } from 'lucide-react';

export const VideoPlayerModal: React.FC = () => {
  const { selectedVideoForPlayer, setSelectedVideoForPlayer, showToast } = useApp();

  if (!selectedVideoForPlayer) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(selectedVideoForPlayer.youtubeUrl);
    showToast('Video link copied to clipboard!', 'info');
  };

  const videoId = selectedVideoForPlayer.videoId || selectedVideoForPlayer.youtubeId || 'dQw4w9WgXcQ';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-xl bg-red-500/20 text-red-400 shrink-0">
              <Video className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="text-sm font-black text-white truncate">{selectedVideoForPlayer.title}</h3>
              <span className="text-[11px] text-slate-400 font-medium">
                {selectedVideoForPlayer.subject} • {selectedVideoForPlayer.targetClass}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Share Video"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setSelectedVideoForPlayer(null)}
              className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
            title={selectedVideoForPlayer.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
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
              {selectedVideoForPlayer.views} Views
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
