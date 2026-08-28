import React from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, Phone, Mail, MapPin, Heart, Shield, Sparkles, ArrowUp } from 'lucide-react';
import { Youtube, Instagram } from './SocialIcons';

export const Footer: React.FC = () => {
  const { navigateTo, setIsAdminAuthModalOpen, isAdminAuthenticated, socialLinks } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const yt = socialLinks.find(s => s.platform === 'youtube')?.url || 'https://youtube.com';
  const ig = socialLinks.find(s => s.platform === 'instagram')?.url || 'https://instagram.com';

  return (
    <footer className="bg-white border-t border-slate-200/90 pt-16 pb-32 sm:pb-16 px-4 sm:px-6 lg:px-8 text-slate-600 relative">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Main Footer Row */}
        <div className="flex flex-col items-center text-center space-y-6">
          
          {/* Brand Badge */}
          <div
            onClick={scrollToTop}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#0066FF] text-white font-black text-base flex items-center justify-center shadow-md">
              LCC
            </div>
            <div className="flex items-center tracking-tight font-black text-2xl">
              <span className="text-[#0066FF]">learn</span>
              <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center text-xs font-black -ml-0.5 shadow-xs">
                er
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed font-medium">
            <strong>Lakshya Career Classes (L.C.C.)</strong> — Premier coaching institute for Academic Excellence (Classes 1–12), Computer Certification (DCA/ADCA/Tally), and Fluent Spoken English under the mentorship of <strong>Aman Arora</strong>.
          </p>

          {/* Quick Links Navigation */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs font-extrabold text-slate-700">
            <button onClick={() => navigateTo('home')} className="hover:text-[#0066FF] transition-colors cursor-pointer">
              Home
            </button>
            <button onClick={() => navigateTo('courses', 'courses-section')} className="hover:text-[#0066FF] transition-colors cursor-pointer">
              Courses
            </button>
            <button onClick={() => navigateTo('study-material', 'study-material-section')} className="hover:text-[#0066FF] transition-colors cursor-pointer">
              Study Vault
            </button>
            <button onClick={() => navigateTo('batches', 'batches-section')} className="hover:text-[#0066FF] transition-colors cursor-pointer">
              Batches
            </button>
            <button onClick={() => navigateTo('reviews', 'reviews-section')} className="hover:text-[#0066FF] transition-colors cursor-pointer">
              Student Reviews
            </button>
            <button onClick={() => navigateTo('notices')} className="hover:text-[#0066FF] transition-colors cursor-pointer">
              Notices
            </button>
            <button onClick={() => navigateTo('contact', 'contact-section')} className="hover:text-[#0066FF] transition-colors cursor-pointer">
              Contacts
            </button>
            <button onClick={() => navigateTo('student-portal')} className="hover:text-[#0066FF] transition-colors text-[#0066FF] cursor-pointer">
              Student Portal
            </button>
          </div>

          {/* Social Icons & Back to Top */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <a
              href={yt}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-slate-50 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 flex items-center justify-center transition-colors"
              title="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>

            <a
              href={ig}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-slate-50 hover:bg-pink-50 hover:text-pink-600 border border-slate-200 flex items-center justify-center transition-colors"
              title="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>

            <button
              onClick={scrollToTop}
              className="w-10 h-10 rounded-full bg-blue-50 text-[#0066FF] hover:bg-[#0066FF] hover:text-white border border-blue-200 flex items-center justify-center transition-colors shadow-xs cursor-pointer"
              title="Back to Top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-8 border-t border-slate-100 text-center space-y-2">
          <p className="text-xs text-slate-500 font-medium leading-relaxed">
            © 2016 – 2026 <strong>Lakshya Career Classes (L.C.C.)</strong>. Directed by <strong>Aman Arora</strong>.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400 font-medium">
            <span>ISO 9001:2015 Certified Coaching Center</span>
            <span>•</span>
            <button
              onClick={() => {
                if (isAdminAuthenticated) navigateTo('admin-panel');
                else setIsAdminAuthModalOpen(true);
              }}
              className="hover:text-[#0066FF] transition-colors font-bold flex items-center gap-1 cursor-pointer"
            >
              <Shield className="w-3 h-3" />
              <span>Director & Admin Desk</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
