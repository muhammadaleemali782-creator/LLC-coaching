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
  Type,
  Palette
} from 'lucide-react';

import { VisualOverrideItem } from '../../types';

export const DEFAULT_SECTION_ORDER = [
  'hero',
  'about',
  'methodology',
  'ad_top',
  'courses',
  'batches',
  'guarantee',
  'what_we_do',
  'ad_middle',
  'study-material',
  'syllabus',
  'videos',
  'reviews',
  'instagram',
  'gallery',
  'app_download',
  'admission',
  'faq',
  'contact'
];

export const SECTION_LABELS: Record<string, string> = {
  hero: 'Photo Slider & Quick Links Portal (Top)',
  about: 'About Institute & Director Aman Arora Card',
  methodology: 'Mission & Pedagogy (What We Do)',
  ad_top: 'Top Offer Banner',
  courses: 'Coaching Courses Grid',
  batches: 'High-Impact Live Batches',
  guarantee: 'Pedagogy, Trust & Rainbow Learning Arch',
  what_we_do: 'Features & Benefits',
  ad_middle: 'Middle Sponsored Banner',
  'study-material': 'Study Vault & PDFs',
  syllabus: 'Syllabus Tracker',
  videos: 'YouTube Lectures',
  reviews: 'Student Reviews & Testimonials',
  instagram: 'Instagram Reels & Posts',
  gallery: 'Campus Life & Lab Gallery',
  app_download: 'Mobile App Download Banner',
  admission: 'Admission Inquiry Form',
  faq: 'Frequently Asked Questions',
  contact: 'Contact & Map Location'
};

export const DEFAULT_HEADER_ORDER = [
  'top-bar',
  'brand-header',
  'navbar',
  'notice-ticker'
];

export const HEADER_LABELS: Record<string, string> = {
  'top-bar': 'Top Helpline & Announcement Bar (BATCH 2026-27)',
  'brand-header': 'Institutional Bilingual Brand Header (L.C.C. & Seal)',
  'navbar': 'Campus Portal Navbar & Menu Links',
  'notice-ticker': 'Live Alert Marquee Ticker (L.C.C. LIVE ALERT)'
};

export const DEFAULT_HERO_COLUMNS_ORDER = [
  'quick-links',
  'slider',
  'leadership'
];

export const HERO_COLUMNS_LABELS: Record<string, string> = {
  'quick-links': 'Quick Links Box (Left Card)',
  'slider': 'Main Photo Slider Showcase (Center Box)',
  'leadership': 'Director & Leadership Spotlight (Right Card)'
};

export const rgbToHex = (rgb: string): string => {
  if (!rgb || rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') return '';
  if (rgb.startsWith('#')) return rgb;
  const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return '';
  const r = parseInt(match[1]).toString(16).padStart(2, '0');
  const g = parseInt(match[2]).toString(16).padStart(2, '0');
  const b = parseInt(match[3]).toString(16).padStart(2, '0');
  return `#${r}${g}${b}`;
};

export const getDomPath = (el: HTMLElement): string => {
  if (el.id) return `#${el.id}`;
  const path: string[] = [];
  let current: HTMLElement | null = el;
  while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.body && current !== document.documentElement) {
    let selector = current.tagName.toLowerCase();
    if (current.id) {
      selector += `#${current.id}`;
      path.unshift(selector);
      break;
    } else {
      let sibling = current;
      let nth = 1;
      while (sibling.previousElementSibling) {
        sibling = sibling.previousElementSibling as HTMLElement;
        if (sibling.tagName === current.tagName) nth++;
      }
      selector += `:nth-of-type(${nth})`;
    }
    path.unshift(selector);
    current = current.parentElement;
  }
  return path.join(' > ');
};

