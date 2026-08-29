import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Download, ChevronDown, ChevronUp, CheckCircle2, Sparkles, Clock, Target, Layers, FileText, Award, ShieldCheck, Flame, BookCheck } from 'lucide-react';

export const SyllabusSection: React.FC = () => {
  const { syllabuses, showToast } = useApp();
  const [selectedClass, setSelectedClass] = useState<string>('Class 10');
  const [openChapterIdx, setOpenChapterIdx] = useState<number | null>(0); // Default first chapter expanded

  const classes = ['Class 8', 'Class 9', 'Class 10', 'Class 12', 'Computer / DCA', 'English Speaking'];

  const activeSyllabus = syllabuses.find(s => s.targetClass === selectedClass) || syllabuses[0];

  const handleDownloadSyllabus = () => {
    showToast(`Downloading official syllabus blueprint for ${selectedClass}`, 'success');
    const element = document.createElement('a');
    const file = new Blob([`L.C.C. (Learning Coaching Center) Official Syllabus Blueprint\nClass: ${activeSyllabus.targetClass}\nSubject: ${activeSyllabus.subject}\nTotal Marks: ${activeSyllabus.totalMarks} Marks\nExam Board: ${activeSyllabus.examBoard}\n\nChapter Breakdown:\n${activeSyllabus.chapters.map((c, i) => `${i + 1}. ${c.name} [${c.weightage}] - Est. ${c.estimatedHours} Hours\n   Topics: ${c.subtopics.join(', ')}`).join('\n\n')}\n\nDirector: Aman Arora\nHelpline: +91 98765 43210`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `syllabus_${selectedClass.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <section id="syllabus-section" className="py-16 sm:py-24 px-3 sm:px-6 lg:px-8 bg-gradient-to-b from-[#F8FAFC] via-white to-[#F8FAFC] relative overflow-hidden">
      
      {/* 3D Background Decorative Blobs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 text-xs font-black uppercase tracking-wider shadow-xs">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curriculum & Marking Scheme</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Official <span className="text-[#0066FF]">Syllabus Blueprint</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-base leading-relaxed font-medium">
            Stay aligned with CBSE and State Board requirements with chapter-wise marks distribution, subtopics, and official blueprint downloads.
          </p>
        </div>

        {/* Class Switcher Track */}
        <div className="flex items-center justify-start sm:justify-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
          {classes.map(cls => (
            <button
              key={cls}
              onClick={() => {
                setSelectedClass(cls);
                setOpenChapterIdx(0);
              }}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer border ${
                selectedClass === cls
                  ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-lg shadow-blue-500/25 scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* 3D Elevated Master Syllabus Card */}
        <div className="bg-white border-2 border-slate-200/90 rounded-3xl p-5 sm:p-10 shadow-learner-lg space-y-8 relative overflow-hidden">
          
          {/* Top 3D Glowing Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#0066FF] via-amber-400 to-[#0066FF]" />

          {/* Master Header with 3D Chips & Download Button */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-3">
              {/* 3D Pill Badges */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-blue-50 text-[#0066FF] text-[11px] font-black uppercase border border-blue-200 shadow-2xs">
                  ✨ {activeSyllabus.examBoard} ALIGNED
                </span>
                <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-[11px] font-black uppercase border border-emerald-200 shadow-2xs">
                  🎯 {activeSyllabus.targetClass}
                </span>
                <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 text-[11px] font-black uppercase border border-amber-200 shadow-2xs">
                  🏆 {activeSyllabus.totalMarks} MARKS SCHEME
                </span>
              </div>

              <div>
                <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  {activeSyllabus.subject} Comprehensive Blueprint
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Complete chapter-wise theoretical concepts, lab practicals, and 10-year board questions distribution.
                </p>
              </div>
            </div>

            {/* 3D Elevated Download Button */}
            <button
              onClick={handleDownloadSyllabus}
              className="w-full lg:w-auto px-7 py-4 rounded-full bg-gradient-to-r from-[#0066FF] to-[#0052CC] hover:opacity-95 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:scale-95 shrink-0 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD BLUEPRINT PDF</span>
            </button>
          </div>

          {/* Redesigned 3D Chapter Accordion Cards */}
          <div className="space-y-3.5">
            {activeSyllabus.chapters.map((ch, idx) => {
              const isOpen = openChapterIdx === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border-2 transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-blue-50/50 border-[#0066FF] shadow-md ring-4 ring-blue-500/10 transform -translate-y-0.5'
                      : 'bg-white border-slate-200/90 hover:border-blue-300 hover:shadow-sm'
                  }`}
                >
                  {/* Chapter Accordion Trigger */}
                  <div
                    onClick={() => setOpenChapterIdx(isOpen ? null : idx)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-3 sm:gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      {/* 3D Weightage Pill */}
                      <span className="px-3.5 py-1.5 rounded-xl bg-[#0066FF] text-white text-xs font-black tracking-wide shrink-0 shadow-sm">
                        {ch.weightage}
                      </span>
                      
                      {/* Chapter Title */}
                      <h4 className="text-xs sm:text-base font-black text-slate-900 truncate">
                        {ch.name}
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                      <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 font-bold bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                        <Clock className="w-3.5 h-3.5 text-[#0066FF]" />
                        <span>{ch.estimatedHours} Hours</span>
                      </div>

                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${isOpen ? 'bg-[#0066FF] text-white' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded 3D Drawer */}
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-6 sm:pb-6 pt-2 border-t border-blue-100 bg-white/90 space-y-4 animate-in fade-in duration-150">
                      
                      {/* Subtopics Pill Grid */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
                          Key Focus Concepts:
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          {ch.subtopics.map((t, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 rounded-xl bg-blue-50 text-[#0066FF] text-xs font-bold border border-blue-200 shadow-2xs"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 2-Card Focus Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-black text-slate-900 block">Board Examination High-Yield</span>
                            <span className="text-[11px] text-slate-600">Expected 10-year recurring question patterns with step-marking breakdown.</span>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex items-start gap-3">
                          <Target className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-black text-slate-900 block">Chapter Mock Evaluation</span>
                            <span className="text-[11px] text-slate-600">Comprehensive objective & subjective tests upon chapter completion.</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
