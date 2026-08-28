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
import { ToastContainer } from './components/Toast';

const MainContent: React.FC = () => {
  const { activeView, isAdminAuthenticated } = useApp();

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between text-slate-900">
      <div>
        <Navbar />
        <NoticeTicker />

        <main>
          {activeView === 'home' && (
            <>
              <Hero />
              <WhatWeDoSection />
              <MethodologySection />
              <GuaranteeSection />
              <AboutSection />
              <CourseSection />
              <AdBanner placement="between_sections" />
              <PaidBatchesSection />
              <StudyMaterialSection />
              <SyllabusSection />
              <YouTubeSection />
              <ReviewsSection />
              <InstagramSection />
              <GallerySection />
              <AppDownloadSection />
              <AdmissionSection />
              <ContactSection />
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
