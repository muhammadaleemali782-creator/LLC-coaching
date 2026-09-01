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
  const { navigateTo, setIsStudentAuthModalOpen, websiteSettings } = useApp();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F4F8FE] via-white to-white pt-6 sm:pt-12 pb-14 px-3 sm:px-6 lg:px-8">
      
      {/* Background Decorative Glow Blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-72 h-72 bg-amber-100/30 rounded-full blur-2xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Top Header & Typography */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          
          {/* Tag Pill Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-[#0066FF] text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#0066FF]" />
            <span>{websiteSettings?.heroBadgeText || "INDIA'S TOP RATED COACHING & EDTECH"}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] animate-pulse" />
          </div>

          {/* High Conversion Main Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
            Choosing the right coaching course <br className="hidden sm:inline" />
            <span className="text-[#0066FF]">for growth</span>
          </h1>

          {/* Promoted / Announcement Ad Banner Placement */}
          <AdBanner placement="hero_top" className="my-3" />

          {/* Subtitle */}
          <p className="text-slate-600 text-xs sm:text-base leading-relaxed font-medium max-w-2xl mx-auto">
            Join <strong className="text-slate-900 font-extrabold">{websiteSettings?.instituteName || 'Learning Coaching Center (L.C.C.)'}</strong> for comprehensive school coaching (<strong className="text-slate-900 font-extrabold">Classes 1 to 12</strong>), <strong className="text-slate-900 font-extrabold">Computer DCA / ADCA / Tally</strong>, and <strong className="text-slate-900 font-extrabold">Fluent Spoken English</strong> led by <strong className="text-slate-900 font-extrabold">{websiteSettings?.directorName || 'Aman Arora'}</strong>.
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
                src={websiteSettings?.heroPosterUrl || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&auto=format&fit=crop&q=80"}
                alt="L.C.C. Academic Excellence Poster"
                className="w-full h-full object-cover filter brightness-90"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-slate-950/60" />

              {/* Top Left Official Branding Banner */}
              <div className="absolute top-3 left-3 sm:top-6 sm:left-6 z-20 flex items-center gap-2.5 sm:gap-3 bg-slate-950/90 backdrop-blur-md px-3.5 py-2 sm:px-5 sm:py-3 rounded-2xl border border-slate-700/80 shadow-2xl">
                <img
                  src={websiteSettings?.logoUrl || '/logo.jpg'}
                  alt="L.C.C."
                  className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl object-contain bg-white p-0.5 shadow-md"
                  onError={(e: any) => {
                    e.target.src = '/logo.jpg';
                  }}
                />
                <div>
                  <h3 className="text-xs sm:text-base font-black text-white uppercase tracking-tight">
                    {websiteSettings?.instituteName || 'Learning Coaching Center (L.C.C.)'}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-amber-400 font-bold tracking-wider uppercase">
                    Empowering Tomorrow's Leaders
                  </p>
                </div>
              </div>

              {/* Bottom Left Admission Badge */}
              <div className="absolute bottom-3 left-3 sm:bottom-6 sm:left-6 z-20">
                <span className="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#0066FF] text-white text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-lg">
                  PATH TO SUCCESS • ADMISSIONS OPEN 2026–27
                </span>
              </div>
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
