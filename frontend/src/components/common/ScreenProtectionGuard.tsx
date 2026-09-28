import React, { useEffect, useState } from 'react';
import { ShieldAlert, Lock } from 'lucide-react';
import { toast } from 'sonner';
import { useApp } from '../../context/AppContext';

export const ScreenProtectionGuard: React.FC = () => {
  const { websiteSettings, isAdminAuthenticated } = useApp();
  const [isBlackout, setIsBlackout] = useState(false);
  const [isWindowBlurred, setIsWindowBlurred] = useState(false);

  // Active ONLY when enabled in Admin Panel AND current user is NOT the Admin
  const isProtectionActive = Boolean(websiteSettings?.enableScreenshotProtection) && !isAdminAuthenticated;

  useEffect(() => {
    if (!isProtectionActive) {
      setIsBlackout(false);
      setIsWindowBlurred(false);
      return;
    }

    // 1. Intercept PrintScreen and screenshot key combos
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen key
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
        e.preventDefault();
        triggerBlackout('Screenshot attempt detected! Screen has been blacked out.');
        return;
      }

      // Windows Snipping Tool (Win + Shift + S) or Mac (Cmd + Shift + 3/4)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === 'S' || e.key === 's' || e.key === '3' || e.key === '4')) {
        triggerBlackout('Screen capture shortcut blocked.');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.code === 'PrintScreen' || e.keyCode === 44) {
        triggerBlackout('Screenshot attempt detected!');
      }
    };

    const triggerBlackout = (message: string) => {
      setIsBlackout(true);
      // Wipe clipboard to remove any captured buffer
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText('Protected Content - L.C.C. Coaching Center').catch(() => {});
        }
      } catch (err) {}

      toast.error(message, {
        id: 'anti-screenshot-alert',
        duration: 3500,
        icon: <ShieldAlert className="w-5 h-5 text-red-500" />
      });

      // Keep black screen for 2.5 seconds
      setTimeout(() => {
        setIsBlackout(false);
      }, 2500);
    };

    // 2. Detect Focus Loss / Window Blur (Snipping tool / Screen recorder overlay focus steal)
    const handleBlur = () => {
      setIsWindowBlurred(true);
    };

    const handleFocus = () => {
      setIsWindowBlurred(false);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsWindowBlurred(true);
      } else {
        setIsWindowBlurred(false);
      }
    };

    // 3. Disable right-click save on protected media
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'IMG' || target.closest('.protected-media') || target.closest('#lightbox-modal'))) {
        e.preventDefault();
        toast.info('Right-click image saving is disabled for copyright protection.', { id: 'ctx-prevent' });
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('keyup', handleKeyUp, true);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('keyup', handleKeyUp, true);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isProtectionActive]);

  if (!isProtectionActive || (!isBlackout && !isWindowBlurred)) {
    return null;
  }

  return (
    <div
      id="anti-screenshot-blackout"
      className="fixed inset-0 z-[999999] bg-black flex flex-col items-center justify-center p-6 text-center select-none cursor-not-allowed transition-opacity duration-75"
    >
      <div className="max-w-md p-8 rounded-3xl bg-neutral-950 border border-neutral-800 shadow-2xl flex flex-col items-center space-y-4 animate-in zoom-in-95 duration-100">
        <div className="w-16 h-16 rounded-2xl bg-red-950/80 border border-red-800 flex items-center justify-center text-red-400 shadow-lg shadow-red-900/30">
          <ShieldAlert className="w-9 h-9" />
        </div>
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-900/40 text-red-300 text-[11px] font-bold uppercase tracking-wider border border-red-700/50">
            <Lock className="w-3.5 h-3.5" />
            <span>Anti-Capture Protection Active</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Screen Recording & Screenshots Restricted
          </h2>
          <p className="text-xs text-neutral-400 font-medium leading-relaxed">
            All coaching center media, student photos, and materials are protected. Content is automatically blacked out during capture attempts.
          </p>
        </div>
        <p className="text-[10px] text-neutral-500 font-mono">
          Click back inside this window to resume viewing
        </p>
      </div>
    </div>
  );
};
