import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { NoticeTicker } from './components/NoticeTicker';
import { Hero } from './components/Hero';
import { WhatWeDoSection } from './components/WhatWeDoSection';
import { MethodologySection } from './components/MethodologySection';
import { GuaranteeSection } from './components/GuaranteeSection';
import { AboutSection } from './components/AboutSection';
import { CourseSection } from './components/CourseSection';
import { PaidBatchesSection } from './components/PaidBatchesSection';
import { StudyMaterialSection } from './components/StudyMaterialSection';
import { SyllabusSection } from './components/SyllabusSection';
import { YouTubeSection } from './components/YouTubeSection';
import { InstagramSection } from './components/InstagramSection';
import { ReviewsSection } from './components/reviews/ReviewsSection';
import { GallerySection } from './components/GallerySection';
import { AppDownloadSection } from './components/AppDownloadSection';
import { AdmissionSection } from './components/AdmissionSection';
import { ContactSection } from './components/ContactSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { AdBanner } from './components/ads/AdBanner';
import { Bell, Calendar, ArrowLeft } from 'lucide-react';

// Modals & Panels
import { PaymentModal } from './components/modals/PaymentModal';
import { DocPreviewModal } from './components/modals/DocPreviewModal';
import { VideoPlayerModal } from './components/modals/VideoPlayerModal';
import { StudentAuthModal } from './components/modals/StudentAuthModal';
import { AdminAuthModal } from './components/modals/AdminAuthModal';
import { LiveSupportChatModal } from './components/modals/LiveSupportChatModal';
import { StudentDashboard } from './components/student/StudentDashboard';
import { StaffDashboard } from './components/staff/StaffDashboard';
import { AdminPanel } from './components/admin/AdminPanel';
import { LiveVisualEditor, applyVisualOverrides, DEFAULT_SECTION_ORDER } from './components/admin/LiveVisualEditor';
import { ToastContainer } from './components/Toast';
import { ScreenProtectionGuard } from './components/common/ScreenProtectionGuard';

// Physics Wallah EdTech App Additions
import { MobileAppHome } from './components/mobile/MobileAppHome';
import { MobileAppDrawer } from './components/mobile/MobileAppDrawer';
import { StudentGoalModal } from './components/modals/StudentGoalModal';
import { OfflineVaultModal } from './components/common/OfflineVaultModal';
import { saveOfflineDoc } from './utils/offlineStorage';

