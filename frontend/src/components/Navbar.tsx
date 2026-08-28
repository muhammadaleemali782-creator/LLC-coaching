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
  ChevronDown
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
    colorTheme,
    setColorTheme,
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
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        
        {/* Top Emergency & Admission Helpline Bar */}
        <div className="bg-[#0066FF] text-white py-1.5 px-3 sm:px-6 text-xs transition-colors">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0">
                BATCH 2026–27
              </span>
              <span className="hidden md:inline font-bold text-[11px] truncate">
                Admissions Open for Classes 1–12, Computer DCA & Spoken English
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-[10px] sm:text-[11px] font-bold">
              <a href="tel:+919876543210" className="hover:text-amber-300 flex items-center gap-1 whitespace-nowrap bg-white/10 px-2 py-0.5 rounded-full">
                <Phone className="w-3 h-3 shrink-0" />
                <span>+91 98765 43210</span>
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-2.5 py-0.5 rounded-full flex items-center gap-1 transition-colors whitespace-nowrap"
              >
                <MessageSquare className="w-3 h-3 shrink-0" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <nav className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* L.C.C. + Learner Brand Logo */}
          <div
            onClick={() => navigateTo('home')}
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer select-none group shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-[#0066FF] text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-sm">
              LCC
            </div>
            <div className="flex items-center tracking-tight font-black text-lg sm:text-xl">
              <span className="text-[#0066FF]">learn</span>
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-[10px] font-black -ml-0.5 shadow-xs">
                er
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-4 text-xs font-bold text-slate-600">
            {navItems.map(item => {
              const isActive = activeView === 'home' ? scrollSection === item.view : activeView === item.view;
              return (
                <button
                  key={item.label}
                  onClick={() => navigateTo(item.view, item.anchor)}
                  className={`transition-all py-1.5 px-3 rounded-full relative hover:text-[#0066FF] cursor-pointer ${
                    isActive ? 'text-[#0066FF] bg-blue-50 font-extrabold' : ''
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
          <div className="flex items-center gap-2">
            
            {/* Student Login Button */}
            {currentStudent ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigateTo('student-portal')}
                  className="px-3 sm:px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-100 transition-all cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[80px] sm:max-w-[120px]">{currentStudent.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={logoutStudent}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-slate-100 transition-colors"
                  title="Logout"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsStudentAuthModalOpen(true)}
                className="px-3 sm:px-4 py-2 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-black uppercase tracking-wider shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
                <span>Student Login</span>
              </button>
            )}

            {/* Admin Shield Access */}
            <button
              onClick={() => {
                if (isAdminAuthenticated) {
                  navigateTo('admin-panel');
                } else {
                  setIsAdminAuthModalOpen(true);
                }
              }}
              className="p-2 rounded-full border border-slate-200 text-slate-600 hover:text-[#0066FF] hover:bg-slate-50 transition-colors cursor-pointer"
              title="Admin Portal"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </nav>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 bg-white px-4 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-4 duration-200 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map(item => (
                <button
                  key={item.label}
                  onClick={() => {
                    navigateTo(item.view, item.anchor);
                    setIsMobileMenuOpen(false);
                  }}
                  className="py-2.5 px-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-bold text-slate-700 text-left flex items-center justify-between"
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  if (currentStudent) {
                    navigateTo('student-portal');
                  } else {
                    setIsStudentAuthModalOpen(true);
                  }
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-2xl bg-[#0066FF] text-white font-black text-xs uppercase tracking-wider text-center"
              >
                {currentStudent ? `Student Portal (${currentStudent.name})` : 'Student Portal & Quizzes'}
              </button>

              {/* Clean Admin Portal Button (Zero Demo Password Displayed) */}
              <button
                onClick={() => {
                  if (isAdminAuthenticated) {
                    navigateTo('admin-panel');
                  } else {
                    setIsAdminAuthModalOpen(true);
                  }
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs text-center flex items-center justify-center gap-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-[#0066FF]" />
                <span>Director & Admin Control Desk</span>
              </button>
            </div>
          </div>
        )}

      </header>

      {/* Sticky Bottom 5-Tab Bar */}
      <div className="xl:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 border-t border-slate-200/80 py-2 px-3 backdrop-blur-xl flex items-center justify-around shadow-2xl">
        <button
          onClick={() => navigateTo('home')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
            scrollSection === 'home' && activeView === 'home' ? 'text-[#0066FF]' : 'text-slate-400'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => navigateTo('courses', 'courses-section')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
            scrollSection === 'courses' ? 'text-[#0066FF]' : 'text-slate-400'
          }`}
        >
          <GraduationCap className="w-5 h-5" />
          <span>Courses</span>
        </button>

        <button
          onClick={() => navigateTo('study-material', 'study-material-section')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
            scrollSection === 'study-material' ? 'text-[#0066FF]' : 'text-slate-400'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>Notes</span>
        </button>

        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-emerald-600"
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
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
            activeView === 'student-portal' ? 'text-[#0066FF]' : 'text-slate-400'
          }`}
        >
          <User className="w-5 h-5" />
          <span>{currentStudent ? 'Portal' : 'Login'}</span>
        </button>
      </div>
    </>
  );
};
