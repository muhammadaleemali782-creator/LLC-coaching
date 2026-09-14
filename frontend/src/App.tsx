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

// Modals & Panels
import { PaymentModal } from './components/modals/PaymentModal';
import { DocPreviewModal } from './components/modals/DocPreviewModal';
import { VideoPlayerModal } from './components/modals/VideoPlayerModal';
import { StudentAuthModal } from './components/modals/StudentAuthModal';
import { AdminAuthModal } from './components/modals/AdminAuthModal';
import { StudentDashboard } from './components/student/StudentDashboard';
import { AdminPanel } from './components/admin/AdminPanel';
import { LiveVisualEditor, applyVisualOverrides, DEFAULT_SECTION_ORDER } from './components/admin/LiveVisualEditor';
import { ToastContainer } from './components/Toast';

const MainContent: React.FC = () => {
  const { activeView, isAdminAuthenticated, theme, websiteSettings } = useApp();

  // Apply visual overrides across page reloads and dynamic renders permanently
  React.useEffect(() => {
    const overrides = websiteSettings?.visualOverrides;
    if (!overrides || Object.keys(overrides).length === 0) return;

    applyVisualOverrides(overrides);

    let rafId: number | null = null;
    const debouncedApply = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        applyVisualOverrides(overrides);
      });
    };

    const observer = new MutationObserver(() => {
      debouncedApply();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [websiteSettings?.visualOverrides, activeView]);

  const sectionMap: Record<string, React.ReactNode> = {
    hero: <Hero key="hero" />,
    about: <AboutSection key="about" />,
    methodology: <MethodologySection key="methodology" />,
    ad_top: <AdBanner key="ad_top" placement="hero_top" />,
    courses: <CourseSection key="courses" />,
    batches: <PaidBatchesSection key="batches" />,
    guarantee: <GuaranteeSection key="guarantee" />,
    what_we_do: <WhatWeDoSection key="what_we_do" />,
    ad_middle: <AdBanner key="ad_middle" placement="between_sections" />,
    'study-material': <StudyMaterialSection key="study-material" />,
    syllabus: <SyllabusSection key="syllabus" />,
    videos: <YouTubeSection key="videos" />,
    reviews: <ReviewsSection key="reviews" />,
    instagram: <InstagramSection key="instagram" />,
    gallery: <GallerySection key="gallery" />,
    app_download: <AppDownloadSection key="app_download" />,
    admission: <AdmissionSection key="admission" />,
    faq: <FaqSection key="faq" />,
    contact: <ContactSection key="contact" />
  };

  const currentSectionOrder = (websiteSettings.sectionOrder && websiteSettings.sectionOrder.length > 0)
    ? websiteSettings.sectionOrder
    : DEFAULT_SECTION_ORDER;

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100 dark' : 'bg-white text-slate-900'
    }`}>
      <div>
        <Navbar />

        <main className={activeView !== 'admin-panel' ? 'pb-32 xl:pb-16' : ''}>
          {activeView === 'home' && (
            <>
              {currentSectionOrder.map(secKey => sectionMap[secKey] || null)}
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
            <div className="pt-6">
              <NoticeTicker />
              <div className="max-w-7xl mx-auto px-4 py-12">
                <AdmissionSection />
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

          {activeView === 'admin-panel' && (
            <AdminPanel />
          )}
        </main>
      </div>

      {activeView !== 'admin-panel' && <Footer />}

      {/* Global Modals */}
      <PaymentModal />
      <DocPreviewModal />
      <VideoPlayerModal />
      <StudentAuthModal />
      <AdminAuthModal />
      <ToastContainer />

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
