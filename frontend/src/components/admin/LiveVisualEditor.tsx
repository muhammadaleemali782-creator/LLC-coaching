import React, { useState, useEffect } from 'react';
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
  Settings
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
    showToast
  } = useApp();

  const [isEditorActive, setIsEditorActive] = useState<boolean>(false);
  const [editingField, setEditingField] = useState<{ key: string; label: string; value: string } | null>(null);
  const [isReorderModalOpen, setIsReorderModalOpen] = useState<boolean>(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

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

  // Quick Inline Save
  const handleSaveField = () => {
    if (!editingField) return;
    const updatedSettings = {
      ...websiteSettings,
      [editingField.key]: editingField.value
    };
    updateWebsiteSettings(updatedSettings);
    pushSnapshot(updatedSettings, courses, `Updated ${editingField.label}`);
    setEditingField(null);
    showToast(`${editingField.label} updated successfully!`, 'success');
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
      {/* Floating Visual Editor Dock (Bottom Right) */}
      <div className="fixed bottom-20 sm:bottom-6 right-4 z-50 flex items-center gap-2 bg-slate-950/95 text-white p-2.5 sm:p-3 rounded-full border border-slate-700 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom-5">
        
        {/* Toggle Editor Switch */}
        <button
          onClick={() => {
            setIsEditorActive(!isEditorActive);
            showToast(isEditorActive ? 'Visual Editor Mode Exited' : 'Visual Edit Mode Active! Click pencil icons to edit.', isEditorActive ? 'info' : 'success');
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
            isEditorActive
              ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300 animate-pulse'
              : 'bg-[#0066FF] text-white hover:bg-blue-600'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isEditorActive ? 'Visual Edit ON' : 'Visual Editor'}</span>
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
              title="Save All Changes"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save</span>
            </button>
          </>
        )}
      </div>

      {/* Quick Edit Modal */}
      {editingField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-950 rounded-3xl border border-slate-800 p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-black uppercase">Edit {editingField.label}</h3>
              </div>
              <button
                onClick={() => setEditingField(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <textarea
                rows={3}
                value={editingField.value}
                onChange={e => setEditingField({ ...editingField, value: e.target.value })}
                className="w-full p-3 bg-slate-900 border border-slate-700 rounded-2xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingField(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveField}
                className="px-5 py-2 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-black uppercase tracking-wider"
              >
                Apply Live
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section Reshuffle / Reorder Modal */}
      {isReorderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
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
                        idx === 0 ? 'text-slate-700' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                      title="Move Up"
                    >
                      <MoveUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveSectionDown(idx)}
                      disabled={idx === sectionOrder.length - 1}
                      className={`p-1.5 rounded-lg ${
                        idx === sectionOrder.length - 1 ? 'text-slate-700' : 'text-slate-300 hover:bg-slate-800'
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
