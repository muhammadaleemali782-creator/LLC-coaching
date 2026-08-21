import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Award, HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';

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
      {/* Warm Honey Yellow Banner Horizon Matching Reference Image */}
      <div className="w-full bg-[#fdb813] pt-16 pb-32 sm:pb-40 relative px-4 text-center">
        {/* Playful student illustration character strip */}
        <div className="max-w-4xl mx-auto flex items-end justify-center gap-6 sm:gap-12 mb-8">
          <div className="text-center">
            <span className="text-3xl sm:text-4xl block">👧</span>
            <span className="text-[10px] font-bold text-slate-900 uppercase">Primary</span>
          </div>
          <div className="text-center">
            <span className="text-4xl sm:text-5xl block">👦</span>
            <span className="text-[10px] font-bold text-slate-900 uppercase">Middle School</span>
          </div>
          <div className="text-center">
            <span className="text-4xl sm:text-5xl block">👩‍🎓</span>
            <span className="text-[10px] font-bold text-slate-900 uppercase">Board Topper</span>
          </div>
          <div className="text-center">
            <span className="text-3xl sm:text-4xl block">💻</span>
            <span className="text-[10px] font-bold text-slate-900 uppercase">Computer Tech</span>
          </div>
        </div>

        <div className="max-w-2xl mx-auto text-slate-900">
          <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
            Nurturing Confident, Happy & Successful Learners
          </h3>
        </div>
      </div>

      {/* Floating White Guarantee Box Matching Reference Image */}
      <div className="max-w-4xl mx-auto px-4 -mt-20 sm:-mt-24 relative z-10">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-100 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 text-brand-orange mx-auto flex items-center justify-center">
            <ShieldCheck className="w-7 h-7" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            We guarantee the conceptual clarity & excellence of our coaching
          </h2>

          <p className="text-slate-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            By contacting us for guidance, you receive a high-class, compassionate approach to your child's academic future with regular progress reports and doubt resolution.
          </p>

          <div className="pt-3">
            <button
              onClick={() => navigateTo('admission')}
              className="px-8 py-4 rounded-full bg-brand-orange hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              REQUEST A CALL / BOOK FREE DEMO
            </button>
          </div>
        </div>
      </div>

      {/* 4-Column Feature/Service Grid Matching Reference Image Footer Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((srv, idx) => (
            <div key={idx} className="space-y-2 border-l-2 border-brand-orange/40 pl-4">
              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                {srv.title}
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {srv.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
