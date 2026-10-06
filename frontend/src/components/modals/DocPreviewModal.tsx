import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileText,
  Download,
  X,
  ZoomIn,
  ZoomOut,
  Printer,
  CheckCircle2,
  HardDrive,
  DownloadCloud,
  Check,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Sparkles,
  Sun,
  Moon,
  Coffee,
  RotateCcw
} from 'lucide-react';
import { recordLearningHistory } from '../../utils/learningHistory';
import { saveOfflineDoc, isDocOffline } from '../../utils/offlineStorage';
import { PdfCanvasViewer } from './PdfCanvasViewer';

export const DocPreviewModal: React.FC = () => {
  const { selectedDocForPreview, setSelectedDocForPreview, showToast, currentStudent } = useApp();
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isOfflineSaved, setIsOfflineSaved] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'notes' | 'pdf' | 'drive'>('notes');
  const [readingTheme, setReadingTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [currentNotePage, setCurrentNotePage] = useState<number>(1);

  const rawUrl = selectedDocForPreview?.googleDriveUrl || selectedDocForPreview?.downloadUrl || '';
  const driveMatch = rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || rawUrl.match(/id=([a-zA-Z0-9_-]+)/);
  const driveEmbedUrl = driveMatch ? `https://drive.google.com/file/d/${driveMatch[1]}/preview` : null;
  const isDirectPdf = rawUrl.toLowerCase().includes('.pdf') || rawUrl.startsWith('data:application/pdf') || rawUrl.includes('/pdf');
  const pdfCanvasUrl = isDirectPdf ? (rawUrl.startsWith('/') && !rawUrl.startsWith('//') ? `.${rawUrl}` : rawUrl) : null;

  const totalPages = Math.max(1, selectedDocForPreview?.pages || 2);

  useEffect(() => {
    if (selectedDocForPreview) {
      setIsOfflineSaved(isDocOffline(selectedDocForPreview.id));
      setCurrentNotePage(1);
      // Default to high-fidelity interactive Digital Book for 100% reliable offline/online readability
      setActiveTab('notes');
      recordLearningHistory({
        type: 'material',
        itemId: selectedDocForPreview.id,
        title: selectedDocForPreview.title,
        subject: selectedDocForPreview.subject,
        targetClass: selectedDocForPreview.targetClass,
        pages: selectedDocForPreview.pages
      }, currentStudent?.id || currentStudent?.email);
    }
  }, [selectedDocForPreview, currentStudent]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedDocForPreview(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedDocForPreview]);

  const handleSaveOffline = React.useCallback(() => {
    if (!selectedDocForPreview) return false;
    const ok = saveOfflineDoc({
      id: selectedDocForPreview.id,
      title: selectedDocForPreview.title,
      category: selectedDocForPreview.category,
      targetClass: selectedDocForPreview.targetClass,
      subject: selectedDocForPreview.subject,
      fileUrl: selectedDocForPreview.downloadUrl || '#',
      fileType: selectedDocForPreview.fileType || 'pdf',
      contentSnippet: selectedDocForPreview.previewContent
    });
    if (ok) {
      setIsOfflineSaved(true);
      showToast('✅ Saved to Offline Vault! You can read this anytime without internet.', 'success');
    }
    return ok;
  }, [selectedDocForPreview, showToast]);

  useEffect(() => {
    if (selectedDocForPreview) {
      (window as any).__lcc_current_selected_doc = selectedDocForPreview;
      (window as any).__lcc_save_doc_offline = handleSaveOffline;
      (window as any).__lcc_close_doc = () => setSelectedDocForPreview(null);
    }
  }, [selectedDocForPreview, handleSaveOffline, setSelectedDocForPreview]);

  if (!selectedDocForPreview) return null;

  const handleDownload = () => {
    showToast(`Downloading ${selectedDocForPreview.title}...`, 'success');

    if (rawUrl && rawUrl !== '#' && rawUrl.trim() !== '') {
      const match = rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || rawUrl.match(/id=([a-zA-Z0-9_-]+)/);
      const directUrl = match ? `https://drive.google.com/uc?export=download&id=${match[1]}` : rawUrl;

      const link = document.createElement('a');
      link.href = directUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('download', selectedDocForPreview.title);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    }

    const element = document.createElement('a');
    const file = new Blob([`L.C.C. Study Notes: ${selectedDocForPreview.title}\n\n${selectedDocForPreview.previewContent || 'Official Study Materials'}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedDocForPreview.title.replace(/[^a-z0-9]/gi, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  // Specific content styling & text for known genuine documents
  const isVocabDoc = selectedDocForPreview.id === 'mat-vocabulary-list' || selectedDocForPreview.title.toLowerCase().includes('vocabulary');
  const isMannersDoc = selectedDocForPreview.id === 'mat-good-manners' || selectedDocForPreview.title.toLowerCase().includes('manners');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full h-full sm:h-[94vh] sm:max-w-5xl bg-white dark:bg-slate-950 sm:rounded-3xl border-0 sm:border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">

        {/* ═══════════ RESPONSIVE HEADER ═══════════ */}
        <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
          
          {/* Top Row: Document Info & Persistent Close Button */}
          <div className="px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-3 border-b border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center gap-2.5 sm:gap-3 overflow-hidden min-w-0 flex-1">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-[#0066FF] flex items-center justify-center shrink-0 shadow-xs">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xs sm:text-base font-black text-slate-900 dark:text-white truncate">
                  {selectedDocForPreview.title}
                </h3>
                <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 truncate mt-0.5">
                  <span className="truncate">{selectedDocForPreview.subject}</span>
                  <span>•</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{selectedDocForPreview.targetClass}</span>
                  <span>•</span>
                  <span>{totalPages} Pages</span>
                </div>
              </div>
            </div>

            {/* Close Button: Fixed in top right, never cut off */}
            <button
              id="btn-close-doc-modal"
              aria-label="Close Preview"
              onClick={() => setSelectedDocForPreview(null)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-slate-200/90 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              title="Close Reader"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Action Row: Mode Toggles & Action Buttons */}
          <div className="px-3 sm:px-5 py-2 flex items-center justify-between gap-2 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-200/90 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'notes'
                    ? 'bg-white dark:bg-slate-700 text-[#0066FF] dark:text-blue-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Digital Book ({totalPages}P)</span>
              </button>

              {pdfCanvasUrl && (
                <button
                  type="button"
                  onClick={() => setActiveTab('pdf')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'pdf'
                      ? 'bg-white dark:bg-slate-700 text-[#0066FF] dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Canvas View</span>
                </button>
              )}

              {driveEmbedUrl && (
                <button
                  type="button"
                  onClick={() => setActiveTab('drive')}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === 'drive'
                      ? 'bg-white dark:bg-slate-700 text-[#0066FF] dark:text-blue-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  <span>Drive Preview</span>
                </button>
              )}
            </div>

            {/* Offline & Download Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
              <button
                type="button"
                id="btn-save-offline-modal"
                onClick={handleSaveOffline}
                disabled={isOfflineSaved}
                className={`h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  isOfflineSaved
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-95'
                }`}
                title="Save note to offline vault"
              >
                {isOfflineSaved ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <DownloadCloud className="w-3.5 h-3.5" />}
                <span className="text-[11px] font-bold whitespace-nowrap">{isOfflineSaved ? 'Saved' : 'Save Offline'}</span>
              </button>

              <button
                type="button"
                id="btn-download-doc-modal"
                onClick={handleDownload}
                className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-xl bg-[#0066FF] hover:bg-blue-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                title="Download study material"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="text-[11px] whitespace-nowrap">Download</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="h-8 sm:h-9 w-8 sm:w-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hidden sm:flex items-center justify-center cursor-pointer transition-colors"
                title="Print Document"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════ VIEWER AREA ═══════════ */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-900/60 overflow-hidden flex flex-col">
          {activeTab === 'pdf' && pdfCanvasUrl ? (
            <div className="w-full h-full p-1.5 sm:p-4 flex flex-col bg-slate-950">
              <PdfCanvasViewer
                url={pdfCanvasUrl}
                title={selectedDocForPreview.title}
                subtitle={`${selectedDocForPreview.subject} • ${selectedDocForPreview.targetClass}`}
                contentSnippet={selectedDocForPreview.previewContent}
                totalDocPages={totalPages}
              />
            </div>
          ) : activeTab === 'drive' && driveEmbedUrl ? (
            <div className="w-full h-full p-2 sm:p-4 flex flex-col bg-slate-900">
              <iframe
                src={driveEmbedUrl}
                title={selectedDocForPreview.title}
                className="w-full h-full border-0 rounded-2xl bg-white shadow-xl"
                allow="autoplay; fullscreen"
              />
            </div>
          ) : (
            /* ═══════════ DIGITAL BOOK READER (100% RELIABLE & BEAUTIFUL) ═══════════ */
            <div className="flex-1 overflow-y-auto p-2 sm:p-6 flex flex-col items-center">
              
              {/* Sticky Top Toolbar: Pagination, Theme Switcher & Zoom */}
              <div className="w-full max-w-3xl mb-3 sm:mb-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-2 sm:p-2.5 flex items-center justify-between gap-2 shadow-xs shrink-0 select-none flex-wrap">
                {/* Page Navigation */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={currentNotePage <= 1}
                    onClick={() => setCurrentNotePage(prev => Math.max(1, prev - 1))}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }).map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentNotePage(idx + 1)}
                        className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                          currentNotePage === idx + 1
                            ? 'bg-[#0066FF] text-white shadow-xs scale-105'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        Page {idx + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    disabled={currentNotePage >= totalPages}
                    onClick={() => setCurrentNotePage(prev => Math.min(totalPages, prev + 1))}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Theme Selector & Zoom */}
                <div className="flex items-center gap-2 ml-auto">
                  {/* Theme Switcher */}
                  <div className="flex items-center gap-0.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setReadingTheme('light')}
                      className={`px-2 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
                        readingTheme === 'light' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'
                      }`}
                      title="Day Theme"
                    >
                      <Sun className="w-3 h-3" />
                      <span className="hidden sm:inline">Day</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReadingTheme('sepia')}
                      className={`px-2 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
                        readingTheme === 'sepia' ? 'bg-[#faebd7] text-amber-900 shadow-xs' : 'text-slate-500'
                      }`}
                      title="Sepia Comfort Theme"
                    >
                      <Coffee className="w-3 h-3" />
                      <span className="hidden sm:inline">Sepia</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setReadingTheme('dark')}
                      className={`px-2 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all ${
                        readingTheme === 'dark' ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-500'
                      }`}
                      title="Night Theme"
                    >
                      <Moon className="w-3 h-3" />
                      <span className="hidden sm:inline">Night</span>
                    </button>
                  </div>

                  {/* Zoom Controls */}
                  <div className="hidden sm:flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-0.5">
                    <button
                      type="button"
                      onClick={() => setZoomLevel(prev => Math.max(80, prev - 10))}
                      className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg cursor-pointer"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[11px] font-mono font-bold px-1 text-slate-700 dark:text-slate-300">{zoomLevel}%</span>
                    <button
                      type="button"
                      onClick={() => setZoomLevel(prev => Math.min(140, prev + 10))}
                      className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg cursor-pointer"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Book Sheet Container */}
              <div
                style={{
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center',
                  maxWidth: '780px'
                }}
                className={`w-full rounded-2xl sm:rounded-3xl shadow-xl border p-4 sm:p-8 space-y-6 transition-all duration-200 select-none ${
                  readingTheme === 'dark'
                    ? 'bg-[#0f172a] text-slate-100 border-slate-800 shadow-slate-950/60'
                    : readingTheme === 'sepia'
                    ? 'bg-[#fbf7ee] text-[#3e2c1c] border-[#ebdcc4] shadow-amber-900/10'
                    : 'bg-white text-slate-900 border-slate-200/90 shadow-slate-200/60 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800'
                }`}
              >
                {/* Book Header Band */}
                <div className="border-b-2 border-blue-600/20 pb-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-blue-600 text-white font-black text-[9px] uppercase tracking-wider">
                        L.C.C. Study Module
                      </span>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
                        Academic Council Verified • 2026–27
                      </span>
                    </div>
                    <h2 className="text-base sm:text-xl font-black mt-1.5 tracking-tight">
                      {selectedDocForPreview.title}
                    </h2>
                    <p className="text-xs font-semibold opacity-75 mt-0.5">
                      {selectedDocForPreview.subject} • {selectedDocForPreview.targetClass}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0066FF] to-blue-700 text-white font-black flex items-center justify-center text-xs shadow-sm shrink-0">
                    LCC
                  </div>
                </div>

                {/* ═══════════ PAGE CONTENT VIEW ═══════════ */}
                {currentNotePage === 1 ? (
                  /* ── PAGE 1: CORE THEORY & CONCEPTS ── */
                  <div className="space-y-5 text-xs sm:text-sm leading-relaxed">
                    <div className="flex items-center justify-between border-b pb-2.5 border-slate-200/60 dark:border-slate-800/60">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-extrabold text-[11px] uppercase tracking-wider border border-blue-200/50 dark:border-blue-800/40">
                        Page 1 of {totalPages}: Theoretical Foundations & Key Rules
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        ✓ Official Curriculum
                      </span>
                    </div>

                    {isVocabDoc ? (
                      /* VOCABULARY LIST CONTENT */
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/50 space-y-2">
                          <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4" />
                            <span>High-Frequency Spoken Vocabulary Mastery:</span>
                          </h4>
                          <p className="font-medium text-xs sm:text-sm leading-relaxed">
                            Mastering everyday conversational English requires fluent command over active vocabulary rather than passive memorization. Practice these expressions daily in sentences.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { word: 'Eloquence', type: 'Noun', mean: 'Fluent and persuasive speaking', ex: 'Her eloquence on the stage impressed the entire panel.' },
                            { word: 'Persist', type: 'Verb', mean: 'Continue firmly despite difficulties', ex: 'If you persist with daily practice, hesitation disappears.' },
                            { word: 'Articulate', type: 'Adj/Verb', mean: 'Express ideas clearly and distinctly', ex: 'He is able to articulate complex thoughts effortlessly.' },
                            { word: 'Impromptu', type: 'Adj', mean: 'Done without prior preparation', ex: 'She gave an impressive impromptu speech during the debate.' }
                          ].map((item, i) => (
                            <div key={i} className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-black text-xs text-blue-600 dark:text-blue-400">{item.word}</span>
                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{item.type}</span>
                              </div>
                              <p className="text-xs font-semibold">{item.mean}</p>
                              <p className="text-[11px] italic opacity-75">“{item.ex}”</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : isMannersDoc ? (
                      /* GOOD MANNERS CONTENT */
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/50 space-y-2">
                          <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4" />
                            <span>Essential Classroom & Social Etiquette Standards:</span>
                          </h4>
                          <p className="font-medium text-xs sm:text-sm leading-relaxed">
                            Good manners and graceful etiquette are the foundation of student character and leadership. Always practice courteous behavior in school, coaching, and society.
                          </p>
                        </div>

                        <div className="space-y-2.5">
                          {[
                            { title: 'The 5 Courteous Expressions:', desc: 'Please, Thank you, Excuse me, I am sorry, and Pardon. Use them naturally and sincerely every day.' },
                            { title: 'Respectful Greetings:', desc: 'Greet teachers, elders, and peers with a pleasant smile and clear eye contact.' },
                            { title: 'Classroom Decorum:', desc: 'Raise your hand before speaking. Listen actively without interrupting classmates or instructors.' },
                            { title: 'Attentive Body Language:', desc: 'Sit upright, maintain positive posture, and avoid slumping or using phones during lectures.' }
                          ].map((rule, idx) => (
                            <div key={idx} className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
                              <span className="font-bold text-xs text-blue-600 dark:text-blue-400 block">{rule.title}</span>
                              <span className="text-xs font-medium opacity-90 mt-0.5 block">{rule.desc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* GENERAL ACADEMIC NOTES */
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/50 space-y-2">
                          <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4" />
                            <span>Core Concept Theory & Chapter Analysis:</span>
                          </h4>
                          <p className="font-medium text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                            {selectedDocForPreview.previewContent || 'Comprehensive theoretical study notes, definitions, conceptual explanations, and derivations prepared by L.C.C. faculty.'}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-xs font-black uppercase tracking-wider opacity-90">Essential Chapter Principles:</h4>
                          <ul className="space-y-1.5 text-xs opacity-90 list-disc list-inside">
                            <li><strong>Standard Definitions:</strong> Strictly compliant with state and central board standards.</li>
                            <li><strong>Conceptual Logic:</strong> Intuitive step-by-step breakdowns for rapid exam recall.</li>
                            <li><strong>Key Warnings:</strong> Common mistakes highlighted to prevent score deductions.</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Faculty Callout Box */}
                    <div className="p-3.5 rounded-2xl border border-dashed border-amber-300 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 text-xs space-y-1">
                      <span className="font-black text-xs">💡 Director Aman Singh Gautam's Guidance:</span>
                      <p className="leading-relaxed font-medium">
                        “Regular revision and structured practice are the secrets to exam mastery. Proceed to Page 2 for practical drills and formula summaries.”
                      </p>
                    </div>

                    {/* Bottom Navigation to Page 2 */}
                    {totalPages > 1 && (
                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setCurrentNotePage(2)}
                          className="h-10 px-5 rounded-xl bg-gradient-to-r from-[#0066FF] to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-black text-xs cursor-pointer shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
                        >
                          <span>Continue to Page 2</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* ── PAGE 2: SOLVED EXAMPLES & FORMULAS ── */
                  <div className="space-y-5 text-xs sm:text-sm leading-relaxed">
                    <div className="flex items-center justify-between border-b pb-2.5 border-slate-200/60 dark:border-slate-800/60">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-extrabold text-[11px] uppercase tracking-wider border border-emerald-200/50 dark:border-emerald-800/40">
                        Page 2 of {totalPages}: Practice Exercises & Key Formulas
                      </span>
                      <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                        High-Yield Revision
                      </span>
                    </div>

                    {isVocabDoc ? (
                      /* VOCABULARY PAGE 2 */
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 space-y-2">
                          <h4 className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                            📝 Daily Conversational Dialogue Drill:
                          </h4>
                          <p className="text-xs leading-relaxed font-medium">
                            Practice this standard conversation template out loud twice every morning to develop natural speech rhythm:
                          </p>
                        </div>

                        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                          <p><strong>Speaker A:</strong> “Excuse me, could you please clarify the key distinction between these two topics?”</p>
                          <p><strong>Speaker B:</strong> “Certainly! The primary difference lies in the application of standard principles.”</p>
                          <p><strong>Speaker A:</strong> “Thank you very much. I appreciate your thoughtful guidance.”</p>
                        </div>

                        <div className="space-y-2">
                          <h5 className="font-black text-xs uppercase tracking-wider">Common English Errors Eliminated:</h5>
                          <div className="space-y-1.5 text-xs">
                            <p className="text-red-500 line-through">❌ “I didn't knew the answer.”</p>
                            <p className="text-emerald-600 dark:text-emerald-400 font-bold">✔️ “I didn't know the answer.” (Did + V1)</p>
                            <p className="text-red-500 line-through mt-2">❌ “He told to me yesterday.”</p>
                            <p className="text-emerald-600 dark:text-emerald-400 font-bold">✔️ “He told me yesterday.” (No 'to' after told)</p>
                          </div>
                        </div>
                      </div>
                    ) : isMannersDoc ? (
                      /* GOOD MANNERS PAGE 2 */
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 space-y-2">
                          <h4 className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                            🌟 Real-Life Scenarios & Behavioral Code:
                          </h4>
                          <p className="text-xs leading-relaxed font-medium">
                            True manners are tested in everyday situations with classmates, family, and online communication:
                          </p>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                            <strong>1. Digital Messaging Etiquette:</strong> Avoid sending single-word messages in study groups. Use polite, complete sentences.
                          </div>
                          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                            <strong>2. Public & Campus Cleanliness:</strong> Keep classrooms tidy, dispose of waste in dustbins, and respect institute furniture.
                          </div>
                          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                            <strong>3. Gratitude Towards Staff:</strong> Always thank the coaching assistants, bus drivers, and office helpers with warm courtesy.
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* GENERAL ACADEMIC PAGE 2 */
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/50 space-y-2">
                          <h4 className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                            📝 Essential Formulas & Derivations Summary:
                          </h4>
                          <ul className="space-y-2 text-xs">
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span><strong>Key Governing Equations:</strong> All primary formulas, algebraic forms, and SI unit standards.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span><strong>Frequently Repeated Questions:</strong> High-probability question types selected from last 10 years papers.</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                              <span><strong>Step Marking Rubric:</strong> Presentation steps to secure full marks in long answers.</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    )}

                    {/* Bottom Navigation Buttons */}
                    <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setCurrentNotePage(1)}
                        className="h-10 px-4 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs cursor-pointer flex items-center gap-1.5 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Back to Page 1</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleSaveOffline}
                        className="h-10 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      >
                        <DownloadCloud className="w-4 h-4" />
                        <span>Save to Phone</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Book Footer */}
                <div className="pt-3 border-t border-slate-500/15 flex items-center justify-between text-[11px] opacity-75">
                  <span>Verified L.C.C. Academic Council • Read-Only</span>
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    Page {currentNotePage} of {totalPages}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
