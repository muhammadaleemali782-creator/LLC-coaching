import React, { useState } from 'react';
import { Sparkles, CheckCircle2, ChevronDown, ChevronUp, BookOpen, Brain, ShieldCheck } from 'lucide-react';

export const MethodologySection: React.FC = () => {
  // Store expanded item index (or null if all closed)
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const methods = [
    {
      id: 1,
      title: 'Diagnostic Test',
      subtitle: 'Identify Learning Gaps',
      icon: '🎯',
      badge: 'STAGE 1: EVALUATION',
      desc: 'Before starting any batch, we conduct a friendly conceptual assessment to understand the student’s current foundation and specific weak areas in mathematics, science, or grammar.',
      points: [
        'Objective gap mapping in fundamental arithmetic and science laws',
        'Customized study plan tailored to child’s pace without peer pressure',
        '100% stress-free diagnostic report shared with parents'
      ]
    },
    {
      id: 2,
      title: 'Visual Foundation',
      subtitle: 'Concept Over Cramming',
      icon: '💡',
      badge: 'STAGE 2: MASTERY',
      desc: 'We use real-world practical examples, diagrammatic breakdowns, and audio-visual demonstrations so that complex formulas and theorems become intuitive and unforgettable.',
      points: [
        'Diagram-led theory breakdowns with step-by-step logic',
        'Relatable real-life analogies for chemistry reactions & physics laws',
        'Formula derivation cheat-sheets provided for permanent memory'
      ]
    },
    {
      id: 3,
      title: 'Doubt Clinics',
      subtitle: '1-on-1 Daily Solutions',
      icon: '🤝',
      badge: 'STAGE 3: RESOLUTION',
      desc: 'Special dedicated 30-minute doubt clearance sessions after every class ensure no child goes home with an unresolved question or lingering confusion.',
      points: [
        'Direct 1:1 interaction with Aman Sir & senior faculty',
        'No question is considered silly — warm and encouraging classroom vibe',
        'Daily homework and DPP checking with personalized feedback'
      ]
    }
  ];

  const toggleExpand = (idx: number) => {
    setExpandedIndex(prev => (prev === idx ? null : idx));
  };

  return (
    <section id="methodology-section" className="py-16 sm:py-20 bg-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 text-xs font-black uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pedagogy & Teaching Philosophy</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            We teach with <span className="text-[#0066FF]">proven methodology</span> for your child's success
          </h2>
          <p className="text-slate-600 text-xs sm:text-base leading-relaxed font-medium">
            Tap each card to view our structured 3-stage learning cycle that eliminates cramming.
          </p>
        </div>

        {/* In-Place Expandable / Collapsible Accordion Cards */}
        <div className="space-y-4">
          {methods.map((method, idx) => {
            const isExpanded = expandedIndex === idx;

            return (
              <div
                key={method.id}
                className={`rounded-3xl border transition-all duration-300 overflow-hidden shadow-card-clean ${
                  isExpanded
                    ? 'bg-blue-50/40 border-[#0066FF] shadow-learner-lg ring-2 ring-blue-500/10'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Clickable Header Button */}
                <button
                  onClick={() => toggleExpand(idx)}
                  className="w-full p-4 sm:p-6 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-2xl sm:text-3xl shrink-0">
                      {method.icon}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900">
                        {method.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#0066FF] font-bold">
                        {method.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:inline text-xs font-bold text-slate-400">
                      {isExpanded ? 'Collapse' : 'Read Details'}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 ${
                        isExpanded
                          ? 'bg-[#0066FF] text-white rotate-180'
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* In-Place Expanded Detail View */}
                {isExpanded && (
                  <div className="px-5 sm:px-8 pb-6 sm:pb-8 pt-2 border-t border-blue-100/80 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="inline-block px-3 py-1 rounded-full bg-blue-100/70 text-[#0066FF] text-[10px] font-black uppercase tracking-wider">
                      {method.badge}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {method.desc}
                    </p>

                    <div className="bg-white rounded-2xl p-4 border border-blue-100 shadow-xs space-y-2">
                      <span className="text-xs font-black text-slate-900 block">
                        Core Pillars & Benefits:
                      </span>
                      <ul className="space-y-1.5">
                        {method.points.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <p className="text-[11px] text-slate-400 font-medium italic">
                      "Our teachers at L.C.C. are rigorously trained to provide a warm, motivating, and personalized environment."
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
