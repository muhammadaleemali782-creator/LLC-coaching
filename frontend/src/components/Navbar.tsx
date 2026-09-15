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
import { NoticeTicker } from './NoticeTicker';

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

  const headerOrder = (websiteSettings?.headerOrder && websiteSettings.headerOrder.length > 0)
    ? websiteSettings.headerOrder
    : ['top-bar', 'brand-header', 'navbar', 'notice-ticker'];

  const renderTopBar = () => (
    <div key="top-bar" id="header-top-bar" className="bg-[#0066FF] text-white py-1 px-3 sm:px-6 text-xs transition-colors">
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
  );

  const renderBrandHeader = () => (
    <div key="brand-header" id="header-brand-banner" className="bg-white border-b-2 border-red-600/30 py-3 sm:py-4 px-3 sm:px-6 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
        <div
          onClick={() => navigateTo('home')}
          className="flex items-center gap-2 sm:gap-3 cursor-pointer shrink-0"
        >
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full border-2 border-amber-400 p-0.5 sm:p-1 bg-white shadow-md flex items-center justify-center shrink-0">
            <img
              src={websiteSettings?.logoUrl || '/logo.jpg'}
              alt={websiteSettings?.instituteName || 'L.C.C. Official Seal'}
              className="w-full h-full object-contain rounded-full"
              onError={(e: any) => { e.target.src = '/logo.jpg'; }}
            />
          </div>
        </div>

        <div
          onClick={() => navigateTo('home')}
          className="text-center flex-1 cursor-pointer select-none space-y-0.5 sm:space-y-1"
        >
          <h1 className="text-base sm:text-2xl lg:text-3xl font-black text-[#0B3B95] tracking-tight uppercase leading-snug">
            {websiteSettings?.instituteName || 'LEARNING COACHING CENTER (L.C.C.)'}
          </h1>
          <h2 className="text-sm sm:text-xl lg:text-2xl font-black text-[#D32F2F] tracking-wide leading-tight">
            लर्निंग कोचिंग सेंटर (एल.सी.सी.) वाराणसी
          </h2>
          <p className="text-[10px] sm:text-xs font-bold text-slate-600 hidden sm:block">
            (A Premier Coaching Institute for School Academics, Computer DCA & Spoken English)
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-amber-500 bg-amber-50 flex flex-col items-center justify-center shadow-xs">
            <span className="text-[8px] sm:text-[9px] font-bold text-amber-900 leading-none">RATED</span>
            <span className="text-xs sm:text-base font-black text-amber-600 leading-none">A++</span>
            <span className="text-[7px] sm:text-[8px] font-bold text-amber-900 leading-none">TOP #1</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMainNavbar = () => (
    <header key="navbar" id="header-main-navbar" className="sticky top-0 z-40 bg-[#0B3B95] text-white shadow-md transition-colors">
      <nav className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Brand Badge for compact view */}
        <div
          onClick={() => navigateTo('home')}
          className="flex items-center gap-2 cursor-pointer select-none py-1"
        >
          <span className="bg-amber-400 text-slate-950 font-black text-xs px-2 py-0.5 rounded uppercase tracking-wider">
            L.C.C.
          </span>
          <span className="font-extrabold text-sm sm:text-base text-white tracking-tight hidden md:inline">
            Campus Portal
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden xl:flex items-center gap-1 text-xs font-bold text-white/90">
          {navItems.map(item => {
            const isActive = activeView === 'home' ? scrollSection === item.view : activeView === item.view;
            return (
              <button
                key={item.label}
                onClick={() => navigateTo(item.view, item.anchor)}
                className={`transition-all py-1.5 px-3 rounded-full relative hover:text-amber-300 hover:bg-white/10 cursor-pointer ${
                  isActive ? 'text-slate-950 bg-amber-400 font-extrabold shadow-xs' : ''
                }`}
              >
                {item.label}
                {item.view === 'notices' && importantNoticesCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-[#0B3B95]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Notice Bell */}
          <button
            onClick={() => navigateTo('notices', 'notices-section')}
            className="p-1.5 sm:p-2 rounded-full hover:bg-white/10 text-white transition-colors relative cursor-pointer"
            title="Notice Board"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {importantNoticesCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>

          {/* Admin / Director Desk Access Button */}
          {isAdminAuthenticated ? (
            <button
              onClick={() => navigateTo('admin-panel')}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              title="Open Director Admin Panel"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Admin Desk</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAdminAuthModalOpen(true)}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              title="Director / Admin Login"
            >
              <Shield className="w-3.5 h-3.5 text-slate-950" />
              <span className="whitespace-nowrap">Admin</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-1.5 sm:p-2 rounded-xl text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="xl:hidden border-t border-blue-800 bg-[#0B3B95] px-4 py-4 space-y-4 shadow-2xl animate-in slide-in-from-top-4 duration-200 max-h-[calc(100vh-120px)] overflow-y-auto pb-36 text-white">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map(item => (
              <button
                key={item.label}
                onClick={() => {
                  navigateTo(item.view, item.anchor);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-amber-400 hover:text-slate-950 transition-all text-left"
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              {isAdminAuthenticated ? (
                <button
                  onClick={() => {
                    navigateTo('admin-panel');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-wider text-center shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Shield className="w-4 h-4" />
                  <span>Open Director Desk</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsAdminAuthModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider text-center border border-white/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-amber-300" />
                  <span>Director / Admin Login</span>
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
    );

    const headerPartsMap: Record<string, React.ReactNode> = {
      'top-bar': renderTopBar(),
      'brand-header': renderBrandHeader(),
      'navbar': renderMainNavbar(),
      'notice-ticker': <NoticeTicker key="notice-ticker" />
    };

    return (
      <>
        {headerOrder.map(partKey => headerPartsMap[partKey] || null)}
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
