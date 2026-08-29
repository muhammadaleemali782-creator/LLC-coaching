import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Download, X, ZoomIn, ZoomOut, Printer, CheckCircle2, HardDrive, ExternalLink } from 'lucide-react';

export const DocPreviewModal: React.FC = () => {
  const { selectedDocForPreview, setSelectedDocForPreview, showToast } = useApp();
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  if (!selectedDocForPreview) return null;

  const isDriveDoc = selectedDocForPreview.isGoogleDrive || (selectedDocForPreview.downloadUrl && selectedDocForPreview.downloadUrl.includes('drive.google.com'));

  const handleDownload = () => {
    showToast(`Downloading ${selectedDocForPreview.title}...`, 'success');
    
    if (selectedDocForPreview.downloadUrl && selectedDocForPreview.downloadUrl.startsWith('http')) {
      window.open(selectedDocForPreview.downloadUrl, '_blank');
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
      <div className="relative w-full max-w-4xl h-[90vh] bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-2xl bg-blue-100 dark:bg-blue-900/50 text-[#0066FF] shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="text-sm font-black text-slate-900 dark:text-white truncate">{selectedDocForPreview.title}</h3>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                <span>{selectedDocForPreview.subject} • {selectedDocForPreview.targetClass} • {selectedDocForPreview.pages} Pages</span>
                {isDriveDoc && (
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold">
                    CLOUD DRIVE
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
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

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 hidden sm:flex items-center justify-center cursor-pointer"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={() => setSelectedDocForPreview(null)}
              className="p-2 rounded-xl bg-slate-200/80 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Viewer */}
        <div className="flex-1 bg-slate-100 dark:bg-slate-900/60 p-4 sm:p-8 overflow-y-auto flex justify-center">
          {selectedDocForPreview.googleDriveUrl && selectedDocForPreview.googleDriveUrl.includes('drive.google.com') ? (
            <iframe
              src={selectedDocForPreview.googleDriveUrl.replace('/view', '/preview')}
              title={selectedDocForPreview.title}
              className="w-full h-full border-0 rounded-2xl bg-white shadow-lg"
            />
          ) : (
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-300 dark:border-slate-800 p-6 sm:p-10 space-y-6 transition-transform duration-200 text-slate-800 dark:text-slate-100 self-start"
            >
              {/* Watermark header */}
              <div className="border-b-2 border-blue-500/20 pb-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-[#0066FF] uppercase">
                    Learning Coaching Center (L.C.C.)
                  </span>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{selectedDocForPreview.title}</h2>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#0066FF] text-white font-black flex items-center justify-center text-xs shadow-sm shrink-0">
                  LCC
                </div>
              </div>

              {/* Module Metadata */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Class / Target</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">{selectedDocForPreview.targetClass}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Subject</span>
                  <span className="font-extrabold text-[#0066FF]">{selectedDocForPreview.subject}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold">Total Pages</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{selectedDocForPreview.pages} Pages</span>
                </div>
              </div>

              {/* Notes content */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                <div className="p-4 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50">
                  <h4 className="text-xs font-black text-[#0066FF] uppercase mb-1">Key Chapter Overview:</h4>
                  <p>{selectedDocForPreview.previewContent}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">Curated Study Highlights:</h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0066FF]" />
                      <span>Step-by-step NCERT + Exemplar numerical derivations solved.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0066FF]" />
                      <span>Last 10 years frequently repeated Board Examination questions marked.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0066FF]" />
                      <span>Quick formula summary chart attached at the end of the chapter.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Verified Director Note • Aman Arora</span>
                <span className="font-mono text-emerald-500 font-bold">✓ Ready for Exam Prep</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
