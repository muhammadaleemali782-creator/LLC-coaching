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
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export type AdminTab =
  | 'overview'
  | 'users'
  | 'pdfs'
  | 'videos'
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
    { id: 'overview', label: 'Overview & KPIs', icon: LayoutDashboard, badge: null },
    { id: 'ads', label: 'Advertisements Manager', icon: Megaphone, badge: 'Active' },
    { id: 'users', label: 'Students & Users', icon: Users, badge: null },
    { id: 'pdfs', label: 'Books & Study PDFs', icon: FileText, badge: null },
    { id: 'videos', label: 'YouTube Lectures', icon: Video, badge: null },
    { id: 'reviews', label: 'Review Moderation', icon: MessageSquare, badge: 'New' },
    { id: 'socials', label: 'Social Media Links', icon: Share2, badge: null },
    { id: 'settings', label: 'Website Settings', icon: Settings, badge: null },
    { id: 'preview', label: 'Mobile Live Preview', icon: Smartphone, badge: 'Live QA' }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-72 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between shrink-0">
        <div className="p-5 space-y-6">
          
          {/* Brand Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0066FF] to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/25">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-black tracking-tight text-white">L.C.C. Director Portal</h2>
                <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  AUTHENTICATED
                </span>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group cursor-pointer ${
                    isActive
                      ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/25 font-black'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-amber-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800/80 space-y-2">
          <button
            onClick={() => navigateTo('home')}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={logoutAdmin}
            className="w-full py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-xs font-bold text-red-400 border border-red-500/30 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Page Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-900 overflow-y-auto">
        <header className="px-6 py-4 border-b border-slate-800 bg-slate-950/60 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Management Control</span>
            <h1 className="text-lg font-black text-white capitalize">{activeTab} Manager</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-500/30 transition-colors cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Test Live Mobile View</span>
            </button>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </div>
      </main>

    </div>
  );
};
