import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout, AdminTab } from './AdminLayout';
import { DashboardOverview } from './DashboardOverview';
import { AdsManager } from './AdsManager';
import { UsersManagement } from './UsersManagement';
import { BooksPdfManager } from './BooksPdfManager';
import { YouTubeManager } from './YouTubeManager';
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
      {activeTab === 'ads' && <AdsManager />}
      {activeTab === 'users' && <UsersManagement />}
      {activeTab === 'pdfs' && <BooksPdfManager />}
      {activeTab === 'videos' && <YouTubeManager />}
      {activeTab === 'reviews' && <ReviewsManager />}
      {activeTab === 'socials' && <SocialMediaManager />}
      {activeTab === 'settings' && <WebsiteSettings />}
      {activeTab === 'preview' && <MobilePreview />}
    </AdminLayout>
  );
};
