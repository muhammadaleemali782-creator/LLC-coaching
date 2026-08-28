import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdPlacement, Advertisement } from '../../types';
import { Sparkles, ExternalLink, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

interface AdBannerProps {
  placement: AdPlacement;
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ placement, className = '' }) => {
  const { ads, trackAdClick, navigateTo } = useApp();

  // Find active ads for this slot
  const matchingAds = ads.filter(a => a.placement === placement && a.isActive);
  if (matchingAds.length === 0) return null;

  const ad: Advertisement = matchingAds[0];

  const handleClick = (e: React.MouseEvent) => {
    trackAdClick(ad.id);
    if (ad.destinationUrl.startsWith('#')) {
      e.preventDefault();
      const targetId = ad.destinationUrl.substring(1);
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      } else if (targetId === 'admission-section') {
        navigateTo('admission', 'admission-section');
      } else if (targetId === 'courses-section') {
        navigateTo('courses', 'courses-section');
      }
    } else {
      window.open(ad.destinationUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // 1. HERO TOP ADVERTISEMENT (Rendered right inside Hero Section)
  if (placement === 'hero_top') {
    return (
      <div className={`w-full max-w-2xl mx-auto my-3 ${className}`}>
        <div
          onClick={handleClick}
          className="relative group bg-gradient-to-r from-blue-900/90 via-slate-900/95 to-indigo-950/90 border border-blue-400/40 hover:border-amber-400 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer overflow-hidden backdrop-blur-md"
        >
          {/* Glowing Ambient Light */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/15 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform" />
          <div className="absolute -bottom-8 -left-8 w-28 h-28 bg-blue-500/20 rounded-full blur-xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-sm">
                  <Flame className="w-3 h-3 fill-slate-950 text-slate-950" />
                  <span>{ad.badge || 'PROMOTED SPONSOR'}</span>
                </span>
                <span className="text-[10px] text-blue-200/80 font-mono hidden sm:inline">
                  Verified by L.C.C.
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors leading-tight">
                {ad.title}
              </h4>
              
              {ad.description && (
                <p className="text-[11px] sm:text-xs text-slate-300 leading-snug font-medium line-clamp-1">
                  {ad.description}
                </p>
              )}
            </div>

            {/* Action CTA Button */}
            <div className="shrink-0 w-full sm:w-auto pt-1 sm:pt-0">
              <button className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md group-hover:scale-105 transition-transform">
                <span>Claim Offer</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. BETWEEN SECTIONS & STUDY VAULT ADVERTISEMENT
  return (
    <div className={`max-w-7xl mx-auto my-8 px-3 sm:px-6 ${className}`}>
      <div
        onClick={handleClick}
        className="relative group bg-gradient-to-r from-slate-900 via-[#003399] to-slate-900 rounded-3xl border border-blue-400/30 hover:border-amber-400 p-5 sm:p-8 shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden text-white"
      >
        <div className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay" style={{ backgroundImage: `url(${ad.imageUrl})` }} />
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3 fill-slate-950" />
              <span>{ad.badge || 'OFFICIAL SPONSORSHIP'}</span>
            </span>
            <h3 className="text-lg sm:text-2xl font-black tracking-tight text-white group-hover:text-amber-300 transition-colors">
              {ad.title}
            </h3>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-medium">
              {ad.description}
            </p>
          </div>

          <button className="px-6 py-3.5 rounded-2xl bg-white hover:bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-2 shrink-0 group-hover:scale-105 transition-all">
            <span>Explore Now</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