export const applyVisualOverrides = (overrides?: Record<string, VisualOverrideItem | any>) => {
  if (!overrides || typeof overrides !== 'object') return;

  Object.values(overrides).forEach((item: any) => {
    if (!item) return;

    let targetEl: HTMLElement | null = null;
    if (item.selector) {
      try {
        targetEl = document.querySelector(item.selector);
      } catch (e) {}
    }

    // Fallback: match by originalValue if selector did not match
    if (!targetEl && item.originalValue) {
      if (item.type === 'image') {
        const imgs = document.querySelectorAll('img');
        for (const img of Array.from(imgs)) {
          if (img.src === item.originalValue || img.getAttribute('src') === item.originalValue) {
            targetEl = img;
            break;
          }
        }
      } else {
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, a, button, li, div');
        for (const el of Array.from(elements)) {
          const htmlEl = el as HTMLElement;
          if (htmlEl.innerText?.trim() === item.originalValue.trim()) {
            targetEl = htmlEl;
            break;
          }
        }
      }
    }

    if (targetEl) {
      if (item.type === 'image' && item.value) {
        const img = targetEl as HTMLImageElement;
        if (img.src !== item.value) {
          img.src = item.value;
        }
      } else if (item.value && targetEl.children.length === 0) {
        if (targetEl.innerText !== item.value) {
          targetEl.innerText = item.value;
        }
      }

      if (item.backgroundColor && targetEl.style.backgroundColor !== item.backgroundColor) {
        targetEl.style.backgroundColor = item.backgroundColor;
      }
      if (item.textColor && targetEl.style.color !== item.textColor) {
        targetEl.style.color = item.textColor;
      }
    }
  });
};

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
    type: 'text' | 'image' | 'element';
    originalValue: string;
    newValue: string;
    originalBgColor: string;
    newBgColor: string;
    originalTextColor: string;
    newTextColor: string;
    elementRef: HTMLElement | null;
    tagName: string;
  } | null>(null);

  // Time-Machine Undo/Redo State Stack
  const [historyStack, setHistoryStack] = useState<HistorySnapshot[]>([]);
  const [historyPointer, setHistoryPointer] = useState<number>(-1);

  // Reshuffle / Reorder Tab: 'header' | 'hero' | 'sections'
  const [reorderTab, setReorderTab] = useState<'header' | 'hero' | 'sections'>('header');

  // Header Ordering State
  const [headerOrder, setHeaderOrder] = useState<string[]>(() => {
    if (websiteSettings.headerOrder && websiteSettings.headerOrder.length > 0) {
      return websiteSettings.headerOrder;
    }
    return DEFAULT_HEADER_ORDER;
  });

  // Hero Columns Ordering State
  const [heroColumnsOrder, setHeroColumnsOrder] = useState<string[]>(() => {
    if (websiteSettings.heroColumnsOrder && websiteSettings.heroColumnsOrder.length > 0) {
      return websiteSettings.heroColumnsOrder;
    }
    return DEFAULT_HERO_COLUMNS_ORDER;
  });

  // Section Ordering State for Homepage
  const [sectionOrder, setSectionOrder] = useState<string[]>(() => {
    if (websiteSettings.sectionOrder && websiteSettings.sectionOrder.length > 0) {
      return websiteSettings.sectionOrder;
    }
    return DEFAULT_SECTION_ORDER;
  });

  useEffect(() => {
    if (websiteSettings.headerOrder && websiteSettings.headerOrder.length > 0) {
      setHeaderOrder(websiteSettings.headerOrder);
    }
  }, [websiteSettings.headerOrder]);

  useEffect(() => {
    if (websiteSettings.heroColumnsOrder && websiteSettings.heroColumnsOrder.length > 0) {
      setHeroColumnsOrder(websiteSettings.heroColumnsOrder);
    }
  }, [websiteSettings.heroColumnsOrder]);

  useEffect(() => {
    if (websiteSettings.sectionOrder && websiteSettings.sectionOrder.length > 0) {
      setSectionOrder(websiteSettings.sectionOrder);
    }
  }, [websiteSettings.sectionOrder]);

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
      
      // Ignore clicks inside the Visual Editor dock, modals, or admin fixed nav
      if (
        target.closest('#visual-editor-dock') ||
        target.closest('#visual-editor-modal') ||
        target.closest('.fixed.z-50')
      ) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const computed = window.getComputedStyle(target);
      const currentBg = rgbToHex(computed.backgroundColor) || '#ffffff';
      const currentText = rgbToHex(computed.color) || '#000000';

      // Check if image
      if (target.tagName === 'IMG') {
        const img = target as HTMLImageElement;
        setClickedTarget({
          type: 'image',
          originalValue: img.src,
          newValue: img.src,
          originalBgColor: currentBg,
          newBgColor: currentBg,
          originalTextColor: currentText,
          newTextColor: currentText,
          elementRef: img,
          tagName: 'IMG'
        });
        return;
      }

      // Check if leaf text node or container element
      const hasNoChildren = target.children.length === 0;
      const textContent = target.innerText?.trim() || '';
      const isText = hasNoChildren && textContent.length > 0 && textContent.length < 500;

      setClickedTarget({
        type: isText ? 'text' : 'element',
        originalValue: isText ? textContent : '',
        newValue: isText ? textContent : '',
        originalBgColor: currentBg,
        newBgColor: currentBg,
        originalTextColor: currentText,
        newTextColor: currentText,
        elementRef: target,
        tagName: target.tagName
      });
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

  // Apply Point & Click Edit Live to DOM & Database Permanently
  const handleApplyClickEdit = async () => {
    if (!clickedTarget || !clickedTarget.elementRef) return;

    const selector = getDomPath(clickedTarget.elementRef);

    // 1. Immediately apply color & styles to the live DOM
    if (clickedTarget.newBgColor) {
      clickedTarget.elementRef.style.backgroundColor = clickedTarget.newBgColor;
    }
    if (clickedTarget.newTextColor) {
      clickedTarget.elementRef.style.color = clickedTarget.newTextColor;
    }

    // 2. Apply content to the live DOM
    if (clickedTarget.type === 'image') {
      (clickedTarget.elementRef as HTMLImageElement).src = clickedTarget.newValue;
    } else if (clickedTarget.type === 'text' && clickedTarget.newValue) {
      clickedTarget.elementRef.innerText = clickedTarget.newValue;
    }

    // 3. Build persistent override object
    const newOverride: VisualOverrideItem = {
      selector,
      type: clickedTarget.type,
      originalValue: clickedTarget.originalValue,
      value: clickedTarget.newValue,
      backgroundColor: clickedTarget.newBgColor,
      textColor: clickedTarget.newTextColor
    };

    const updatedOverrides = {
      ...(websiteSettings.visualOverrides || {}),
      [selector]: newOverride
    };

    // 4. Check for top-level websiteSettings sync
    const updatedSettings: any = {
      ...websiteSettings,
      visualOverrides: updatedOverrides
    };

    if (clickedTarget.type === 'text') {
      const val = clickedTarget.newValue.trim();
      const orig = clickedTarget.originalValue.trim();
      if (orig === websiteSettings.instituteName?.trim()) updatedSettings.instituteName = val;
      if (orig === websiteSettings.directorName?.trim()) updatedSettings.directorName = val;
      if (orig === websiteSettings.contactPhone?.trim()) updatedSettings.contactPhone = val;
      if (orig === websiteSettings.contactEmail?.trim()) updatedSettings.contactEmail = val;
      if (orig === websiteSettings.contactAddress?.trim()) updatedSettings.contactAddress = val;
      if (orig === websiteSettings.emergencyAlertText?.trim()) updatedSettings.emergencyAlertText = val;
      if (orig === websiteSettings.heroBadgeText?.trim()) updatedSettings.heroBadgeText = val;
      if (orig === websiteSettings.instituteTagline?.trim()) updatedSettings.instituteTagline = val;
    } else if (clickedTarget.type === 'image') {
      if (clickedTarget.originalValue === websiteSettings.directorPhotoUrl) updatedSettings.directorPhotoUrl = clickedTarget.newValue;
      if (clickedTarget.originalValue === websiteSettings.logoUrl) updatedSettings.logoUrl = clickedTarget.newValue;
      if (clickedTarget.originalValue === websiteSettings.heroPosterUrl) updatedSettings.heroPosterUrl = clickedTarget.newValue;
    }

    // 5. Save to AppContext & localStorage & backend immediately
    try {
      localStorage.setItem('lcc_visual_overrides', JSON.stringify(updatedOverrides));
      await updateWebsiteSettings(updatedSettings);
      pushSnapshot(updatedSettings, courses, `Updated ${clickedTarget.tagName}: colors/content`);
      setHasUnsavedChanges(false);
      showToast('Live changes saved permanently! It will remain even after page reload.', 'success');
    } catch (err: any) {
      showToast('Saved to local browser storage!', 'info');
    }

    setClickedTarget(null);
  };

  // Move Header Item Up
  const moveHeaderUp = (idx: number) => {
    if (idx <= 0) return;
    const updated = [...headerOrder];
    const temp = updated[idx - 1];
    updated[idx - 1] = updated[idx];
    updated[idx] = temp;
    setHeaderOrder(updated);
    const newSettings = { ...websiteSettings, headerOrder: updated };
    updateWebsiteSettings(newSettings);
    pushSnapshot(newSettings, courses, `Moved ${HEADER_LABELS[updated[idx - 1]] || updated[idx - 1]} up`);
    showToast('Header bar order updated and saved live!', 'info');
  };

  // Move Header Item Down
  const moveHeaderDown = (idx: number) => {
    if (idx >= headerOrder.length - 1) return;
    const updated = [...headerOrder];
    const temp = updated[idx + 1];
    updated[idx + 1] = updated[idx];
    updated[idx] = temp;
    setHeaderOrder(updated);
    const newSettings = { ...websiteSettings, headerOrder: updated };
    updateWebsiteSettings(newSettings);
    pushSnapshot(newSettings, courses, `Moved ${HEADER_LABELS[updated[idx + 1]] || updated[idx + 1]} down`);
    showToast('Header bar order updated and saved live!', 'info');
  };

  // Move Hero Column Up / Left
  const moveHeroColumnUp = (idx: number) => {
    if (idx <= 0) return;
    const updated = [...heroColumnsOrder];
    const temp = updated[idx - 1];
    updated[idx - 1] = updated[idx];
    updated[idx] = temp;
    setHeroColumnsOrder(updated);
    const newSettings = { ...websiteSettings, heroColumnsOrder: updated };
    updateWebsiteSettings(newSettings);
    pushSnapshot(newSettings, courses, `Moved ${HERO_COLUMNS_LABELS[updated[idx - 1]] || updated[idx - 1]} left`);
    showToast('Hero column order updated and saved live!', 'info');
  };

  // Move Hero Column Down / Right
  const moveHeroColumnDown = (idx: number) => {
    if (idx >= heroColumnsOrder.length - 1) return;
    const updated = [...heroColumnsOrder];
    const temp = updated[idx + 1];
    updated[idx + 1] = updated[idx];
    updated[idx] = temp;
    setHeroColumnsOrder(updated);
    const newSettings = { ...websiteSettings, heroColumnsOrder: updated };
    updateWebsiteSettings(newSettings);
    pushSnapshot(newSettings, courses, `Moved ${HERO_COLUMNS_LABELS[updated[idx + 1]] || updated[idx + 1]} right`);
    showToast('Hero column order updated and saved live!', 'info');
  };

  // Move Section Up
  const moveSectionUp = (idx: number) => {
    if (idx <= 0) return;
    const updated = [...sectionOrder];
    const temp = updated[idx - 1];
    updated[idx - 1] = updated[idx];
    updated[idx] = temp;
    setSectionOrder(updated);
    const newSettings = { ...websiteSettings, sectionOrder: updated };
    updateWebsiteSettings(newSettings);
    pushSnapshot(newSettings, courses, `Moved ${SECTION_LABELS[updated[idx - 1]] || updated[idx - 1]} up`);
    showToast('Section order updated and saved live!', 'info');
  };

  // Move Section Down
  const moveSectionDown = (idx: number) => {
    if (idx >= sectionOrder.length - 1) return;
    const updated = [...sectionOrder];
    const temp = updated[idx + 1];
    updated[idx + 1] = updated[idx];
    updated[idx] = temp;
    setSectionOrder(updated);
    const newSettings = { ...websiteSettings, sectionOrder: updated };
    updateWebsiteSettings(newSettings);
    pushSnapshot(newSettings, courses, `Moved ${SECTION_LABELS[updated[idx + 1]] || updated[idx + 1]} down`);
    showToast('Section order updated and saved live!', 'info');
  };

  const handleSaveAll = async () => {
    try {
      await updateWebsiteSettings(websiteSettings);
      setHasUnsavedChanges(false);
      showToast('All live changes saved permanently to cloud database and browser!', 'success');
    } catch (e: any) {
      showToast('Saved to browser storage!', 'info');
    }
  };

  const COLOR_SWATCHES = [
    '#002147',
    '#0066FF',
    '#0f172a',
    '#1e293b',
    '#dc2626',
    '#ea580c',
    '#f59e0b',
    '#16a34a',
    '#059669',
    '#7c3aed',
    '#ffffff',
    '#f8fafc',
    '#f1f5f9',
    '#94a3b8',
    '#000000'
  ];

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
        .visual-editor-mode-active img:hover,
        .visual-editor-mode-active header:hover,
        .visual-editor-mode-active nav:hover,
        .visual-editor-mode-active [id^="header-"]:hover,
        .visual-editor-mode-active [id^="hero-"]:hover {
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
                : '🎯 Click on ANY text, box, or photo on the website to edit colors & content live!',
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
            {/* Reorder Sections & Components Button */}
            <button
              onClick={() => setIsReorderModalOpen(true)}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              title="Reshuffle & Reorder (Headers, Hero, Sections)"
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
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-slate-950 rounded-3xl border border-slate-800 p-6 text-white space-y-4 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                {clickedTarget.type === 'image' ? (
                  <ImageIcon className="w-5 h-5 text-purple-400" />
                ) : clickedTarget.type === 'text' ? (
                  <Type className="w-5 h-5 text-amber-400" />
                ) : (
                  <Palette className="w-5 h-5 text-emerald-400" />
                )}
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider">
                    {clickedTarget.type === 'image'
                      ? 'Replace Image'
                      : clickedTarget.type === 'text'
                      ? 'Edit Text & Colors'
                      : 'Customize Box & Colors'}
                  </h3>
                  <span className="text-[10px] text-slate-500 font-mono">
                    &lt;{clickedTarget.tagName.toLowerCase()}&gt; element
                  </span>
                </div>
              </div>
              <button
                onClick={() => setClickedTarget(null)}
                className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Editing Section */}
            {clickedTarget.type === 'image' ? (
              <div className="space-y-3">
                <div className="h-40 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 flex items-center justify-center">
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
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Image URL</label>
                  <input
                    type="text"
                    value={clickedTarget.newValue}
                    onChange={e => setClickedTarget({ ...clickedTarget, newValue: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>
            ) : clickedTarget.type === 'text' ? (
              <div className="space-y-3">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
                  <span className="text-[10px] text-slate-500 uppercase font-black block mb-1">Original Text:</span>
                  <p className="line-clamp-2 italic font-mono text-slate-300">{clickedTarget.originalValue}</p>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Edit Text Content</label>
                  <textarea
                    rows={3}
                    value={clickedTarget.newValue}
                    onChange={e => setClickedTarget({ ...clickedTarget, newValue: e.target.value })}
                    className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            ) : null}

            {/* INFINITE COLOR PALETTE CUSTOMIZATION */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-amber-400">
                <Palette className="w-4 h-4" />
                <span>Infinite Color Customization</span>
              </div>

              {/* Background Color Picker */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5">
                  Background Color
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="color"
                    value={clickedTarget.newBgColor || '#ffffff'}
                    onChange={e => setClickedTarget({ ...clickedTarget, newBgColor: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer bg-transparent p-0.5"
                    title="Choose any color from infinite palette"
                  />
                  <input
                    type="text"
                    value={clickedTarget.newBgColor}
                    onChange={e => setClickedTarget({ ...clickedTarget, newBgColor: e.target.value })}
                    placeholder="#002147"
                    className="w-28 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg font-mono text-xs text-white uppercase focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-400">Infinite HEX / Spectrum</span>
                </div>
                {/* Quick Swatches */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {COLOR_SWATCHES.map(color => (
                    <button
                      key={`bg-${color}`}
                      type="button"
                      onClick={() => setClickedTarget({ ...clickedTarget, newBgColor: color })}
                      style={{ backgroundColor: color }}
                      className={`w-5 h-5 rounded-full border border-slate-600 transition-transform hover:scale-125 cursor-pointer ${
                        clickedTarget.newBgColor === color ? 'ring-2 ring-amber-400 scale-110' : ''
                      }`}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Text / Font Color Picker */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1.5">
                  Text / Font Color
                </label>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="color"
                    value={clickedTarget.newTextColor || '#000000'}
                    onChange={e => setClickedTarget({ ...clickedTarget, newTextColor: e.target.value })}
                    className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer bg-transparent p-0.5"
                    title="Choose any text color from infinite palette"
                  />
                  <input
                    type="text"
                    value={clickedTarget.newTextColor}
                    onChange={e => setClickedTarget({ ...clickedTarget, newTextColor: e.target.value })}
                    placeholder="#ffffff"
                    className="w-28 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg font-mono text-xs text-white uppercase focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-400">Infinite HEX / Spectrum</span>
                </div>
                {/* Quick Swatches */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {COLOR_SWATCHES.map(color => (
                    <button
                      key={`text-${color}`}
                      type="button"
                      onClick={() => setClickedTarget({ ...clickedTarget, newTextColor: color })}
                      style={{ backgroundColor: color }}
                      className={`w-5 h-5 rounded-full border border-slate-600 transition-transform hover:scale-125 cursor-pointer ${
                        clickedTarget.newTextColor === color ? 'ring-2 ring-amber-400 scale-110' : ''
                      }`}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Live Preview Pill */}
              <div
                className="p-3 rounded-xl border border-slate-700 flex items-center justify-center font-bold text-xs shadow-inner transition-colors"
                style={{
                  backgroundColor: clickedTarget.newBgColor || '#ffffff',
                  color: clickedTarget.newTextColor || '#000000'
                }}
              >
                Sample Preview: L.C.C. Coaching Portal
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setClickedTarget(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
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

      {/* Multi-Level Reshuffle / Reorder Modal */}
      {isReorderModalOpen && (
        <div
          id="visual-editor-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
        >
          <div className="relative w-full max-w-xl bg-slate-950 rounded-3xl border border-slate-800 p-6 text-white space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-black uppercase">Reshuffle & Reorder</h3>
              </div>
              <button
                onClick={() => setIsReorderModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Reorder Tabs: Header | Hero | Sections */}
            <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setReorderTab('header')}
                className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  reorderTab === 'header'
                    ? 'bg-[#0066FF] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                🏛️ Header Bars
              </button>
              <button
                type="button"
                onClick={() => setReorderTab('hero')}
                className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  reorderTab === 'hero'
                    ? 'bg-[#0066FF] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📐 Hero 3-Columns
              </button>
              <button
                type="button"
                onClick={() => setReorderTab('sections')}
                className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                  reorderTab === 'sections'
                    ? 'bg-[#0066FF] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📑 Page Sections
              </button>
            </div>

            <p className="text-xs text-slate-400 font-medium">
              {reorderTab === 'header' && 'Reorder the top bars (Helpline, Brand Header, Navbar Menu, Live Notice Ticker).'}
              {reorderTab === 'hero' && 'Reorder the 3 Hero boxes (Quick Links, Photo Slider Showcase, Leadership Box).'}
              {reorderTab === 'sections' && 'Reorder full page sections up or down across the entire website.'}
            </p>

            {/* Tab 1: Header Reordering */}
            {reorderTab === 'header' && (
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {headerOrder.map((item, idx) => (
                  <div
                    key={item}
                    className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 text-xs font-mono font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {HEADER_LABELS[item] || item}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveHeaderUp(idx)}
                        disabled={idx === 0}
                        className={`p-1.5 rounded-lg ${
                          idx === 0 ? 'text-slate-700' : 'text-slate-300 hover:bg-slate-800 cursor-pointer'
                        }`}
                        title="Move Up"
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveHeaderDown(idx)}
                        disabled={idx === headerOrder.length - 1}
                        className={`p-1.5 rounded-lg ${
                          idx === headerOrder.length - 1 ? 'text-slate-700' : 'text-slate-300 hover:bg-slate-800 cursor-pointer'
                        }`}
                        title="Move Down"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: Hero Columns Reordering */}
            {reorderTab === 'hero' && (
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {heroColumnsOrder.map((col, idx) => (
                  <div
                    key={col}
                    className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 text-xs font-mono font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {HERO_COLUMNS_LABELS[col] || col}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveHeroColumnUp(idx)}
                        disabled={idx === 0}
                        className={`p-1.5 rounded-lg ${
                          idx === 0 ? 'text-slate-700' : 'text-slate-300 hover:bg-slate-800 cursor-pointer'
                        }`}
                        title="Move Left / Earlier"
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveHeroColumnDown(idx)}
                        disabled={idx === heroColumnsOrder.length - 1}
                        className={`p-1.5 rounded-lg ${
                          idx === heroColumnsOrder.length - 1 ? 'text-slate-700' : 'text-slate-300 hover:bg-slate-800 cursor-pointer'
                        }`}
                        title="Move Right / Later"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 3: Page Sections Reordering */}
            {reorderTab === 'sections' && (
              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {sectionOrder.map((sec, idx) => (
                  <div
                    key={sec}
                    className="p-3 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 text-xs font-mono font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-white">
                        {SECTION_LABELS[sec] || `${sec.replace(/[-_]/g, ' ')} Section`}
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
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setIsReorderModalOpen(false);
                  showToast('Reordering saved live!', 'success');
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

