import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Download, X, ZoomIn, ZoomOut, Printer, CheckCircle2, HardDrive, ExternalLink, DownloadCloud, Check, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { recordLearningHistory } from '../../utils/learningHistory';
import { saveOfflineDoc, isDocOffline } from '../../utils/offlineStorage';
import { PdfCanvasViewer } from './PdfCanvasViewer';

export const DocPreviewModal: React.FC = () => {
  const { selectedDocForPreview, setSelectedDocForPreview, showToast, currentStudent } = useApp();
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isOfflineSaved, setIsOfflineSaved] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'pdf' | 'notes' | 'drive'>('notes');
  const [readingTheme, setReadingTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [currentNotePage, setCurrentNotePage] = useState<number>(1);

  const rawUrl = selectedDocForPreview?.googleDriveUrl || selectedDocForPreview?.downloadUrl || '';
  const driveMatch = rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || rawUrl.match(/id=([a-zA-Z0-9_-]+)/);
  const driveEmbedUrl = driveMatch ? `https://drive.google.com/file/d/${driveMatch[1]}/preview` : null;
  const isDirectPdf = rawUrl.toLowerCase().includes('.pdf') || rawUrl.startsWith('data:application/pdf') || rawUrl.includes('/pdf');
  const pdfCanvasUrl = isDirectPdf ? (rawUrl.startsWith('/') && !rawUrl.startsWith('//') ? `.${rawUrl}` : rawUrl) : null;
  const hasPdfOption = Boolean(pdfCanvasUrl || driveEmbedUrl);

  const totalPages = Math.max(1, selectedDocForPreview?.pages || 2);

  useEffect(() => {
    if (selectedDocForPreview) {
      setIsOfflineSaved(isDocOffline(selectedDocForPreview.id));
      setCurrentNotePage(1);
      setActiveTab(pdfCanvasUrl ? 'pdf' : driveEmbedUrl ? 'drive' : 'notes');
      recordLearningHistory({
        type: 'material',
        itemId: selectedDocForPreview.id,
        title: selectedDocForPreview.title,
        subject: selectedDocForPreview.subject,
        targetClass: selectedDocForPreview.targetClass,
        pages: selectedDocForPreview.pages
      }, currentStudent?.id || currentStudent?.email);
    }
  }, [selectedDocForPreview, currentStudent, pdfCanvasUrl, driveEmbedUrl]);

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
    }
  }, [selectedDocForPreview, handleSaveOffline]);

  if (!selectedDocForPreview) return null;

  const isDriveDoc = Boolean(driveEmbedUrl);

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[92vh] bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 overflow-hidden min-w-0">
            <div className="p-2 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-[#0066FF] shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">{selectedDocForPreview.title}</h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 truncate">
                <span>{selectedDocForPreview.subject} • {selectedDocForPreview.targetClass} • {totalPages} Pages</span>
                {isDriveDoc && (
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold shrink-0">
                    CLOUD DRIVE
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-auto">
            {/* View Mode Toggle */}
            <div className="flex bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-xl text-xs font-bold">
              {pdfCanvasUrl && (
                <button
                  type="button"
                  onClick={() => setActiveTab('pdf')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'pdf' ? 'bg-white dark:bg-slate-700 text-[#0066FF] dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  📄 PDF Reader
                </button>
              )}
              {driveEmbedUrl && (
                <button
                  type="button"
                  onClick={() => setActiveTab('drive')}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    activeTab === 'drive' ? 'bg-white dark:bg-slate-700 text-[#0066FF] dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  ☁️ Drive Preview
                </button>
              )}
              <button
                type="button"
                onClick={() => setActiveTab('notes')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'notes' ? 'bg-white dark:bg-slate-700 text-[#0066FF] dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                📖 Digital Book ({totalPages}P)
              </button>
            </div>

            {activeTab === 'notes' && (
              <div className="hidden sm:flex items-center gap-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-1">
                <button
                  onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
                  className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold px-1 text-slate-700 dark:text-slate-300">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))}
                  className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 hidden sm:flex items-center justify-center cursor-pointer"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              type="button"
              id="btn-save-offline-modal"
              onClick={handleSaveOffline}
              disabled={isOfflineSaved}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer relative z-10 ${
                isOfflineSaved
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
              title="Save to Phone Offline Vault"
            >
              {isOfflineSaved ? <Check className="w-4 h-4" /> : <DownloadCloud className="w-4 h-4" />}
              <span className="text-[11px] font-bold">{isOfflineSaved ? 'Saved Offline' : 'Save Offline'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="px-3 sm:px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              id="btn-close-doc-modal"
              onClick={() => setSelectedDocForPreview(null)}
              className="p-2 rounded-xl bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Viewer Area */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-900/60 overflow-hidden flex flex-col">
          {activeTab === 'pdf' && pdfCanvasUrl ? (
            <div className="w-full h-full p-2 sm:p-4 flex flex-col bg-slate-950">
              <PdfCanvasViewer url={pdfCanvasUrl} title={selectedDocForPreview.title} />
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
            <div className="flex-1 p-3 sm:p-6 overflow-y-auto flex flex-col items-center">
              
              {/* Multi-Page Pagination Bar */}
              <div className="w-full max-w-2xl mb-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2.5 flex items-center justify-between gap-2 shadow-xs shrink-0 select-none">
                <button
                  type="button"
                  disabled={currentNotePage <= 1}
                  onClick={() => setCurrentNotePage(prev => Math.max(1, prev - 1))}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentNotePage(idx + 1)}
                      className={`px-3 py-1 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        currentNotePage === idx + 1
                          ? 'bg-[#0066FF] text-white shadow-xs'
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
                  className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Book Sheet */}
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                className={`w-full max-w-2xl rounded-3xl shadow-xl border p-6 sm:p-10 space-y-6 transition-all duration-200 select-none ${
                  readingTheme === 'dark'
                    ? 'bg-slate-900 text-slate-100 border-slate-800'
                    : readingTheme === 'sepia'
                    ? 'bg-[#fbf0d9] text-[#433422] border-[#ebd5b3]'
                    : 'bg-white text-slate-800 border-slate-300 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800'
                }`}
              >
                {/* Book Header */}
                <div className="border-b-2 border-blue-500/20 pb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-[#0066FF] uppercase">
                      L.C.C. Academic Council • Read-Only Study Module
                    </span>
                    <h2 className="text-xl font-black mt-0.5">{selectedDocForPreview.title}</h2>
                    <span className="text-xs font-bold opacity-75">
                      {selectedDocForPreview.subject} • {selectedDocForPreview.targetClass}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Theme selector */}
                    <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[10px] font-bold">
                      <button
                        type="button"
                        onClick={() => setReadingTheme('light')}
                        className={`px-1.5 py-0.5 rounded cursor-pointer ${readingTheme === 'light' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'}`}
                      >
                        Day
                      </button>
                      <button
                        type="button"
                        onClick={() => setReadingTheme('sepia')}
                        className={`px-1.5 py-0.5 rounded cursor-pointer ${readingTheme === 'sepia' ? 'bg-[#faebd7] text-amber-900 shadow-xs' : 'text-slate-500'}`}
                      >
                        Sepia
                      </button>
                      <button
                        type="button"
                        onClick={() => setReadingTheme('dark')}
                        className={`px-1.5 py-0.5 rounded cursor-pointer ${readingTheme === 'dark' ? 'bg-slate-950 text-white shadow-xs' : 'text-slate-500'}`}
                      >
                        Night
                      </button>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-[#0066FF] text-white font-black flex items-center justify-center text-xs shadow-xs shrink-0">
                      LCC
                    </div>
                  </div>
                </div>

                {/* Page Content View */}
                {currentNotePage === 1 ? (
                  /* ═══════════ PAGE 1: CHAPTER THEORY & CONCEPTS ═══════════ */
                  <div className="space-y-6 text-xs sm:text-sm leading-relaxed font-sans">
                    <div className="flex items-center justify-between border-b pb-2 border-slate-200/50">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#0066FF] font-black text-[11px] uppercase tracking-wider">
                        Page 1 of {totalPages}: Theoretical Foundations & Key Laws
                      </span>
                      <span className="text-[11px] font-mono opacity-60">Verified Official Syllabus</span>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200/50 space-y-2">
                      <h4 className="text-xs font-black text-[#0066FF] uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        <span>Core Concept Theory & Chapter Analysis:</span>
                      </h4>
                      <p className="whitespace-pre-line leading-relaxed font-medium">
                        {selectedDocForPreview.previewContent || 'Comprehensive theoretical study notes, definitions, conceptual explanations, and derivations prepared by L.C.C. faculty.'}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-black uppercase tracking-wider opacity-90">Essential Chapter Principles:</h4>
                      <ul className="space-y-2 text-xs opacity-90 list-disc list-inside">
                        <li><strong>Standard Definitions:</strong> Strictly compliant with state and central board curriculum standards.</li>
                        <li><strong>Conceptual Logic:</strong> Intuitive step-by-step breakdowns designed for rapid memorization and exam recall.</li>
                        <li><strong>Key Exam Warnings:</strong> Highlighted common errors made by students in board exam answering sheets.</li>
                      </ul>
                    </div>

                    <div className="p-3.5 rounded-2xl border border-dashed border-blue-300/80 bg-blue-50/30 text-xs text-blue-950 dark:text-blue-200 flex items-center justify-between">
                      <span>➡️ Continue to <strong>Page 2</strong> for Solved Examples and Formula Cheat Sheet.</span>
                      {totalPages > 1 && (
                        <button
                          type="button"
                          onClick={() => setCurrentNotePage(2)}
                          className="px-3 py-1 rounded-lg bg-[#0066FF] text-white font-bold text-xs shrink-0 cursor-pointer"
                        >
                          Go to Page 2
                        </button>
                      )}
                    </div>
                  </div>
                ) : currentNotePage === 2 ? (
                  /* ═══════════ PAGE 2: SOLVED EXAMPLES & FORMULAS ═══════════ */
                  <div className="space-y-6 text-xs sm:text-sm leading-relaxed font-sans">
                    <div className="flex items-center justify-between border-b pb-2 border-slate-200/50">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-black text-[11px] uppercase tracking-wider">
                        Page 2 of {totalPages}: Solved Questions & Formula Reference
                      </span>
                      <span className="text-[11px] font-mono opacity-60">High-Yield Board Revision</span>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200/50 space-y-3">
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
                          <span><strong>Step-by-Step Marking Steps:</strong> Systematic presentation tips to secure full marks in long-answer questions.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-2xl border border-dashed border-amber-300 bg-amber-50/70 text-amber-900 text-xs space-y-1">
                      <span className="font-black">💡 Director Aman Arora's Scoring Guidance:</span>
                      <p className="mt-0.5">Always draw neat, labelled diagrams where applicable and write down standard formulas before substituting numerical values.</p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setCurrentNotePage(1)}
                        className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                      >
                        ⬅️ Back to Page 1
                      </button>
                      {totalPages > 2 && (
                        <button
                          type="button"
                          onClick={() => setCurrentNotePage(3)}
                          className="px-3 py-1.5 rounded-lg bg-[#0066FF] text-white font-bold text-xs cursor-pointer"
                        >
                          Next Page ➡️
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  /* ═══════════ PAGE 3+: PRACTICE PROBLEMS & CHECKPOINTS ═══════════ */
                  <div className="space-y-6 text-xs sm:text-sm leading-relaxed font-sans">
                    <div className="flex items-center justify-between border-b pb-2 border-slate-200/50">
                      <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 font-black text-[11px] uppercase tracking-wider">
                        Page {currentNotePage} of {totalPages}: Practice Problem Set & Checkpoints
                      </span>
                      <span className="text-[11px] font-mono opacity-60">Curriculum Mastery</span>
                    </div>

                    <div className="p-4 sm:p-5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200/50 space-y-3">
                      <h4 className="text-xs font-black text-purple-700 dark:text-purple-400 uppercase tracking-wider">
                        🎯 Chapter Problem Set & Self-Assessment:
                      </h4>
                      <ol className="space-y-2.5 text-xs list-decimal list-inside">
                        <li>Solve textbook back-exercises without referring to hints.</li>
                        <li>Identify key derivation weak spots and re-solve them on paper.</li>
                        <li>Take the chapter mock assessment in the Student Portal to benchmark your test score.</li>
                      </ol>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setCurrentNotePage(currentNotePage - 1)}
                        className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                      >
                        ⬅️ Previous Page
                      </button>
                      {currentNotePage < totalPages && (
                        <button
                          type="button"
                          onClick={() => setCurrentNotePage(currentNotePage + 1)}
                          className="px-3 py-1.5 rounded-lg bg-[#0066FF] text-white font-bold text-xs cursor-pointer"
                        >
                          Next Page ➡️
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Book Footer */}
                <div className="pt-4 border-t border-slate-500/10 flex items-center justify-between text-[11px] opacity-60">
                  <span>Verified L.C.C. Academic Council • Read-Only</span>
                  <span className="font-mono text-emerald-600 font-bold">Page {currentNotePage} of {totalPages}</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
