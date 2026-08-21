import React from 'react';
import { Target, Eye, ShieldCheck, CheckCircle2, Sparkles, Compass, Lightbulb, UserCheck } from 'lucide-react';

export const MissionVision: React.FC = () => {
  const pillars = [
    {
      icon: Target,
      title: 'Our Mission',
      tagline: 'Conceptual Clarity & Mentorship',
      color: 'from-brand-orange to-amber-500',
      textColor: 'text-brand-orange',
      borderColor: 'border-brand-orange/40',
      bgColor: 'bg-brand-orange/10',
      description:
        'To demystify complex academic concepts, ignite organic curiosity, and provide affordable, high-standard coaching that transforms average students into top performers through structured problem-solving and daily practice.'
    },
    {
      icon: Eye,
      title: 'Our Vision',
      tagline: 'Leading the Future of Education',
      color: 'from-cyan-500 to-blue-600',
      textColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/40',
      bgColor: 'bg-cyan-500/10',
      description:
        'To be recognized as the foremost regional and digital learning hub where traditional academic excellence seamlessly unites with modern digital skills (Coding, Office tools, English fluency) to prepare scholars for 21st-century global challenges.'
    },
    {
      icon: ShieldCheck,
      title: 'Core Values',
      tagline: 'Integrity, Discipline & Empathy',
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/40',
      bgColor: 'bg-emerald-500/10',
      description:
        'We stand firmly on student-centric pedagogy, transparency with parents, zero compromise on teaching standards, holistic personality grooming, and relentless support for every child till they reach their zenith.'
    }
  ];

  const objectives = [
    {
      title: 'Zero Rote Learning',
      desc: 'Deep conceptual explanations with real-world examples rather than blind cramming.'
    },
    {
      title: 'Individual Student Tracking',
      desc: 'Small batch sizes allowing dedicated focus, weekly performance analysis, and regular PTMs.'
    },
    {
      title: 'Dual Academic + Tech Edge',
      desc: 'Equipping students with school syllabus excellence plus modern computer literacy and stage confidence.'
    },
    {
      title: 'Affordable & Transparent Fees',
      desc: 'Ensuring top quality education is within reach of every hardworking family with merit scholarships.'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-brand-dark relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-card border border-brand-border text-brand-orange text-xs font-bold uppercase tracking-wider mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Guiding Philosophy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Mission, Vision & <span className="text-gradient-orange">Core Values</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            The foundational principles and educational philosophy guiding every class, mentor, and student at L.C.C.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-brand-card/90 border border-brand-border hover:border-brand-borderLight rounded-3xl p-8 shadow-card-dark transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className={`p-3.5 rounded-2xl ${pillar.bgColor} ${pillar.textColor} border ${pillar.borderColor} shadow-sm group-hover:scale-110 transition-transform`}>
                    <pillar.icon className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-black text-slate-500 font-mono tracking-widest">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-1">{pillar.title}</h3>
                <p className={`text-xs font-bold uppercase tracking-wider mb-4 ${pillar.textColor}`}>
                  {pillar.tagline}
                </p>

                <p className="text-slate-300 text-sm leading-relaxed mb-6">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-4 border-t border-brand-border/60 flex items-center gap-2 text-xs text-slate-400">
                <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
                <span>Committed to student success</span>
              </div>
            </div>
          ))}
        </div>

        {/* Objectives toward students & parents */}
        <div className="bg-gradient-to-r from-brand-card via-brand-cardLighter to-brand-card border border-brand-border rounded-3xl p-8 sm:p-10 shadow-card-dark">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange uppercase tracking-wider mb-1">
                <Lightbulb className="w-4 h-4" />
                <span>Our Clear Objectives</span>
              </div>
              <h3 className="text-2xl font-bold text-white">What We Promise to Every Student & Parent</h3>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-dark/70 border border-brand-border text-xs text-slate-300 self-start lg:self-auto">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Academic Satisfaction Guarantee</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {objectives.map((obj, i) => (
              <div key={i} className="p-5 rounded-2xl bg-brand-dark/50 border border-brand-border/80 space-y-2">
                <div className="flex items-center gap-2 text-brand-orange">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-brand-orange" />
                  <h4 className="text-sm font-bold text-white">{obj.title}</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{obj.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
