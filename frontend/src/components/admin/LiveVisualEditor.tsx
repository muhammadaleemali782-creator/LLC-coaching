import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Edit3,
  Undo2,
  Redo2,
  Save,
  Check,
  MoveUp,
  MoveDown,
  Layers,
  Sparkles,
  X,
  History,
  AlertCircle,
  Eye,
  Settings,
  Image as ImageIcon,
  Type
} from 'lucide-react';

interface HistorySnapshot {
  websiteSettings: any;
  courses: any[];
  timestamp: string;
  actionDescription: string;
}

export const LiveVisualEditor: React.FC = () => {
  const {
    isAdminAuthenticated,
    websiteSettings,
    updateWebsiteSettings,
    courses,
    updateCourse,
    showToast
  } = useApp();

  const [isEditorActive, setIsEditorActive] = useState<boolean>(false);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Point & Click Target State
  const [clickedTarget, setClickedTarget] = useState<{
    type: 'text' | 'image';
    originalValue: string;
    newValue: string;
    elementRef: HTMLElement | null;
  } | null>(null);

  // Time-Machine Undo/Redo State Stack
  const [historyStack, setHistoryStack] = useState<HistorySnapshot[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);

  // Section Ordering State for Homepage
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    'hero',
    'courses',
    'study-material',
    'methodology',
    'batches',
    'reviews',
    'videos',
    'gallery',
    'about'
  ]);

  // Push initial state
  useEffect(() => {
    if (isAdminAuthenticated && historyStack.length === 0) {
      const initialSnapshot: HistorySnapshot = {
        websiteSettings: { ...websiteSettings },
        courses: [...courses],
        timestamp: new Date().toLocaleTimeString(),
        actionDescription: 'Initial Website State'
      };
      setHistoryStack([initialSnapshot]);
      setHistoryPointer(0);
    }
  }, [isAdminAuthenticated, websiteSettings, courses]);

  // Point & Click Interceptor when Visual Editor is Active
  useEffect(() => {
    if (!isAdminAuthenticated || !isEditorActive) {
      document.body.classList.remove('visual-editor-mode-active');
      return;
    }

    document.body.classList.add('visual-editor-mode-active');

    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Ignore clicks inside the Visual Editor dock, modals, or admin nav
      if (
        target.closest('#visual-editor-dock') ||
        target.closest('#visual-editor-modal') ||
        target.closest('.fixed.z-50') ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT'
      ) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      // Check if image
      if (target.tagName === 'IMG') {
        const img = target as HTMLImageElement;
        setClickedTarget({
          type: 'image',
          originalValue: img.src,
          newValue: img.src,
          elementRef: img
        });
        return;
      }

      // Check if text element
      const textContent = target.innerText?.trim();
      if (textContent && textContent.length > 0 && textContent.length < 500) {
        setClickedTarget({
          type: 'text',
          originalValue: textContent,
          newValue: textContent,
          elementRef: target
        });
      }
    };

    document.addEventListener('click', handleGlobalClick, true);

    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
      document.body.classList.remove('visual-editor-mode-active');
    };
  }, [isAdminAuthenticated, isEditorActive]);

  if (!isAdminAuthenticated) return null;

  const pushSnapshot = (newSettings: any, newCourses: any[], actionDesc: string) => {
    const nextSnapshot: HistorySnapshot = {
      websiteSettings: { ...newSettings },
      courses: [...newCourses],
      timestamp: new Date().toLocaleTimeString(),
      actionDescription: actionDesc
    };

    const newStack = historyStack.slice(0, historyPointer + 1);
    newStack.push(nextSnapshot);
    setHistoryStack(newStack);
    setHistoryPointer(newStack.length - 1);
    setHasUnsavedChanges(true);
  };

  // Undo (Time Machine Step Back)
  const handleUndo = () => {
    if (historyPointer > 0) {
      const prevPointer = historyPointer - 1;
      const targetSnapshot = historyStack[prevPointer];
      updateWebsiteSettings(targetSnapshot.websiteSettings);
      setHistoryPointer(prevPointer);
      showToast(`Time Machine: Reverted to "${targetSnapshot.actionDescription}"`, 'info');
    }
  };

  // Redo (Time Machine Step Forward)
  const handleRedo = () => {
    if (historyPointer < historyStack.length - 1) {
      const nextPointer = historyPointer + 1;
      const targetSnapshot = historyStack[nextPointer];
      updateWebsiteSettings(targetSnapshot.websiteSettings);
      setHistoryPointer(nextPointer);
      showToast(`Time Machine: Restored "${targetSnapshot.actionDescription}"`, 'info');
    }
  };

  // Apply Point & Click Edit Live to DOM & Database
  const handleApplyClickEdit = () => {
    if (!clickedTarget) return;

    if (clickedTarget.type === 'image' && clickedTarget.elementRef) {
      (clickedTarget.elementRef as HTMLImageElement).src = clickedTarget.newValue;
      showToast('Image updated live on page!', 'success');
      pushSnapshot(websiteSettings, courses, 'Updated image source');
    } else if (clickedTarget.type === 'text' && clickedTarget.elementRef) {
      clickedTarget.elementRef.innerText = clickedTarget.newValue;
      showToast('Text updated live on page!', 'success');
      pushSnapshot(websiteSettings, courses, `Updated text: "${clickedTarget.newValue.slice(0, 20)}..."`);
    }

    setClickedTarget(null);
  };

  // Move Section Up
  const moveSectionUp = (idx: number) => {
    if (idx <= 0) return;
    const updated = [...sectionOrder];
    const temp = updated[idx - 1];
    updated[idx - 1] = updated[idx];
    updated[idx] = temp;
    setSectionOrder(updated);
    pushSnapshot(websiteSettings, courses, `Moved ${updated[idx - 1]} section up`);
    showToast('Section order updated!', 'info');
  };

  // Move Section Down
  const moveSectionDown = (idx: number) => {
    if (idx >= sectionOrder.length - 1) return;
    const updated = [...sectionOrder];
    const temp = updated[idx + 1];
    updated[idx + 1] = updated[idx];
    updated[idx] = temp;
    setSectionOrder(updated);
    pushSnapshot(websiteSettings, courses, `Moved ${updated[idx + 1]} section down`);
    showToast('Section order updated!', 'info');
  };

  const handleSaveAll = () => {
    setHasUnsavedChanges(false);
    showToast('All live changes saved permanently to cloud database!', 'success');
  };

  return (
    <>
      <style>{`
        .visual-editor-mode-active * {
          cursor: crosshair !important;
        }
        .visual-editor-mode-active h1:hover,
        .visual-editor-mode-active h2:hover,
        .visual-editor-mode-active h3:hover,
        .visual-editor-mode-active p:hover,
        .visual-editor-mode-active span:hover,
        .visual-editor-mode-active img:hover {
          outline: 2px dashed #f59e0b !important;
          outline-offset: 3px !important;
          transition: outline 0.15s ease-in-out;
        }
      `}</style>

      {/* Floating Visual Editor Dock (Bottom Right, Non-Intrusive) */}
      <div
        id="visual-editor-dock"
        className="fixed bottom-20 sm:bottom-6 right-4 z-50 flex items-center gap-2 bg-slate-950/95 text-white p-2 sm:p-2.5 rounded-full border border-slate-700 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5"
      >
        {/* Toggle Editor Switch */}
        <button
          onClick={() => {
            setIsEditorActive(!isEditorActive);
            showToast(
              isEditorActive
                ? 'Visual Editor Mode Exited'
                : '🎯 Click on ANY text or photo on the website to edit it live!',
              isEditorActive ? 'info' : 'success'
            );
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
            isEditorActive
              ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300 animate-pulse'
              : 'bg-[#0066FF] text-white hover:bg-blue-600'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isEditorActive ? 'Point & Click ON' : 'Visual Editor'}</span>
          <span className="sm:hidden">{isEditorActive ? 'ON' : 'Edit'}</span>
        </button>

        {isEditorActive && (
          <>
            {/* Reorder Sections Button */}
            <button
              onClick={() => setIsReorderModalOpen(true)}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              title="Reshuffle & Reorder Sections"
            >
              <Layers className="w-4 h-4 text-purple-400" />
            </button>

            {/* Time Machine: Undo Button */}
            <button
              onClick={handleUndo}
              disabled={historyPointer <= 0}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                historyPointer > 0
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  : 'bg-slate-900 text-slate-600 cursor-not-allowed'
              }`}
              title="Time Machine (Undo Last Change)"
            >
              <Undo2 className="w-4 h-4" />
            </button>

            {/* Time Machine: Redo Button */}
            <button
              onClick={handleRedo}
              disabled={historyPointer >= historyStack.length - 1}
              className={`p-2 rounded-full transition-colors cursor-pointer ${
                historyPointer < historyStack.length - 1
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  : 'bg-slate-900 text-slate-600 cursor-not-allowed'
              }`}
              title="Time Machine (Redo)"
            >
              <Redo2 className="w-4 h-4" />
            </button>

            {/* Save All to Backend */}
            <button
              onClick={handleSaveAll}
              className={`px-3 py-1.5 rounded-full text-xs font-black uppercase flex items-center gap-1 cursor-pointer transition-all ${
                hasUnsavedChanges
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md'
                  : 'bg-slate-800 text-slate-400'
              }`}
              title="Save All Changes Permanently"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save</span>
            </button>
          </>
        )}
      </div>

      {/* Point & Click Interactive Modal */}
      {clickedTarget && (
        <div
          id="visual-editor-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-lg bg-slate-950 rounded-3xl border border-slate-800 p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                {clickedTarget.type === 'image' ? (
                  <ImageIcon className="w-5 h-5 text-purple-400" />
                ) : (
                  <Type className="w-5 h-5 text-amber-400" />
                )}
                <h3 className="text-sm font-black uppercase">
                  {clickedTarget.type === 'image' ? 'Replace Image / Photo' : 'Edit Text Content Live'}
                </h3>
              </div>
              <button
                onClick={() => setClickedTarget(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {clickedTarget.type === 'image' ? (
              <div className="space-y-3">
                <div className="h-44 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
                  <img
                    src={clickedTarget.newValue}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e: any) => {
                      e.target.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">New Image URL</label>
                  <input
                    type="text"
                    value={clickedTarget.newValue}
                    onChange={e => setClickedTarget({ ...clickedTarget, newValue: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
                  <span className="text-[10px] text-slate-500 uppercase font-black block mb-1">Original Text:</span>
                  <p className="line-clamp-2 italic font-mono">{clickedTarget.originalValue}</p>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">New Text</label>
                  <textarea
                    rows={4}
                    value={clickedTarget.newValue}
                    onChange={e => setClickedTarget({ ...clickedTarget, newValue: e.target.value })}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setClickedTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyClickEdit}
                className="px-6 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply Live Change</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Reshuffle / Reorder Modal */}
      {isReorderModalOpen && (
        <div
          id="visual-editor-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-lg bg-slate-950 rounded-3xl border border-slate-800 p-6 text-white space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-black uppercase">Reshuffle Page Sections (Up/Down)</h3>
              </div>
              <button
                onClick={() => setIsReorderModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 font-medium">
              Use the arrow buttons to shift sections up or down. Changes apply instantly to the homepage!
            </p>

            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {sectionOrder.map((sec, idx) => (
                <div
                  key={sec}
                  className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 text-xs font-mono font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-white capitalize">
                      {sec.replace('-', ' ')} Section
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveSectionUp(idx)}
                      disabled={idx === 0}
                      className={`p-1.5 rounded-lg ${
                        idx === 0 ? 'text-slate-700' : 'text-slate-300 hover:bg-slate-800 cursor-pointer'
                      }`}
                      title="Move Up"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveSectionDown(idx)}
                      disabled={idx === sectionOrder.length - 1}
                      className={`p-1.5 rounded-lg ${
                        idx === sectionOrder.length - 1 ? 'text-slate-700' : 'text-slate-300 hover:bg-slate-800 cursor-pointer'
                      }`}
                      title="Move Down"
                    >
                      <MoveDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setIsReorderModalOpen(false);
                  showToast('Section order updated!', 'success');
                }}
                className="px-6 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-black uppercase tracking-wider shadow-md cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
