import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, MessageCircle, ExternalLink, Sparkles, Play } from 'lucide-react';
import { Instagram } from './SocialIcons';

export const InstagramSection: React.FC = () => {
  const { instagramPosts } = useApp();

  const enrichedPosts = instagramPosts.map(post => {
    if (post.id === 'insta-3' || post.title.toLowerCase().includes('debate') || post.imageUrl.includes('moss') || post.imageUrl.includes('forest')) {
      return {
        ...post,
        imageUrl: '/assets/debate.jpg'
      };
    }
    return post;
  });

  return (
    <section id="instagram-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-t border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 text-pink-600 text-xs font-black uppercase tracking-wider mb-3">
            <Instagram className="w-4 h-4" />
            <span>@lcc_official_classes</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Campus Life, Reels & <span className="text-[#0066FF]">Student Moments</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
            Join our energetic community on Instagram. Catch daily experiment reels, debate snippets, celebration vlogs, and classroom BTS!
          </p>
        </div>

        {/* Reels & Posts Grid with Left-to-Right Stagger */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {enrichedPosts.map((post, idx) => (
            <a
              key={post.id}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              style={{ animationDelay: `${idx * 100}ms` }}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-card-clean hover:shadow-learner-lg transition-all duration-300 transform hover:-translate-y-2 flex flex-col group animate-in fade-in slide-in-from-left-6"
            >
              {/* Media Preview */}
              <div className="relative h-64 overflow-hidden bg-slate-900">
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Reel Badge */}
                {post.type === 'reel' && (
                  <span className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/60 backdrop-blur-md text-white shadow-sm">
                    <Play className="w-3.5 h-3.5 fill-white" />
                  </span>
                )}

                {/* Likes & Comments Counters */}
                <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-white text-xs font-bold font-mono">
                  <div className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-lg backdrop-blur-sm">
                    <MessageCircle className="w-3.5 h-3.5 text-white" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs font-extrabold text-slate-800 line-clamp-2 leading-relaxed group-hover:text-[#0066FF] transition-colors">
                  {post.title}
                </p>
                
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-medium">
                  <span>{post.date}</span>
                  <span className="text-[#0066FF] font-bold group-hover:underline flex items-center gap-1">
                    <span>View Post</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Follow on Instagram Banner */}
        <div className="mt-12 text-center">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-500/25 hover:opacity-95 transition-all"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow @lcc_official_classes on Instagram</span>
          </a>
        </div>

      </div>
    </section>
  );
};
