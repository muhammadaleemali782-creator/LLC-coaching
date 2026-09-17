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
  Palette,
  Upload,
  Link2
} from 'lucide-react';

import { VisualOverrideItem } from '../../types';
import { compressImageFile } from '../../utils/imageCompressor';

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

export const getEffectiveBgColor = (el: HTMLElement): string => {
  let curr: HTMLElement | null = el;
  while (curr && curr !== document.body && curr !== document.documentElement) {
    const comp = window.getComputedStyle(curr);
    const hex = rgbToHex(comp.backgroundColor);
    if (hex && comp.backgroundColor !== 'transparent' && comp.backgroundColor !== 'rgba(0, 0, 0, 0)') {
      return hex;
    }
    curr = curr.parentElement;
  }
  return '#0B3B95';
};

export const getEffectiveTextColor = (el: HTMLElement): string => {
  let curr: HTMLElement | null = el;
  while (curr && curr !== document.body && curr !== document.documentElement) {
    const comp = window.getComputedStyle(curr);
    const hex = rgbToHex(comp.color);
    if (hex && comp.color !== 'transparent' && comp.color !== 'rgba(0, 0, 0, 0)') {
      return hex;
    }
    curr = curr.parentElement;
  }
  return '#ffffff';
};

export const getElementFriendlyInfo = (el: HTMLElement): { name: string; subtitle: string; targetEl: HTMLElement } => {
  // 1. If clicked a specific button or link
  if (el.tagName === 'BUTTON' || el.closest('button')) {
    const btn = (el.tagName === 'BUTTON' ? el : el.closest('button')) as HTMLElement;
    const txt = btn.innerText.trim();
    return {
      name: txt ? `Button: "${txt.slice(0, 25)}"` : 'Action Button',
      subtitle: btn.id ? `#${btn.id}` : 'Clickable Button',
      targetEl: btn
    };
  }

  if (el.tagName === 'A' || el.closest('a')) {
    const a = (el.tagName === 'A' ? el : el.closest('a')) as HTMLElement;
    const txt = a.innerText.trim();
    return {
      name: txt ? `Link: "${txt.slice(0, 25)}"` : 'Navigation Link',
      subtitle: a.getAttribute('href') || 'Hyperlink',
      targetEl: a
    };
  }

  // 2. Header Bars & Strips
  const navHeader = el.closest('#header-main-navbar') as HTMLElement;
  if (navHeader) {
    return {
      name: 'Campus Portal Navbar (Blue Strip)',
      subtitle: 'Main Navigation Bar & Menu Links',
      targetEl: navHeader
    };
  }

  const topBar = el.closest('#header-top-bar') as HTMLElement;
  if (topBar) {
    return {
      name: 'Top Announcement & Helpline Bar',
      subtitle: 'Batch 2026-27 Strip',
      targetEl: topBar
    };
  }

  const brandBanner = el.closest('#header-brand-banner') as HTMLElement;
  if (brandBanner) {
    return {
      name: 'Institutional Bilingual Brand Header',
      subtitle: 'L.C.C. Logo & Varanasi Title Banner',
      targetEl: brandBanner
    };
  }

  const noticeTicker = el.closest('#header-notice-ticker') as HTMLElement;
  if (noticeTicker) {
    return {
      name: 'Live Alert Marquee Notice Bar',
      subtitle: 'Scrolling Breaking News Strip',
      targetEl: noticeTicker
    };
  }

  // 3. Hero Cards & Spotlight
  const quickLinks = el.closest('#hero-quick-links-box') as HTMLElement;
  if (quickLinks && (el === quickLinks || el.closest('#hero-quick-links-header') || el.classList.contains('bg-white'))) {
    return {
      name: 'Quick Links Portal Card',
      subtitle: 'Admission, Batches & DPP Links Box',
      targetEl: quickLinks
    };
  }

  const leadership = el.closest('#hero-leadership-box') as HTMLElement;
  if (leadership && (el === leadership || el.closest('#hero-leadership-header') || el.classList.contains('bg-white'))) {
    return {
      name: 'Director & Leadership Spotlight Card',
      subtitle: 'Aman Arora Director Showcase Card',
      targetEl: leadership
    };
  }

  const slider = el.closest('#hero-slider-box') as HTMLElement;
  if (slider && el === slider) {
    return {
      name: 'Main Photo Slider Showcase',
      subtitle: 'Hero Center Photo Slider Box',
      targetEl: slider
    };
  }

  // 4. Photo / Image
  if (el.tagName === 'IMG') {
    const img = el as HTMLImageElement;
    return {
      name: 'Photo / Image',
      subtitle: img.alt || 'Website Graphic / Photo',
      targetEl: img
    };
  }

  // 5. Headings
  if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(el.tagName)) {
    return {
      name: `${el.tagName} Heading`,
      subtitle: el.innerText.trim().slice(0, 40) || 'Section Heading',
      targetEl: el
    };
  }

  // 6. Text Elements
  if (['P', 'SPAN', 'LI', 'LABEL'].includes(el.tagName)) {
    return {
      name: 'Text Content',
      subtitle: el.innerText.trim().slice(0, 40) || 'Typography Element',
      targetEl: el
    };
  }

  // 7. General Container
  return {
    name: el.id ? `#${el.id}` : `${el.tagName.toUpperCase()} Container Box`,
    subtitle: el.innerText.trim().slice(0, 35) || 'Layout Box',
    targetEl: el
  };
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

      if (item.linkUrl !== undefined) {
        const linkEl = targetEl.tagName === 'A' ? (targetEl as HTMLAnchorElement) : (targetEl.closest('a') as HTMLAnchorElement | null);
        if (linkEl) {
          if (linkEl.getAttribute('href') !== item.linkUrl) {
            linkEl.setAttribute('href', item.linkUrl);
            if (item.linkUrl.startsWith('http')) {
              linkEl.setAttribute('target', '_blank');
              linkEl.setAttribute('rel', 'noopener noreferrer');
            }
          }
        }
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
    friendlyName: string;
    friendlySubtitle: string;
    originalValue: string;
    newValue: string;
    originalBgColor: string;
    newBgColor: string;
    originalTextColor: string;
    newTextColor: string;
    originalLink?: string;
    newLink?: string;
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

      const friendlyInfo = getElementFriendlyInfo(target);
      const effectiveEl = friendlyInfo.targetEl;
      const currentBg = getEffectiveBgColor(effectiveEl);
      const currentText = getEffectiveTextColor(effectiveEl);

      // Check link href (if el is <a> or inside <a>)
      const linkEl = effectiveEl.tagName === 'A' ? (effectiveEl as HTMLAnchorElement) : (effectiveEl.closest('a') as HTMLAnchorElement | null);
      const currentLink = linkEl ? (linkEl.getAttribute('href') || '') : '';

      // Check if image
      if (effectiveEl.tagName === 'IMG') {
        const img = effectiveEl as HTMLImageElement;
        setClickedTarget({
          type: 'image',
          friendlyName: friendlyInfo.name,
          friendlySubtitle: friendlyInfo.subtitle,
          originalValue: img.src,
          newValue: img.src,
          originalBgColor: currentBg,
          newBgColor: currentBg,
          originalTextColor: currentText,
          newTextColor: currentText,
          originalLink: currentLink,
          newLink: currentLink,
          elementRef: img,
          tagName: 'IMG'
        });
        return;
      }

      // Check if leaf text node or container element
      const hasNoChildren = effectiveEl.children.length === 0;
      const textContent = effectiveEl.innerText?.trim() || '';
      const isText = hasNoChildren && textContent.length > 0 && textContent.length < 500;

      setClickedTarget({
        type: isText ? 'text' : 'element',
        friendlyName: friendlyInfo.name,
        friendlySubtitle: friendlyInfo.subtitle,
        originalValue: isText ? textContent : '',
        newValue: isText ? textContent : '',
        originalBgColor: currentBg,
        newBgColor: currentBg,
        originalTextColor: currentText,
        newTextColor: currentText,
        originalLink: currentLink,
        newLink: currentLink,
        elementRef: effectiveEl,
        tagName: effectiveEl.tagName
      });
    };

    document.addEventListener('click', handleGlobalClick, true);

    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
      document.body.classList.remove('visual-editor-mode-active');
    };
  }, [isAdminAuthenticated, isEditorActive]);

  // Live Real-Time Preview Functions (Instantly modifies DOM for live preview)
  const updateBgColor = (color: string) => {
    if (!clickedTarget || !clickedTarget.elementRef) return;
    try {
      clickedTarget.elementRef.style.backgroundColor = color;
    } catch (e) {}
    setClickedTarget({ ...clickedTarget, newBgColor: color });
  };

  const updateTextColor = (color: string) => {
    if (!clickedTarget || !clickedTarget.elementRef) return;
    try {
      clickedTarget.elementRef.style.color = color;
    } catch (e) {}
    setClickedTarget({ ...clickedTarget, newTextColor: color });
  };

  const updateContentValue = (val: string) => {
    if (!clickedTarget || !clickedTarget.elementRef) return;
    try {
      if (clickedTarget.type === 'text') {
        clickedTarget.elementRef.innerText = val;
      } else if (clickedTarget.type === 'image') {
        (clickedTarget.elementRef as HTMLImageElement).src = val;
      }
    } catch (e) {}
    setClickedTarget({ ...clickedTarget, newValue: val });
  };

  const updateLinkValue = (url: string) => {
    if (!clickedTarget || !clickedTarget.elementRef) return;
    try {
      const linkEl = clickedTarget.elementRef.tagName === 'A' ? (clickedTarget.elementRef as HTMLAnchorElement) : (clickedTarget.elementRef.closest('a') as HTMLAnchorElement | null);
      if (linkEl) {
        linkEl.setAttribute('href', url);
      }
    } catch (e) {}
    setClickedTarget({ ...clickedTarget, newLink: url });
  };

  // Revert preview changes on Cancel
  const handleCancelEdit = () => {
    if (clickedTarget && clickedTarget.elementRef) {
      try {
        clickedTarget.elementRef.style.backgroundColor = clickedTarget.originalBgColor;
        clickedTarget.elementRef.style.color = clickedTarget.originalTextColor;
        if (clickedTarget.type === 'image') {
          (clickedTarget.elementRef as HTMLImageElement).src = clickedTarget.originalValue;
        } else if (clickedTarget.type === 'text') {
          clickedTarget.elementRef.innerText = clickedTarget.originalValue;
        }
        if (clickedTarget.originalLink !== undefined) {
          const linkEl = clickedTarget.elementRef.tagName === 'A' ? (clickedTarget.elementRef as HTMLAnchorElement) : (clickedTarget.elementRef.closest('a') as HTMLAnchorElement | null);
          if (linkEl) {
            linkEl.setAttribute('href', clickedTarget.originalLink);
          }
        }
      } catch (e) {}
    }
    setClickedTarget(null);
  };

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

    // 2. Apply content & link to the live DOM
    if (clickedTarget.type === 'image') {
      (clickedTarget.elementRef as HTMLImageElement).src = clickedTarget.newValue;
    } else if (clickedTarget.type === 'text' && clickedTarget.newValue) {
      clickedTarget.elementRef.innerText = clickedTarget.newValue;
    }

    if (clickedTarget.newLink !== undefined) {
      const linkEl = clickedTarget.elementRef.tagName === 'A' ? (clickedTarget.elementRef as HTMLAnchorElement) : (clickedTarget.elementRef.closest('a') as HTMLAnchorElement | null);
      if (linkEl) {
        linkEl.setAttribute('href', clickedTarget.newLink);
        if (clickedTarget.newLink.startsWith('http')) {
          linkEl.setAttribute('target', '_blank');
          linkEl.setAttribute('rel', 'noopener noreferrer');
        }
      }
    }

    // 3. Build persistent override object
    const newOverride: VisualOverrideItem = {
      selector,
      type: clickedTarget.type,
      originalValue: clickedTarget.originalValue,
      value: clickedTarget.newValue,
      backgroundColor: clickedTarget.newBgColor,
      textColor: clickedTarget.newTextColor,
      linkUrl: clickedTarget.newLink
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
      const el = clickedTarget.elementRef;
      const isDirector = el.closest('#hero-leadership-box') || 
                         el.closest('#about-section') || 
                         orig === websiteSettings.directorName?.trim() ||
                         clickedTarget.friendlyName.toLowerCase().includes('director');

      if (isDirector && (clickedTarget.friendlyName.toLowerCase().includes('heading') || clickedTarget.friendlyName.toLowerCase().includes('director') || orig.toLowerCase().includes('aman') || orig.toLowerCase().includes('director'))) {
        updatedSettings.directorName = val;
      }
      if (orig === websiteSettings.instituteName?.trim() || el.closest('#header-brand-banner')) updatedSettings.instituteName = val;
      if (orig === websiteSettings.contactPhone?.trim()) updatedSettings.contactPhone = val;
      if (orig === websiteSettings.contactEmail?.trim()) updatedSettings.contactEmail = val;
      if (orig === websiteSettings.contactAddress?.trim()) updatedSettings.contactAddress = val;
      if (orig === websiteSettings.emergencyAlertText?.trim()) updatedSettings.emergencyAlertText = val;
      if (orig === websiteSettings.heroBadgeText?.trim()) updatedSettings.heroBadgeText = val;
      if (orig === websiteSettings.instituteTagline?.trim()) updatedSettings.instituteTagline = val;
    } else if (clickedTarget.type === 'image') {
      const el = clickedTarget.elementRef;
      const alt = (el.getAttribute('alt') || '').toLowerCase();
      const isDirector = el.closest('#hero-leadership-box') || 
                         el.closest('#about-section') || 
                         alt.includes('director') || 
                         alt.includes('founder') || 
                         alt.includes('aman') ||
                         clickedTarget.friendlyName.toLowerCase().includes('director') ||
                         clickedTarget.friendlySubtitle.toLowerCase().includes('director');

      const isLogo = el.closest('#header-brand-banner') || 
                     el.closest('#header-main-navbar') || 
                     alt.includes('logo') || 
                     alt.includes('seal') ||
                     clickedTarget.friendlyName.toLowerCase().includes('logo');

      const isHeroPoster = el.closest('#hero-poster-banner') || 
                           alt.includes('poster') || 
                           alt.includes('banner');

      if (isDirector) {
        updatedSettings.directorPhotoUrl = clickedTarget.newValue;
      } else if (isLogo) {
        updatedSettings.logoUrl = clickedTarget.newValue;
      } else if (isHeroPoster) {
        updatedSettings.heroPosterUrl = clickedTarget.newValue;
      }
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
            {/* Header with Friendly Name */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                {clickedTarget.type === 'image' ? (
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-purple-400" />
                  </div>
                ) : clickedTarget.type === 'text' ? (
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                    <Type className="w-4 h-4 text-amber-400" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                    <Palette className="w-4 h-4 text-blue-400" />
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-black text-white tracking-wide">
                    {clickedTarget.friendlyName}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {clickedTarget.friendlySubtitle}
                  </span>
                </div>
              </div>
              <button
                onClick={handleCancelEdit}
                className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
                title="Cancel & Revert"
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
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">New Image URL (Previews instantly)</label>
                  <input
                    type="text"
                    value={clickedTarget.newValue}
                    onChange={e => updateContentValue(e.target.value)}
                    placeholder="https://... or upload local image file below"
                    className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                {/* Upload Image From Device (Auto-Compressed for permanent cloud save) */}
                <div>
                  <input
                    type="file"
                    id="live-editor-img-upload"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const compressed = await compressImageFile(file, 900, 0.82);
                        updateContentValue(compressed);
                      } catch (err: any) {
                        alert(err.message || 'Failed to process local image');
                      }
                    }}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('live-editor-img-upload')?.click()}
                    className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm"
                  >
                    <Upload className="w-4 h-4 text-amber-300" />
                    <span>Upload Photo From Device / Gallery (Auto-Compressed)</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {clickedTarget.originalValue && (
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
                    <span className="text-[10px] text-slate-500 uppercase font-black block mb-1">Current Text / Content:</span>
                    <p className="line-clamp-2 italic font-mono text-slate-300">{clickedTarget.originalValue}</p>
                  </div>
                )}
                {clickedTarget.originalValue && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Edit Text Content (Previews instantly on website)</label>
                    <textarea
                      rows={3}
                      value={clickedTarget.newValue}
                      onChange={e => updateContentValue(e.target.value)}
                      className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                )}
              </div>
            )}

            {/* HYPERLINK / REDIRECT URL CONTROLLER (Works on any Button, Link, Image, or Box) */}
            <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase text-blue-400">
                <Link2 className="w-4 h-4" />
                <span>Link / Click Redirect URL</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Aap is element pe click hone par kisi bhi page ya external link pe bhej sakte hain (eg: <code>/courses</code>, <code>/admission</code>, ya <code>https://wa.me/...</code>).
              </p>
              <input
                type="text"
                value={clickedTarget.newLink || ''}
                onChange={e => updateLinkValue(e.target.value)}
                placeholder="/courses, /admission, ya https://wa.me/..."
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            {/* OPTIONAL BACKGROUND PHOTO UPLOAD (For any container / section box) */}
            {clickedTarget.type !== 'image' && (
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-black uppercase text-purple-400">
                  <Upload className="w-4 h-4" />
                  <span>Set Background Photo (Mobile / Desktop)</span>
                </div>
                <input
                  type="file"
                  id="live-editor-bg-upload"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const compressed = await compressImageFile(file, 900, 0.82);
                      if (clickedTarget.elementRef) {
                        clickedTarget.elementRef.style.backgroundImage = `url(${compressed})`;
                        clickedTarget.elementRef.style.backgroundSize = 'cover';
                        clickedTarget.elementRef.style.backgroundPosition = 'center';
                      }
                      updateBgColor(`url(${compressed})`);
                    } catch (err: any) {
                      alert(err.message || 'Failed to process local image');
                    }
                  }}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('live-editor-bg-upload')?.click()}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-white text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors border border-slate-700"
                >
                  <Upload className="w-3.5 h-3.5 text-purple-400" />
                  <span>Upload Background Image from Device / Gallery</span>
                </button>
              </div>
            )}

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
                    value={clickedTarget.newBgColor || '#0B3B95'}
                    onChange={e => updateBgColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer bg-transparent p-0.5"
                    title="Choose any color from infinite palette"
                  />
                  <input
                    type="text"
                    value={clickedTarget.newBgColor}
                    onChange={e => updateBgColor(e.target.value)}
                    placeholder="#0B3B95"
                    className="w-28 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg font-mono text-xs text-white uppercase focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-400">Live preview on click</span>
                </div>
                {/* Quick Swatches */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {COLOR_SWATCHES.map(color => (
                    <button
                      key={`bg-${color}`}
                      type="button"
                      onClick={() => updateBgColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-5 h-5 rounded-full border border-slate-600 transition-transform hover:scale-125 cursor-pointer ${
                        clickedTarget.newBgColor.toLowerCase() === color.toLowerCase() ? 'ring-2 ring-amber-400 scale-110' : ''
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
                    value={clickedTarget.newTextColor || '#ffffff'}
                    onChange={e => updateTextColor(e.target.value)}
                    className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer bg-transparent p-0.5"
                    title="Choose any text color from infinite palette"
                  />
                  <input
                    type="text"
                    value={clickedTarget.newTextColor}
                    onChange={e => updateTextColor(e.target.value)}
                    placeholder="#ffffff"
                    className="w-28 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg font-mono text-xs text-white uppercase focus:outline-none focus:border-amber-400"
                  />
                  <span className="text-[10px] text-slate-400">Live preview on click</span>
                </div>
                {/* Quick Swatches */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {COLOR_SWATCHES.map(color => (
                    <button
                      key={`text-${color}`}
                      type="button"
                      onClick={() => updateTextColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-5 h-5 rounded-full border border-slate-600 transition-transform hover:scale-125 cursor-pointer ${
                        clickedTarget.newTextColor.toLowerCase() === color.toLowerCase() ? 'ring-2 ring-amber-400 scale-110' : ''
                      }`}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* LIVE PREVIEW BOX */}
              <div className="p-3.5 rounded-2xl border border-blue-500/30 bg-blue-950/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-wider">
                    <Eye className="w-4 h-4 animate-pulse" /> Live Preview Box
                  </span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                    ✓ Website pe real-time change ho raha hai
                  </span>
                </div>

                <div
                  className="p-4 rounded-xl border border-slate-700 shadow-md flex flex-col items-center justify-center text-center transition-all duration-150 min-h-[60px]"
                  style={{
                    backgroundColor: clickedTarget.newBgColor || '#0B3B95',
                    color: clickedTarget.newTextColor || '#ffffff'
                  }}
                >
                  <span className="font-extrabold text-sm tracking-wide">
                    {clickedTarget.type === 'text'
                      ? (clickedTarget.newValue || clickedTarget.originalValue)
                      : clickedTarget.friendlyName}
                  </span>
                  {clickedTarget.type !== 'text' && (
                    <span className="text-[10px] opacity-80 mt-0.5">
                      {clickedTarget.friendlySubtitle}
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                  💡 <b>Preview:</b> Website pe live check karein. Pasand aaye toh <b>Apply Live Change</b> dabayein, ya <b>Cancel</b> karke pehle jaisa restore karein.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={handleCancelEdit}
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