const MainContent: React.FC = () => {
  const {
    activeView,
    isAdminAuthenticated,
    theme,
    websiteSettings,
    notices,
    navigateTo,
    isInitialSyncLoading,
    currentStudent,
    currentStaff,
    setIsStudentAuthModalOpen,
    isGoalModalOpen,
    setIsGoalModalOpen,
    isDrawerOpen,
    setIsDrawerOpen,
    isOfflineVaultOpen,
    setIsOfflineVaultOpen,
    setIsLiveSupportChatOpen,
    setSelectedCourseForPayment,
    selectedDocForPreview,
    setSelectedDocForPreview,
    courses
  } = useApp();

  const isAuthenticated = Boolean(currentStudent || currentStaff || isAdminAuthenticated);

  // Expose automation helpers
  React.useEffect(() => {
    (window as any).__lcc_navigate = navigateTo;
    (window as any).__lcc_open_support = () => setIsLiveSupportChatOpen(true);
    (window as any).__lcc_open_payment = (course?: any) => {
      setSelectedCourseForPayment(course !== undefined ? course : courses[0]);
    };
    (window as any).__lcc_close_payment = () => setSelectedCourseForPayment(null);
    (window as any).__lcc_close_doc = () => setSelectedDocForPreview(null);
    (window as any).__lcc_save_doc_offline = (doc?: any) => {
      const target = doc || selectedDocForPreview || (window as any).__lcc_current_selected_doc;
      if (target) {
        saveOfflineDoc({
          id: target.id,
          title: target.title,
          category: target.category,
          targetClass: target.targetClass,
          subject: target.subject,
          fileUrl: target.downloadUrl || '#',
          fileType: target.fileType || 'pdf',
          contentSnippet: target.previewContent
        });
      }
    };
  }, [navigateTo, setIsLiveSupportChatOpen, setSelectedCourseForPayment, setSelectedDocForPreview, selectedDocForPreview, courses]);

  // On Mobile App Open (< 1024px): Immediately prompt Login / Register if user is not authenticated
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      const hasStudent = localStorage.getItem('lcc_student_session');
      const hasAdmin = localStorage.getItem('lcc_admin_authenticated') === 'true';
      const hasStaff = localStorage.getItem('lcc_staff_session');

      if (!hasStudent && !hasAdmin && !hasStaff) {
        setIsStudentAuthModalOpen(true);
      }
    }
  }, [setIsStudentAuthModalOpen]);

  // Apply visual overrides when settings load or view changes (no continuous body observation)
  React.useEffect(() => {
    const overrides = websiteSettings?.visualOverrides;
    if (!overrides || Object.keys(overrides).length === 0) return;

    const timer = setTimeout(() => {
      applyVisualOverrides(overrides);
    }, 60);

    return () => clearTimeout(timer);
  }, [websiteSettings?.visualOverrides, activeView]);

  const [isMobileScreen, setIsMobileScreen] = React.useState(() => {
    return typeof window !== 'undefined' ? window.innerWidth < 1024 : false;
  });

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobileScreen(prev => (prev !== mobile ? mobile : prev));
    };
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sectionMap: Record<string, React.ReactNode> = {
    hero: <Hero key="hero" />,
    about: <div key="about" className="content-visibility-auto"><AboutSection /></div>,
    methodology: <div key="methodology" className="content-visibility-auto"><MethodologySection /></div>,
    ad_top: <div key="ad_top" className="content-visibility-auto"><AdBanner placement="hero_top" /></div>,
    courses: <div key="courses" className="content-visibility-auto"><CourseSection /></div>,
    batches: <div key="batches" className="content-visibility-auto"><PaidBatchesSection /></div>,
    guarantee: <div key="guarantee" className="content-visibility-auto"><GuaranteeSection /></div>,
    what_we_do: <div key="what_we_do" className="content-visibility-auto"><WhatWeDoSection /></div>,
    ad_middle: <div key="ad_middle" className="content-visibility-auto"><AdBanner placement="between_sections" /></div>,
    'study-material': <div key="study-material" className="content-visibility-auto"><StudyMaterialSection /></div>,
    syllabus: <div key="syllabus" className="content-visibility-auto"><SyllabusSection /></div>,
    videos: <div key="videos" className="content-visibility-auto"><YouTubeSection /></div>,
    reviews: <div key="reviews" className="content-visibility-auto"><ReviewsSection /></div>,
    instagram: <div key="instagram" className="content-visibility-auto"><InstagramSection /></div>,
    gallery: <div key="gallery" className="content-visibility-auto"><GallerySection /></div>,
    app_download: <div key="app_download" className="content-visibility-auto"><AppDownloadSection /></div>,
    admission: <div key="admission" className="content-visibility-auto"><AdmissionSection /></div>,
    faq: <div key="faq" className="content-visibility-auto"><FaqSection /></div>,
    contact: <div key="contact" className="content-visibility-auto"><ContactSection /></div>
  };

  const currentSectionOrder = (websiteSettings.sectionOrder && websiteSettings.sectionOrder.length > 0)
    ? websiteSettings.sectionOrder
    : DEFAULT_SECTION_ORDER;

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100 dark' : 'bg-white text-slate-900'
    }`}>
      <div>
        <div className="hidden lg:block">
          <Navbar />
        </div>

        <main className={activeView !== 'admin-panel' ? 'pb-0 lg:pb-16' : ''}>
          {activeView === 'home' && (
            <>
              {/* Mobile View: Dedicated Physics Wallah Mobile App Experience */}
              {isMobileScreen ? (
                <div className="w-full max-w-full overflow-x-hidden">
                  {!isAuthenticated ? null : (
                    <MobileAppHome
                      onOpenDrawer={() => setIsDrawerOpen(true)}
                      onOpenGoalModal={() => setIsGoalModalOpen(true)}
                      onOpenOfflineVault={() => setIsOfflineVaultOpen(true)}
                    />
                  )}
                </div>
              ) : (
                /* Desktop View: Grand Educational Institute Web Experience */
                <div className="w-full">
                  {currentSectionOrder.map(secKey => sectionMap[secKey] || null)}
                </div>
              )}
            </>
          )}

          {activeView === 'courses' && (
            <div className="pt-6">
              <CourseSection />
              <AdBanner placement="between_sections" />
              <PaidBatchesSection />
            </div>
          )}

          {activeView === 'study-material' && (
            <div className="pt-6">
              <StudyMaterialSection />
            </div>
          )}

          {activeView === 'syllabus' && (
            <div className="pt-6">
              <SyllabusSection />
            </div>
          )}

          {activeView === 'batches' && (
            <div className="pt-6">
              <PaidBatchesSection />
              <CourseSection />
            </div>
          )}

          {activeView === 'videos' && (
            <div className="pt-6">
              <YouTubeSection />
            </div>
          )}

          {activeView === 'reviews' && (
            <div className="pt-6">
              <ReviewsSection />
            </div>
          )}

          {activeView === 'gallery' && (
            <div className="pt-6">
              <GallerySection />
            </div>
          )}

          {activeView === 'notices' && (
            <div className="pt-6 max-w-5xl mx-auto px-4 py-8">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-[#0066FF] text-white shadow-md">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      Official Notice Board
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium">
                      All notifications, exam schedules and official announcements from L.C.C.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigateTo('home')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Home</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {notices && notices.length > 0 ? (
                  notices.map((notice) => (
                    <div
                      key={notice.id}
                      className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#0066FF] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                          {notice.badgeText || 'OFFICIAL NOTICE'}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{notice.date}</span>
                        </div>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                        {notice.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {notice.description}
                      </p>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span>Issued by: {websiteSettings?.directorName || 'Aman Singh Gautam'} (Director)</span>
                        <span className="font-semibold text-emerald-600">Active</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-16 text-slate-400 text-sm">
                    No notices available at this moment.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeView === 'admission' && (
            <div className="pt-6">
              <AdmissionSection />
            </div>
          )}

          {activeView === 'contact' && (
            <div className="pt-6">
              <ContactSection />
            </div>
          )}

          {activeView === 'student-portal' && (
            <div className="pt-4 pb-16">
              <StudentDashboard />
            </div>
          )}

          {activeView === 'staff-portal' && (
            <div className="pt-4 pb-16">
              <StaffDashboard />
            </div>
          )}

          {activeView === 'admin-panel' && (
            <AdminPanel />
          )}
        </main>
      </div>

      {activeView !== 'admin-panel' && (
        <div className="hidden lg:block">
          <Footer />
        </div>
      )}

      {/* Global Modals */}
      <PaymentModal />
      <DocPreviewModal />
      <VideoPlayerModal />
      <StudentAuthModal />
      <AdminAuthModal />
      <LiveSupportChatModal />
      <ToastContainer />
      <ScreenProtectionGuard />

      {/* Mobile EdTech App Drawer & Modals */}
      <MobileAppDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenGoalModal={() => setIsGoalModalOpen(true)}
        onOpenOfflineVault={() => setIsOfflineVaultOpen(true)}
      />
      <StudentGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
      />
      <OfflineVaultModal
        isOpen={isOfflineVaultOpen}
        onClose={() => setIsOfflineVaultOpen(false)}
      />

      {/* Admin On-Page Live Visual Editor with Time-Machine Undo/Redo & Reshuffle */}
      {isAdminAuthenticated && activeView !== 'admin-panel' && (
        <LiveVisualEditor />
      )}
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
export default App;
