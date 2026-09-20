import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Award } from 'lucide-react';
import { normalizeImageUrl } from '../utils/imageCompressor';

export const GallerySection: React.FC = () => {
  const { galleryItems, isInitialSyncLoading } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
            Explore our state-of-the-art facilities, classroom environments, top students, and student events.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
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
                style={{ animationDelay: `${index * 100}ms` }}
                className="bg-[#F8FAFC] border border-slate-200/90 rounded-3xl overflow-hidden shadow-card-clean hover:shadow-learner-lg transition-all duration-500 transform hover:-translate-y-2 group animate-in fade-in slide-in-from-left-6"
              >
                <div className="relative h-56 sm:h-64 overflow-hidden bg-slate-200">
                  <img
                    src={normalizeImageUrl(item.imageUrl)}
                    alt={item.title || 'Campus Moment'}
                    loading="lazy"
                    decoding="async"
                    onError={(e: any) => { e.target.style.display = 'none'; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#0066FF] text-[11px] font-black uppercase tracking-wider shadow-sm">
                    {(item.category || 'CAMPUS').toUpperCase()}
                  </span>

                  <span className="absolute bottom-3.5 right-3.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[11px] font-mono font-bold">
                    {item.date}
                  </span>
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

      </div>
    </section>
  );
};
