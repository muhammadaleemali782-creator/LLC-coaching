import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Target, Brain, HelpCircle, ArrowRight } from 'lucide-react';

export const MethodologySection: React.FC = () => {
  const [activeItem, setActiveItem] = useState(0);

  const methods = [
    {
      title: 'Diagnostic Test',
      subtitle: 'Identify Learning Gaps',
      icon: '🎯',
      desc: 'Before starting any batch, we conduct a friendly conceptual assessment to understand the student’s current foundation and specific weak areas in mathematics, science, or grammar.'
    },
    {
      title: 'Visual Foundation',
      subtitle: 'Concept Over Cramming',
      icon: '💡',
      desc: 'We use real-world practical examples, diagrammatic breakdowns, and audio-visual demonstrations so that complex formulas and theorems become intuitive and unforgettable.'
    },
    {
      title: 'Doubt Clinics',
      subtitle: '1-on-1 Daily Solutions',
      icon: '🤝',
      desc: 'Special dedicated 30-minute doubt clearance sessions after every class ensure no child goes home with an unresolved question or lingering confusion.'
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            We are teaching with <span className="text-brand-orange">optimum methodology</span> for your children
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            Our structured 3-stage learning cycle ensures consistent academic growth and stress-free board preparation.
          </p>
        </div>

        {/* 2-Column Methodology Grid Matching Reference Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center max-w-5xl mx-auto">
          {/* Left Column: Interactive Icons / Method Switcher */}
          <div className="lg:col-span-5 space-y-4">
            {methods.map((method, idx) => (
              <div
                key={idx}
                onClick={() => setActiveItem(idx)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                  activeItem === idx
                    ? 'bg-orange-50/70 border-brand-orange shadow-md transform translate-x-2'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100/70'
                }`}
              >
                <div className="text-2xl shrink-0 p-2 bg-white rounded-xl shadow-sm">
                  {method.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{method.title}</h4>
                  <span className="text-xs text-brand-orange font-semibold">{method.subtitle}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Detailed Narrative */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-100 p-8 sm:p-10 rounded-3xl space-y-4 shadow-sm">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
              Methodology #{activeItem + 1}
            </span>
            <h3 className="text-2xl font-black text-slate-900">
              {methods[activeItem].title} — {methods[activeItem].subtitle}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {methods[activeItem].desc}
            </p>
            <p className="text-slate-500 text-xs leading-relaxed pt-2">
              Our teachers at L.C.C. are rigorously trained in child developmental psychology, ensuring a warm, supportive, and motivating environment for every scholar.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
