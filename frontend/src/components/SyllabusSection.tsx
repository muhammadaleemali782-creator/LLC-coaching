import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Download, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

export const SyllabusSection: React.FC = () => {
  const { syllabuses, showToast } = useApp();
  const [selectedClass, setSelectedClass] = useState<string>('Class 10');
  const [openChapterIdx, setOpenChapterIdx] = useState<number | null>(null);

  const classes = ['Class 8', 'Class 9', 'Class 10', 'Class 12', 'Computer / DCA', 'English Speaking'];

  const activeSyllabus = syllabuses.find(s => s.targetClass === selectedClass) || syllabuses[0];

  const handleDownloadSyllabus = () => {
    showToast(`Downloading official syllabus blueprint for ${selectedClass}`, 'success');
    const element = document.createElement('a');
    const file = new Blob([`L.C.C. Official Syllabus Blueprint\nClass: ${activeSyllabus.targetClass}\nSubject: ${activeSyllabus.subject}\nTotal Marks: ${activeSyllabus.totalMarks}\nExam Board: ${activeSyllabus.examBoard}\n\nChapters & Weightage:\n${activeSyllabus.chapters.map((c, i) => `${i + 1}. ${c.name} (${c.weightage}, ${c.estimatedHours} Hours)`).join('\n')}\n\nDirector: Aman Arora\nHelpline: +91 98765 43210`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `syllabus_${selectedClass.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <section id="syllabus-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 text-[#0066FF] text-xs font-black uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curriculum Blueprints</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Class-Wise <span className="text-[#0066FF]">Syllabus & Marking Scheme</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
            Stay aligned with CBSE and State Board requirements with chapter-wise marks distribution, subtopics, and official blueprint downloads.
          </p>
        </div>

        {/* Class Switcher */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          {classes.map(cls => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedClass === cls
                  ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/20'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cls}
            </button>
          ))}
        </div>

        {/* Syllabus Content Card */}
        <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-card-clean space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-black text-[#0066FF] uppercase">
                {activeSyllabus.examBoard} • {activeSyllabus.targetClass}
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {activeSyllabus.subject} Complete Curriculum
              </h3>
            </div>

            <button
              onClick={handleDownloadSyllabus}
              className="px-6 py-3 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider shadow-md shadow-blue-500/20 flex items-center gap-2 transition-colors shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download Blueprint PDF</span>
            </button>
          </div>

          {/* Chapters Accordion */}
          <div className="space-y-3">
            {activeSyllabus.chapters.map((ch, idx) => {
              const isOpen = openChapterIdx === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm transition-all"
                >
                  <div
                    onClick={() => setOpenChapterIdx(isOpen ? null : idx)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-blue-50/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center text-xs font-black shrink-0 border border-blue-200">
                        {ch.weightage}
                      </span>
                      <h4 className="text-sm font-extrabold text-slate-900">{ch.name}</h4>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-slate-400 font-medium hidden sm:inline">{ch.estimatedHours} Hours</span>
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-500" />
                      )}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-3 animate-in fade-in duration-150">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                        Included Key Concepts:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {ch.subtopics.map((topic, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>{topic}</span>
                          </div>
                        ))}
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
