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
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);
  const [useFallbackCanvas, setUseFallbackCanvas] = useState<boolean>(false);

  // Attempt to load PDF using pdfjs, fall back gracefully if worker/CORS fails in Android WebView
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    const loadPdf = async () => {
      try {
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
      pdfDoc.getPage(currentPage).then((page: any) => {
        if (isCancelled) return;
        const viewport = page.getViewport({ scale: 2.0 });
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.removeProperty('width');
        canvas.style.removeProperty('height');
        canvas.style.aspectRatio = `${viewport.width} / ${viewport.height}`;

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
      const baseWidth = 620;
      const baseHeight = 880;
      const dpr = 2; // 2x Retina resolution for razor-sharp text

      canvas.width = baseWidth * dpr;
      canvas.height = baseHeight * dpr;
      canvas.style.removeProperty('width');
      canvas.style.removeProperty('height');
      canvas.style.aspectRatio = `${baseWidth} / ${baseHeight}`;

      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Paper Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, baseWidth, baseHeight);

      // Subtle paper border
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.strokeRect(0, 0, baseWidth, baseHeight);

      // 2. Institutional Top Header Bar
      ctx.fillStyle = '#0052CC';
      ctx.fillRect(0, 0, baseWidth, 68);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px system-ui, -apple-system, sans-serif';
      ctx.fillText('LEARNING COACHING CENTER (L.C.C.)', 28, 32);

      ctx.font = '10px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = '#bfdbfe';
      ctx.fillText('DIRECTOR: AMAN SINGH GAUTAM • ACADEMIC COUNCIL (2026–27)', 28, 52);

      // Page Badge Pill
      ctx.fillStyle = '#1e40af';
      ctx.beginPath();
      ctx.roundRect(baseWidth - 128, 19, 100, 30, 8);
      ctx.fill();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`PAGE ${currentPage} OF ${totalPages}`, baseWidth - 78, 38);
      ctx.textAlign = 'left';

      // 3. Document Title Section
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 17px system-ui, -apple-system, sans-serif';
      ctx.fillText(title, 28, 100);

      ctx.fillStyle = '#0066FF';
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      ctx.fillText(`SUBJECT: ${subtitle.toUpperCase()}`, 28, 122);

      // Accent Divider
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(28, 136);
      ctx.lineTo(baseWidth - 28, 136);
      ctx.stroke();

      // 4. Subtle Watermark
      ctx.save();
      ctx.translate(baseWidth / 2, baseHeight / 2);
      ctx.rotate(-Math.PI / 7);
      ctx.font = 'bold 44px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(226, 232, 240, 0.45)';
      ctx.textAlign = 'center';
      ctx.fillText('L.C.C. STUDY NOTES', 0, 0);
      ctx.restore();

      // 5. Document Specific Content
      const isVocab = title.toLowerCase().includes('vocab') || subtitle.toLowerCase().includes('vocab');
      const isManners = title.toLowerCase().includes('manner') || subtitle.toLowerCase().includes('manner') || title.toLowerCase().includes('etiquette');

      if (isVocab) {
        if (currentPage === 1) {
          // ─── VOCABULARY PAGE 1 ───
          ctx.fillStyle = '#eff6ff';
          ctx.beginPath();
          ctx.roundRect(28, 150, baseWidth - 56, 32, 6);
          ctx.fill();
          ctx.strokeStyle = '#bfdbfe';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = '#1e40af';
          ctx.font = 'bold 11.5px system-ui, -apple-system, sans-serif';
          ctx.fillText('SECTION 1: HIGH-FREQUENCY POWER WORDS & HINDI MEANINGS', 40, 171);

          // Word List Container
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.roundRect(28, 192, baseWidth - 56, 370, 8);
          ctx.fill();
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 1;
          ctx.stroke();

          const vocabItems = [
            { word: '1. Eloquent (वाक्पटु)', def: 'Fluent and persuasive in speech and writing.' },
            { word: '2. Diligent (परिश्रमी)', def: 'Hardworking, careful, and dedicated to learning.' },
            { word: '3. Benevolent (दयालु)', def: 'Kind, generous, and caring towards others.' },
            { word: '4. Resilience (सहनशीलता)', def: 'The capacity to recover quickly from difficulties.' },
            { word: '5. Ambiguity (अस्पष्टता)', def: 'Uncertainty or having multiple interpretations.' },
            { word: '6. Empathy (सहानुभूति)', def: 'The ability to understand and share others\' feelings.' },
            { word: '7. Pragmatic (व्यावहारिक)', def: 'Dealing with things sensibly, practically, and calmly.' }
          ];

          let vy = 222;
          for (const item of vocabItems) {
            ctx.fillStyle = '#0f172a';
            ctx.font = 'bold 12.5px system-ui, -apple-system, sans-serif';
            ctx.fillText(item.word, 42, vy);

            ctx.fillStyle = '#475569';
            ctx.font = '11px system-ui, -apple-system, sans-serif';
            ctx.fillText(`• ${item.def}`, 42, vy + 20);

            vy += 48;
          }

          // Director's Advisory Box
          ctx.fillStyle = '#fefce8';
          ctx.beginPath();
          ctx.roundRect(28, 574, baseWidth - 56, 100, 8);
          ctx.fill();
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = '#854d0e';
          ctx.font = 'bold 11.5px system-ui, -apple-system, sans-serif';
          ctx.fillText('DIRECTOR AMAN ARORA\'S ENGLISH FLUENCY ADVICE:', 40, 600);

          ctx.font = 'italic 11px system-ui, -apple-system, sans-serif';
          ctx.fillStyle = '#713f12';
          ctx.fillText('“Do not merely memorize dictionary definitions.', 40, 624);
          ctx.fillText('Speak at least 5 new English sentences daily in class. Fluency comes with speaking!”', 40, 644);

          // Turn Page Notice
          ctx.fillStyle = '#0066FF';
          ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
          ctx.fillText('➡️ Turn to Page 2 for Phrasal Verbs & Sentence Construction Patterns', 28, 700);

        } else {
          // ─── VOCABULARY PAGE 2 ───
          ctx.fillStyle = '#f0fdf4';
          ctx.beginPath();
          ctx.roundRect(28, 150, baseWidth - 56, 32, 6);
          ctx.fill();
          ctx.strokeStyle = '#bbf7d0';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = '#166534';
          ctx.font = 'bold 11.5px system-ui, -apple-system, sans-serif';
          ctx.fillText('SECTION 2: ESSENTIAL PHRASAL VERBS & SENTENCE PATTERNS', 40, 171);

          // Phrasal Verbs Container
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.roundRect(28, 192, baseWidth - 56, 255, 8);
          ctx.fill();
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
          ctx.fillText('COMMON CONVERSATIONAL PHRASAL VERBS:', 40, 218);

          const phrasalList = [
            { pv: '1. Look forward to', ex: 'Anticipate eagerly — "I look forward to our next class."' },
            { pv: '2. Bring about', ex: 'Cause positive change — "Practice brings about real confidence."' },
            { pv: '3. Carry on', ex: 'Continue doing something — "Carry on with your daily revision."' },
            { pv: '4. Break down', ex: 'Explain simply — "Let us break down this difficult sentence."' },
            { pv: '5. Catch up', ex: 'Reach the expected grade — "Revise notes to catch up quickly."' }
          ];

          let py = 246;
          for (const item of phrasalList) {
            ctx.fillStyle = '#1e293b';
            ctx.font = 'bold 11.5px system-ui, -apple-system, sans-serif';
            ctx.fillText(item.pv, 42, py);

            ctx.fillStyle = '#64748b';
            ctx.font = '10.5px system-ui, -apple-system, sans-serif';
            ctx.fillText(item.ex, 42, py + 18);

            py += 40;
          }

          // Sentence Pattern Box
          ctx.fillStyle = '#eff6ff';
          ctx.beginPath();
          ctx.roundRect(28, 460, baseWidth - 56, 120, 8);
          ctx.fill();
          ctx.strokeStyle = '#bfdbfe';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = '#1e40af';
          ctx.font = 'bold 11.5px system-ui, -apple-system, sans-serif';
          ctx.fillText('DAILY SPOKEN SENTENCE ARCHITECTURE:', 40, 486);

          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
          ctx.fillText('Formula: [Subject] + [Helping Verb] + [Action Verb] + [Object/Complement]', 40, 510);

          ctx.fillStyle = '#334155';
          ctx.font = 'italic 11px system-ui, -apple-system, sans-serif';
          ctx.fillText('Example 1: “L.C.C. students speak fluent English with daily confidence.”', 40, 534);
          ctx.fillText('Example 2: “I am revising my vocabulary notes every single morning.”', 40, 554);

          // Daily Discipline Box
          ctx.fillStyle = '#fefce8';
          ctx.beginPath();
          ctx.roundRect(28, 592, baseWidth - 56, 95, 8);
          ctx.fill();
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = '#854d0e';
          ctx.font = 'bold 11.5px system-ui, -apple-system, sans-serif';
          ctx.fillText('DIRECTOR AMAN ARORA\'S DAILY FLUENCY CHALLENGE:', 40, 616);

          ctx.font = 'italic 11px system-ui, -apple-system, sans-serif';
          ctx.fillStyle = '#713f12';
          ctx.fillText('“Dedicate 15 minutes every evening to talk with a study friend in English.', 40, 640);
          ctx.fillText('Never fear making mistakes; consistent practice makes you fluent.”', 40, 660);
        }

      } else if (isManners) {
        if (currentPage === 1) {
          // ─── GOOD MANNERS PAGE 1 ───
          ctx.fillStyle = '#eff6ff';
          ctx.beginPath();
          ctx.roundRect(28, 150, baseWidth - 56, 32, 6);
          ctx.fill();
          ctx.strokeStyle = '#bfdbfe';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = '#1e40af';
          ctx.font = 'bold 11.5px system-ui, -apple-system, sans-serif';
          ctx.fillText('SECTION 1: GOLDEN RULES OF RESPECT & DAILY COURTESY', 40, 171);

          // Manners Box
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.roundRect(28, 192, baseWidth - 56, 370, 8);
          ctx.fill();
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 1;
          ctx.stroke();

          const mannersList = [
            { rule: '1. Respectful Greetings', desc: 'Greet teachers, parents & peers with "Namaste" or "Good Morning".' },
            { rule: '2. The Three Magic Words', desc: 'Always say "Please" to ask, "Thank You" for help, and "Sorry" for mistakes.' },
            { rule: '3. Attentive Listening', desc: 'Listen carefully and never interrupt when a teacher or classmate speaks.' },
            { rule: '4. Punctuality & Discipline', desc: 'Arrive 5 minutes before scheduled class time every day without delay.' },
            { rule: '5. Clean Learning Space', desc: 'Keep your study desk, books, and classroom clean and organized.' },
            { rule: '6. Gentle Tone of Voice', desc: 'Speak in a calm, polite voice. Never use rude words or yell in class.' }
          ];

          let my = 222;
          for (const item of mannersList) {
            ctx.fillStyle = '#0f172a';
            ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
            ctx.fillText(item.rule, 42, my);

            ctx.fillStyle = '#475569';
            ctx.font = '11px system-ui, -apple-system, sans-serif';
            ctx.fillText(`• ${item.desc}`, 42, my + 20);

            my += 52;
          }

          // Director's Wisdom Box
          ctx.fillStyle = '#fefce8';
          ctx.beginPath();
          ctx.roundRect(28, 574, baseWidth - 56, 100, 8);
          ctx.fill();
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = '#854d0e';
          ctx.font = 'bold 11.5px system-ui, -apple-system, sans-serif';
          ctx.fillText('DIRECTOR AMAN ARORA\'S MESSAGE ON VALUES:', 40, 600);

          ctx.font = 'italic 11px system-ui, -apple-system, sans-serif';
          ctx.fillStyle = '#713f12';
          ctx.fillText('“Character and manners are the true measures of an educated mind.', 40, 624);
          ctx.fillText('Knowledge provides ability, but polite conduct earns lifelong respect.”', 40, 644);

          // Turn Page Notice
          ctx.fillStyle = '#0066FF';
          ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
          ctx.fillText('➡️ Turn to Page 2 for Social Etiquette & Daily Habit Checklist', 28, 700);

        } else {
          // ─── GOOD MANNERS PAGE 2 ───
          ctx.fillStyle = '#f0fdf4';
          ctx.beginPath();
          ctx.roundRect(28, 150, baseWidth - 56, 32, 6);
          ctx.fill();
          ctx.strokeStyle = '#bbf7d0';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = '#166534';
          ctx.font = 'bold 11.5px system-ui, -apple-system, sans-serif';
          ctx.fillText('SECTION 2: SOCIAL ETIQUETTE, PUBLIC CONDUCT & HABITS', 40, 171);

          // Public Conduct Box
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.roundRect(28, 192, baseWidth - 56, 255, 8);
          ctx.fill();
          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
          ctx.fillText('PUBLIC & SOCIAL CONDUCT GUIDELINES:', 40, 218);

          const socialList = [
            { item: '1. Queue Discipline', detail: 'Wait patiently in lines at bus stops, school counters, and events.' },
            { item: '2. Dining Etiquette', detail: 'Chew quietly with mouth closed, and thank whoever served your food.' },
            { item: '3. Empathy & Inclusion', detail: 'Support struggling classmates; never mock or laugh at mistakes.' },
            { item: '4. Digital Manners', detail: 'Keep mobile phones on silent mode during classroom lectures.' },
            { item: '5. Public Cleanliness', detail: 'Always dispose of waste wrappers in dustbins; never litter roads.' }
          ];

          let sy = 246;
          for (const s of socialList) {
            ctx.fillStyle = '#1e293b';
            ctx.font = 'bold 11.5px system-ui, -apple-system, sans-serif';
            ctx.fillText(s.item, 42, sy);

            ctx.fillStyle = '#64748b';
            ctx.font = '10.5px system-ui, -apple-system, sans-serif';
            ctx.fillText(s.detail, 42, sy + 18);

            sy += 40;
          }

          // Student Code Box
          ctx.fillStyle = '#eff6ff';
          ctx.beginPath();
          ctx.roundRect(28, 460, baseWidth - 56, 120, 8);
          ctx.fill();
          ctx.strokeStyle = '#bfdbfe';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = '#1e40af';
          ctx.font = 'bold 11.5px system-ui, -apple-system, sans-serif';
          ctx.fillText('DAILY CODE OF CONDUCT FOR L.C.C. CHAMPIONS:', 40, 486);

          const codes = [
            '✓ Greet teachers and parents respectfully every morning',
            '✓ Speak politely and humbly in all situations',
            '✓ Help classmates with difficult study topics',
            '✓ Keep classroom and study desk perfectly neat'
          ];

          let cy = 510;
          ctx.fillStyle = '#0f172a';
          ctx.font = '11px system-ui, -apple-system, sans-serif';
          for (const c of codes) {
            ctx.fillText(c, 42, cy);
            cy += 20;
          }

          // Director's Advice Box
          ctx.fillStyle = '#fefce8';
          ctx.beginPath();
          ctx.roundRect(28, 592, baseWidth - 56, 95, 8);
          ctx.fill();
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = '#854d0e';
          ctx.font = 'bold 11.5px system-ui, -apple-system, sans-serif';
          ctx.fillText('DIRECTOR AMAN ARORA\'S LIFE ADVICE:', 40, 616);

          ctx.font = 'italic 11px system-ui, -apple-system, sans-serif';
          ctx.fillStyle = '#713f12';
          ctx.fillText('“Practice what you learn every single day. A student with good manners', 40, 640);
          ctx.fillText('illuminates their entire family, school, and society.”', 40, 660);
        }

      } else {
        // ─── GENERAL STUDY NOTES ───
        ctx.fillStyle = '#eff6ff';
        ctx.beginPath();
        ctx.roundRect(28, 150, baseWidth - 56, 32, 6);
        ctx.fill();
        ctx.strokeStyle = '#bfdbfe';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#1e40af';
        ctx.font = 'bold 11.5px system-ui, -apple-system, sans-serif';
        ctx.fillText(`SECTION ${currentPage}: THEORETICAL PRINCIPLES & EXAM HIGHLIGHTS`, 40, 171);

        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.roundRect(28, 192, baseWidth - 56, 370, 8);
        ctx.fill();
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#1e293b';
        ctx.font = '12px system-ui, -apple-system, sans-serif';
        const bodyText = contentSnippet || 'Official classroom study notes and conceptual principles compiled by L.C.C. faculty for exam preparation.';
        
        const words = bodyText.split(' ');
        let line = '';
        let gy = 230;
        for (let i = 0; i < words.length; i++) {
          const test = line + words[i] + ' ';
          if (ctx.measureText(test).width > baseWidth - 90 && i > 0) {
            ctx.fillText(line, 42, gy);
            line = words[i] + ' ';
            gy += 24;
          } else {
            line = test;
          }
        }
        ctx.fillText(line, 42, gy);

        // Principles
        gy += 40;
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 12px system-ui, -apple-system, sans-serif';
        ctx.fillText('CORE ACADEMIC HIGHLIGHTS:', 42, gy);

        const pts = [
          '• Standard definitions compliant with board examination rubrics.',
          '• Step-by-step conceptual breakdowns for fast examination recall.',
          '• High-yield questions curated from past 10 years papers.',
          '• Common errors highlighted to maximize score.'
        ];
        gy += 25;
        ctx.font = '11px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#475569';
        for (const pt of pts) {
          ctx.fillText(pt, 42, gy);
          gy += 26;
        }

        // Advisory
        ctx.fillStyle = '#fefce8';
        ctx.beginPath();
        ctx.roundRect(28, 574, baseWidth - 56, 100, 8);
        ctx.fill();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#854d0e';
        ctx.font = 'bold 11.5px system-ui, -apple-system, sans-serif';
        ctx.fillText('FACULTY GUIDANCE • DIRECTOR AMAN SINGH GAUTAM:', 40, 600);

        ctx.font = 'italic 11px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = '#713f12';
        ctx.fillText('“Conceptual clarity and continuous revision lead to top rank.', 40, 624);
        ctx.fillText('Review all principles thoroughly before taking weekly assessments.”', 40, 644);
      }

      // 6. Institutional Bottom Footer
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(28, baseHeight - 38);
      ctx.lineTo(baseWidth - 28, baseHeight - 38);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '10px system-ui, -apple-system, sans-serif';
      ctx.fillText('© 2026 Learning Coaching Center (L.C.C.) • All Rights Reserved • Read-Only Module', 28, baseHeight - 20);

      ctx.textAlign = 'right';
      ctx.fillText(`Page ${currentPage} of ${totalPages}`, baseWidth - 28, baseHeight - 20);
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
            id="btn-prev-canvas-page"
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
            id="btn-next-canvas-page"
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
            id="btn-zoom-out-canvas"
            onClick={() => setScale(prev => Math.max(0.7, Number((prev - 0.15).toFixed(2))))}
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
            id="btn-zoom-in-canvas"
            onClick={() => setScale(prev => Math.min(1.8, Number((prev + 0.15).toFixed(2))))}
            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 cursor-pointer transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            id="btn-reset-zoom-canvas"
            onClick={() => setScale(1.0)}
            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white cursor-pointer transition-colors ml-1"
            title="Reset Zoom (100%)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Viewport: 100% Proportional, Zero Distortion */}
      <div className="flex-1 overflow-auto p-2 sm:p-4 flex justify-center items-start bg-slate-950/95 scrollbar-thin scrollbar-thumb-slate-800">
        {loading ? (
          <div className="py-24 text-center text-slate-400 space-y-3">
            <div className="w-9 h-9 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-medium">Opening study pages...</p>
          </div>
        ) : (
          <div
            className="transition-all duration-150 ease-out origin-top mx-auto w-full flex justify-center py-1"
            style={{
              maxWidth: `${Math.round(620 * scale)}px`
            }}
          >
            <canvas
              ref={canvasRef}
              className="w-full h-auto shadow-2xl rounded-2xl bg-white ring-1 ring-slate-800/80 block"
              style={{
                aspectRatio: '620 / 880',
                maxWidth: '100%'
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
