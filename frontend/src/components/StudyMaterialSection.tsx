import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StudyMaterial, MaterialCategory } from '../types';
import {
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  BookOpen,
  Sparkles,
  CheckCircle,
  FileCheck,
  HelpCircle,
  Clock,
  Layers,
  ArrowDownToLine
} from 'lucide-react';

export const StudyMaterialSection: React.FC = () => {
  const { studyMaterials, setSelectedDocForPreview, incrementDownloadCount, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: { id: string; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'all', label: 'All Resources', icon: Layers },
    { id: 'pdf_notes', label: 'PDF Notes', icon: FileText },
    { id: 'practice_sets', label: 'Practice Sets', icon: FileCheck },
    { id: 'worksheets', label: 'Worksheets', icon: BookOpen },
    { id: 'important_questions', label: 'Important Qs', icon: HelpCircle },
    { id: 'pyq', label: 'Past Papers', icon: Clock },
    { id: 'homework', label: 'Homework Sheets', icon: CheckCircle }
  ];

  const classFilters = ['all', 'Class 8', 'Class 9', 'Class 10', 'Class 12', 'Computer / DCA', 'English Speaking'];

  const filteredMaterials = studyMaterials.filter(mat => {
    const matchesCat = selectedCategory === 'all' || mat.category === selectedCategory;
    const matchesClass = selectedClass === 'all' || mat.targetClass.toLowerCase().includes(selectedClass.toLowerCase());
    const matchesSearch =
      mat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mat.chapter.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesClass && matchesSearch;
  });

  const handleDownload = (mat: StudyMaterial) => {
    incrementDownloadCount(mat.id);
    showToast(`Downloading: ${mat.title}`, 'success');
    
    const element = document.createElement('a');
    const file = new Blob([`L.C.C. (Lakshya Career Classes) Study Material\n\nTitle: ${mat.title}\nClass: ${mat.targetClass}\nSubject: ${mat.subject}\nChapter: ${mat.chapter}\nPages: ${mat.pages}\n\nNotes Summary:\n${mat.previewContent || 'Official verified notes from L.C.C. Academic Mentors.'}\n\nWebsite: https://lcc.edu\nHelpline: +91 98765 43210`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${mat.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <section id="study-material-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-t border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 text-[#0066FF] text-xs font-black uppercase tracking-wider mb-3">
            <FileText className="w-3.5 h-3.5" />
            <span>Digital Study Vault</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Free & Verified <span className="text-[#0066FF]">Study Notes & PDFs</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
            Download chapter-wise revision notes, high-yield worksheets, model practice sets, and previous 10 years solved board papers prepared by senior faculties.
          </p>
        </div>

        {/* Filter Toolbar Box */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 mb-10 shadow-card-clean space-y-4">
          
          {/* Top row: Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/70'
                }`}
              >
                <cat.icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Bottom row: Class Filter + Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#0066FF]" />
                Class:
              </span>
              {classFilters.map(cf => (
                <button
                  key={cf}
                  onClick={() => setSelectedClass(cf)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedClass === cf
                      ? 'bg-blue-50 text-[#0066FF] border border-blue-300'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {cf === 'all' ? 'All Classes' : cf}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search chapter, subject, or topic..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0066FF] transition-colors font-medium"
              />
            </div>
          </div>

        </div>

        {/* Materials Cards Grid */}
        {filteredMaterials.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h4 className="text-lg font-black text-slate-900 mb-1">No Study Materials Found</h4>
            <p className="text-xs text-slate-500">Please select a different category or search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMaterials.map(mat => (
              <div
                key={mat.id}
                className="bg-white border border-slate-200/90 hover:border-blue-300 rounded-3xl p-6 shadow-card-clean hover:shadow-learner transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-[#0066FF] font-black text-[11px] border border-blue-200">
                      {mat.targetClass}
                    </span>
                    <span className="text-[11px] text-slate-500 font-bold">
                      {mat.pages} Pages • PDF
                    </span>
                  </div>

                  <span className="text-xs font-black text-slate-400 uppercase tracking-wider block mb-1">
                    {mat.subject}
                  </span>

                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#0066FF] transition-colors line-clamp-2 leading-snug mb-2">
                    {mat.title}
                  </h3>

                  <p className="text-xs text-slate-500 font-medium line-clamp-2 mb-4">
                    {mat.chapter}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <ArrowDownToLine className="w-3.5 h-3.5 text-[#0066FF]" />
                    {mat.downloadsCount} Downloads
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDocForPreview(mat)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition-colors"
                      title="Read Online"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Read</span>
                    </button>

                    <button
                      onClick={() => handleDownload(mat)}
                      className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
