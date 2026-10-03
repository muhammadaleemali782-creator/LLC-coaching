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
  ChevronRight,
  GraduationCap
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

  const languages: { id: AppLanguage; label: string; short: string }[] = [
    { id: 'en', label: 'English', short: 'EN' },
    { id: 'hinglish', label: 'Hinglish', short: 'HI' },
    { id: 'hi', label: 'हिंदी', short: 'हि' },
    { id: 'mr', label: 'मराठी', short: 'मर' }
  ];

  const studentAvatar = currentStudent?.avatar || '';
  const studentGoal = currentStudent?.targetClass || currentStudent?.classEnrolled || 'Class 10';
  const studentSubjects = currentStudent?.selectedSubjects?.join(', ') || 'Maths, Science';

  return (
    <div className="fixed inset-0 z-[9999] flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      />

      {/* Drawer Panel */}
      <div
        className="relative h-full shadow-2xl flex flex-col z-10"
        style={{ width: '85%', maxWidth: '320px', backgroundColor: '#ffffff', color: '#1e293b' }}
      >

        {/* Profile Header */}
        <div
          className="p-4 text-white"
          style={{ background: 'linear-gradient(135deg, #0052CC 0%, #0066FF 60%, #1a73e8 100%)' }}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold shadow-md"
                style={{ backgroundColor: currentStaff ? '#6366f1' : '#fbbf24', color: currentStaff ? '#ffffff' : '#1e293b' }}
              >
                {currentStaff ? (
                  <GraduationCap className="w-6 h-6 text-white" />
                ) : currentStudent ? (
                  currentStudent.name.charAt(0).toUpperCase()
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>
              <div>
                <h4 className="text-sm font-bold truncate" style={{ maxWidth: '170px' }}>
                  {currentStaff ? currentStaff.name : currentStudent ? currentStudent.name : t.hiLearner}
                </h4>
                <p className="text-[11px] font-medium mt-0.5 truncate" style={{ color: '#bfdbfe', maxWidth: '170px' }}>
                  {currentStaff
                    ? `${currentStaff.designation || 'Faculty'} • ${currentStaff.branch?.split(' ')[0] || 'Main'}`
                    : currentStudent
                    ? (currentStudent.phone || currentStudent.email)
                    : 'L.C.C. Learning App'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl cursor-pointer"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Goal Chip */}
          <div
            className="mt-3 p-2.5 rounded-xl flex items-center justify-between"
            style={{ backgroundColor: 'rgba(255,255,255,0.12)', borderTop: '1px solid rgba(255,255,255,0.15)' }}
          >
            <div className="flex items-center gap-1.5 text-xs font-bold" style={{ color: '#fbbf24' }}>
              <Target className="w-3.5 h-3.5" />
              <span className="truncate" style={{ maxWidth: '150px' }}>{studentGoal}</span>
            </div>
            <button
              type="button"
              onClick={() => { onClose(); onOpenGoalModal(); }}
              className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer shadow-sm"
              style={{ backgroundColor: '#fbbf24', color: '#1e293b' }}
            >
              {t.changeGoal}
            </button>
          </div>
        </div>

        {/* Scrollable Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-bold">

          {/* Section: My Learning */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider block px-2 mb-1.5" style={{ color: '#94a3b8' }}>
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
              className="w-full flex items-center justify-between p-2.5 rounded-xl transition-colors text-left cursor-pointer"
              style={{ backgroundColor: 'transparent' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#eff6ff', color: '#0066FF' }}
                >
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold" style={{ color: '#1e293b' }}>{t.myLearning}</span>
                  <span className="text-[10px] font-medium" style={{ color: '#94a3b8' }}>Enrolled batches & attendance</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4" style={{ color: '#94a3b8' }} />
            </button>

            <button
              onClick={() => { onClose(); onOpenOfflineVault(); }}
              className="w-full flex items-center justify-between p-2.5 rounded-xl transition-colors text-left cursor-pointer"
              style={{ backgroundColor: 'transparent' }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: '#ecfdf5', color: '#059669' }}
                >
                  <DownloadCloud className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-bold" style={{ color: '#1e293b' }}>{t.offlineVault}</span>
                  <span className="text-[10px] font-semibold" style={{ color: '#059669' }}>
                    {offlineCount > 0 ? `${offlineCount} notes ready offline` : t.offlineReady}
                  </span>
                </div>
              </div>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#ecfdf5', color: '#065f46' }}
              >
                {offlineCount}
              </span>
            </button>
          </div>

          {/* Section: Language Switcher */}
          <div className="space-y-1.5 pt-2" style={{ borderTop: '1px solid #f1f5f9' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider block px-2 mb-1 flex items-center gap-1" style={{ color: '#94a3b8' }}>
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
                    className="py-2 px-2.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                    style={{
                      backgroundColor: isSelected ? '#0066FF' : '#f8fafc',
                      color: isSelected ? '#ffffff' : '#475569',
                      border: isSelected ? '1px solid #0066FF' : '1px solid #e2e8f0'
                    }}
                  >
                    <span>{lang.short}</span>
                    <span>{lang.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Doubts & Support */}
          <div className="space-y-1 pt-2" style={{ borderTop: '1px solid #f1f5f9' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider block px-2 mb-1" style={{ color: '#94a3b8' }}>
              Doubt Support
            </span>

            <a
              href={`https://wa.me/91${contactPhone}?text=${encodeURIComponent(
                `Hello Director Aman Arora Sir, I am student ${currentStudent?.name || ''} from ${studentGoal}. I have a doubt in ${studentSubjects}. Please help.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between p-2.5 rounded-xl transition-colors"
              style={{ backgroundColor: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' }}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" style={{ color: '#059669' }} />
                <span>1:1 WhatsApp Teacher Doubt</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Section: Staff & Admin Switching */}
          {(isAdminAuthenticated || currentStaff) && (
            <div className="space-y-1 pt-2" style={{ borderTop: '1px solid #f1f5f9' }}>
              <span className="text-[10px] font-bold uppercase tracking-wider block px-2 mb-1" style={{ color: '#94a3b8' }}>
                Management
              </span>

              {isAdminAuthenticated && (
                <button
                  onClick={() => { navigateTo('admin-panel'); onClose(); }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl font-bold cursor-pointer"
                  style={{ color: '#059669' }}
                >
                  <Shield className="w-4 h-4" />
                  <span>{t.adminDesk}</span>
                </button>
              )}

              {currentStaff && (
                <button
                  onClick={() => { navigateTo('staff-portal'); onClose(); }}
                  className="w-full flex items-center gap-2.5 p-2 rounded-xl font-bold cursor-pointer"
                  style={{ color: '#4f46e5' }}
                >
                  <Users className="w-4 h-4" />
                  <span>{t.staffPortal} ({currentStaff.name})</span>
                </button>
              )}
            </div>
          )}

        </div>

        {/* Footer with Auth Action */}
        <div className="p-3" style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          {currentStudent ? (
            <button
              onClick={() => { logoutStudent(); onClose(); }}
              className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t.logout}</span>
            </button>
          ) : currentStaff ? (
            <button
              onClick={() => { logoutStaff(); onClose(); }}
              className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              style={{ backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout Staff Desk</span>
            </button>
          ) : (
            <button
              onClick={() => { setIsStudentAuthModalOpen(true); onClose(); }}
              className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              style={{ backgroundColor: '#0066FF', color: '#ffffff' }}
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
