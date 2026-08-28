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
import { AdBanner } from './ads/AdBanner';

export const StudyMaterialSection: React.FC = () => {
  const { studyMaterials, setSelectedDocForPreview, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories: { id: string; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'all', label: 'All Resources', icon: Layers },
    { id: 'pdf_notes', label: 'PDF Notes', icon: FileText },
    { id: 'formulas', label: 'Formula Books', icon: FileCheck },
    { id: 'cheat_sheets', label: 'Cheat Sheets', icon: BookOpen },
    { id: 'worksheets', label: 'Worksheets', icon: HelpCircle },
    { id: 'pyq', label: 'Past Papers', icon: Clock }
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
    <section id="study-material-section" className="py-16 sm:py-20 px-3 sm:px-6 lg:px-8 bg-[#F8FAFC] relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 text-xs font-black uppercase tracking-wider shadow-xs">
            <FileText className="w-3.5 h-3.5" />
            <span>Digital Study Material & PDF Vault</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Free Revision <span className="text-[#0066FF]">Notes & Handbooks</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-base leading-relaxed font-medium">
            Download verified formula sheets, handwritten notes, sample question banks, and computer shortcut cards.
          </p>
        </div>

        {/* Dynamic Study Vault Advertisement Banner */}
        <AdBanner placement="study_vault" />

        {/* Search & Class Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-card-clean">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by topic, chapter, subject..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#0066FF]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {classFilters.map(cls => (
              <button
                key={cls}
                onClick={() => setSelectedClass(cls)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedClass === cls
                    ? 'bg-[#0066FF] text-white shadow-sm'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cls === 'all' ? 'All Classes' : cls}
              </button>
            ))}
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((mat) => (
            <div
              key={mat.id}
              className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-card-clean hover:shadow-learner-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#0066FF] text-[10px] font-black uppercase border border-blue-100">
                    {mat.targetClass}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {mat.pages} Pages • PDF
                  </span>
                </div>

                <h3 className="text-base font-black text-slate-900 group-hover:text-[#0066FF] transition-colors leading-snug">
                  {mat.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-medium">
                  {mat.previewContent || 'Comprehensive theory, derivations, and board examination highlights.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedDocForPreview(mat)}
                  className="px-3.5 py-2 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-[#0066FF]" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => handleDownload(mat)}
                  className="px-4 py-2 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-xs font-medium">
            No study materials found matching the selected filters.
          </div>
        )}

      </div>
    </section>
  );
};
