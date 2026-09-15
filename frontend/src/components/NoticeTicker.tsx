import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, ChevronRight, X, Calendar, AlertCircle, Search } from 'lucide-react';
import { Notice } from '../types';

export const NoticeTicker: React.FC = () => {
  const { notices, navigateTo } = useApp();
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [isAllNoticesOpen, setIsAllNoticesOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (!notices || notices.length === 0) return null;

  const activeNotices = notices.slice(0, 5);
  const filteredAllNotices = notices.filter(n =>
    n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (n.description && n.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      <div id="header-notice-ticker" className="bg-blue-50/95 border-b border-blue-100 py-1 sm:py-1.5 px-2 sm:px-4 relative overflow-hidden transition-colors">
        <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-3">
          
          {/* Responsive Compact Label Badge */}
          <div id="header-live-alert-badge" className="flex items-center gap-1.5 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#0066FF] text-white text-[10px] sm:text-[11px] font-black tracking-wider uppercase shrink-0 shadow-xs z-10 transition-colors">
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
            onClick={() => setIsAllNoticesOpen(true)}
            className="flex items-center gap-1 text-xs font-bold text-[#0066FF] hover:text-blue-800 shrink-0 transition-colors z-10 bg-blue-100 hover:bg-blue-200 px-2.5 py-1 rounded-lg cursor-pointer"
            title="View All Official Notices"
          >
            <span>All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* All Notices Modal */}
      {isAllNoticesOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-[#0066FF] text-white">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">
                    Official Notice Board
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    All announcements, exam circulars & academic notices
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAllNoticesOpen(false)}
                className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="relative shrink-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notices by keyword, batch, exam..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
              />
            </div>

            {/* Notices List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {filteredAllNotices.length > 0 ? (
                filteredAllNotices.map((notice) => (
                  <div
                    key={notice.id}
                    onClick={() => {
                      setIsAllNoticesOpen(false);
                      setSelectedNotice(notice);
                    }}
                    className="p-4 rounded-2xl border border-slate-100 hover:border-blue-300 bg-slate-50/70 hover:bg-blue-50/50 transition-all cursor-pointer group space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#0066FF] bg-blue-100/80 px-2 py-0.5 rounded-md">
                        {notice.badgeText || 'ANNOUNCEMENT'}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{notice.date}</span>
                      </div>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 group-hover:text-[#0066FF] transition-colors leading-snug">
                      {notice.title}
                    </h4>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {notice.description}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400 text-xs">
                  No notices found matching "{searchTerm}"
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 shrink-0">
              <span>Total Notices: <strong>{notices.length}</strong></span>
              <button
                onClick={() => setIsAllNoticesOpen(false)}
                className="px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
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
                className="px-4 py-1.5 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-black uppercase text-[11px] shadow-sm cursor-pointer"
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
