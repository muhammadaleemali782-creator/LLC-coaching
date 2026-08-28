import React from 'react';
import { useApp } from '../context/AppContext';
import { Play, Clock, Eye, ExternalLink, Sparkles } from 'lucide-react';
import { Youtube, Instagram, Facebook } from './SocialIcons';

export const YouTubeSection: React.FC = () => {
  const { videos, setSelectedVideoForPlayer } = useApp();

  return (
    <section id="videos-section" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 border-t border-slate-200/80 dark:border-slate-800 relative transition-colors">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-black uppercase tracking-wider mb-3">
              <Youtube className="w-3.5 h-3.5" />
              <span>Video Lectures & Viral Reels</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Watch <span className="text-rose-600">Lectures & Short Concept Reels</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-base mt-2 font-medium">
              Watch chapter concept boosters, derivation marathons, and reels by Director Aman Arora across YouTube, Instagram, and Facebook.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-rose-500/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Youtube className="w-4 h-4" />
              <span>YouTube Channel</span>
            </a>
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {videos.map(vid => {
            const platform = vid.platform || (vid.youtubeUrl?.includes('instagram') ? 'instagram' : vid.youtubeUrl?.includes('facebook') ? 'facebook' : 'youtube');

            return (
              <div
                key={vid.id}
                onClick={() => setSelectedVideoForPlayer(vid)}
                className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-500/50 rounded-3xl overflow-hidden shadow-card-clean hover:shadow-learner-lg transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer group flex flex-col justify-between"
              >
                <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-900">
                  <img
                    src={vid.thumbnail}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter brightness-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-all ${
                      platform === 'instagram'
                        ? 'bg-pink-600/90 group-hover:bg-pink-600'
                        : platform === 'facebook'
                        ? 'bg-blue-600/90 group-hover:bg-blue-600'
                        : 'bg-rose-600/90 group-hover:bg-rose-600'
                    }`}>
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </div>

                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-md bg-black/80 text-white text-[11px] font-mono font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3 text-rose-400" />
                    {vid.duration}
                  </span>

                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 text-xs font-black shadow-sm">
                      {vid.targetClass}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase text-white shadow-sm ${
                      platform === 'instagram'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-500'
                        : platform === 'facebook'
                        ? 'bg-blue-600'
                        : 'bg-rose-600'
                    }`}>
                      {platform}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1.5 block">
                      {vid.subject}
                    </span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-3 line-clamp-2 leading-snug group-hover:text-rose-600 transition-colors">
                      {vid.title}
                    </h3>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className="font-bold text-slate-700 dark:text-slate-300">By {vid.instructor}</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {vid.views}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
