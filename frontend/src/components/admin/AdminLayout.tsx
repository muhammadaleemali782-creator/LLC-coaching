import React from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  Video,
  Megaphone,
  MessageSquare,
  Share2,
  Settings,
  Smartphone,
  LogOut,
  Shield,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  Image,
  BookOpen,
  Bell,
  HelpCircle,
  ArrowLeft
} from 'lucide-react';
import { Instagram } from '../SocialIcons';
import { useApp } from '../../context/AppContext';

export type AdminTab =
  | 'overview'
  | 'courses'
  | 'pdfs'
  | 'videos'
  | 'instagram'
  | 'gallery'
  | 'syllabus'
  | 'notices'
  | 'inquiries'
  | 'users'
  | 'ads'
  | 'reviews'
  | 'socials'
  | 'settings'
  | 'preview';

interface AdminLayoutProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ activeTab, setActiveTab, children }) => {
  const { logoutAdmin, navigateTo } = useApp();

  const navItems = [
    { id: 'overview', label: 'Overview & Live KPIs', icon: LayoutDashboard, badge: null },
    { id: 'courses', label: 'Academic Courses', icon: GraduationCap, badge: 'Live DB' },
    { id: 'pdfs', label: 'Books & Drive PDFs', icon: FileText, badge: 'Cloud' },
    { id: 'videos', label: 'Video Lectures', icon: Video, badge: null },
    { id: 'instagram', label: 'Instagram Feed & Reels', icon: Instagram, badge: 'Hot' },
    { id: 'gallery', label: 'Campus Photo Gallery', icon: Image, badge: null },
    { id: 'syllabus', label: 'Syllabus & Weightage', icon: BookOpen, badge: null },
    { id: 'notices', label: 'Notice Board & Alerts', icon: Bell, badge: null },
    { id: 'inquiries', label: 'Admission Inquiries', icon: HelpCircle, badge: 'Leads' },
    { id: 'users', label: 'Students Directory', icon: Users, badge: null },
    { id: 'ads', label: 'Ads Campaign Manager', icon: Megaphone, badge: 'Active' },
    { id: 'reviews', label: 'Reviews Moderation', icon: MessageSquare, badge: 'New' },
    { id: 'socials', label: 'Social Media Handles', icon: Share2, badge: null },
    { id: 'settings', label: 'Website Settings', icon: Settings, badge: null },
    { id: 'preview', label: 'Mobile Live QA Preview', icon: Smartphone, badge: null }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-950 border-b border-slate-800 sticky top-0 z-30">
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateTo('home')}
              className="p-1.5 rounded-lg bg-slate-800 text-white flex items-center gap-1 cursor-pointer"
              title="Back to Public Website"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span className="text-[11px] font-bold">Back</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#0066FF] flex items-center justify-center text-white">
                <Shield className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-xs font-black text-white">Director Desk</h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => navigateTo('home')}
              className="px-2 py-1 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Website</span>
            </button>
            <button
              onClick={logoutAdmin}
              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Scrolling Tabs */}
        <div className="flex items-center gap-1.5 px-3 pb-2.5 overflow-x-auto scrollbar-none">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0066FF] text-white shadow-sm font-black'
                    : 'bg-slate-900 text-slate-400 border border-slate-800'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                    isActive ? 'bg-white text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden md:flex w-72 bg-slate-950 border-r border-slate-800/80 flex-col justify-between shrink-0 h-screen sticky top-0">
        <div>
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0066FF] to-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-black text-white">Director Desk</h2>
                <p className="text-[11px] text-slate-400 font-medium">L.C.C. Cloud Admin Hub</p>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0066FF] text-white shadow-lg shadow-blue-600/30'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        isActive
                          ? 'bg-white text-slate-950'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Navigation Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => navigateTo('home')}
            className="w-full px-4 py-2.5 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-xs font-black text-white flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md"
          >
            <ArrowLeft className="w-4 h-4 text-amber-300" />
            <span>Back to Public Website</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="w-full px-4 py-2 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-bold text-red-400 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Director Hub</span>
          </button>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto pb-36 md:pb-16 max-w-7xl mx-auto w-full space-y-4">
        
        {/* Universal Back Navigation Bar */}
        <div className="flex items-center justify-between bg-slate-950/80 border border-slate-800/80 px-4 py-2.5 rounded-2xl">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (activeTab !== 'overview') {
                  setActiveTab('overview');
                } else {
                  navigateTo('home');
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-black text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-amber-400" />
              <span>{activeTab !== 'overview' ? '← Back to Overview KPIs' : '← Back to Public Website'}</span>
            </button>
          </div>

          <button
            onClick={() => navigateTo('home')}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#0066FF] hover:underline"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {children}
      </main>

    </div>
  );
};
