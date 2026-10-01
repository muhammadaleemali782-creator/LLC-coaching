import React, { useState, useEffect } from 'react';
import { DownloadCloud, Trash2, BookOpen, X, ArrowLeft, FileText, CheckCircle2, Search, ExternalLink } from 'lucide-react';
import { getOfflineDocs, deleteOfflineDoc, OfflineDoc } from '../../utils/offlineStorage';
import { useApp } from '../../context/AppContext';
import { getTranslation } from '../../utils/i18n';

interface OfflineVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineVaultModal: React.FC<OfflineVaultModalProps> = ({ isOpen, onClose }) => {
  const { language, showToast } = useApp();
  const t = getTranslation(language);

  const [docs, setDocs] = useState<OfflineDoc[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [readingDoc, setReadingDoc] = useState<OfflineDoc | null>(null);

  useEffect(() => {
    if (isOpen) {
      setDocs(getOfflineDocs());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDelete = (id: string, title: string) => {
    deleteOfflineDoc(id);
    setDocs(getOfflineDocs());
    showToast(`Removed "${title}" from offline vault.`, 'info');
    if (readingDoc?.id === id) {
      setReadingDoc(null);
    }
  };

  const filteredDocs = docs.filter(d =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.subject && d.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (d.targetClass && d.targetClass.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 py-4 bg-emerald-600 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">{t.offlineVault}</h3>
              <p className="text-[11px] text-emerald-100 font-medium">
                {t.offlineReady} • Read anytime without data
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setReadingDoc(null);
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        {readingDoc ? (
          /* In-App Offline Reader View */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setReadingDoc(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Offline List</span>
              </button>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-800">
                Offline Mode Active
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-slate-500 uppercase">
                  {readingDoc.targetClass} • {readingDoc.subject || 'All Subjects'}
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white leading-snug">
                {readingDoc.title}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Saved to your phone on {readingDoc.downloadedAt}
              </p>
            </div>

            {/* In-App Reader Canvas */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 font-serif leading-relaxed text-sm space-y-3">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2 font-sans font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>This document is stored in your device storage and works without any internet.</span>
              </div>

              <div className="pt-2 text-slate-800 dark:text-slate-200 whitespace-pre-line font-sans text-xs sm:text-sm">
                {readingDoc.contentSnippet || (
                  `[CHAPTER NOTES SUMMARY]\n\n• Institute: Learning Coaching Center (L.C.C.)\n• Class: ${readingDoc.targetClass}\n• Subject: ${readingDoc.subject || 'Comprehensive Topic'}\n• Title: ${readingDoc.title}\n\n1. Key Concepts:\nComprehensive study material curated by Director Aman Arora and senior faculty. Covers theory, solved examples, formula sheets, and board pattern practice questions.\n\n2. Formula / Rules Recap:\nReview definitions, theorems, and exam weightage before appearing for weekly chapter mock tests.\n\n3. High-Priority Examination Tips:\nFocus on conceptual clarity and neat diagrammatic representation to maximize board exam scoring.`
                )}
              </div>

              {readingDoc.fileUrl && readingDoc.fileUrl.startsWith('http') && (
                <div className="pt-3 border-t border-slate-200 dark:border-slate-700">
                  <a
                    href={readingDoc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold shadow-xs hover:bg-emerald-700"
                  >
                    <span>Open Original Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Offline Documents List */
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {filteredDocs.length > 0 ? (
              <div className="space-y-2.5">
                {filteredDocs.map(doc => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 hover:border-emerald-400 shadow-xs flex items-center justify-between gap-3 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.2 rounded">
                            {doc.targetClass}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {doc.downloadedAt}
                          </span>
                        </div>
                        <h4 className="text-xs font-black text-slate-900 dark:text-white truncate mt-0.5">
                          {doc.title}
                        </h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setReadingDoc(doc)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-xs cursor-pointer"
                      >
                        {t.readNow}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(doc.id, doc.title)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                        title="Delete from phone"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 space-y-2">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                  <DownloadCloud className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-black text-slate-800 dark:text-slate-200">
                  {t.noOfflineNotes}
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  {t.noOfflineNotesSub}
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
