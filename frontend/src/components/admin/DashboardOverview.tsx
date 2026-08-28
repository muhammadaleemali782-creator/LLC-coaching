import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  GraduationCap,
  FileText,
  Video,
  Megaphone,
  MessageSquare,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

import { AdminTab } from './AdminLayout';

interface DashboardOverviewProps {
  onSelectTab?: (tab: AdminTab) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onSelectTab }) => {
  const { courses, studyMaterials, videos, ads, reviews, students, inquiries } = useApp();

  const stats: { label: string; value: number; tab: AdminTab; icon: any; color: string; bg: string; action: string }[] = [
    { label: 'Registered Students', value: students.length, tab: 'users', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50', action: 'Manage Students' },
    { label: 'Live Courses', value: courses.length, tab: 'overview', icon: GraduationCap, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/50', action: 'View Courses' },
    { label: 'Study PDFs & Drive', value: studyMaterials.length, tab: 'pdfs', icon: FileText, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20 hover:border-amber-500/50', action: 'Open Study Vault' },
    { label: 'Video Lectures & Reels', value: videos.length, tab: 'videos', icon: Video, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20 hover:border-rose-500/50', action: 'Manage Videos' },
    { label: 'Active Ad Campaigns', value: ads.filter(a => a.isActive).length, tab: 'ads', icon: Megaphone, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20 hover:border-purple-500/50', action: 'Manage Ads' },
    { label: 'Verified Reviews', value: reviews.filter(r => r.status === 'approved').length, tab: 'reviews', icon: MessageSquare, color: 'text-teal-400', bg: 'bg-teal-500/10 border-teal-500/20 hover:border-teal-500/50', action: 'Moderate Reviews' }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-900/60 via-slate-800 to-indigo-950 border border-blue-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
            Academic Session 2026–27
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Welcome back, Director Aman Arora
          </h2>
          <p className="text-xs text-slate-300">
            Real-time verified data stream. Click any card below to open its dedicated manager desk.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-slate-900/80 px-4 py-2 rounded-2xl border border-slate-700">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold text-slate-200">Database: MongoDB Atlas Connected</span>
        </div>
      </div>

      {/* Interactive KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            onClick={() => onSelectTab && onSelectTab(stat.tab)}
            className={`p-4 sm:p-5 rounded-3xl border ${stat.bg} flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 cursor-pointer group shadow-lg`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] sm:text-xs font-bold text-slate-400 block line-clamp-1">{stat.label}</span>
              <div className={`p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-800 ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>

            <div className="flex items-end justify-between">
              <h3 className="text-2xl sm:text-3xl font-black text-white">{stat.value}</h3>
              <span className="text-[9px] sm:text-[10px] font-bold text-[#0066FF] flex items-center gap-0.5 group-hover:underline">
                <span>{stat.action}</span>
                <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Admissions & Inquiries */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white">Recent Admission Inquiries</h3>
          <span className="text-xs text-[#0066FF] font-bold">Total: {inquiries.length} Inquiries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-3 font-bold">Student Name</th>
                <th className="pb-3 font-bold">Parent</th>
                <th className="pb-3 font-bold">Contact</th>
                <th className="pb-3 font-bold">Target Course</th>
                <th className="pb-3 font-bold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {inquiries.slice(0, 5).map((inq) => (
                <tr key={inq.id} className="hover:bg-slate-900/50">
                  <td className="py-3 font-bold text-white">{inq.studentName}</td>
                  <td className="py-3 text-slate-400">{inq.parentName || 'N/A'}</td>
                  <td className="py-3 font-mono text-emerald-400">{inq.phone}</td>
                  <td className="py-3 text-blue-400 font-bold">{inq.targetCourse}</td>
                  <td className="py-3 text-slate-500">{inq.date}</td>
                </tr>
              ))}
              {inquiries.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500 font-medium">
                    No new inquiries today. Public inquiries from admission desk will appear here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
