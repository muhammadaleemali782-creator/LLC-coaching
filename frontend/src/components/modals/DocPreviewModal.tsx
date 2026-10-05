import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Download, X, ZoomIn, ZoomOut, Printer, CheckCircle2, HardDrive, ExternalLink, DownloadCloud, Check } from 'lucide-react';
import { recordLearningHistory } from '../../utils/learningHistory';
import { saveOfflineDoc, isDocOffline } from '../../utils/offlineStorage';

export const DocPreviewModal: React.FC = () => {
  const { selectedDocForPreview, setSelectedDocForPreview, showToast, currentStudent } = useApp();
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isOfflineSaved, setIsOfflineSaved] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'pdf' | 'notes'>('notes');
  const [readingTheme, setReadingTheme] = useState<'light' | 'sepia' | 'dark'>('light');

  const rawUrl = selectedDocForPreview?.googleDriveUrl || selectedDocForPreview?.downloadUrl || '';
  const driveMatch = rawUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || rawUrl.match(/id=([a-zA-Z0-9_-]+)/);
  const driveEmbedUrl = driveMatch ? `https://drive.google.com/file/d/${driveMatch[1]}/preview` : null;
  const isDirectPdf = rawUrl.startsWith('http') && (rawUrl.toLowerCase().includes('.pdf') || rawUrl.toLowerCase().includes('/pdf'));
  const directPdfEmbedUrl = isDirectPdf ? `https://docs.google.com/viewer?url=${encodeURIComponent(rawUrl)}&embedded=true` : null;
  const pdfEmbedUrl = driveEmbedUrl || directPdfEmbedUrl;

  useEffect(() => {
    if (selectedDocForPreview) {
      setIsOfflineSaved(isDocOffline(selectedDocForPreview.id));
      setActiveTab(pdfEmbedUrl ? 'pdf' : 'notes');
      recordLearningHistory({
        type: 'material',
        itemId: selectedDocForPreview.id,
        title: selectedDocForPreview.title,
        subject: selectedDocForPreview.subject,
        targetClass: selectedDocForPreview.targetClass,
        pages: selectedDocForPreview.pages
      }, currentStudent?.id || currentStudent?.email);
    }
  }, [selectedDocForPreview, currentStudent, pdfEmbedUrl]);

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
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden min-w-0">
            <div className="p-2 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-[#0066FF] shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">{selectedDocForPreview.title}</h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5 truncate">
                <span>{selectedDocForPreview.subject} • {selectedDocForPreview.targetClass} • {selectedDocForPreview.pages} Pages</span>
                {isDriveDoc && (
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold shrink-0">
                    CLOUD DRIVE
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 ml-auto">
            {/* View Mode Toggle if PDF embed exists */}
            {pdfEmbedUrl && (
              <div className="flex bg-slate-200/80 dark:bg-slate-800 p-0.5 rounded-xl">
                <button
                  type="button"
                  onClick={() => setActiveTab('pdf')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'pdf' ? 'bg-white dark:bg-slate-700 text-[#0066FF] dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  📄 PDF View
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('notes')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'notes' ? 'bg-white dark:bg-slate-700 text-[#0066FF] dark:text-blue-400 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  📖 Digital Notes
                </button>
              </div>
            )}

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
          {activeTab === 'pdf' && pdfEmbedUrl ? (
            <div className="w-full h-full p-2 sm:p-4 flex flex-col bg-slate-900">
              <iframe
                src={pdfEmbedUrl}
                title={selectedDocForPreview.title}
                className="w-full h-full border-0 rounded-2xl bg-white shadow-xl"
                allow="autoplay; fullscreen"
              />
            </div>
          ) : (
            <div className="flex-1 p-4 sm:p-8 overflow-y-auto flex justify-center">
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                className={`w-full max-w-2xl rounded-2xl shadow-xl border p-6 sm:p-10 space-y-6 transition-all duration-200 self-start ${
                  readingTheme === 'dark'
                    ? 'bg-slate-900 text-slate-100 border-slate-800'
                    : readingTheme === 'sepia'
                    ? 'bg-[#fbf0d9] text-[#433422] border-[#ebd5b3]'
                    : 'bg-white text-slate-800 border-slate-300 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800'
                }`}
              >
                {/* Watermark header */}
                <div className="border-b-2 border-blue-500/20 pb-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black tracking-widest text-[#0066FF] uppercase">
                      Learning Coaching Center (L.C.C.)
                    </span>
                    <h2 className="text-xl font-black mt-0.5">{selectedDocForPreview.title}</h2>
                  </div>
                  <div className="flex items-center gap-2">
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
                    <div className="w-9 h-9 rounded-xl bg-[#0066FF] text-white font-black flex items-center justify-center text-xs shadow-sm shrink-0">
                      LCC
                    </div>
                  </div>
                </div>

                {/* Module Metadata */}
                <div className="grid grid-cols-3 gap-3 p-3 bg-slate-500/5 rounded-xl border border-slate-500/10 text-xs">
                  <div>
                    <span className="text-[10px] opacity-70 block font-bold">Class / Target</span>
                    <span className="font-extrabold">{selectedDocForPreview.targetClass}</span>
                  </div>
                  <div>
                    <span className="text-[10px] opacity-70 block font-bold">Subject</span>
                    <span className="font-extrabold text-[#0066FF]">{selectedDocForPreview.subject}</span>
                  </div>
                  <div>
                    <span className="text-[10px] opacity-70 block font-bold">Total Pages</span>
                    <span className="font-extrabold text-emerald-600">{selectedDocForPreview.pages} Pages</span>
                  </div>
                </div>

                {/* Notes content */}
                <div className="space-y-5 text-xs sm:text-sm leading-relaxed font-medium">
                  <div className="p-4 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-200/50">
                    <h4 className="text-xs font-black text-[#0066FF] uppercase mb-1">Chapter Concept Synopsis:</h4>
                    <p className="leading-relaxed">{selectedDocForPreview.previewContent || 'Comprehensive theoretical study notes, core chapter concepts, and formula derivations prepared by L.C.C. faculty.'}</p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-wider opacity-90">Core Chapter Focus & Highlights:</h4>
                    <ul className="space-y-2 text-xs opacity-90">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
                        <span><strong>NCERT & Board Syllabus Coverage:</strong> Complete in-depth breakdown of theory and step-by-step numerical examples.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
                        <span><strong>Frequently Repeated Board Questions:</strong> Last 10 years high-yield board examination questions flagged for revision.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
                        <span><strong>Formula & Definition Cheat Sheet:</strong> Essential formulas, unit conversions, and key definitions compiled for rapid review.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl border border-dashed border-amber-300 bg-amber-50/70 text-amber-900 text-xs">
                    <span className="font-bold">💡 Director Aman Arora's Exam Tip:</span>
                    <p className="mt-1">Focus on conceptual clarity and revise derivations at least twice before taking chapter mock DPP tests.</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-6 border-t border-slate-500/10 flex items-center justify-between text-[11px] opacity-60">
                  <span>Verified L.C.C. Academic Council Notes</span>
                  <span className="font-mono text-emerald-500 font-bold">✓ Exam Prep Ready</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
