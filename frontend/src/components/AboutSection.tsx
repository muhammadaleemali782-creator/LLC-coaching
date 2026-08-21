import React from 'react';
import { Award, BookOpen, Clock, HeartHandshake, Sparkles, Target, Users, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const milestones = [
    {
      year: '2016',
      title: 'Founded by Aman Arora',
      desc: 'Started with a passionate mission to eliminate rote cramming and provide conceptual education to every student.'
    },
    {
      year: '2019',
      title: 'Modern 1:1 Computer Lab',
      desc: 'Launched air-conditioned computer center offering DCA, ADCA, and Tally Prime with GST accounting diplomas.'
    },
    {
      year: '2022',
      title: 'State & District Toppers',
      desc: 'L.C.C. students secured 98.6% top ranks in Class 10 & 12 board examinations across Science and Commerce.'
    },
    {
      year: '2024',
      title: 'Smart Interactive Classrooms',
      desc: 'Equipped audio-visual smart screens and automated weekly chapter testing with parent progress SMS reports.'
    },
    {
      year: '2026',
      title: 'Hybrid EdTech & Learner Portal',
      desc: 'Introduced 24/7 student learning vault, online mock tests, digital certificate generator, and mobile app.'
    }
  ];

  return (
    <section id="about-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 text-[#0066FF] text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Legacy of Educational Excellence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            About <span className="text-[#0066FF]">L.C.C. Coaching Institute</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
            Directed and founded by <strong>Aman Arora</strong>, L.C.C. (Lakshya Career Classes) is recognized as a premier educational haven for academic excellence and computer skills.
          </p>
        </div>

        {/* 2-Column Founder & Philosophy Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-20">
          
          {/* Left Column: Founder Spotlight Card */}
          <div className="lg:col-span-6">
            <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50/40 rounded-3xl p-8 border-2 border-blue-200/80 shadow-learner-lg space-y-6">
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative shrink-0">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-[#0066FF] shadow-lg shadow-blue-500/25 bg-slate-900">
                    <img
                      src="/assets/founder.png"
                      alt="Aman Arora - Founder & Director"
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-2 rounded-2xl bg-[#0066FF] text-white shadow-md">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                </div>

                <div className="space-y-1.5 text-center sm:text-left">
                  <span className="px-3 py-1 rounded-full bg-blue-600 text-white font-black text-[10px] uppercase tracking-wider">
                    FOUNDER & MANAGING DIRECTOR
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">Aman Arora</h3>
                  <p className="text-xs text-[#0066FF] font-bold">
                    Lead Educator & Academic Mentor • Lakshya Career Classes
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-sm text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                "Har student me ek topper chupa hota hai. Bas use sahi guidance, daily practice aur self-belief ki zaroorat hoti hai. L.C.C. me hum har ek bachhe par personally focus karte hain."
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                  <span className="text-xl font-black text-[#0066FF] block">10+</span>
                  <span className="text-[11px] text-slate-500 font-bold">Years Mentorship</span>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                  <span className="text-xl font-black text-[#0066FF] block">5,000+</span>
                  <span className="text-[11px] text-slate-500 font-bold">Students Taught</span>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                  <span className="text-xl font-black text-[#0066FF] block">98.6%</span>
                  <span className="text-[11px] text-slate-500 font-bold">Board Success</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Mission & Core Pedagogy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                Empowering every student with <br />
                <span className="text-[#0066FF]">confidence and modern skills</span>
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                At <strong>Lakshya Career Classes (L.C.C.)</strong>, education is beyond exams. We emphasize strong logical foundations in mathematics and science, practical computer literacy, and stage-speaking charisma.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { title: 'Personalized 1-on-1 Attention', desc: 'Small batch sizes (15–25 students) so every question is heard and resolved.' },
                { title: 'Air-Conditioned Computer Lab', desc: 'Individual PC workstations for DCA, ADCA, Python, and Tally Prime with GST.' },
                { title: 'Complete Chapter Vault & DPPs', desc: 'Point-wise solved notes, worksheets, and 10-year past papers for top scores.' }
              ].map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-start gap-3.5">
                  <div className="p-2 rounded-xl bg-blue-100 text-[#0066FF] shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Milestone Timeline */}
        <div className="bg-[#F8FAFC] rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-card-clean">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Our Journey of Excellence</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">10+ Years of inspiring students under Aman Arora's leadership</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {milestones.map((item, idx) => (
              <div key={item.year} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-black text-[#0066FF] font-mono bg-blue-50 px-2.5 py-1 rounded-lg inline-block mb-2">
                    {item.year}
                  </span>
                  <h4 className="text-xs font-extrabold text-slate-900 mb-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
