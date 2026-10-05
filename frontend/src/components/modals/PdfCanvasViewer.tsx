import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, AlertCircle } from 'lucide-react';

// Configure local worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = './pdf.worker.min.mjs';
}

interface PdfCanvasViewerProps {
  url: string;
  title: string;
}

export const PdfCanvasViewer: React.FC<PdfCanvasViewerProps> = ({ url, title }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.2);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setError(null);

    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument({ url });
        const doc = await loadingTask.promise;
        if (isCancelled) return;
        setPdfDoc(doc);
        setTotalPages(doc.numPages);
        setCurrentPage(1);
        setLoading(false);
      } catch (err: any) {
        if (isCancelled) return;
        console.error('Failed to load PDF via pdfjs:', err);
        setError(err.message || 'Unable to open PDF file.');
        setLoading(false);
      }
    };

    loadPdf();
    return () => {
      isCancelled = true;
    };
  }, [url]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;
    let isCancelled = false;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        if (isCancelled) return;
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };
        await page.render(renderContext).promise;
      } catch (err) {
        console.error('Error rendering page:', err);
      }
    };

    renderPage();
    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, currentPage, scale]);

  if (error) {
    return (
      <div className="p-6 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
        <h4 className="text-sm font-black text-slate-900 dark:text-white">Direct Canvas Render Notice</h4>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white rounded-2xl overflow-hidden select-none">
      {/* Control bar */}
      <div className="p-2 sm:p-3 bg-slate-800/90 border-b border-slate-700 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1 || loading}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono px-2 font-bold text-[11px]">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages || loading}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-40 cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setScale(prev => Math.max(0.6, prev - 0.2))}
            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono text-[11px] px-1 font-bold">{Math.round(scale * 100)}%</span>
          <button
            type="button"
            onClick={() => setScale(prev => Math.min(2.5, prev + 0.2))}
            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="flex-1 overflow-auto p-4 flex justify-center items-start bg-slate-950">
        {loading ? (
          <div className="py-20 text-center text-slate-400 space-y-2">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs">Loading PDF pages for {title}...</p>
          </div>
        ) : (
          <canvas ref={canvasRef} className="shadow-2xl rounded-lg max-w-full bg-white" />
        )}
      </div>
    </div>
  );
};
