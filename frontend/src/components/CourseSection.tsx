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
  Edit3,
  X,
  Save
} from 'lucide-react';

export const CourseSection: React.FC = () => {
  const { courses, updateCourse, isAdminAuthenticated, navigateTo, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

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
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 text-xs font-black uppercase tracking-wider mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Academic Programs 2026-27</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
            Explore <span className="text-[#0066FF]">Top-Rated Coaching Courses</span>
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
            className="w-full px-5 py-3 rounded-full bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0066FF] shadow-xs"
          />
        </div>

        {/* 1. TOP LINE: Clean, Native, Butter-Smooth Horizontal Swipe Rail (Never disappears, zero blank gaps) */}
        <div className="relative mb-6">
          <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x px-1 select-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    showToast(`Filtering: ${cat.label}`, 'info');
                  }}
                  className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all duration-200 flex items-center gap-2 shrink-0 snap-start shadow-card-clean border cursor-pointer ${
                    isSelected
                      ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-lg shadow-blue-500/25 scale-105'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-[#0066FF] hover:bg-blue-50'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. BOTTOM LINE: Smooth Auto-Gliding Infinite Trust Ticker Rail */}
        <div className="overflow-hidden mb-12 py-2 border-y border-slate-100 bg-slate-50/60 rounded-2xl">
          <div className="animate-marquee-slow flex items-center gap-6 text-xs font-bold text-slate-600 whitespace-nowrap">
            <span className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200 shrink-0 shadow-2xs">
              ✨ CBSE & State Board Syllabus
            </span>
            <span className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200 shrink-0 shadow-2xs">
              💻 1:1 Computer DCA / ADCA Lab
            </span>
            <span className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200 shrink-0 shadow-2xs">
              🗣️ Daily Stage Speech & Debate
            </span>
            <span className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200 shrink-0 shadow-2xs">
              🏆 98.6% Board Examination Success
            </span>
            <span className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200 shrink-0 shadow-2xs">
              👨‍🏫 Mentor: Aman Arora
            </span>
            {/* Loop Duplicate for Seamless Marquee */}
            <span className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200 shrink-0 shadow-2xs">
              ✨ CBSE & State Board Syllabus
            </span>
            <span className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200 shrink-0 shadow-2xs">
              💻 1:1 Computer DCA / ADCA Lab
            </span>
            <span className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200 shrink-0 shadow-2xs">
              🗣️ Daily Stage Speech & Debate
            </span>
            <span className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200 shrink-0 shadow-2xs">
              🏆 98.6% Board Examination Success
            </span>
            <span className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-slate-200 shrink-0 shadow-2xs">
              👨‍🏫 Mentor: Aman Arora
            </span>
          </div>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCourses.map((course, idx) => (
            <div
              key={course.id}
              style={{ animationDelay: `${idx * 80}ms` }}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl overflow-hidden shadow-card-clean hover:shadow-learner-lg transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col group animate-in fade-in slide-in-from-bottom-4 relative"
            >
              {/* Admin In-Card Edit Pencil */}
              {isAdminAuthenticated && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingCourse({ ...course });
                  }}
                  className="absolute top-3.5 right-20 z-20 p-2 rounded-full bg-amber-400 text-slate-950 font-black shadow-lg hover:scale-110 transition-transform cursor-pointer"
                  title="Director: Edit this Course"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}

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

                <div className="absolute top-3.5 right-3.5 px-3 py-1 rounded-full bg-[#0066FF] text-white text-xs font-black shadow-sm">
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
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-[#0066FF] transition-colors leading-snug line-clamp-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium mt-1.5 line-clamp-2">
                    {course.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                  {course.features.slice(0, 3).map((feat, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0066FF] shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom Enroll & Details */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] text-slate-400 block line-through">₹{course.fee}</span>
                    <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">₹{course.discountFee}</span>
                  </div>

                  <button
                    onClick={() => handleEnroll(course)}
                    className="px-5 py-2.5 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
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
          <div className="p-12 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <p className="text-slate-500 text-sm font-medium">No courses found matching your filter.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="px-4 py-2 bg-[#0066FF] text-white text-xs font-bold rounded-full cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Live Admin Course Editor Modal */}
        {editingCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="relative w-full max-w-lg bg-slate-950 text-white rounded-3xl border border-slate-800 p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-black uppercase">Edit Course Details (Director Desk)</h3>
                </div>
                <button
                  onClick={() => setEditingCourse(null)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Course Title</label>
                  <input
                    type="text"
                    value={editingCourse.title}
                    onChange={e => setEditingCourse({ ...editingCourse, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Original Fee (₹)</label>
                  <input
                    type="number"
                    value={editingCourse.fee}
                    onChange={e => setEditingCourse({ ...editingCourse, fee: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Discounted Fee (₹)</label>
                  <input
                    type="number"
                    value={editingCourse.discountFee}
                    onChange={e => setEditingCourse({ ...editingCourse, discountFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Course Image URL</label>
                  <input
                    type="text"
                    value={editingCourse.image}
                    onChange={e => setEditingCourse({ ...editingCourse, image: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editingCourse.description}
                    onChange={e => setEditingCourse({ ...editingCourse, description: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    updateCourse(editingCourse);
                    setEditingCourse(null);
                    showToast('Course updated and saved live!', 'success');
                  }}
                  className="px-6 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Live</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
