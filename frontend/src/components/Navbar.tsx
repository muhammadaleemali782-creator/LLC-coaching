import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  User,
  Users,
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
    currentStaff,
    isAdminAuthenticated,
    activeView,
    scrollSection,
    navigateTo,
    setIsStudentAuthModalOpen,
    setIsAdminAuthModalOpen,
    logoutStudent,
    logoutStaff,
    notices,
    websiteSettings,
    colorTheme,
    setColorTheme,
    theme,
    toggleTheme,
    showToast
  } = useApp();

  const contactPhone = websiteSettings?.contactPhone || '+91 9250703092';
  const cleanPhone = contactPhone.replace(/[^0-9]/g, '');

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
          <a href={`tel:${contactPhone}`} className="hover:text-amber-300 flex items-center gap-1 whitespace-nowrap bg-white/10 px-2 py-0.5 rounded-full">
            <Phone className="w-3 h-3 shrink-0" />
            <span className="hidden xs:inline">{contactPhone}</span>
            <span className="xs:hidden">Call</span>
          </a>
          <a
            href={`https://wa.me/${cleanPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors whitespace-nowrap"
          >
            <MessageSquare className="w-3 h-3 shrink-0" />
            <span>WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => navigateTo('staff-portal')}
            className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap shadow-xs"
            title="Employee & Teacher Portal"
          >
            <Users className="w-3 h-3 text-slate-950" />
            <span>Staff Portal</span>
          </button>
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
            {websiteSettings?.instituteTagline || 'EXCELLENCE IN EDUCATION • VARANASI'}
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

          {/* Unified Auth Button: Admin Desk when admin logged in, Student Profile when student logged in, Student Portal otherwise */}
          {isAdminAuthenticated ? (
            <button
              onClick={() => navigateTo('admin-panel')}
              className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              title="Open Director Admin Panel"
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="whitespace-nowrap">Admin Desk</span>
            </button>
          ) : currentStaff ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => navigateTo('staff-portal')}
                className="flex items-center gap-1.5 sm:gap-2 bg-indigo-600/80 hover:bg-indigo-600 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-indigo-400/40 transition-all cursor-pointer shadow-xs"
                title="Open Employee & Teacher Portal"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white text-indigo-700 font-black text-[10px] sm:text-xs flex items-center justify-center">
                  {(currentStaff.name || 'T').charAt(0).toUpperCase()}
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-white hidden sm:inline truncate max-w-[110px]">
                  Staff: {(currentStaff.name || 'Faculty').split(' ')[0]}
                </span>
              </button>
              <button
                onClick={logoutStaff}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                title="Log Out Staff"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : currentStudent ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => navigateTo('student-portal')}
                className="flex items-center gap-1.5 sm:gap-2 bg-white/10 hover:bg-white/20 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/20 transition-all cursor-pointer"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px] sm:text-xs flex items-center justify-center">
                  {(currentStudent.name || 'S').charAt(0).toUpperCase()}
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-white hidden sm:inline truncate max-w-[100px]">
                  {(currentStudent.name || 'Student').split(' ')[0]}
                </span>
              </button>
              <button
                onClick={logoutStudent}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
                title="Log Out"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsStudentAuthModalOpen(true)}
                className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-1 cursor-pointer"
                title="Student Portal Login"
              >
                <User className="w-3 h-3 text-slate-950" />
                <span className="whitespace-nowrap font-black">Student</span>
              </button>
              <button
                onClick={() => navigateTo('staff-portal')}
                className="hidden sm:flex px-3 py-1.5 sm:py-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-[11px] sm:text-xs font-bold items-center gap-1 cursor-pointer transition-all"
                title="Employee & Teacher Portal"
              >
                <Users className="w-3 h-3 text-amber-300" />
                <span className="whitespace-nowrap">Staff</span>
              </button>
            </div>
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
              ) : currentStaff ? (
                <button
                  onClick={() => {
                    navigateTo('staff-portal');
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider text-center shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>Staff Portal ({currentStaff.name})</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      if (currentStudent) {
                        navigateTo('student-portal');
                      } else {
                        setIsStudentAuthModalOpen(true);
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-3 rounded-2xl bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider text-center shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <User className="w-4 h-4" />
                    <span>{currentStudent ? `Student Portal (${currentStudent.name})` : 'Student Portal'}</span>
                  </button>

                  <button
                    onClick={() => {
                      navigateTo('staff-portal');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Users className="w-4 h-4 text-amber-300" />
                    <span>Staff & Teacher Portal</span>
                  </button>
                </>
              )}
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
      {/* Physics Wallah (PW) App-Style Mobile Header */}
      <div className="xl:hidden bg-gradient-to-r from-[#0052CC] via-[#0066FF] to-[#0A2540] text-white px-3.5 py-2.5 flex items-center justify-between shadow-md sticky top-0 z-40 transition-colors">
        <div className="flex items-center gap-2.5">
          <div
            onClick={() => {
              if (currentStudent) {
                navigateTo('student-portal');
              } else {
                setIsStudentAuthModalOpen(true);
              }
            }}
            className="w-9 h-9 rounded-full bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center cursor-pointer shadow-md ring-2 ring-white/30 shrink-0"
            title="Student Profile"
          >
            {currentStudent ? (currentStudent.name || 'S').charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </div>
          <div className="leading-tight">
            <div className="text-xs font-black text-white flex items-center gap-1">
              <span>{currentStudent ? `Hi, ${currentStudent.name.split(' ')[0]}!` : 'Hello, Learner!'}</span>
              <span>👋</span>
            </div>
            <div className="text-[10px] font-semibold text-blue-100 flex items-center gap-1.5">
              <span>L.C.C. Live Learning</span>
              <span className="inline-flex items-center gap-1 text-[9px] bg-emerald-500/30 text-emerald-300 font-bold px-1.5 py-0.2 rounded-full border border-emerald-400/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigateTo('notices', 'notices-section')}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {importantNoticesCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>

          <a
            href={`https://wa.me/${cleanPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-sm transition-all"
            title="Ask Doubts on WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Doubts</span>
          </a>

          {/* Quick Drawer Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* PW Horizontal Target Exam / Class Goal Strip */}
      <div className="xl:hidden bg-slate-900 border-b border-slate-800 px-2.5 py-1.5 overflow-x-auto scrollbar-none flex items-center gap-1.5 text-[11px] font-bold text-slate-300">
        {[
          { label: '🎯 All Batches', view: 'batches' as const, anchor: 'batches-section', bg: 'bg-blue-600 text-white' },
          { label: '📚 Class 9-10th', view: 'courses' as const, anchor: 'courses-section', bg: 'bg-slate-800 text-slate-200' },
          { label: '🔬 Class 11-12th', view: 'courses' as const, anchor: 'courses-section', bg: 'bg-slate-800 text-slate-200' },
          { label: '🩺 NEET / Foundation', view: 'courses' as const, anchor: 'courses-section', bg: 'bg-slate-800 text-slate-200' },
          { label: '💻 Computer DCA', view: 'courses' as const, anchor: 'courses-section', bg: 'bg-slate-800 text-slate-200' },
          { label: '🗣️ Spoken English', view: 'courses' as const, anchor: 'courses-section', bg: 'bg-slate-800 text-slate-200' },
          { label: '📥 Free DPPs', view: 'study-material' as const, anchor: 'study-material-section', bg: 'bg-slate-800 text-slate-200' },
        ].map((pill, idx) => (
          <button
            key={idx}
            onClick={() => navigateTo(pill.view, pill.anchor)}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-[11px] font-bold transition-all shrink-0 cursor-pointer border border-white/10 active:scale-95 ${pill.bg}`}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* PW-Style Mobile Bottom App Dock */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B1528]/95 border-t border-slate-800/90 py-1 pb-[max(0.4rem,env(safe-area-inset-bottom))] px-1 backdrop-blur-xl grid grid-cols-5 items-center shadow-2xl transition-colors">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-all cursor-pointer py-1 rounded-xl appearance-none bg-transparent border-0 select-none ${
            activeView === 'home' ? 'text-blue-400 font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeView === 'home' ? 'bg-blue-600/30' : ''}`}>
            <Sparkles className="w-5 h-5 shrink-0" />
          </div>
          <span className="truncate w-full text-center text-[10px]">Home</span>
        </button>

        {/* 2. Batches (Core PW Tab) */}
        <button
          type="button"
          onClick={() => navigateTo('batches', 'batches-section')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-all cursor-pointer py-1 rounded-xl appearance-none bg-transparent border-0 select-none ${
            activeView === 'batches' || activeView === 'courses' ? 'text-amber-400 font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeView === 'batches' || activeView === 'courses' ? 'bg-amber-500/30' : ''}`}>
            <BookOpen className="w-5 h-5 shrink-0" />
          </div>
          <span className="truncate w-full text-center text-[10px]">Batches</span>
        </button>

        {/* 3. Study Vault (PW Notes & DPPs) */}
        <button
          type="button"
          onClick={() => navigateTo('study-material', 'study-material-section')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-all cursor-pointer py-1 rounded-xl appearance-none bg-transparent border-0 select-none ${
            activeView === 'study-material' ? 'text-emerald-400 font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeView === 'study-material' ? 'bg-emerald-500/30' : ''}`}>
            <FileText className="w-5 h-5 shrink-0" />
          </div>
          <span className="truncate w-full text-center text-[10px]">Vault</span>
        </button>

        {/* 4. Notices (PW Announcements & Timetable) */}
        <button
          type="button"
          onClick={() => navigateTo('notices', 'notices-section')}
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-all cursor-pointer py-1 rounded-xl appearance-none bg-transparent border-0 select-none relative ${
            activeView === 'notices' ? 'text-rose-400 font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all relative ${activeView === 'notices' ? 'bg-rose-500/30' : ''}`}>
            <Bell className="w-5 h-5 shrink-0" />
            {importantNoticesCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            )}
          </div>
          <span className="truncate w-full text-center text-[10px]">Notices</span>
        </button>

        {/* 5. My Study / Student Portal */}
        <button
          type="button"
          onClick={() => {
            if (currentStudent) {
              navigateTo('student-portal');
            } else {
              setIsStudentAuthModalOpen(true);
            }
          }}
          className={`flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-all cursor-pointer py-1 rounded-xl appearance-none bg-transparent border-0 select-none ${
            activeView === 'student-portal' ? 'text-indigo-400 font-black' : 'text-slate-400 hover:text-white'
          }`}
        >
          <div className={`p-1 rounded-xl transition-all ${activeView === 'student-portal' ? 'bg-indigo-500/30' : ''}`}>
            <User className="w-5 h-5 shrink-0" />
          </div>
          <span className="truncate w-full text-center text-[10px]">
            {currentStudent ? (currentStudent.name.split(' ')[0]) : 'My Study'}
          </span>
        </button>
      </div>
    </>
  );
};
