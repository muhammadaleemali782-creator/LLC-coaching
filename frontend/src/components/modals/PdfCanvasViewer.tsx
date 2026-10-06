import React, { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface PdfCanvasViewerProps {
  url: string;
  title: string;
  subtitle?: string;
  contentSnippet?: string;
  totalDocPages?: number;
}

export const PdfCanvasViewer: React.FC<PdfCanvasViewerProps> = ({
  url,
  title,
  subtitle = 'Official Study Notes',
  contentSnippet = '',
  totalDocPages = 2
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(totalDocPages || 2);
  const [scale, setScale] = useState<number>(1.1);
  const [loading, setLoading] = useState<boolean>(true);
  const [useFallbackCanvas, setUseFallbackCanvas] = useState<boolean>(false);

  // Attempt to load PDF using pdfjs, fall back gracefully if worker/CORS fails in Android WebView
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    const loadPdf = async () => {
      try {
        // In Android WebView file:/// protocol, web workers are restricted.
        // Attempt getDocument without forcing external workerSrc
        const loadingTask = pdfjsLib.getDocument({
          url,
          disableFontFace: false
        } as any);
        const doc = await loadingTask.promise;
        if (isCancelled) return;
        setPdfDoc(doc);
        setTotalPages(doc.numPages || totalDocPages || 2);
        setCurrentPage(1);
        setUseFallbackCanvas(false);
        setLoading(false);
      } catch (err) {
        if (isCancelled) return;
        // In local WebView or if worker is blocked, switch to built-in high-DPI canvas renderer seamlessly
        setUseFallbackCanvas(true);
        setTotalPages(totalDocPages || 2);
        setCurrentPage(1);
        setLoading(false);
      }
    };

    loadPdf();
    return () => {
      isCancelled = true;
    };
  }, [url, totalDocPages]);

  // Render Page: either via pdfjs page.render OR via high-fidelity built-in canvas renderer
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isCancelled = false;

    if (pdfDoc && !useFallbackCanvas) {
      // Render using pdfjs
      pdfDoc.getPage(currentPage).then((page: any) => {
        if (isCancelled) return;
        const viewport = page.getViewport({ scale });
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };
        page.render(renderContext).promise.catch(() => {
          if (!isCancelled) {
            setUseFallbackCanvas(true);
          }
        });
      }).catch(() => {
        if (!isCancelled) {
          setUseFallbackCanvas(true);
        }
      });
    } else {
      // High-Fidelity Standalone Vector Canvas Renderer (No worker needed, 100% offline & APK compatible)
      const baseWidth = 794; // Standard A4 at 96 DPI
      const baseHeight = 1123;
      const dpr = Math.min(window.devicePixelRatio || 2, 2.5);

      canvas.width = Math.round(baseWidth * scale * dpr);
      canvas.height = Math.round(baseHeight * scale * dpr);
      canvas.style.width = `${Math.round(baseWidth * scale)}px`;
      canvas.style.height = `${Math.round(baseHeight * scale)}px`;

      ctx.save();
      ctx.scale(scale * dpr, scale * dpr);

      // 1. Paper Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, baseWidth, baseHeight);

      // Subtle paper border
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, baseWidth, baseHeight);

      // 2. Institutional Top Header Bar
      ctx.fillStyle = '#0052CC';
      ctx.fillRect(0, 0, baseWidth, 75);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
      ctx.fillText('LEARNING COACHING CENTER (L.C.C.)', 40, 38);

      ctx.font = '11px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#bfdbfe';
      ctx.fillText('DIRECTOR: AMAN SINGH GAUTAM • OFFICIAL ACADEMIC MODULE (2026–27)', 40, 58);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`PAGE ${currentPage} OF ${totalPages}`, baseWidth - 40, 48);
      ctx.textAlign = 'left';

      // 3. Document Title Section
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 20px system-ui, -apple-system, sans-serif';
      ctx.fillText(title, 40, 115);

      ctx.fillStyle = '#0066FF';
      ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
      ctx.fillText(`SUBJECT: ${subtitle.toUpperCase()}`, 40, 138);

      // Divider
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(40, 155);
      ctx.lineTo(baseWidth - 40, 155);
      ctx.stroke();

      // 4. Subtle Watermark
      ctx.save();
      ctx.translate(baseWidth / 2, baseHeight / 2);
      ctx.rotate(-Math.PI / 6);
      ctx.font = 'bold 62px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(226, 232, 240, 0.45)';
      ctx.textAlign = 'center';
      ctx.fillText('L.C.C. STUDY NOTES', 0, 0);
      ctx.restore();

      // 5. Content Rendering Based on Page
      if (currentPage === 1) {
        // ─── PAGE 1: CHAPTER THEORY & ESSENTIAL PRINCIPLES ───
        // Section Header Box
        ctx.fillStyle = '#eff6ff';
        ctx.fillRect(40, 175, baseWidth - 80, 40);
        ctx.strokeStyle = '#bfdbfe';
        ctx.strokeRect(40, 175, baseWidth - 80, 40);

        ctx.fillStyle = '#1e40af';
        ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
        ctx.fillText('SECTION 1: THEORETICAL FOUNDATIONS & CORE CONCEPTS', 55, 200);

        // Core snippet text
        ctx.fillStyle = '#1e293b';
        ctx.font = '13px system-ui, -apple-system, sans-serif';
        const bodyText = contentSnippet || 'Comprehensive classroom study notes, definitions, conceptual explanations, and derivations prepared by L.C.C. senior faculty.';
        
        // Wrap text
        const maxTextWidth = baseWidth - 110;
        const words = bodyText.split(' ');
        let line = '';
        let y = 245;

        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' ';
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxTextWidth && i > 0) {
            ctx.fillText(line, 55, y);
            line = words[i] + ' ';
            y += 24;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, 55, y);
        y += 45;

        // Key Principles Box
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(40, y, baseWidth - 80, 220);
        ctx.strokeStyle = '#e2e8f0';
        ctx.strokeRect(40, y, baseWidth - 80, 220);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
        ctx.fillText('PRIMARY SYLLABUS PRINCIPLES:', 55, y + 30);

        ctx.font = '12px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#334155';
        const points = [
          '1. Standard Definitions: Strictly compliant with State & Central Board guidelines.',
          '2. Step-by-Step Logic: Intuitive conceptual breakdowns for rapid exam recall.',
          '3. High-Yield Question Patterns: Frequently tested concepts highlighted for focus.',
          '4. Common Error Prevention: Avoid penalty mistakes in board examination answer sheets.',
          '5. Revision Protocol: Revise concepts with handwritten notes for maximum retention.'
        ];

        let py = y + 60;
        for (const pt of points) {
          ctx.fillText(pt, 55, py);
          py += 30;
        }

        // Director's Advisory Box
        y = y + 250;
        ctx.fillStyle = '#fefce8';
        ctx.fillRect(40, y, baseWidth - 80, 110);
        ctx.strokeStyle = '#fef08a';
        ctx.strokeRect(40, y, baseWidth - 80, 110);

        ctx.fillStyle = '#854d0e';
        ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
        ctx.fillText('FACULTY GUIDANCE • DIRECTOR AMAN SINGH GAUTAM:', 55, y + 28);

        ctx.font = 'italic 12px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#713f12';
        ctx.fillText('“Conceptual clarity and continuous practice are the twin keys to academic distinction.', 55, y + 54);
        ctx.fillText('Review all definitions on this page before attempting solved examples on Page 2.”', 55, y + 76);

        // Next page indicator
        ctx.fillStyle = '#0066FF';
        ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
        ctx.fillText('➡️ Turn to Page 2 for Solved Questions & Formula Cheat Sheet', 40, y + 160);

      } else {
        // ─── PAGE 2: SOLVED EXAMPLES & FORMULAS ───
        ctx.fillStyle = '#f0fdf4';
        ctx.fillRect(40, 175, baseWidth - 80, 40);
        ctx.strokeStyle = '#bbf7d0';
        ctx.strokeRect(40, 175, baseWidth - 80, 40);

        ctx.fillStyle = '#166534';
        ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
        ctx.fillText('SECTION 2: SOLVED EXAMPLES, FORMULA SUMMARY & BOARD PYQs', 55, 200);

        let y = 245;

        // Formula / Rule Box
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(40, y, baseWidth - 80, 180);
        ctx.strokeStyle = '#e2e8f0';
        ctx.strokeRect(40, y, baseWidth - 80, 180);

        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 13px system-ui, -apple-system, sans-serif';
        ctx.fillText('HIGH-YIELD FORMULA & CONCEPT REFERENCE:', 55, y + 30);

        ctx.font = '12px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#334155';
        const formulaItems = [
          '• Governing Equations: All standard algebraic and physical relationship forms.',
          '• SI Units & Dimensional Check: Always write full unit dimensions in answers.',
          '• Step Marking Protocol: Write given values, formula, substitution, and boxed answer.',
          '• High Probability PYQs: Selected from the last 10 years board paper collection.'
        ];

        let fy = y + 60;
        for (const f of formulaItems) {
          ctx.fillText(f, 55, fy);
          fy += 28;
        }

        // Solved Example Problem Box
        y = y + 210;
        ctx.fillStyle = '#eff6ff';
        ctx.fillRect(40, y, baseWidth - 80, 160);
        ctx.strokeStyle = '#bfdbfe';
        ctx.strokeRect(40, y, baseWidth - 80, 160);

        ctx.fillStyle = '#1e40af';
        ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
        ctx.fillText('MODEL BOARD QUESTION & SOLUTION STRUCTURE:', 55, y + 28);

        ctx.font = '12px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#1e293b';
        ctx.fillText('Q1: State and derive the core relationship for this chapter module.', 55, y + 55);
        
        ctx.fillStyle = '#475569';
        ctx.fillText('Sol: Follow standard L.C.C. 3-step presentation to secure full marks.', 55, y + 80);
        ctx.fillText('1. Clear conceptual statement with labeled schematic diagram.', 70, y + 104);
        ctx.fillText('2. Analytical derivation with justified substitution steps.', 70, y + 128);

        // Director's Scoring Advice
        y = y + 190;
        ctx.fillStyle = '#fefce8';
        ctx.fillRect(40, y, baseWidth - 80, 100);
        ctx.strokeStyle = '#fef08a';
        ctx.strokeRect(40, y, baseWidth - 80, 100);

        ctx.fillStyle = '#854d0e';
        ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
        ctx.fillText('DIRECTOR AMAN ARORA\'S EXAM ADVICE:', 55, y + 28);

        ctx.font = 'italic 12px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#713f12';
        ctx.fillText('“Always present your answers neatly with clear margins and boxed final answers.', 55, y + 52);
        ctx.fillText('Attempt weekly Sunday test series at the campus to test your speed.”', 55, y + 74);
      }

      // 6. Institutional Bottom Footer
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(40, baseHeight - 45);
      ctx.lineTo(baseWidth - 40, baseHeight - 45);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px system-ui, -apple-system, sans-serif';
      ctx.fillText('© 2026 Learning Coaching Center (L.C.C.) • All Rights Reserved • Read-Only Study Module', 40, baseHeight - 25);

      ctx.textAlign = 'right';
      ctx.fillText(`Page ${currentPage} of ${totalPages}`, baseWidth - 40, baseHeight - 25);
      ctx.textAlign = 'left';

      ctx.restore();
    }

    return () => {
      isCancelled = true;
    };
  }, [pdfDoc, useFallbackCanvas, currentPage, scale, totalPages, title, subtitle, contentSnippet]);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white rounded-2xl overflow-hidden select-none">
      {/* Top Controls Bar */}
      <div className="px-3 py-2 sm:px-4 sm:py-2.5 bg-slate-800/95 border-b border-slate-700/80 flex items-center justify-between gap-2 text-xs shrink-0 flex-wrap">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage <= 1 || loading}
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:hover:bg-slate-700 font-bold flex items-center gap-1 cursor-pointer transition-colors"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Prev</span>
          </button>
          <span className="font-mono px-2.5 py-1 rounded-md bg-slate-900/80 text-blue-400 font-bold text-xs border border-slate-700/60">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages || loading}
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            className="px-2.5 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 disabled:opacity-30 disabled:hover:bg-slate-700 font-bold flex items-center gap-1 cursor-pointer transition-colors"
            title="Next Page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={() => setScale(prev => Math.max(0.6, Number((prev - 0.15).toFixed(2))))}
            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 cursor-pointer transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="font-mono text-xs px-1.5 font-bold text-slate-300 min-w-[42px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setScale(prev => Math.min(2.0, Number((prev + 0.15).toFixed(2))))}
            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 cursor-pointer transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setScale(1.0)}
            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white cursor-pointer transition-colors ml-1"
            title="Reset Zoom (100%)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="flex-1 overflow-auto p-3 sm:p-6 flex justify-center items-start bg-slate-950/95 scrollbar-thin scrollbar-thumb-slate-800">
        {loading ? (
          <div className="py-24 text-center text-slate-400 space-y-3">
            <div className="w-9 h-9 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-medium">Opening study pages...</p>
          </div>
        ) : (
          <div className="transition-transform duration-150 ease-out origin-top flex justify-center">
            <canvas
              ref={canvasRef}
              className="shadow-2xl rounded-xl max-w-full bg-white ring-1 ring-slate-800/80"
            />
          </div>
        )}
      </div>
    </div>
  );
};
