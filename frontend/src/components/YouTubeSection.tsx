import React from 'react';
import { useApp } from '../context/AppContext';
import { Play, Clock, Eye, ExternalLink, Sparkles } from 'lucide-react';
import { Youtube } from './SocialIcons';

export const YouTubeSection: React.FC = () => {
  const { videos, setSelectedVideoForPlayer } = useApp();

  return (
    <section id="youtube-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-600 text-xs font-black uppercase tracking-wider mb-3">
              <Youtube className="w-3.5 h-3.5" />
              <span>Official Video Lectures</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Free YouTube <span className="text-rose-600">Video Marathons</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 font-medium">
              Watch full chapter concept boosters, derivation marathons, and board exam solutions by Aman Arora and expert faculty.
            </p>
          </div>

          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-rose-500/20 flex items-center gap-2 transition-all self-start md:self-auto shrink-0"
          >
            <Youtube className="w-4 h-4" />
            <span>Visit YouTube Channel</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map(vid => (
            <div
              key={vid.id}
              onClick={() => setSelectedVideoForPlayer(vid)}
              className="bg-white border border-slate-200/90 hover:border-rose-300 rounded-3xl overflow-hidden shadow-card-clean hover:shadow-learner-lg transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-900">
                <img
                  src={vid.thumbnail}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-rose-600 transition-all">
                    <Play className="w-6 h-6 fill-current ml-0.5" />
                  </div>
                </div>

                <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/80 text-white text-[11px] font-mono font-bold flex items-center gap-1">
                  <Clock className="w-3 h-3 text-rose-400" />
                  {vid.duration}
                </span>

                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white text-rose-600 text-xs font-black shadow-sm">
                  {vid.targetClass}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black text-rose-600 uppercase tracking-wider mb-2 block">
                    {vid.subject}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mb-3 line-clamp-2 leading-snug group-hover:text-rose-600 transition-colors">
                    {vid.title}
                  </h3>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="font-bold text-slate-700">By {vid.instructor}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {vid.views}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
