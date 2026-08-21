import React from 'react';
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
  PhoneCall,
  Flame,
  Star
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { navigateTo, setIsStudentAuthModalOpen } = useApp();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F4F8FE] via-white to-white pt-8 sm:pt-14 pb-14 px-3 sm:px-6 lg:px-8">
      
      {/* Background Decorative Glow Blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-amber-100/30 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        
        {/* Top Header & Typography */}
        <div className="text-center max-w-4xl mx-auto space-y-4 sm:space-y-6">
          
          {/* 3D Status Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#0066FF] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider">
              INDIA’S TOP RATED COACHING & EDTECH
            </span>
            <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-ping ml-1" />
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Choosing the right coaching course <span className="text-[#0066FF] block sm:inline">for growth</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-600 text-xs sm:text-base leading-relaxed font-medium max-w-2xl mx-auto">
            Join <strong className="text-slate-900 font-extrabold">Lakshya Career Classes (L.C.C.)</strong> for comprehensive school coaching (<strong className="text-slate-900 font-extrabold">Classes 1 to 12</strong>), <strong className="text-slate-900 font-extrabold">Computer DCA / ADCA / Tally</strong>, and <strong className="text-slate-900 font-extrabold">Fluent Spoken English</strong> led by <strong className="text-slate-900 font-extrabold">Aman Arora</strong>.
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
            <button
              onClick={() => navigateTo('courses', 'courses-section')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-95 cursor-pointer"
            >
              <span>EXPLORE ALL COURSES</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigateTo('study-material', 'study-material-section')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-black text-xs uppercase tracking-wider shadow-card-clean transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#0066FF]" />
              <span>FREE STUDY VAULT</span>
            </button>
          </div>

          {/* Trust Points */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-500 font-bold">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>CBSE & State Board</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>100% Practical PC Lab</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span>Doubt Solving Clinics</span>
            </div>
          </div>

        </div>

        {/* Master Hero Visual Showcase */}
        <div className="max-w-5xl mx-auto space-y-4">
          
          {/* Master Poster Frame */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white bg-slate-950">
            <div className="relative aspect-[16/10] sm:aspect-[21/9] w-full overflow-hidden">
              <img
                src="/assets/hero_poster.jpg"
                alt="L.C.C. Academic Excellence Poster"
                className="w-full h-full object-cover filter brightness-95"
              />
            </div>

            {/* Subtle Floating Corner Tags */}
            <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-[10px] font-bold border border-white/20">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>BATCH 2026-27</span>
            </div>

            <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 bg-[#0066FF] text-white text-[11px] font-black px-3.5 py-1.5 rounded-xl shadow-md">
              75% OFF
            </div>
          </div>

          {/* Neatly Separated Founder & Counselor Strip */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-card-clean flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 w-full sm:w-auto">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-300">
                <img
                  src="/assets/founder.png"
                  alt="Aman Arora"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <span className="text-[10px] font-black text-[#0066FF] uppercase tracking-wider block">DIRECTOR & LEAD MENTOR</span>
                <h4 className="text-sm sm:text-base font-black text-slate-900">Aman Arora</h4>
                <p className="text-[11px] text-slate-500 font-medium">Guiding 5,000+ Toppers & Diploma Scholars</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider text-center shadow-sm"
              >
                WhatsApp Counselor
              </a>
              <button
                onClick={() => setIsStudentAuthModalOpen(true)}
                className="flex-1 sm:flex-none px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider text-center transition-colors"
              >
                Portal Login
              </button>
            </div>
          </div>

        </div>

        {/* 4-Item Metric Bottom Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card-clean text-center">
            <span className="text-2xl sm:text-3xl font-black text-[#0066FF] block">5000+</span>
            <span className="text-xs text-slate-600 font-bold mt-0.5 block">Students Mentored</span>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card-clean text-center">
            <span className="text-2xl sm:text-3xl font-black text-emerald-600 block">98.6%</span>
            <span className="text-xs text-slate-600 font-bold mt-0.5 block">Board Exam Pass Rate</span>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card-clean text-center">
            <span className="text-2xl sm:text-3xl font-black text-amber-500 block">100%</span>
            <span className="text-xs text-slate-600 font-bold mt-0.5 block">Practical PC Lab Training</span>
          </div>
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card-clean text-center">
            <span className="text-2xl sm:text-3xl font-black text-purple-600 block">24/7</span>
            <span className="text-xs text-slate-600 font-bold mt-0.5 block">Online Study Vault Portal</span>
          </div>
        </div>

      </div>
    </section>
  );
};
