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
import { GallerySection } from './components/GallerySection';
import { AppDownloadSection } from './components/AppDownloadSection';
import { AdmissionSection } from './components/AdmissionSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';

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
  const { activeView } = useApp();

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
              <PaidBatchesSection />
              <StudyMaterialSection />
              <SyllabusSection />
              <YouTubeSection />
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

          {activeView === 'gallery' && (
            <div className="pt-6">
              <GallerySection />
            </div>
          )}

          {activeView === 'notices' && (
            <div className="pt-6 max-w-7xl mx-auto px-4 py-16">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Official Notice & Exam Board</h2>
                <p className="text-xs text-slate-500">Live examination schedules, holiday circulars, and announcements.</p>
              </div>
              <AboutSection />
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

          {activeView === 'student-portal' && <StudentDashboard />}

          {activeView === 'admin-panel' && <AdminPanel />}
        </main>
      </div>

      <Footer />

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
