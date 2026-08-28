import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Download, X, ZoomIn, ZoomOut, Printer, CheckCircle2 } from 'lucide-react';
import { api } from '../../api/client';

export const DocPreviewModal: React.FC = () => {
  const { selectedDocForPreview, setSelectedDocForPreview, showToast } = useApp();
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  if (!selectedDocForPreview) return null;

  const handleDownload = () => {
    api.media.deletePDF(selectedDocForPreview.id).catch(() => {});
    showToast(`Downloading ${selectedDocForPreview.title}...`, 'success');
    
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl h-[90vh] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-2xl bg-blue-100 text-[#0066FF] shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="text-sm font-black text-slate-900 truncate">{selectedDocForPreview.title}</h3>
              <span className="text-[11px] text-slate-500 font-medium">
                {selectedDocForPreview.subject} • {selectedDocForPreview.targetClass} • {selectedDocForPreview.pages} Pages
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
              <button
                onClick={() => setZoomLevel(prev => Math.max(70, prev - 10))}
                className="p-1 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-50"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold px-1 text-slate-700">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(prev => Math.min(150, prev + 10))}
                className="p-1 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-50"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hidden sm:flex items-center justify-center"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={() => setSelectedDocForPreview(null)}
              className="p-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Document Viewer Paper Simulation */}
        <div className="flex-1 bg-slate-200/60 p-4 sm:p-8 overflow-y-auto flex justify-center">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-300 p-6 sm:p-10 space-y-6 transition-transform duration-200 text-slate-800 self-start"
          >
            {/* Watermark header */}
            <div className="border-b-2 border-blue-500/20 pb-4 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black tracking-widest text-[#0066FF] uppercase">
                  LAKSHYA CAREER CLASSES (L.C.C.)
                </span>
                <h2 className="text-xl font-black text-slate-900">{selectedDocForPreview.subject} Module</h2>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-500">{selectedDocForPreview.targetClass}</span>
                <span className="text-[10px] text-emerald-600 block font-bold">Verified Notes</span>
              </div>
            </div>

            {/* Simulated Content */}
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed">
              <h4 className="font-bold text-base text-slate-900 border-l-4 border-[#0066FF] pl-2">
                Chapter: {selectedDocForPreview.chapter}
              </h4>
              <p className="text-slate-600">
                {selectedDocForPreview.previewContent ||
                  'These verified revision notes are authored by senior subject matter faculty at Lakshya Career Classes. Each section is structured according to recent CBSE and State Board pattern guidelines with marked high-yield theorems, step derivations, and recurring past board examination questions.'}
              </p>

              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
                <span className="text-xs font-bold text-[#0066FF] block">Key Formula & Definition Vault:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs">
                  <li>Fundamental Principles & Axioms (NCERT standard)</li>
                  <li>Common Student Pitfalls & Step-by-Step Marking Rules</li>
                  <li>10-Year Question Frequency Index</li>
                </ul>
              </div>

              <div className="space-y-2 pt-4">
                <span className="text-xs font-bold text-slate-800 block">Sample Board Problems & Solutions:</span>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700">
                  Q1. State and derive the primary equation for standard conditions.<br />
                  <span className="text-emerald-700 font-bold">Ans. [Detailed 5-step derivation illustrated in full PDF module.]</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-[11px] text-slate-400">
              <span>Director: Aman Arora</span>
              <span>Page 1 of {selectedDocForPreview.pages}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
