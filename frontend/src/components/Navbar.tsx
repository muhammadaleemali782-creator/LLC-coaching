import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  User,
  Shield,
  Phone,
  MessageSquare,
  FileText,
  Video,
  Image,
  Bell,
  Menu,
  X,
  Palette,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { ColorTheme } from '../types';

export const Navbar: React.FC = () => {
  const {
    currentStudent,
    isAdminAuthenticated,
    activeView,
    scrollSection,
    navigateTo,
    setIsStudentAuthModalOpen,
    setIsAdminAuthModalOpen,
    logoutStudent,
    notices,
    websiteSettings,
    colorTheme,
    setColorTheme,
    theme,
    toggleTheme,
    showToast
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const importantNoticesCount = notices.filter(n => n.isImportant).length;

  const themes: { id: ColorTheme; label: string; bg: string; border: string }[] = [
    { id: 'cobalt', label: 'Cobalt (Default)', bg: 'bg-[#0066FF]', border: 'border-[#0066FF]' },
    { id: 'emerald', label: 'Emerald Mint', bg: 'bg-emerald-600', border: 'border-emerald-600' },
    { id: 'purple', label: 'Royal Purple', bg: 'bg-purple-600', border: 'border-purple-600' },
    { id: 'sunset', label: 'Sunset Amber', bg: 'bg-amber-600', border: 'border-amber-600' },
    { id: 'midnight', label: 'Midnight Blue', bg: 'bg-slate-900', border: 'border-slate-900' }
  ];

  const navItems = [
    { label: 'Home', view: 'home' as const, anchor: 'home' },
    { label: 'Courses', view: 'courses' as const, anchor: 'courses-section' },
    { label: 'Study Vault', view: 'study-material' as const, anchor: 'study-material-section' },
    { label: 'Syllabus', view: 'syllabus' as const, anchor: 'syllabus-section' },
    { label: 'Batches', view: 'batches' as const, anchor: 'batches-section' },
    { label: 'Lectures', view: 'videos' as const, anchor: 'videos-section' },
    { label: 'Reviews', view: 'reviews' as const, anchor: 'reviews-section' },
    { label: 'Gallery', view: 'gallery' as const, anchor: 'gallery-section' },
    { label: 'Notices', view: 'notices' as const, anchor: 'notices-section' },
    { label: 'Admission', view: 'admission' as const, anchor: 'admission-section' },
    { label: 'Contact', view: 'contact' as const, anchor: 'contact-section' }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors">
        
        {/* Top Emergency & Admission Helpline Bar */}
        <div className="bg-[#0066FF] text-white py-1 px-3 sm:px-6 text-xs transition-colors">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="bg-amber-400 text-slate-950 font-black text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                BATCH 2026–27
              </span>
              <span className="hidden md:inline font-bold text-[11px] truncate">
                Admissions Open for Classes 1–12, Computer DCA & Spoken English
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 text-[10px] sm:text-[11px] font-bold">
              <a href="tel:+919876543210" className="hover:text-amber-300 flex items-center gap-1 whitespace-nowrap bg-white/10 px-2 py-0.5 rounded-full">
                <Phone className="w-3 h-3 shrink-0" />
                <span className="hidden xs:inline">+91 98765 43210</span>
                <span className="xs:hidden">Call</span>
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors whitespace-nowrap"
              >
                <MessageSquare className="w-3 h-3 shrink-0" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <nav className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-1.5 sm:gap-4">
          
          {/* L.C.C. Official Brand Logo */}
          <div
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group shrink-0"
          >
            <img
              src={websiteSettings?.logoUrl || '/logo.jpg'}
              alt={websiteSettings?.instituteName || 'L.C.C. Learning Coaching Center'}
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl object-contain shadow-sm border border-slate-200/50 dark:border-slate-800 bg-white"
              onError={(e: any) => {
                e.target.src = '/logo.jpg';
              }}
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-black text-base sm:text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                  {websiteSettings?.shortName || 'L.C.C.'}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-wider hidden sm:inline-block">
                  Coaching
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-[#0066FF] tracking-wide leading-tight">
                {websiteSettings?.instituteTagline || 'Learning Coaching Center'}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-300">
            {navItems.map(item => {
              const isActive = activeView === 'home' ? scrollSection === item.view : activeView === item.view;
              return (
                <button
                  key={item.label}
                  onClick={() => navigateTo(item.view, item.anchor)}
                  className={`transition-all py-1.5 px-3 rounded-full relative hover:text-[#0066FF] cursor-pointer ${
                    isActive ? 'text-[#0066FF] bg-blue-50 dark:bg-blue-950/60 font-extrabold' : ''
                  }`}
                >
                  {item.label}
                  {item.view === 'notices' && importantNoticesCount > 0 && (
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-400 ml-1 align-middle animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Authenticated Director Quick Hub Access */}
            {isAdminAuthenticated && (
              <button
                onClick={() => navigateTo('admin-panel')}
                className="px-2.5 sm:px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1 cursor-pointer animate-in fade-in"
                title="Director Desk"
              >
                <Shield className="w-3.5 h-3.5 text-slate-950" />
                <span className="hidden sm:inline">Director Desk</span>
              </button>
            )}

            {/* Unified Single Login Portal Button */}
            {currentStudent ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigateTo('student-portal')}
                  className="px-2.5 sm:px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] sm:text-xs font-bold flex items-center gap-1 hover:bg-emerald-100 transition-all cursor-pointer"
                >
                  <User className="w-3 h-3" />
                  <span className="truncate max-w-[60px] sm:max-w-[100px]">{currentStudent.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={logoutStudent}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Logout"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : !isAdminAuthenticated ? (
              <button
                onClick={() => setIsStudentAuthModalOpen(true)}
                className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-1 cursor-pointer"
              >
                <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="whitespace-nowrap">Login</span>
              </button>
            ) : null}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-1.5 sm:p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors cursor-pointer"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>

          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-200 max-h-[calc(100vh-120px)] overflow-y-auto pb-36">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map(item => (
                <button
                  key={item.label}
                  onClick={() => {
                    navigateTo(item.view, item.anchor);
                    setIsMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 text-left flex items-center justify-between cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-[#0066FF]"
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              {isAdminAuthenticated && (
                <button
                  onClick={() => {
                    navigateTo('admin-panel');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider text-center shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Shield className="w-4 h-4" />
                  <span>Open Director Desk</span>
                </button>
              )}

              <button
                onClick={() => {
                  if (currentStudent) {
                    navigateTo('student-portal');
                  } else {
                    setIsStudentAuthModalOpen(true);
                  }
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-2xl bg-[#0066FF] text-white font-black text-xs uppercase tracking-wider text-center shadow-sm cursor-pointer"
              >
                {currentStudent ? `Student Portal (${currentStudent.name})` : 'Student Portal & Login'}
              </button>
            </div>
          </div>
        )}

      </header>

      {/* Sticky Bottom 5-Tab Bar (Only on public view, never block admin panel) */}
      {activeView !== 'admin-panel' && (
        <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 border-t border-slate-200/80 dark:border-slate-800 py-2 px-3 backdrop-blur-xl flex items-center justify-around shadow-2xl transition-colors">
          <button
            onClick={() => navigateTo('home')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors cursor-pointer ${
              scrollSection === 'home' && activeView === 'home' ? 'text-[#0066FF]' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => navigateTo('courses', 'courses-section')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors cursor-pointer ${
              scrollSection === 'courses' ? 'text-[#0066FF]' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <GraduationCap className="w-5 h-5" />
            <span>Courses</span>
          </button>

          <button
            onClick={() => navigateTo('study-material', 'study-material-section')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors cursor-pointer ${
              scrollSection === 'study-material' ? 'text-[#0066FF]' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span>Notes</span>
          </button>

          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 cursor-pointer"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Chat</span>
          </a>

          <button
            onClick={() => {
              if (currentStudent) {
                navigateTo('student-portal');
              } else {
                setIsStudentAuthModalOpen(true);
              }
            }}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors cursor-pointer ${
              activeView === 'student-portal' ? 'text-[#0066FF]' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <User className="w-5 h-5" />
            <span>{currentStudent ? 'Portal' : 'Login'}</span>
          </button>
        </div>
      )}
    </>
  );
};
