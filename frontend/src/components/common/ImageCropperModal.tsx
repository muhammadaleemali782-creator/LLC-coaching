import React, { useState, useRef, useEffect } from 'react';
import { X, Check, ZoomIn, ZoomOut, RotateCw, FlipHorizontal, RefreshCw, Crop, Move } from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  onApplyCrop: (croppedDataUrl: string) => void;
}

type AspectRatio = '1:1' | '16:9' | '4:5' | '9:16' | 'free';

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  imageUrl,
  onClose,
  onApplyCrop
}) => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Reset state when opening with a new image
  useEffect(() => {
    if (!isOpen || !imageUrl) return;

    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setPan({ x: 0, y: 0 });
    setImageLoaded(false);
    setLoadError(null);

    const img = new Image();
    img.crossOrigin = 'anonymous';

    // Wrap external URLs with weserv proxy to guarantee CORS allow-origin
    let safeUrl = imageUrl;
    if (safeUrl.startsWith('http') && !safeUrl.includes('images.weserv.nl')) {
      safeUrl = "https://images.weserv.nl/?url=" + encodeURIComponent(safeUrl);
    }

    img.onload = () => {
      imageRef.current = img;
      setImageLoaded(true);
      setLoadError(null);
    };

    img.onerror = () => {
      // Fallback: try raw url without proxy
      const rawImg = new Image();
      rawImg.onload = () => {
        imageRef.current = rawImg;
        setImageLoaded(true);
        setLoadError(null);
      };
      rawImg.onerror = () => {
        setLoadError('Failed to load image for cropping.');
      };
      rawImg.src = imageUrl;
    };

    img.src = safeUrl;
  }, [isOpen, imageUrl]);

  // Redraw canvas whenever parameters change
  useEffect(() => {
    if (!imageLoaded || !imageRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imageRef.current;
    const cw = canvas.width;
    const ch = canvas.height;

    ctx.clearRect(0, 0, cw, ch);

    // Dark backdrop
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, cw, ch);

    ctx.save();
    ctx.translate(cw / 2 + pan.x, ch / 2 + pan.y);
    ctx.rotate((rotation * Math.PI) / 180);
    if (flipH) ctx.scale(-1, 1);

    const isRotatedNinety = rotation % 180 !== 0;
    const effectiveW = isRotatedNinety ? img.height : img.width;
    const effectiveH = isRotatedNinety ? img.width : img.height;

    const baseScale = Math.max(cw / effectiveW, ch / effectiveH);
    const scale = baseScale * zoom;

    ctx.drawImage(
      img,
      (-img.width / 2) * scale,
      (-img.height / 2) * scale,
      img.width * scale,
      img.height * scale
    );

    ctx.restore();

    // Draw grid overlay (rule of thirds)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, cw, ch);

    // Vertical lines
    ctx.beginPath();
    ctx.moveTo(cw / 3, 0);
    ctx.lineTo(cw / 3, ch);
    ctx.moveTo((cw * 2) / 3, 0);
    ctx.lineTo((cw * 2) / 3, ch);
    // Horizontal lines
    ctx.moveTo(0, ch / 3);
    ctx.lineTo(cw, ch / 3);
    ctx.moveTo(0, (ch * 2) / 3);
    ctx.lineTo(cw, (ch * 2) / 3);
    ctx.stroke();

    // Corner brackets
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    const cornerSize = 16;
    ctx.beginPath();
    // Top Left
    ctx.moveTo(0, cornerSize);
    ctx.lineTo(0, 0);
    ctx.lineTo(cornerSize, 0);
    // Top Right
    ctx.moveTo(cw - cornerSize, 0);
    ctx.lineTo(cw, 0);
    ctx.lineTo(cw, cornerSize);
    // Bottom Left
    ctx.moveTo(0, ch - cornerSize);
    ctx.lineTo(0, ch);
    ctx.lineTo(cornerSize, ch);
    // Bottom Right
    ctx.moveTo(cw - cornerSize, ch);
    ctx.lineTo(cw, ch);
    ctx.lineTo(cw, ch - cornerSize);
    ctx.stroke();
  }, [imageLoaded, zoom, rotation, flipH, pan, aspectRatio]);

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile/tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Calculate canvas dimensions based on chosen aspect ratio
  const getCanvasDimensions = () => {
    const baseW = 340;
    if (aspectRatio === '1:1') return { width: baseW, height: baseW };
    if (aspectRatio === '16:9') return { width: baseW, height: Math.round(baseW * (9 / 16)) };
    if (aspectRatio === '4:5') return { width: Math.round(baseW * (4 / 5)), height: baseW };
    if (aspectRatio === '9:16') return { width: Math.round(baseW * (9 / 16)), height: baseW };
    // Freeform / original
    if (imageRef.current) {
      const img = imageRef.current;
      const ratio = img.height / img.width;
      return { width: baseW, height: Math.min(Math.round(baseW * ratio), 360) };
    }
    return { width: baseW, height: baseW };
  };

  const { width: canvasW, height: canvasH } = getCanvasDimensions();

  // Export cropped & adjusted result
  const handleApply = () => {
    if (!imageRef.current || !canvasRef.current) return;

    const img = imageRef.current;
    const exportCanvas = document.createElement('canvas');

    // High quality export resolution
    let outW = 900;
    let outH = 900;
    if (aspectRatio === '1:1') {
      outW = 900;
      outH = 900;
    } else if (aspectRatio === '16:9') {
      outW = 1280;
      outH = 720;
    } else if (aspectRatio === '4:5') {
      outW = 800;
      outH = 1000;
    } else if (aspectRatio === '9:16') {
      outW = 720;
      outH = 1280;
    } else {
      const ratio = img.height / img.width;
      outW = 900;
      outH = Math.round(900 * ratio);
    }

    exportCanvas.width = outW;
    exportCanvas.height = outH;

    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Scale pan proportional to output
    const scaleFactorX = outW / canvasW;
    const scaleFactorY = outH / canvasH;

    ctx.save();
    ctx.translate(outW / 2 + pan.x * scaleFactorX, outH / 2 + pan.y * scaleFactorY);
    ctx.rotate((rotation * Math.PI) / 180);
    if (flipH) ctx.scale(-1, 1);

    const isRotatedNinety = rotation % 180 !== 0;
    const effectiveW = isRotatedNinety ? img.height : img.width;
    const effectiveH = isRotatedNinety ? img.width : img.height;

    const baseScale = Math.max(outW / effectiveW, outH / effectiveH);
    const scale = baseScale * zoom;

    ctx.drawImage(
      img,
      (-img.width / 2) * scale,
      (-img.height / 2) * scale,
      img.width * scale,
      img.height * scale
    );

    ctx.restore();

    try {
      const resultDataUrl = exportCanvas.toDataURL('image/jpeg', 0.88);
      onApplyCrop(resultDataUrl);
      onClose();
    } catch (e: any) {
      alert('Could not export cropped image due to browser CORS restriction. Please use local upload file instead.');
    }
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setFlipH(false);
    setPan({ x: 0, y: 0 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 select-none">
      <div className="relative w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Crop & Adjust Image</h3>
              <p className="text-[11px] text-slate-400">Drag to reposition, use zoom and aspect ratio controls.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewport Workspace */}
        <div className="flex-1 bg-slate-900/40 p-4 sm:p-6 flex flex-col items-center justify-center min-h-[300px] overflow-hidden">
          {loadError ? (
            <div className="text-center p-6 text-rose-400 space-y-2">
              <p className="text-xs font-bold">{loadError}</p>
              <p className="text-[11px] text-slate-400">Tip: Upload the image directly from your device to avoid remote security blocking.</p>
            </div>
          ) : !imageLoaded ? (
            <div className="flex flex-col items-center gap-2 text-slate-400">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold">Loading photo into editor...</span>
            </div>
          ) : (
            <div className="space-y-2 text-center">
              <div
                className="relative mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-700 cursor-grab active:cursor-grabbing bg-slate-950"
                style={{ width: canvasW, height: canvasH }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <canvas
                  ref={canvasRef}
                  width={canvasW}
                  height={canvasH}
                  className="w-full h-full block"
                />
              </div>
              <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1">
                <Move className="w-3 h-3" />
                <span>Click & drag inside box to move photo position</span>
              </p>
            </div>
          )}
        </div>

        {/* Controls Toolbar */}
        <div className="p-4 bg-slate-900/90 border-t border-slate-800 space-y-4">
          
          {/* Aspect Ratio Selector */}
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
              Aspect Ratio Preset
            </span>
            <div className="grid grid-cols-5 gap-1.5 text-xs font-bold">
              <button
                type="button"
                onClick={() => setAspectRatio('1:1')}
                className={"py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer " + (aspectRatio === '1:1' ? 'bg-blue-600 border-blue-500 text-white shadow-md' : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800')}
              >
                1:1 Sq
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('16:9')}
                className={"py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer " + (aspectRatio === '16:9' ? 'bg-blue-600 border-blue-500 text-white shadow-md' : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800')}
              >
                16:9 Wide
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('4:5')}
                className={"py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer " + (aspectRatio === '4:5' ? 'bg-blue-600 border-blue-500 text-white shadow-md' : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800')}
              >
                4:5 Post
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('9:16')}
                className={"py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer " + (aspectRatio === '9:16' ? 'bg-blue-600 border-blue-500 text-white shadow-md' : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800')}
              >
                9:16 Reel
              </button>
              <button
                type="button"
                onClick={() => setAspectRatio('free')}
                className={"py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer " + (aspectRatio === 'free' ? 'bg-blue-600 border-blue-500 text-white shadow-md' : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800')}
              >
                Original
              </button>
            </div>
          </div>

          {/* Zoom & Rotation Row */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Zoom Slider */}
            <div className="flex items-center gap-2 flex-1 min-w-[180px]">
              <button
                type="button"
                onClick={() => setZoom(prev => Math.max(0.8, Number((prev - 0.1).toFixed(1))))}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <input
                type="range"
                min="0.8"
                max="3"
                step="0.05"
                value={zoom}
                onChange={e => setZoom(parseFloat(e.target.value))}
                className="flex-1 accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setZoom(prev => Math.min(3, Number((prev + 0.1).toFixed(1))))}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono text-slate-400 w-10 text-right">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            {/* Transform buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setRotation(r => (r + 90) % 360)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                title="Rotate 90° Clockwise"
              >
                <RotateCw className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xs:inline">Rotate</span>
              </button>
              <button
                type="button"
                onClick={() => setFlipH(f => !f)}
                className={"p-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors " + (flipH ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200')}
                title="Flip Horizontally"
              >
                <FlipHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden xs:inline">Flip</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
                title="Reset All Adjustments"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              disabled={!imageLoaded}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-blue-500/20 cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>Apply & Save Crop</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
