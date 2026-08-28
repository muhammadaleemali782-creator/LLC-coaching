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
import { AdBanner } from './ads/AdBanner';

export const Hero: React.FC = () => {
  const { navigateTo, setIsStudentAuthModalOpen } = useApp();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F4F8FE] via-white to-white pt-6 sm:pt-12 pb-14 px-3 sm:px-6 lg:px-8">
      
      {/* Background Decorative Glow Blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-amber-100/30 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Top Header & Typography */}
        <div className="text-center max-w-4xl mx-auto space-y-4 sm:space-y-5">
          
          {/* 3D Status Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#0066FF] animate-pulse" />
            <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider">
              INDIA’S TOP RATED COACHING & EDTECH
            </span>
            <span className="w-2 h-2 rounded-full bg-[#0066FF] animate-ping ml-1" />
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Choosing the right coaching course <span className="text-[#0066FF] block sm:inline">for growth</span>
          </h1>

          {/* Dynamic Backend-Managed Hero Advertisement Slot (Red Square Target) */}
          <AdBanner placement="hero_top" />

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

            {/* Bottom Floating Stats Bar */}
            <div className="p-4 sm:p-6 bg-slate-900/95 backdrop-blur-md text-white border-t border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <span className="text-xl sm:text-3xl font-black text-amber-400">98.6%</span>
                <span className="text-[10px] sm:text-xs text-slate-300 block font-medium">Board Exam Pass Rate</span>
              </div>
              <div>
                <span className="text-xl sm:text-3xl font-black text-[#0066FF]">10+ Years</span>
                <span className="text-[10px] sm:text-xs text-slate-300 block font-medium">Academic Excellence</span>
              </div>
              <div>
                <span className="text-xl sm:text-3xl font-black text-emerald-400">1:1 Lab</span>
                <span className="text-[10px] sm:text-xs text-slate-300 block font-medium">Dedicated Computers</span>
              </div>
              <div>
                <span className="text-xl sm:text-3xl font-black text-purple-400">1500+</span>
                <span className="text-[10px] sm:text-xs text-slate-300 block font-medium">Students Trained</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
