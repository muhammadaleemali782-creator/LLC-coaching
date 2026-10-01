import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  BookOpen,
  DownloadCloud,
  Globe,
  MessageSquare,
  Shield,
  Users,
  LogOut,
  X,
  Target,
  ArrowRight,
  GraduationCap,
  Sparkles,
  Award,
  ChevronRight
} from 'lucide-react';
import { getTranslation, AppLanguage } from '../../utils/i18n';
import { getOfflineDocs } from '../../utils/offlineStorage';

interface MobileAppDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenGoalModal: () => void;
  onOpenOfflineVault: () => void;
}

export const MobileAppDrawer: React.FC<MobileAppDrawerProps> = ({
  isOpen,
  onClose,
  onOpenGoalModal,
  onOpenOfflineVault
}) => {
  const {
    currentStudent,
    currentStaff,
    isAdminAuthenticated,
    logoutStudent,
    logoutStaff,
    navigateTo,
    language,
    setLanguage,
    websiteSettings,
    setIsStudentAuthModalOpen
  } = useApp();

  const t = getTranslation(language);
  const offlineCount = getOfflineDocs().length;
  const contactPhone = (websiteSettings?.contactPhone || '9250703092').replace(/[^0-9]/g, '');

  if (!isOpen) return null;

  const languages: { id: AppLanguage; label: string; icon: string }[] = [
    { id: 'en', label: 'English', icon: '🇬🇧' },
    { id: 'hinglish', label: 'Hinglish', icon: '🇮🇳' },
    { id: 'hi', label: 'हिंदी', icon: '🕉️' },
    { id: 'mr', label: 'मराठी', icon: '🚩' }
  ];

  const studentAvatar = currentStudent?.avatar || '🎓';
  const studentGoal = currentStudent?.targetClass || currentStudent?.classEnrolled || 'Class 10';
  const studentSubjects = currentStudent?.selectedSubjects?.join(', ') || 'Maths, Science';

  return (
    <div className="fixed inset-0 z-[9999] flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/65 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Drawer Panel */}
      <div className="relative w-[85%] max-w-[320px] bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200 text-slate-900 dark:text-white">
        
        {/* Profile Header */}
        <div className="p-4 bg-gradient-to-br from-[#0052CC] via-[#0066FF] to-[#0A2540] text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center text-2xl shadow-md ring-2 ring-white/30">
                {studentAvatar}
              </div>
              <div className="leading-tight">
                <h4 className="text-sm font-black truncate max-w-[170px]">
                  {currentStudent ? currentStudent.name : t.hiLearner}
                </h4>
                <p className="text-[11px] text-blue-100 font-medium mt-0.5">
                  {currentStudent ? (currentStudent.phone || currentStudent.email) : 'L.C.C. Learning App'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Goal Chip in Header */}
          <div className="mt-3.5 pt-3 border-t border-white/15 flex items-center justify-between bg-white/10 p-2.5 rounded-xl">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
              <Target className="w-3.5 h-3.5" />
              <span className="truncate max-w-[150px]">{studentGoal}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenGoalModal();
              }}
              className="px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider hover:bg-amber-300 cursor-pointer shadow-xs"
            >
              {t.changeGoal}
            </button>
          </div>
        </div>

        {/* Scrollable Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-bold">
          
          {/* Section: My Learning */}
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-2 mb-1.5">
              {t.myLearning}
            </span>

            <button
              onClick={() => {
                if (currentStudent) {
                  navigateTo('student-portal');
                } else {
                  setIsStudentAuthModalOpen(true);
                }
                onClose();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/60 text-[#0066FF] flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-slate-900 dark:text-white font-black">{t.myLearning}</span>
                  <span className="text-[10px] text-slate-400 font-medium">Enrolled batches & attendance</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenOfflineVault();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-800 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 flex items-center justify-center">
                  <DownloadCloud className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-slate-900 dark:text-white font-black">{t.offlineVault}</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {offlineCount > 0 ? `${offlineCount} notes ready offline` : t.offlineReady}
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {offlineCount}
              </span>
            </button>
          </div>

          {/* Section: Language Switcher */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-2 mb-1 flex items-center gap-1">
              <Globe className="w-3 h-3" />
              <span>{t.selectLanguage}</span>
            </span>

            <div className="grid grid-cols-2 gap-1.5 px-1">
              {languages.map(lang => {
                const isSelected = language === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setLanguage(lang.id)}
                    className={`py-2 px-2.5 rounded-xl border text-[11px] font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0066FF] bg-[#0066FF] text-white shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span>{lang.icon}</span>
                    <span>{lang.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Doubts & Support */}
          <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-2 mb-1">
              Doubt Support
            </span>

            <a
              href={`https://wa.me/91${contactPhone}?text=${encodeURIComponent(
                `Hello Director Aman Arora Sir, I am student ${currentStudent?.name || ''} from ${studentGoal}. I have a doubt in ${studentSubjects}. Please help.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600 fill-current" />
                <span>1:1 WhatsApp Teacher Doubt</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Section: Staff & Admin Switching */}
          {(isAdminAuthenticated || currentStaff) && (
            <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-2 mb-1">
                Management
              </span>

              {isAdminAuthenticated && (
                <button
                  onClick={() => {
                    navigateTo('admin-panel');
                    onClose();
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 font-black cursor-pointer"
                >
                  <Shield className="w-4 h-4" />
                  <span>{t.adminDesk}</span>
                </button>
              )}

              {currentStaff && (
                <button
                  onClick={() => {
                    navigateTo('staff-portal');
                    onClose();
                  }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-slate-800 font-black cursor-pointer"
                >
                  <Users className="w-4 h-4" />
                  <span>{t.staffPortal} ({currentStaff.name})</span>
                </button>
              )}
            </div>
          )}

        </div>

        {/* Footer with Auth Action */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800">
          {currentStudent ? (
            <button
              onClick={() => {
                logoutStudent();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer hover:bg-red-100"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.logout}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsStudentAuthModalOpen(true);
                onClose();
              }}
              style={{ backgroundColor: '#0066FF', color: '#ffffff' }}
              className="w-full py-2.5 rounded-xl bg-[#0066FF] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>{t.portalLogin}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
