import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, ChevronRight, X, Calendar, AlertCircle } from 'lucide-react';
import { Notice } from '../types';

export const NoticeTicker: React.FC = () => {
  const { notices, navigateTo } = useApp();
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  if (!notices || notices.length === 0) return null;

  const activeNotices = notices.slice(0, 5);

  return (
    <>
      <div className="bg-blue-50/95 border-b border-blue-100 py-1 sm:py-1.5 px-2 sm:px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-3">
          
          {/* Responsive Compact Label Badge */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#0066FF] text-white text-[10px] sm:text-[11px] font-black tracking-wider uppercase shrink-0 shadow-xs z-10">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">L.C.C. LIVE ALERT</span>
            <span className="sm:hidden whitespace-nowrap">ALERT</span>
          </div>

          {/* Smooth Continuous Infinite Marquee Ticker */}
          <div className="flex-1 overflow-hidden relative min-w-0">
            <div className="animate-marquee-slow flex items-center gap-8 py-0.5 whitespace-nowrap">
              {/* Loop Batch 1 */}
              {activeNotices.map((notice) => (
                <button
                  key={`n1-${notice.id}`}
                  onClick={() => setSelectedNotice(notice)}
                  className="inline-flex items-center gap-2 hover:text-[#0066FF] transition-colors group cursor-pointer shrink-0"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] shrink-0" />
                  <span className="font-extrabold text-slate-900 group-hover:text-[#0066FF] text-xs">
                    {notice.title}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono font-bold bg-white px-1.5 py-0.2 rounded border border-slate-200">
                    {notice.date}
                  </span>
                </button>
              ))}

              {/* Loop Batch 2 (Duplicate for Seamless Infinite Scroll) */}
              {activeNotices.map((notice) => (
                <button
                  key={`n2-${notice.id}`}
                  onClick={() => setSelectedNotice(notice)}
                  className="inline-flex items-center gap-2 hover:text-[#0066FF] transition-colors group cursor-pointer shrink-0"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0066FF] shrink-0" />
                  <span className="font-extrabold text-slate-900 group-hover:text-[#0066FF] text-xs">
                    {notice.title}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono font-bold bg-white px-1.5 py-0.2 rounded border border-slate-200">
                    {notice.date}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* View All Button */}
          <button
            onClick={() => navigateTo('notices')}
            className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#0066FF] hover:text-blue-800 shrink-0 transition-colors z-10 bg-blue-50 px-2 py-0.5 rounded-lg"
          >
            <span>All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Notice Detail Modal */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-blue-100 text-[#0066FF]">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#0066FF] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    {selectedNotice.badgeText || 'NOTICE'}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Published: {selectedNotice.date}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedNotice(null)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900 leading-snug">
                {selectedNotice.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {selectedNotice.description}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-bold">Issued by: Director Aman Arora</span>
              <button
                onClick={() => setSelectedNotice(null)}
                className="px-4 py-1.5 rounded-full bg-[#0066FF] text-white font-black uppercase text-[11px] shadow-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
