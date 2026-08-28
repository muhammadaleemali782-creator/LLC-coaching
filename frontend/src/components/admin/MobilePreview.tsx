import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor, RotateCcw, Sparkles, ShieldCheck } from 'lucide-react';

export const MobilePreview: React.FC = () => {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [scale, setScale] = useState(1);

  const deviceDimensions = {
    mobile: { width: '375px', height: '680px', label: 'iPhone 15 Pro (375 × 680)' },
    tablet: { width: '768px', height: '800px', label: 'iPad Mini (768 × 800)' },
    desktop: { width: '100%', height: '800px', label: 'Full Responsive Desktop' }
  };

  return (
    <div className="space-y-6">
      
      {/* Control Bar */}
      <div className="p-4 bg-slate-950 border border-slate-800 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-black text-white">Live Multi-Device Emulator</h2>
          <span className="text-xs text-slate-400">Preview changes, ads, and typography live without deploying</span>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setDevice('mobile')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              device === 'mobile' ? 'bg-[#0066FF] text-white shadow-sm font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
          
          <button
            onClick={() => setDevice('tablet')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              device === 'tablet' ? 'bg-[#0066FF] text-white shadow-sm font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>

          <button
            onClick={() => setDevice('desktop')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              device === 'desktop' ? 'bg-[#0066FF] text-white shadow-sm font-black' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
        </div>
      </div>

      {/* Emulated Viewport Container */}
      <div className="flex justify-center items-center py-6 bg-slate-950/60 rounded-3xl border border-slate-800/80 min-h-[700px] overflow-hidden">
        
        <div
          style={{
            width: deviceDimensions[device].width,
            height: deviceDimensions[device].height,
            maxWidth: '100%'
          }}
          className={`transition-all duration-300 relative rounded-3xl overflow-hidden border-4 border-slate-700 bg-white shadow-2xl ${
            device === 'mobile' ? 'ring-8 ring-slate-800/60' : ''
          }`}
        >
          {/* Simulated Mobile Top Notch / Island */}
          {device === 'mobile' && (
            <div className="w-28 h-4 bg-slate-900 rounded-b-xl mx-auto absolute top-0 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-slate-800" />
            </div>
          )}

          {/* Iframe Loading Public Application */}
          <iframe
            src="/"
            title="LCC Coaching Live Emulator"
            className="w-full h-full border-none"
          />
        </div>

      </div>

    </div>
  );
};
