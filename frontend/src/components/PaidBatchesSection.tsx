import React from 'react';
import { useApp } from '../context/AppContext';
import { Layers, Sparkles, CheckCircle2, Clock, Users, ArrowRight, ShieldCheck, Zap, Lock } from 'lucide-react';

export const PaidBatchesSection: React.FC = () => {
  const { courses, setSelectedCourseForPayment, currentStudent, navigateTo } = useApp();

  const paidCourses = courses.filter(c => c.isPaid);

  return (
    <section id="batches-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 text-[#0066FF] text-xs font-black uppercase tracking-wider mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive Live & Hybrid Batches</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Join Our High-Impact <span className="text-[#0066FF]">Live Batches</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
            Enroll today for intensive curriculum coverage, daily practice problems (DPPs), personal doubt resolution sessions with Aman Arora, and automated test evaluations.
          </p>
        </div>

        {/* Paid Batches Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {paidCourses.slice(0, 3).map((course, idx) => {
            const isEnrolled = currentStudent?.enrolledCourses.includes(course.id);
            const isFeatured = idx === 1; // Highlight middle card

            return (
              <div
                key={course.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 transform hover:-translate-y-2 ${
                  isFeatured
                    ? 'bg-white border-2 border-[#0066FF] shadow-learner-lg ring-4 ring-blue-50'
                    : 'bg-[#F8FAFC] border border-slate-200/90 hover:border-blue-300 shadow-card-clean'
                }`}
              >
                {isFeatured && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#0066FF] text-white text-xs font-black uppercase tracking-wider shadow-md">
                    MOST RECOMMENDED BATCH
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] font-black text-xs border border-blue-200">
                      {course.targetClass}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-extrabold">
                      <span>★</span>
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-black text-slate-900 mb-3 leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed mb-6 font-medium">
                    {course.description}
                  </p>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200/80 mb-6 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Clock className="w-3.5 h-3.5 text-[#0066FF]" />
                        {course.duration}
                      </span>
                      <span className="font-bold text-slate-700">Daily Live & Recorded</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Users className="w-3.5 h-3.5 text-[#0066FF]" />
                        Batch Size: 25 Seats
                      </span>
                      <span className="text-rose-500 font-extrabold">Limited Seats</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 mb-8">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Included in Batch:
                    </span>
                    {course.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl sm:text-3xl font-black text-slate-900">
                        ₹{course.discountFee}
                      </span>
                      <span className="text-xs text-slate-400 line-through ml-2 font-medium">
                        ₹{course.fee}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-extrabold border border-emerald-200">
                      SAVE ₹{course.fee - course.discountFee}
                    </span>
                  </div>

                  {isEnrolled ? (
                    <button
                      onClick={() => navigateTo('student-portal')}
                      className="w-full py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Access Your Batch Dashboard</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedCourseForPayment(course)}
                      className={`w-full py-4 rounded-full font-black text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 ${
                        isFeatured
                          ? 'bg-[#0066FF] hover:bg-blue-700 text-white shadow-blue-500/25'
                          : 'bg-slate-900 hover:bg-[#0066FF] text-white'
                      }`}
                    >
                      <span>Enroll in Batch</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  <p className="text-[11px] text-center text-slate-400 font-medium">
                    🔒 Instant access upon payment • E-Receipt generated automatically
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Guarantee Strip */}
        <div className="p-6 rounded-3xl bg-blue-50/70 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-2xl bg-[#0066FF] text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900">100% Academic Satisfaction Guarantee</h4>
              <p className="text-xs text-slate-600 font-medium">Attend your first 3 trial lectures. If not satisfied, get complete fee counseling assistance.</p>
            </div>
          </div>
          <button
            onClick={() => navigateTo('admission')}
            className="px-6 py-3 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider shrink-0 shadow-sm transition-all"
          >
            Apply for Admission
          </button>
        </div>

      </div>
    </section>
  );
};
