import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Award, Download, Lock, X, ChevronLeft, ChevronRight, Maximize2, Shield, Calendar, Tag } from 'lucide-react';
import { normalizeImageUrl } from '../utils/imageCompressor';
import { GalleryItem } from '../types';
import { toast } from 'sonner';

export const GallerySection: React.FC = () => {
  const { galleryItems, isInitialSyncLoading } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'toppers', label: 'Toppers & Awards' },
    { id: 'classroom', label: 'Smart Classrooms & Labs' },
    { id: 'event', label: 'Events & Functions' },
    { id: 'events', label: 'Events (Admin)' },
    { id: 'students', label: 'Student Activities & Debates' }
  ];

  const filteredItems = selectedCategory === 'all'
    ? galleryItems.filter(item => item && (item.imageUrl || item.title))
    : galleryItems.filter(item => item && (item.imageUrl || item.title) && (item.category || '').toLowerCase() === selectedCategory.toLowerCase());

  const activePhoto: GalleryItem | null = activePhotoIndex !== null && filteredItems[activePhotoIndex] ? filteredItems[activePhotoIndex] : null;

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activePhotoIndex === null) return;
      if (e.key === 'Escape') {
        setActivePhotoIndex(null);
      } else if (e.key === 'ArrowLeft') {
        setActivePhotoIndex(prev => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
      } else if (e.key === 'ArrowRight') {
        setActivePhotoIndex(prev => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, filteredItems.length]);

  const handleDownload = async (item: GalleryItem) => {
    if (item.allowDownload === false) {
      toast.error('Admin has restricted download permissions for this photo.', {
        icon: <Lock className="w-4 h-4 text-amber-400" />
      });
      return;
    }

    setIsDownloading(true);
    toast.loading('Preparing high-res photo download...', { id: 'gallery-dl' });
    try {
      const response = await fetch(normalizeImageUrl(item.imageUrl));
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeTitle = (item.title || 'LCC_Campus_Photo').replace(/[^a-zA-Z0-9_-]/g, '_');
      a.download = `${safeTitle}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Photo downloaded successfully!', { id: 'gallery-dl' });
    } catch (err) {
      // Fallback
      window.open(normalizeImageUrl(item.imageUrl), '_blank');
      toast.success('Photo opened in new tab for saving.', { id: 'gallery-dl' });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section id="gallery" className="py-20 bg-gradient-to-b from-[#F0F7FF]/60 via-white to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 mb-4 shadow-sm">
            <Award className="w-4 h-4 text-[#0066FF]" />
            <span className="text-xs font-black tracking-widest text-[#0066FF] uppercase">Campus Moments</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Life at <span className="text-[#0066FF]">L.C.C.</span> Campus
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium">
            Explore our state-of-the-art facilities, classroom environments, top students, and student events. Click any photo to view full size.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                setActivePhotoIndex(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skeleton Shimmer Loading or Gallery Grid */}
        {isInitialSyncLoading && filteredItems.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(n => (
              <div key={n} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="h-56 sm:h-64 skeleton-shimmer" />
                <div className="p-6 space-y-3">
                  <div className="h-4 rounded-md skeleton-shimmer w-4/5" />
                  <div className="h-3 rounded skeleton-shimmer w-3/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setActivePhotoIndex(index)}
                style={{ animationDelay: `${index * 80}ms` }}
                className="bg-[#F8FAFC] border border-slate-200/90 rounded-3xl overflow-hidden shadow-card-clean hover:shadow-learner-lg transition-all duration-500 transform hover:-translate-y-2 group animate-in fade-in slide-in-from-left-6 cursor-pointer relative"
              >
                <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-200">
                  <img
                    src={normalizeImageUrl(item.imageUrl)}
                    alt={item.title || 'Campus Moment'}
                    loading="lazy"
                    decoding="async"
                    onContextMenu={e => e.preventDefault()}
                    onDragStart={e => e.preventDefault()}
                    onError={(e: any) => { e.target.style.display = 'none'; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95 protected-media select-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  {/* Hover Quick Zoom Cue */}
                  <div className="absolute inset-0 bg-blue-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                    <span className="px-4 py-2 rounded-xl bg-white/95 text-slate-900 text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-xl transform scale-95 group-hover:scale-100 transition-transform">
                      <Maximize2 className="w-4 h-4 text-[#0066FF]" />
                      <span>View Full Size</span>
                    </span>
                  </div>

                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#0066FF] text-[11px] font-black uppercase tracking-wider shadow-sm">
                    {(item.category || 'CAMPUS').toUpperCase()}
                  </span>

                  <span className="absolute bottom-3.5 right-3.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[11px] font-mono font-bold">
                    {item.date}
                  </span>

                  {item.allowDownload === false && (
                    <span className="absolute top-3.5 right-3.5 p-1.5 rounded-lg bg-black/70 backdrop-blur-md text-amber-300 shadow-sm" title="Download protected by Admin">
                      <Lock className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-2 bg-white">
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0066FF] transition-colors leading-snug line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 font-medium">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* High-Resolution Fullscreen Lightbox Modal */}
        {activePhoto && (
          <div
            id="lightbox-modal"
            className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-xl flex flex-col justify-between animate-in fade-in duration-200"
            onClick={e => {
              if (e.target === e.currentTarget) setActivePhotoIndex(null);
            }}
          >
            {/* Top Toolbar */}
            <div className="w-full px-4 sm:px-6 py-4 flex items-center justify-between border-b border-neutral-800/80 bg-neutral-950/60 backdrop-blur-md z-20">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-400 text-xs font-black uppercase tracking-wider">
                  {activePhoto.category || 'CAMPUS'}
                </span>
                <span className="text-xs text-neutral-400 font-medium flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  {activePhoto.date}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-neutral-800 text-[11px] font-mono text-neutral-400">
                  {activePhotoIndex! + 1} of {filteredItems.length}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Download Action */}
                {activePhoto.allowDownload !== false ? (
                  <button
                    onClick={() => handleDownload(activePhoto)}
                    disabled={isDownloading}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer transition-all disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">{isDownloading ? 'Downloading...' : 'Download High-Res'}</span>
                    <span className="sm:hidden">Download</span>
                  </button>
                ) : (
                  <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Download Restricted</span>
                  </div>
                )}

                {/* Close Button */}
                <button
                  onClick={() => setActivePhotoIndex(null)}
                  className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 hover:text-white cursor-pointer transition-colors"
                  title="Close (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Center Image Canvas with Navigation Arrows */}
            <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden select-none">
              {/* Previous Photo Button */}
              <button
                onClick={e => {
                  e.stopPropagation();
                  setActivePhotoIndex(prev => (prev !== null && prev > 0 ? prev - 1 : filteredItems.length - 1));
                }}
                className="absolute left-3 sm:left-6 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-neutral-700 text-white cursor-pointer transition-all shadow-xl hover:scale-105"
                title="Previous Photo (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Protected Image Display */}
              <div className="relative max-w-full max-h-[75vh] flex items-center justify-center">
                <img
                  src={normalizeImageUrl(activePhoto.imageUrl)}
                  alt={activePhoto.title}
                  onContextMenu={e => e.preventDefault()}
                  onDragStart={e => e.preventDefault()}
                  className="max-h-[72vh] max-w-[92vw] sm:max-w-[85vw] object-contain rounded-2xl shadow-2xl border border-neutral-800 protected-media select-none pointer-events-auto"
                />

                {/* Anti-Scrape Watermark / DRM Overlay */}
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-neutral-700/60 text-[10px] text-neutral-300 font-mono flex items-center gap-1.5 pointer-events-none select-none">
                  <Shield className="w-3 h-3 text-blue-400" />
                  <span>Learning Coaching Center (L.C.C.) Official</span>
                </div>
              </div>

              {/* Next Photo Button */}
              <button
                onClick={e => {
                  e.stopPropagation();
                  setActivePhotoIndex(prev => (prev !== null && prev < filteredItems.length - 1 ? prev + 1 : 0));
                }}
                className="absolute right-3 sm:right-6 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-neutral-700 text-white cursor-pointer transition-all shadow-xl hover:scale-105"
                title="Next Photo (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Caption Bar */}
            <div className="w-full px-6 py-4 bg-neutral-950/90 border-t border-neutral-800/80 backdrop-blur-md text-center max-w-4xl mx-auto rounded-t-3xl shadow-2xl z-20 space-y-1">
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                {activePhoto.title}
              </h3>
              {activePhoto.description && (
                <p className="text-xs sm:text-sm text-neutral-400 max-w-2xl mx-auto leading-relaxed">
                  {activePhoto.description}
                </p>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
