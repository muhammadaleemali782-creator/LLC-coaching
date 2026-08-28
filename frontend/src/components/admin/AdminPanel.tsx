import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout, AdminTab } from './AdminLayout';
import { DashboardOverview } from './DashboardOverview';
import { CourseManager } from './CourseManager';
import { BooksPdfManager } from './BooksPdfManager';
import { YouTubeManager } from './YouTubeManager';
import { InstagramManager } from './InstagramManager';
import { GalleryManager } from './GalleryManager';
import { SyllabusManager } from './SyllabusManager';
import { NoticeManager } from './NoticeManager';
import { InquiriesManager } from './InquiriesManager';
import { UsersManagement } from './UsersManagement';
import { AdsManager } from './AdsManager';
import { ReviewsManager } from './ReviewsManager';
import { SocialMediaManager } from './SocialMediaManager';
import { WebsiteSettings } from './WebsiteSettings';
import { MobilePreview } from './MobilePreview';

export const AdminPanel: React.FC = () => {
  const { isAdminAuthenticated } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'overview' && <DashboardOverview onSelectTab={setActiveTab} />}
      {activeTab === 'courses' && <CourseManager />}
      {activeTab === 'pdfs' && <BooksPdfManager />}
      {activeTab === 'videos' && <YouTubeManager />}
      {activeTab === 'instagram' && <InstagramManager />}
      {activeTab === 'gallery' && <GalleryManager />}
      {activeTab === 'syllabus' && <SyllabusManager />}
      {activeTab === 'notices' && <NoticeManager />}
      {activeTab === 'inquiries' && <InquiriesManager />}
      {activeTab === 'users' && <UsersManagement />}
      {activeTab === 'ads' && <AdsManager />}
      {activeTab === 'reviews' && <ReviewsManager />}
      {activeTab === 'socials' && <SocialMediaManager />}
      {activeTab === 'settings' && <WebsiteSettings />}
      {activeTab === 'preview' && <MobilePreview />}
    </AdminLayout>
  );
};
