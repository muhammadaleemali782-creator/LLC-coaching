import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StudyMaterial, MaterialCategory } from '../../types';
import { FileText, Plus, Trash2, Download, Eye, Layers } from 'lucide-react';

export const BooksPdfManager: React.FC = () => {
  const { studyMaterials, addStudyMaterial, deleteStudyMaterial, showToast } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [newPdf, setNewPdf] = useState<Partial<StudyMaterial>>({
    title: '',
    category: 'pdf_notes',
    targetClass: 'Class 10',
    subject: 'Science',
    chapter: 'Chapter 1',
    pages: 15,
    downloadUrl: '/assets/sample_notes.pdf',
    isPremium: false,
    previewContent: 'Comprehensive theoretical notes and board sample questions.'
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPdf.title || !newPdf.subject) {
      showToast('Please provide PDF title and subject.', 'warning');
      return;
    }
    await addStudyMaterial(newPdf as StudyMaterial);
    setIsAdding(false);
    setNewPdf({
      title: '',
      category: 'pdf_notes',
      targetClass: 'Class 10',
      subject: 'Science',
      chapter: 'Chapter 1',
      pages: 15,
      downloadUrl: '/assets/sample_notes.pdf',
      isPremium: false,
      previewContent: 'Comprehensive theoretical notes and board sample questions.'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">Books & PDF Study Vault</h2>
          <p className="text-xs text-slate-400">Manage revision modules, formula handbooks, and downloadable notes.</p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel' : 'Upload New Study PDF'}</span>
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 animate-in fade-in duration-150">
          <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider">Add Study PDF Module</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Module Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Class 10 Science Formula Handbook"
                value={newPdf.title}
                onChange={e => setNewPdf({ ...newPdf, title: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Target Class *</label>
              <select
                value={newPdf.targetClass}
                onChange={e => setNewPdf({ ...newPdf, targetClass: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              >
                <option>Class 1–5</option>
                <option>Class 6–8</option>
                <option>Class 9</option>
                <option>Class 10</option>
                <option>Class 11</option>
                <option>Class 12</option>
                <option>Computer / DCA</option>
                <option>Spoken English</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Subject *</label>
              <input
                type="text"
                required
                placeholder="e.g. Physics / Mathematics / Tally"
                value={newPdf.subject}
                onChange={e => setNewPdf({ ...newPdf, subject: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-wider"
            >
              Publish PDF
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {studyMaterials.map(mat => (
          <div key={mat.id} className="bg-slate-950 border border-slate-800 rounded-3xl p-5 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase">
                  {mat.targetClass}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{mat.pages} Pages</span>
              </div>
              <h4 className="text-sm font-black text-white">{mat.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2">{mat.previewContent}</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-emerald-400 font-mono">📥 {mat.downloadsCount || 0} Downloads</span>
              <button
                onClick={() => deleteStudyMaterial(mat.id)}
                className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 cursor-pointer"
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
