import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Award, HeartHandshake, CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

export const GuaranteeSection: React.FC = () => {
  const { navigateTo } = useApp();

  const services = [
    {
      title: 'Foundational Champs (Classes 1–5)',
      desc: 'Building mental arithmetic, reading fluency, handwriting skills, and natural scientific curiosity with play-way methodology.'
    },
    {
      title: 'Middle & Board Target (Classes 6–10)',
      desc: 'Comprehensive subject mastery in Maths, Science, and SST with 10-year PYQ booklets and full board simulation tests.'
    },
    {
      title: 'Senior Secondary Science (Classes 11–12)',
      desc: 'Physics, Chemistry, Maths and Biology deep-dives with step-by-step formula derivations and competitive exam foundation.'
    },
    {
      title: 'Computer Diplomas & Spoken English',
      desc: 'Govt. recognized DCA/ADCA certifications, Tally Prime with GST accounting, and public speaking confidence workshops.'
    }
  ];

  return (
    <section className="relative overflow-hidden pt-12 pb-24 bg-white">
      
      {/* Warm Honey Yellow Banner with Rainbow-Curved Floating Avatars */}
      <div className="w-full bg-[#fdb813] pt-14 pb-32 sm:pb-44 relative px-4 text-center overflow-hidden">
        
        {/* Subtle Decorative Rainbow Arc Background Lines */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="w-[500px] h-[300px] sm:w-[800px] sm:h-[450px] border-4 border-dashed border-slate-900 rounded-t-full -mb-32" />
        </div>

        {/* Playful Student Character Strip in Rainbow Arc Curve with Dynamic Floating Motion */}
        <div className="max-w-4xl mx-auto flex items-end justify-center gap-4 sm:gap-14 mb-10 relative z-10 pt-4">
          
          {/* 1. Primary (Left Lower Rainbow Leg) */}
          <div className="flex flex-col items-center animate-rainbow-1 transition-transform">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-3xl bg-white/30 backdrop-blur-sm border-2 border-white/60 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
              <span className="text-3xl sm:text-5xl select-none">👧</span>
            </div>
            <span className="text-[11px] sm:text-xs font-black text-slate-950 uppercase tracking-wider mt-2.5 bg-white/40 px-2.5 py-0.5 rounded-full">
              PRIMARY
            </span>
          </div>

          {/* 2. Middle School (Mid-Left Arch) */}
          <div className="flex flex-col items-center animate-rainbow-2 transition-transform -translate-y-4 sm:-translate-y-6">
            <div className="w-16 h-16 sm:w-22 sm:h-22 rounded-3xl bg-white/40 backdrop-blur-sm border-2 border-white/80 flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform">
              <span className="text-4xl sm:text-6xl select-none">👦</span>
            </div>
            <span className="text-[11px] sm:text-xs font-black text-slate-950 uppercase tracking-wider mt-2.5 bg-white/50 px-2.5 py-0.5 rounded-full">
              MIDDLE SCHOOL
            </span>
          </div>

          {/* 3. Board Topper (Peak of Rainbow Arch) */}
          <div className="flex flex-col items-center animate-rainbow-3 transition-transform -translate-y-7 sm:-translate-y-12">
            <div className="w-18 h-18 sm:w-24 sm:h-24 rounded-3xl bg-white/60 backdrop-blur-md border-3 border-white flex items-center justify-center shadow-2xl ring-4 ring-white/30 transform hover:scale-110 transition-transform">
              <span className="text-4xl sm:text-6xl select-none">👩‍🎓</span>
            </div>
            <span className="text-[11px] sm:text-xs font-black text-slate-950 uppercase tracking-wider mt-2.5 bg-white/80 px-3 py-1 rounded-full shadow-xs">
              BOARD TOPPER
            </span>
          </div>

          {/* 4. Computer Tech (Right Lower Rainbow Leg) */}
          <div className="flex flex-col items-center animate-rainbow-4 transition-transform">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-3xl bg-white/30 backdrop-blur-sm border-2 border-white/60 flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
              <span className="text-3xl sm:text-5xl select-none">💻</span>
            </div>
            <span className="text-[11px] sm:text-xs font-black text-slate-950 uppercase tracking-wider mt-2.5 bg-white/40 px-2.5 py-0.5 rounded-full">
              COMPUTER TECH
            </span>
          </div>

        </div>

        {/* Banner Headline */}
        <div className="max-w-3xl mx-auto text-slate-950 relative z-10 px-2">
          <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Nurturing Confident, <span className="underline decoration-slate-950/30 decoration-wavy">Happy & Successful</span> Learners
          </h3>
          <p className="text-xs sm:text-sm font-bold text-slate-800/80 mt-2 max-w-xl mx-auto">
            From Class 1 to 12 CBSE & State Boards, Professional Computer Diplomas, and Fluent Spoken English.
          </p>
        </div>

      </div>

      {/* Floating White Guarantee Box */}
      <div className="max-w-4xl mx-auto px-4 -mt-20 sm:-mt-24 relative z-10">
        <div className="bg-white rounded-3xl p-6 sm:p-12 shadow-2xl border border-slate-100 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% Quality & Conceptual Assurance</span>
          </div>

          <h3 className="text-xl sm:text-3xl font-black text-slate-900 leading-tight">
            The L.C.C. Academic Promise
          </h3>

          <p className="text-slate-600 text-xs sm:text-base leading-relaxed font-medium max-w-2xl mx-auto">
            Under the direct guidance of <strong className="text-slate-900 font-extrabold">Aman Arora</strong>, we assure complete conceptual clarity, dedicated 1:1 doubt clinics, and rigorous practice tests for guaranteed score elevation.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
            {services.map((serv, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="p-1 rounded-full bg-emerald-100 text-emerald-600 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">{serv.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{serv.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigateTo('admission', 'admission-section')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>Apply for Admission</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs uppercase tracking-wider text-center transition-colors"
            >
              Talk to Aman Sir
            </a>
          </div>

        </div>
      </div>

    </section>
  );
};
