import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CourseCategory, Course } from '../types';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Laptop,
  MessageCircle,
  Clock,
  Star,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

export const CourseSection: React.FC = () => {
  const { courses, navigateTo, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: { id: string; label: string; icon: string }[] = [
    { id: 'all', label: 'All Courses', icon: '✨' },
    { id: 'primary', label: 'Class 1–5', icon: '🎒' },
    { id: 'middle', label: 'Class 6–8', icon: '📖' },
    { id: 'secondary', label: 'Class 9–10', icon: '📐' },
    { id: 'senior', label: 'Class 11–12', icon: '🔬' },
    { id: 'computer', label: 'Computer DCA', icon: '💻' },
    { id: 'spoken', label: 'Spoken English', icon: '🗣️' }
  ];

  // Guaranteed authentic images
  const enrichedCourses = courses.map(c => {
    if (c.id === 'c-english-fluency' || c.category === 'spoken' || c.title.toLowerCase().includes('spoken') || c.image.includes('forest') || c.image.includes('moss')) {
      return {
        ...c,
        image: '/assets/debate.jpg'
      };
    }
    return c;
  });

  const filteredCourses = enrichedCourses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.targetClass.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleEnroll = (course: Course) => {
    showToast(`Opening admission desk for ${course.title}`, 'info');
    navigateTo('admission', 'admission-section');
  };

  return (
    <section id="courses-section" className="py-16 sm:py-20 px-3 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-theme-light text-theme-primary text-xs font-black uppercase tracking-wider mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Programs 2026-27</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
            Explore <span className="text-theme-primary">Top-Rated Coaching Courses</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-base leading-relaxed font-medium">
            From foundational school classes to advanced DCA diplomas and fluent English speaking.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mb-8">
          <input
            type="text"
            placeholder="Search courses, classes, subjects..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-5 py-3 rounded-full bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-theme-primary shadow-xs"
          />
        </div>

        {/* Smooth Left-to-Right Continuous Sliding Category Carousel */}
        <div className="relative mb-12 overflow-hidden py-2">
          
          {/* Visual Track Container with Left-to-Right Flow */}
          <div className="flex items-center gap-3 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    showToast(`Filtering: ${cat.label}`, 'info');
                  }}
                  className={`px-5 py-3.5 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all duration-300 flex items-center gap-2 shrink-0 snap-center shadow-card-clean border ${
                    isSelected
                      ? 'bg-theme-primary text-white border-theme-primary shadow-lg shadow-blue-500/25 scale-105'
                      : 'bg-white text-slate-700 border-slate-200/90 hover:border-theme-primary hover:bg-theme-light'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Left-to-Right Infinite Ticker Badges Strip */}
          <div className="overflow-hidden mt-4 pt-2 border-t border-slate-100">
            <div className="animate-marquee-left flex items-center gap-6 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 shrink-0">
                ✨ CBSE & State Board Syllabus
              </span>
              <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 shrink-0">
                💻 1:1 Computer DCA / ADCA Lab
              </span>
              <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 shrink-0">
                🗣️ Daily Stage Speech & Debate
              </span>
              <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 shrink-0">
                🏆 98.6% Board Examination Success
              </span>
              <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 shrink-0">
                👨‍🏫 Mentor: Aman Arora
              </span>
              {/* Loop Duplicate */}
              <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 shrink-0">
                ✨ CBSE & State Board Syllabus
              </span>
              <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 shrink-0">
                💻 1:1 Computer DCA / ADCA Lab
              </span>
              <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 shrink-0">
                🗣️ Daily Stage Speech & Debate
              </span>
              <span className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-200 shrink-0">
                🏆 98.6% Board Examination Success
              </span>
            </div>
          </div>

        </div>

        {/* Course Cards Grid with Live State Filtering */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCourses.map((course, idx) => (
            <div
              key={course.id}
              style={{ animationDelay: `${idx * 80}ms` }}
              className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-card-clean hover:shadow-learner-lg transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col group animate-in fade-in slide-in-from-bottom-4"
            >
              {/* Image & Price Badge */}
              <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-900">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {course.badge && (
                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-sm">
                    {course.badge}
                  </span>
                )}

                <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-theme-primary text-white text-xs font-black shadow-sm">
                  ₹{course.discountFee}
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-medium">
                  <span className="bg-black/60 px-2.5 py-1 rounded-lg backdrop-blur-sm text-[11px] font-mono">
                    {course.targetClass}
                  </span>
                  <div className="flex items-center gap-1 bg-amber-400/90 text-slate-950 px-2 py-0.5 rounded-lg text-[11px] font-black">
                    <Star className="w-3 h-3 fill-slate-950" />
                    <span>4.9</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-theme-primary transition-colors leading-snug line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium mt-1.5 line-clamp-2">
                    {course.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  {course.features.slice(0, 3).map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-theme-primary shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom Enroll & Details */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block line-through">₹{course.fee}</span>
                    <span className="text-sm sm:text-base font-black text-slate-900">₹{course.discountFee}</span>
                  </div>

                  <button
                    onClick={() => handleEnroll(course)}
                    className="px-5 py-2.5 rounded-full bg-theme-primary hover:opacity-95 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
                  >
                    <span>Enroll Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="p-12 bg-slate-50 rounded-3xl border border-slate-200 text-center space-y-3">
            <p className="text-slate-500 text-sm font-medium">No courses found matching your filter.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 bg-theme-primary text-white text-xs font-bold rounded-full"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
