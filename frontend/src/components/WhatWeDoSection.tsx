import React from 'react';
import { useApp } from '../context/AppContext';
import { ArrowRight, Brain, Sparkles, Compass, Target, BookOpen, CheckCircle2 } from 'lucide-react';

export const WhatWeDoSection: React.FC = () => {
  const { navigateTo } = useApp();

  const cards = [
    {
      title: 'Conceptual Block',
      badge: 'Maths & Science',
      icon: Brain,
      color: 'text-amber-500 bg-amber-50',
      description: 'When students struggle with foundational maths formulas or physics laws, we break them down with real-life experiments and visual logic.',
      target: 'courses' as const
    },
    {
      title: 'Exam Anxiety',
      badge: 'Board Preparation',
      icon: Target,
      color: 'text-rose-500 bg-rose-50',
      description: 'Fear of exams is common. Our weekly mock tests and regular practice papers replace panic with proven exam temperament and speed.',
      target: 'syllabus' as const
    },
    {
      title: 'Career & Digital Skills',
      badge: 'Computer & Spoken English',
      icon: Sparkles,
      color: 'text-indigo-500 bg-indigo-50',
      description: 'Equipping scholars with high-demand computer diplomas (DCA/ADCA/Tally Prime) and stage-speaking confidence to excel in the real world.',
      target: 'courses' as const
    }
  ];

  return (
    <section className="py-20 bg-[#eef6fd] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: 3 Floating White Cards Matching Reference */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {cards.map((card, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-3xl p-6 shadow-soft hover:shadow-card-hover border border-slate-100/80 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between text-center sm:text-left ${
                  idx === 1 ? 'sm:-translate-y-4' : ''
                }`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center mb-4 mx-auto sm:mx-0 shadow-sm`}>
                    <card.icon className="w-6 h-6" />
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    {card.badge}
                  </span>

                  <h3 className="text-base font-extrabold text-slate-900 mb-2.5">
                    {card.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed mb-6">
                    {card.description}
                  </p>
                </div>

                <button
                  onClick={() => navigateTo(card.target)}
                  className="text-xs font-bold text-brand-orange hover:text-orange-700 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1 pt-3 border-t border-slate-100 transition-colors"
                >
                  <span>READ MORE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Right Column: Editorial "What We Do" Matching Reference */}
          <div className="lg:col-span-5 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-orange uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Pedagogy & Child Psychology</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              What We Do
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed">
              At <strong>L.C.C.</strong>, our teaching methodology addresses both cognitive understanding and emotional confidence. We recognize that every child has distinct strengths and learning paces.
            </p>

            <p className="text-slate-600 text-sm leading-relaxed">
              By blending disciplined school coaching with small batch sizes, daily doubt solving clinics, and practical computer skills, we ensure students never feel left behind.
            </p>

            {/* Circular Arrow Navigation Link */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => navigateTo('courses')}
                className="w-12 h-12 rounded-full border-2 border-slate-300 hover:border-brand-orange hover:bg-brand-orange hover:text-white text-slate-700 flex items-center justify-center transition-all shadow-sm group"
                title="Explore Programs"
              >
                <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <span className="text-xs font-bold text-slate-600">Discover Our Complete Curriculum</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
