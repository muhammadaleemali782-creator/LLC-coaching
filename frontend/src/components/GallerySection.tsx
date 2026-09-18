import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Award } from 'lucide-react';

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

  const filteredItems = galleryItems.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <section id="gallery-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 text-[#0066FF] text-xs font-black uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Memories & Wall of Fame</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Campus Gallery & <span className="text-[#0066FF]">Student Life</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
            Glance through our annual felicitation galas, stage debates, science practical experiments, modern computer labs, and celebrations of merit.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-md shadow-blue-500/20 scale-105'
                  : 'bg-[#F8FAFC] text-slate-700 border-slate-200/80 hover:bg-slate-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skeleton shimmer while DB loads */}
        {isInitialSyncLoading && filteredItems.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="rounded-3xl border border-slate-200 overflow-hidden">
                <div className="h-56 sm:h-64 skeleton-shimmer" />
                <div className="p-6 space-y-2 bg-white">
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
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    onError={(e: any) => { e.target.style.display = 'none'; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#0066FF] text-[11px] font-black uppercase tracking-wider shadow-sm">
                    {item.category.toUpperCase()}
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
