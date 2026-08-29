import React from 'react';
import { Award, BookOpen, Clock, HeartHandshake, Sparkles, Target, Users, CheckCircle2, ShieldCheck, ArrowRight, Flag, Rocket, Trophy, Monitor, Laptop } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const milestones = [
    {
      year: '2016',
      title: 'Founded by Aman Arora',
      icon: Flag,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      desc: 'Started with a passionate mission to eliminate rote cramming and provide conceptual education to every student.'
    },
    {
      year: '2019',
      title: 'Modern 1:1 Computer Lab',
      icon: Monitor,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      desc: 'Launched air-conditioned computer center offering DCA, ADCA, and Tally Prime with GST accounting diplomas.'
    },
    {
      year: '2022',
      title: 'State & District Toppers',
      icon: Trophy,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      desc: 'L.C.C. students secured 98.6% top ranks in Class 10 & 12 board examinations across Science and Commerce.'
    },
    {
      year: '2024',
      title: 'Smart Interactive Classrooms',
      icon: Laptop,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
      desc: 'Equipped audio-visual smart screens and automated weekly chapter testing with parent progress SMS reports.'
    },
    {
      year: '2026',
      title: 'Hybrid EdTech & Learner Portal',
      icon: Rocket,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      desc: 'Introduced 24/7 student learning vault, online mock tests, digital certificate generator, and mobile app.'
    }
  ];

  return (
    <section id="about-section" className="py-20 px-3 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 text-[#0066FF] text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Legacy of Educational Excellence</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            About <span className="text-[#0066FF]">L.C.C. Coaching Institute</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-base leading-relaxed font-medium">
            Directed and founded by <strong className="text-slate-900 font-extrabold">Aman Arora</strong>, L.C.C. (Learning Coaching Center) is recognized as a premier educational haven for academic excellence and computer skills.
          </p>
        </div>

        {/* 2-Column Founder & Philosophy Story */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Founder Spotlight Card */}
          <div className="lg:col-span-6">
            <div className="bg-gradient-to-br from-blue-50/80 via-white to-blue-50/40 rounded-3xl p-6 sm:p-8 border-2 border-blue-200/80 shadow-learner-lg space-y-6">
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative shrink-0">
                  <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-[#0066FF] shadow-lg shadow-blue-500/25 bg-slate-900">
                    <img
                      src="/assets/founder.png"
                      alt="Aman Arora - Founder & Director"
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-2 rounded-2xl bg-[#0066FF] text-white shadow-md">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                <div className="space-y-1.5 text-center sm:text-left">
                  <span className="px-3 py-1 rounded-full bg-[#0066FF] text-white font-black text-[10px] uppercase tracking-wider">
                    FOUNDER & MANAGING DIRECTOR
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">Aman Arora</h3>
                  <p className="text-xs text-[#0066FF] font-bold">
                    Lead Educator & Academic Mentor • Learning Coaching Center
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-sm text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                "Har student me ek topper chupa hota hai. Bas use sahi guidance, daily practice aur self-belief ki zaroorat hoti hai. L.C.C. me hum har ek bachhe par personally focus karte hain."
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-1 text-center">
                <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                  <span className="text-lg sm:text-xl font-black text-[#0066FF] block">10+</span>
                  <span className="text-[10px] text-slate-500 font-bold">Years Mentorship</span>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                  <span className="text-lg sm:text-xl font-black text-[#0066FF] block">5,000+</span>
                  <span className="text-[10px] text-slate-500 font-bold">Students Taught</span>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                  <span className="text-lg sm:text-xl font-black text-[#0066FF] block">98.6%</span>
                  <span className="text-[10px] text-slate-500 font-bold">Board Success</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Mission & Core Pedagogy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                Empowering every student with <br />
                <span className="text-[#0066FF]">confidence and modern skills</span>
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-medium">
                At <strong className="text-slate-900 font-extrabold">Learning Coaching Center (L.C.C.)</strong>, education is beyond exams. We emphasize strong logical foundations in mathematics and science, practical computer literacy, and stage-speaking charisma.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { title: 'Personalized 1-on-1 Attention', desc: 'Small batch sizes (15–25 students) so every question is heard and resolved.' },
                { title: 'Air-Conditioned Computer Lab', desc: 'Individual PC workstations for DCA, ADCA, Python, and Tally Prime with GST.' },
                { title: 'Complete Chapter Vault & DPPs', desc: 'Point-wise solved notes, worksheets, and 10-year past papers for top scores.' }
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-[#F8FAFC] border border-slate-200/80 flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-blue-100 text-[#0066FF] shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* High-End Milestone Timeline (Our Journey of Excellence) */}
        <div className="bg-[#F8FAFC] rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-card-clean space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#0066FF] text-[10px] font-black uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span>MILESTONES & PROVEN RECORD</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">Our Journey of Excellence</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">10+ Years of inspiring students under Aman Arora's leadership</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {milestones.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.year}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-card-clean hover:shadow-learner-lg hover:border-[#0066FF]/40 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#0066FF] font-mono bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-xl">
                        {item.year}
                      </span>
                      <div className={`p-2 rounded-xl border ${item.color} shadow-xs`}>
                        <IconComp className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-[#0066FF] transition-colors leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed font-medium">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
