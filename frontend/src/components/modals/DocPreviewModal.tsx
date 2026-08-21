import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FileText, Download, X, ZoomIn, ZoomOut, Printer, CheckCircle2 } from 'lucide-react';

export const DocPreviewModal: React.FC = () => {
  const { selectedDocForPreview, setSelectedDocForPreview, incrementDownloadCount, showToast } = useApp();
  const [zoomLevel, setZoomLevel] = useState<number>(100);

  if (!selectedDocForPreview) return null;

  const handleDownload = () => {
    incrementDownloadCount(selectedDocForPreview.id);
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
                {selectedDocForPreview.targetClass} • {selectedDocForPreview.subject} • {selectedDocForPreview.pages} Pages
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
              <button
                onClick={() => setZoomLevel(Math.max(75, zoomLevel - 15))}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs text-slate-700 font-mono font-bold px-1">{zoomLevel}%</span>
              <button
                onClick={() => setZoomLevel(Math.min(150, zoomLevel + 15))}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#0066FF] transition-colors"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={() => setSelectedDocForPreview(null)}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Reading Surface */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 flex justify-center">
          <div
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-slate-200/80 p-8 sm:p-12 transition-transform duration-200 space-y-6 text-slate-800 font-serif min-h-[800px]"
          >
            {/* Document Header */}
            <div className="border-b-2 border-[#0066FF] pb-4 flex items-center justify-between">
              <div>
                <span className="text-xl font-black text-[#0066FF] font-sans tracking-tight">
                  L.C.C. (Lakshya Career Classes)
                </span>
                <span className="text-xs text-slate-500 block font-sans font-medium">Director: Aman Arora • Verified Study Material</span>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-[#0066FF] rounded-lg text-xs font-bold font-sans">
                {selectedDocForPreview.targetClass}
              </span>
            </div>

            {/* Document Title */}
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">
                Subject: {selectedDocForPreview.subject} | {selectedDocForPreview.chapter}
              </span>
              <h1 className="text-2xl font-black text-slate-900 mt-1 font-sans">
                {selectedDocForPreview.title}
              </h1>
            </div>

            {/* Content Preview */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 font-sans text-xs text-slate-700 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#0066FF] shrink-0 mt-0.5" />
                <span>
                  <strong>Academic Advisory:</strong> This study note is authored and vetted by <strong>Aman Arora</strong> and senior subject specialists for board examinations and competitive clarity.
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-900 font-sans">1. Key Conceptual Definitions & Rules:</h4>
              <p>
                {selectedDocForPreview.previewContent || 'Conceptual notes explaining fundamentals, formulas, step-by-step numerical examples, and previous 5 years repeated questions.'}
              </p>

              <h4 className="text-base font-bold text-slate-900 font-sans">2. Important Formulas & Derivation Steps:</h4>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-800 space-y-1">
                <div>• Formula 1: Fundamental Relationship Equations</div>
                <div>• Formula 2: Standard Application Laws & Dimensional Check</div>
                <div>• Formula 3: Exam Shortcut Tricks & Time Savers</div>
              </div>

              <h4 className="text-base font-bold text-slate-900 font-sans">3. Most Repeated Board Questions (2020–2025):</h4>
              <ol className="list-decimal pl-5 space-y-2 text-xs">
                <li>State and explain the fundamental law with appropriate diagrammatic illustration. (3 Marks)</li>
                <li>Derive the primary mathematical relationship and state SI units. (5 Marks)</li>
                <li>Solve the numerical given in previous board paper with complete step calculation. (3 Marks)</li>
              </ol>
            </div>

            {/* Document Footer */}
            <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400 font-sans">
              <span>Page 1 of {selectedDocForPreview.pages}</span>
              <span>L.C.C. Digital Study Vault • Helpline: +91 98765 43210</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
