import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, MessageCircle, ExternalLink, Sparkles, Play } from 'lucide-react';
import { Instagram } from './SocialIcons';

export const InstagramSection: React.FC = () => {
  const { instagramPosts, socialLinks } = useApp();

  const igUrl = socialLinks.find(s => s.platform === 'instagram')?.url || 'https://instagram.com';

  const enrichedPosts = instagramPosts.map(post => {
    if (post.id === 'insta-3' || (post.title || '').toLowerCase().includes('debate') || post.imageUrl.includes('moss') || post.imageUrl.includes('forest')) {
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
            <span>Campus Life & Highlights</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Follow Us on <span className="text-[#0066FF]">Instagram</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
            Daily classroom activities, topper ceremonies, English speech snippets, and student celebrations.
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {enrichedPosts.map((post) => (
            <a
              key={post.id}
              href={post.postUrl || igUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-card-clean hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col group cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden bg-slate-900">
                <img
                  src={post.imageUrl}
                  alt={post.title || post.caption || 'LCC Instagram Post'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white">
                    <ExternalLink className="w-5 h-5" />
                  </span>
                </div>

                {post.type === 'reel' && (
                  <span className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 text-white backdrop-blur-sm">
                    <Play className="w-3.5 h-3.5 fill-white" />
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-slate-700 font-bold line-clamp-2 leading-relaxed">
                  {post.title || post.caption}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-pink-600 font-bold">
                      <Heart className="w-3.5 h-3.5 fill-pink-600" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {post.comments}
                    </span>
                  </div>
                  <span>{post.date}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom Instagram CTA */}
        <div className="mt-12 text-center">
          <a
            href={igUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-lg hover:opacity-95 transition-all"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow @lcc_coaching_official</span>
          </a>
        </div>

      </div>
    </section>
  );
};
