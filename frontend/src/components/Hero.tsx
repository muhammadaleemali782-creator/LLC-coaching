import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Star,
  FileText,
  Clock,
  PhoneCall,
  Flame
} from 'lucide-react';
import { AdBanner } from './ads/AdBanner';
import { ADMIN_GALLERY_ITEMS } from '../data/adminGallery';

export const Hero: React.FC = () => {
  const { navigateTo, setIsStudentAuthModalOpen, websiteSettings, galleryItems, courses } = useApp();

  // Slide Images strictly using official Admin-uploaded Gallery items only
  const sourceGallery = (galleryItems && galleryItems.length > 0) ? galleryItems : ADMIN_GALLERY_ITEMS;
  const slides = sourceGallery.map(g => ({
    id: g.id,
    imageUrl: g.imageUrl,
    title: g.title,
    subtitle: g.description || 'L.C.C. Official Campus Event',
    tag: (g.category || 'CAMPUS').toUpperCase()
  }));

  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide transition every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length);
  };

  const instituteFullName = websiteSettings?.instituteName || 'Learning Coaching Center (L.C.C.)';
  const directorName = websiteSettings?.directorName || 'Aman Singh Gautam';

  return (
    <section className="bg-slate-100/70 border-b border-slate-200/90 pb-8 sm:pb-12 pt-3 sm:pt-4 px-2 sm:px-4 lg:px-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">

        {/* PHYSICS WALLAH (PW) STYLE QUICK LEARNING HUB (Mobile-First 4x2 Grid) */}
        <div className="lg:hidden bg-white dark:bg-slate-900 rounded-2xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-2.5 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              <span className="p-1 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-[#0066FF] dark:text-blue-400">⚡</span>
              <span>Learning Hub</span>
            </div>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Batches
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { label: 'Batches', icon: '🎯', desc: 'Classes 1–12', onClick: () => navigateTo('batches', 'batches-section'), color: 'from-amber-400 to-orange-500' },
              { label: 'Study Vault', icon: '📚', desc: 'Free Notes', onClick: () => navigateTo('study-material', 'study-material-section'), color: 'from-blue-500 to-indigo-600' },
              { label: 'Syllabus', icon: '📝', desc: 'Exam Topics', onClick: () => navigateTo('syllabus', 'syllabus-section'), color: 'from-emerald-400 to-teal-600' },
              { label: 'Classes', icon: '🎥', desc: 'Lectures', onClick: () => navigateTo('videos', 'videos-section'), color: 'from-rose-500 to-red-600' },
              { label: 'Notices', icon: '📢', desc: 'Exams & News', onClick: () => navigateTo('notices', 'notices-section'), color: 'from-purple-500 to-violet-600' },
              { label: 'Toppers', icon: '🏆', desc: 'Merit List', onClick: () => navigateTo('reviews', 'reviews-section'), color: 'from-yellow-400 to-amber-600' },
              { label: 'Gurus', icon: '👨‍🏫', desc: 'Faculty Team', onClick: () => navigateTo('home', 'about-section'), color: 'from-cyan-500 to-blue-600' },
              { label: 'Ask Doubt', icon: '💬', desc: '1:1 WhatsApp', onClick: () => window.open(`https://wa.me/919250703092`, '_blank'), color: 'from-emerald-500 to-green-600' }
            ].map((tile, i) => (
              <button
                key={i}
                type="button"
                onClick={tile.onClick}
                className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all border border-slate-100 dark:border-slate-800/80 active:scale-95 group cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${tile.color} text-white flex items-center justify-center text-lg shadow-sm group-hover:scale-105 transition-transform`}>
                  <span>{tile.icon}</span>
                </div>
                <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 mt-1.5 leading-tight truncate w-full">
                  {tile.label}
                </span>
                <span className="text-[9px] font-medium text-slate-400 dark:text-slate-400 leading-none truncate w-full mt-0.5">
                  {tile.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* UNIVERSITY SLIDER + QUICK LINKS + DIRECTOR SIDEBAR GRID (CUSTOMIZABLE & RESHUFFLEABLE) */}
        {(() => {
          const heroColumnsOrder = (websiteSettings?.heroColumnsOrder && websiteSettings.heroColumnsOrder.length > 0)
            ? websiteSettings.heroColumnsOrder
            : ['quick-links', 'slider', 'leadership'];

          const columnMap: Record<string, React.ReactNode> = {
            'quick-links': (
              <div key="quick-links" id="hero-quick-links-box" className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 sm:p-4 flex flex-col justify-between space-y-3 transition-colors">
                <div>
                  <div id="hero-quick-links-header" className="bg-[#0B3B95] text-white px-3 py-2 rounded-xl flex items-center justify-between mb-3 shadow-xs transition-colors">
                    <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-300" />
                      Quick Links
                    </span>
                    <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded">NEW</span>
                  </div>

                  <ul className="space-y-1.5 sm:space-y-2 text-xs font-bold text-slate-700">
                    <li>
                      <button
                        onClick={() => navigateTo('admission', 'admission-section')}
                        className="w-full text-left px-3 py-2 sm:py-2.5 rounded-xl hover:bg-blue-50 hover:text-[#0B3B95] transition-colors flex items-center justify-between border border-slate-100 bg-slate-50/80 active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-blue-600 text-base shrink-0">🏛️</span>
                          <span className="font-bold text-[11px] sm:text-xs text-slate-800 leading-tight">Admissions Open 2026-27</span>
                        </div>
                        <span className="text-[9px] font-black text-blue-600 shrink-0 bg-blue-100/70 px-1.5 py-0.5 rounded ml-1">Open</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => navigateTo('courses', 'courses-section')}
                        className="w-full text-left px-3 py-2 sm:py-2.5 rounded-xl hover:bg-blue-50 hover:text-[#0B3B95] transition-colors flex items-center justify-between border border-slate-100 bg-slate-50/80 active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-emerald-600 text-base shrink-0">📚</span>
                          <span className="font-bold text-[11px] sm:text-xs text-slate-800 leading-tight">Classes 1–12 School Batches</span>
                        </div>
                        <span className="text-[9px] font-black text-emerald-700 shrink-0 bg-emerald-100/70 px-1.5 py-0.5 rounded ml-1">Live</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => navigateTo('courses', 'courses-section')}
                        className="w-full text-left px-3 py-2 sm:py-2.5 rounded-xl hover:bg-blue-50 hover:text-[#0B3B95] transition-colors flex items-center justify-between border border-slate-100 bg-slate-50/80 active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-purple-600 text-base shrink-0">💻</span>
                          <span className="font-bold text-[11px] sm:text-xs text-slate-800 leading-tight">Computer DCA / ADCA Diploma</span>
                        </div>
                        <span className="text-[9px] font-black text-purple-700 shrink-0 bg-purple-100/70 px-1.5 py-0.5 rounded ml-1">Govt</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => navigateTo('courses', 'courses-section')}
                        className="w-full text-left px-3 py-2 sm:py-2.5 rounded-xl hover:bg-blue-50 hover:text-[#0B3B95] transition-colors flex items-center justify-between border border-slate-100 bg-slate-50/80 active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-amber-600 text-base shrink-0">🗣️</span>
                          <span className="font-bold text-[11px] sm:text-xs text-slate-800 leading-tight">Fluent Spoken English Course</span>
                        </div>
                        <span className="text-[9px] font-black text-amber-700 shrink-0 bg-amber-100/70 px-1.5 py-0.5 rounded ml-1">Basic</span>
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => navigateTo('study-material', 'study-material-section')}
                        className="w-full text-left px-3 py-2 sm:py-2.5 rounded-xl hover:bg-blue-50 hover:text-[#0B3B95] transition-colors flex items-center justify-between border border-slate-100 bg-slate-50/80 active:scale-[0.99]"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="text-rose-600 text-base shrink-0">📥</span>
                          <span className="font-bold text-[11px] sm:text-xs text-slate-800 leading-tight">Official Study Notes & PDF Books</span>
                        </div>
                        <span className="text-[9px] font-black text-rose-700 shrink-0 bg-rose-100/70 px-1.5 py-0.5 rounded ml-1">Free</span>
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Helpline Box */}
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-center">
                  <span className="text-[10px] font-black text-amber-900 block uppercase">Director Helpline</span>
                  <a href={`tel:${websiteSettings?.contactPhone || '+91 9250703092'}`} className="text-xs font-black text-[#0B3B95] hover:underline block mt-0.5">
                    {websiteSettings?.contactPhone || '+91 9250703092'}
                  </a>
                </div>
              </div>
            ),
            'slider': (
              <div key="slider" id="hero-slider-box" className="lg:col-span-6 relative rounded-2xl overflow-hidden border-2 border-slate-300 shadow-md bg-slate-950 flex flex-col justify-end min-h-[300px] sm:min-h-[380px] lg:min-h-[420px] transition-colors">
                {/* Slide Images */}
                {slides.map((slide, idx) => (
                  <div
                    key={slide.id}
                    className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                      idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                    }`}
                  >
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                  </div>
                ))}

                {/* Slider Caption Overlay */}
                <div className="relative z-20 p-4 sm:p-6 text-white space-y-1 sm:space-y-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    {slides[currentSlide]?.tag}
                  </span>
                  <h3 className="text-sm sm:text-lg lg:text-xl font-black text-white leading-snug drop-shadow-md">
                    {slides[currentSlide]?.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-1 font-medium hidden sm:block">
                    {slides[currentSlide]?.subtitle}
                  </p>
                </div>

                {/* Left & Right Arrow Navigation (Like MGKVP buttons) */}
                <button
                  onClick={prevSlide}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all cursor-pointer backdrop-blur-xs border border-white/20"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-all cursor-pointer backdrop-blur-xs border border-white/20"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Dots Indicator */}
                <div className="absolute bottom-2.5 right-4 z-30 flex items-center gap-1.5">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        i === currentSlide ? 'w-6 bg-amber-400' : 'w-2 bg-white/50 hover:bg-white'
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            ),
            'leadership': (
              <div key="leadership" id="hero-leadership-box" className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-3.5 sm:p-4 flex flex-col justify-between space-y-3 transition-colors">
                <div>
                  <div id="hero-leadership-header" className="bg-[#D32F2F] text-white px-3 py-2 rounded-xl flex items-center justify-between mb-3 shadow-xs transition-colors">
                    <span className="text-xs font-black uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-300" />
                      Leadership
                    </span>
                    <span className="text-[10px] bg-white text-[#D32F2F] font-black px-1.5 py-0.5 rounded">DIRECTOR</span>
                  </div>

                  {/* Director Card */}
                  <div className="text-center space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="w-24 h-24 mx-auto rounded-xl overflow-hidden border-2 border-[#0B3B95] shadow-md bg-slate-900">
                      <img
                        src={websiteSettings?.visualOverrides?.['div#hero-leadership-box > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > img:nth-of-type(1)']?.value || websiteSettings?.directorPhotoUrl || "/assets/founder.png"}
                        alt={directorName}
                        decoding="async"
                        onContextMenu={(e: any) => e.preventDefault()}
                        onDragStart={(e: any) => e.preventDefault()}
                        onError={(e: any) => {
                          e.target.src = '/assets/founder.png';
                        }}
                        className="w-full h-full object-cover object-top protected-media select-none"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 leading-tight">{directorName}</h4>
                      <p className="text-[11px] font-bold text-[#0B3B95]">Director & Founder</p>
                      <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-snug">
                        Lead Academic Mentor & Student Career Counselor
                      </p>
                    </div>
                  </div>

                  {/* Message excerpt */}
                  <div className="mt-2.5 p-2 bg-blue-50/60 rounded-lg border border-blue-100 text-[11px] text-slate-700 leading-relaxed italic">
                    "Our single focus is conceptual clarity, 1:1 computer practice, and making every student confident in life."
                  </div>
                </div>

                <button
                  onClick={() => navigateTo('home', 'about-section')}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-[#0B3B95] hover:text-white text-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border border-slate-200"
                >
                  <span>View Profile & Story</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          };

          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
              {heroColumnsOrder.map(colKey => columnMap[colKey] || null)}
            </div>
          );
        })()}

      </div>
    </section>
  );
};
