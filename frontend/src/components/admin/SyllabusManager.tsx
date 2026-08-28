import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SyllabusItem } from '../../types';
import { Plus, Edit3, Trash2, BookOpen, Layers, CheckCircle2, Save, X } from 'lucide-react';

export const SyllabusManager: React.FC = () => {
  const { syllabuses, setSyllabuses, showToast } = useApp();
  const [isAdding, setIsAdding] = useState(false);

  const [newSyllabus, setNewSyllabus] = useState<Partial<SyllabusItem>>({
    targetClass: 'Class 10',
    subject: 'Science',
    examBoard: 'CBSE & State Board',
    totalMarks: 100,
    academicYear: '2026-2027',
    chapters: [
      { name: 'Chemical Reactions and Equations', subtopics: ['Types of Reactions', 'Balancing Equations'], weightage: '6 Marks', estimatedHours: 12 }
    ]
  });

  const [newChapterName, setNewChapterName] = useState('');
  const [newChapterWeightage, setNewChapterWeightage] = useState('6 Marks');
  const [newChapterSubtopics, setNewChapterSubtopics] = useState('Types of Reactions, Balancing Equations');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSyllabus.targetClass || !newSyllabus.subject) {
      showToast('Target class and subject are required.', 'warning');
      return;
    }

    const item: SyllabusItem = {
      id: `syl-${Date.now()}`,
      targetClass: newSyllabus.targetClass,
      subject: newSyllabus.subject,
      examBoard: newSyllabus.examBoard || 'CBSE & State Board',
      totalMarks: Number(newSyllabus.totalMarks) || 100,
      academicYear: newSyllabus.academicYear || '2026-2027',
      pdfUrl: '#',
      chapters: [
        {
          name: newChapterName || 'Chapter 1: Fundamentals',
          subtopics: newChapterSubtopics ? newChapterSubtopics.split(',').map(s => s.trim()) : ['Core Concepts'],
          weightage: newChapterWeightage || '6 Marks',
          estimatedHours: 10
        }
      ]
    };

    setSyllabuses(prev => [item, ...prev]);
    setIsAdding(false);
    showToast('Syllabus module created successfully!', 'success');
  };

  const handleDelete = (id: string) => {
    setSyllabuses(prev => prev.filter(s => s.id !== id));
    showToast('Syllabus deleted.', 'info');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <span>Syllabus & Marks Weightage Manager</span>
          </h2>
          <p className="text-xs text-slate-400">Configure board chapters, subtopic breakdowns, and question weightage marks.</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel' : 'Add Syllabus Curriculum'}</span>
        </button>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 animate-in fade-in duration-150">
          <h3 className="text-sm font-black text-emerald-400 uppercase tracking-wider">Create Syllabus Module</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Target Class *</label>
              <input
                type="text"
                required
                placeholder="e.g. Class 10 / Class 12"
                value={newSyllabus.targetClass}
                onChange={e => setNewSyllabus({ ...newSyllabus, targetClass: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Subject *</label>
              <input
                type="text"
                required
                placeholder="e.g. Science / Mathematics / Physics"
                value={newSyllabus.subject}
                onChange={e => setNewSyllabus({ ...newSyllabus, subject: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Exam Board</label>
              <input
                type="text"
                placeholder="e.g. CBSE & State Board"
                value={newSyllabus.examBoard}
                onChange={e => setNewSyllabus({ ...newSyllabus, examBoard: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">Chapter Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Chemical Reactions and Equations"
                value={newChapterName}
                onChange={e => setNewChapterName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Marks Weightage</label>
              <input
                type="text"
                placeholder="e.g. 6 Marks / 12 Marks"
                value={newChapterWeightage}
                onChange={e => setNewChapterWeightage(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="text-xs font-bold text-slate-300 block mb-1">Key Focus Concepts (Comma separated)</label>
              <input
                type="text"
                placeholder="e.g. Types of Reactions, Balancing Equations, Corrosion & Rancidity"
                value={newChapterSubtopics}
                onChange={e => setNewChapterSubtopics(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider shadow-md"
            >
              Publish Syllabus
            </button>
          </div>
        </form>
      )}

      {/* Grid of Syllabuses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {syllabuses.map(s => (
          <div key={s.id} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase">
                  {s.targetClass} • {s.subject}
                </span>
                <span className="text-xs text-slate-400 font-mono">{s.examBoard}</span>
              </div>

              <div className="space-y-3 pt-2">
                {s.chapters.map((ch, idx) => (
                  <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-white">{ch.name}</h4>
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-[10px] font-black">
                        {ch.weightage}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {ch.subtopics.map((sub, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] text-slate-300 font-medium">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => handleDelete(s.id)}
                className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                title="Delete Syllabus"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
