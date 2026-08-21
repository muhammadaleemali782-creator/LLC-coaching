import React, { useState, useEffect } from 'react';
import { useApp, ActiveView } from '../context/AppContext';
import {
  GraduationCap,
  BookOpen,
  FileText,
  Video,
  Image,
  Bell,
  UserCheck,
  Shield,
  Menu,
  X,
  Phone,
  MessageSquare,
  Sparkles,
  Layers,
  Award,
  ChevronRight,
  LogOut,
  User
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    activeView,
    navigateTo,
    currentStudent,
    isAdminLoggedIn,
    setIsStudentAuthModalOpen,
    setIsAdminAuthModalOpen,
    logoutStudent,
    notices
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollSection, setScrollSection] = useState<string>('home');

  const importantNoticesCount = notices.filter(n => n.isImportant).length;

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const coursesEl = document.getElementById('courses-section');
      const studyEl = document.getElementById('study-material-section');
      const batchesEl = document.getElementById('batches-section');
      const contactEl = document.getElementById('contact-section');

      if (contactEl && scrollY >= contactEl.offsetTop - 200) {
        setScrollSection('contact');
      } else if (studyEl && scrollY >= studyEl.offsetTop - 200) {
        setScrollSection('study-material');
      } else if (batchesEl && scrollY >= batchesEl.offsetTop - 200) {
        setScrollSection('batches');
      } else if (coursesEl && scrollY >= coursesEl.offsetTop - 200) {
        setScrollSection('courses');
      } else {
        setScrollSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; view: ActiveView; anchor?: string; icon: React.FC<{ className?: string }> }[] = [
    { label: 'Home', view: 'home', icon: Sparkles },
    { label: 'Courses', view: 'courses', anchor: 'courses-section', icon: GraduationCap },
    { label: 'Study Vault', view: 'study-material', anchor: 'study-material-section', icon: FileText },
    { label: 'Syllabus', view: 'syllabus', anchor: 'syllabus-section', icon: BookOpen },
    { label: 'Batches', view: 'batches', anchor: 'batches-section', icon: Layers },
    { label: 'Lectures', view: 'videos', anchor: 'youtube-section', icon: Video },
    { label: 'Gallery', view: 'gallery', anchor: 'gallery-section', icon: Image },
    { label: 'Notices', view: 'notices', icon: Bell },
    { label: 'Admission', view: 'admission', anchor: 'admission-section', icon: Award },
    { label: 'Contact', view: 'contact', anchor: 'contact-section', icon: Phone }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all shadow-card-clean">
        
        {/* Top Emergency Strip */}
        <div className="bg-[#0066FF] py-1 px-3 sm:px-6 text-white overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 truncate">
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] sm:text-[10px] uppercase whitespace-nowrap shrink-0">
                BATCH 2026-27
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
                  className={`transition-all py-1.5 px-3 rounded-full relative hover:text-[#0066FF] ${
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
                  className="px-3 py-1.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200 text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1 shadow-xs"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="truncate max-w-[70px] sm:max-w-none">{currentStudent.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={logoutStudent}
                  title="Logout"
                  className="p-1.5 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsStudentAuthModalOpen(true)}
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-bold tracking-wide shadow-md shadow-blue-500/25 transition-all flex items-center gap-1"
              >
                <UserCheck className="w-3.5 h-3.5 shrink-0" />
                <span className="whitespace-nowrap">Student Login</span>
              </button>
            )}

            {/* Admin Portal Trigger */}
            <button
              onClick={() => {
                if (isAdminLoggedIn) navigateTo('admin-panel');
                else setIsAdminAuthModalOpen(true);
              }}
              className={`p-1.5 rounded-full border transition-colors shrink-0 ${
                isAdminLoggedIn
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
              title="Admin Portal (admin123)"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </nav>

        {/* Mobile Slide-Down Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden bg-white border-b border-slate-100 px-4 py-4 space-y-3 shadow-2xl animate-in slide-in-from-top-4 duration-200">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map(item => (
                <button
                  key={item.label}
                  onClick={() => {
                    navigateTo(item.view, item.anchor);
                    setIsMobileMenuOpen(false);
                  }}
                  className="p-3 rounded-2xl text-left text-xs font-bold border transition-colors flex items-center gap-2 bg-slate-50 border-slate-200/80 text-slate-700 hover:border-blue-400 hover:bg-blue-50"
                >
                  <item.icon className="w-4 h-4 text-[#0066FF] shrink-0" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsStudentAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-3 rounded-2xl bg-[#0066FF] text-white font-bold text-xs shadow-md shadow-blue-500/20 text-center"
              >
                Student Portal & Quizzes
              </button>
              <button
                onClick={() => {
                  setIsAdminAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-2xl bg-slate-100 text-slate-600 font-semibold text-xs text-center"
              >
                Admin Control Login (admin123)
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
