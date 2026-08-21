import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, Eye, BookOpen, ExternalLink, X } from 'lucide-react';
import { Youtube } from '../SocialIcons';

export const VideoPlayerModal: React.FC = () => {
  const { selectedVideoForPlayer, setSelectedVideoForPlayer, setSelectedDocForPreview, studyMaterials } = useApp();

  if (!selectedVideoForPlayer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 truncate">
            <div className="p-2 rounded-xl bg-rose-100 text-rose-600 shrink-0">
              <Youtube className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="text-sm font-black text-slate-900 truncate">{selectedVideoForPlayer.title}</h3>
              <span className="text-[11px] text-slate-500 font-medium">
                {selectedVideoForPlayer.targetClass} • {selectedVideoForPlayer.subject} • By {selectedVideoForPlayer.instructor}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={selectedVideoForPlayer.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => setSelectedVideoForPlayer(null)}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative w-full aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${selectedVideoForPlayer.youtubeId}?autoplay=1&rel=0`}
            title={selectedVideoForPlayer.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Bottom Details */}
        <div className="p-5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-slate-600 font-medium">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-[#0066FF]" />
              Duration: {selectedVideoForPlayer.duration}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4 text-slate-400" />
              {selectedVideoForPlayer.views}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {studyMaterials.length > 0 && (
              <button
                onClick={() => {
                  const doc = studyMaterials[0];
                  setSelectedDocForPreview(doc);
                }}
                className="px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 text-[#0066FF] text-xs font-bold flex items-center gap-2 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Open Solved Notes PDF</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
