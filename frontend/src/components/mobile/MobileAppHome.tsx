import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  BookOpen,
  DownloadCloud,
  FileText,
  Video,
  ArrowRight,
  CheckCircle2,
  Bell,
  MessageSquare,
  Globe,
  Target,
  ChevronRight,
  ShieldCheck,
  Star,
  Users
} from 'lucide-react';
import { getTranslation, AppLanguage } from '../../utils/i18n';
import { saveOfflineDoc, isDocOffline } from '../../utils/offlineStorage';

interface MobileAppHomeProps {
  onOpenDrawer: () => void;
  onOpenGoalModal: () => void;
  onOpenOfflineVault: () => void;
}

export const MobileAppHome: React.FC<MobileAppHomeProps> = ({
  onOpenDrawer,
  onOpenGoalModal,
  onOpenOfflineVault
}) => {
  const {
    currentStudent,
    courses,
    studyMaterials,
    videos,
    instagramPosts,
    notices,
    websiteSettings,
    language,
    setLanguage,
    setSelectedCourseForPayment,
    navigateTo,
    showToast
  } = useApp();

  const t = getTranslation(language);
  const studentGoal = currentStudent?.targetClass || currentStudent?.classEnrolled || 'Class 10';
  const studentSubjects = currentStudent?.selectedSubjects || ['Mathematics', 'Science'];
  const studentAvatar = currentStudent?.avatar || '🎓';
  const contactPhone = (websiteSettings?.contactPhone || '9250703092').replace(/[^0-9]/g, '');

  // 1. Featured Announcement Slides for Top Carousel
  const defaultSlides = [
    {
      id: 's1',
      title: 'Admissions Open 2026-27: Top Rankers Batch',
      subtitle: 'Complete Conceptual Coaching for Classes 1–12, NEET/JEE & DCA',
      tag: 'NEW SESSION',
      img: websiteSettings?.heroPosterUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80'
    },
    {
      id: 's2',
      title: '1:1 Computer Lab & DCA Software Diplomas',
      subtitle: 'Hands-on Coding, Tally Prime, ADCA & Govt Certified Training',
      tag: 'TECH ACADEMY',
      img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80'
    },
    {
      id: 's3',
      title: 'Spoken English & Stage Personality Championship',
      subtitle: 'Build Fearless Communication with Lead Mentor Aman Arora',
      tag: 'ENGLISH MASTERY',
      img: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=1200&auto=format&fit=crop&q=80'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % defaultSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [defaultSlides.length]);

  // 2. Personalized Batches (Matching student's targetClass)
  const matchedCourses = courses.filter(c => {
    const cClass = (c.targetClass || '').toLowerCase();
    const gClass = studentGoal.toLowerCase();
    return cClass.includes(gClass) || gClass.includes(cClass) || c.category === 'secondary' || c.category === 'senior';
  });
  const displayPersonalizedCourses = matchedCourses.length > 0 ? matchedCourses.slice(0, 4) : courses.slice(0, 4);

  // 3. Personalized Study Materials (Matching student's class & subjects)
  const matchedMaterials = studyMaterials.filter(m => {
    const mClass = (m.targetClass || '').toLowerCase();
    const gClass = studentGoal.toLowerCase();
    const matchClass = mClass.includes(gClass) || gClass.includes(mClass);
    const matchSubj = studentSubjects.some(s => (m.subject || '').toLowerCase().includes(s.toLowerCase()));
    return matchClass || matchSubj;
  });
  const displayPersonalizedNotes = matchedMaterials.length > 0 ? matchedMaterials.slice(0, 4) : studyMaterials.slice(0, 4);

  // 4. Handle Offline Download
  const handleSaveOffline = (mat: any) => {
    saveOfflineDoc({
      id: mat.id,
      title: mat.title,
      category: mat.category,
      targetClass: mat.targetClass,
      subject: mat.subject,
      fileUrl: mat.downloadUrl || mat.googleDriveUrl || '',
      fileType: mat.fileType || 'pdf',
      fileSize: `${mat.pages || 12} Pages`,
      contentSnippet: mat.previewContent || `[OFFLINE L.C.C. STUDY NOTES]\n• Chapter: ${mat.chapter || mat.title}\n• Subject: ${mat.subject}\n• Prepared by Director Aman Arora and L.C.C. Academic Council.`
    });
    showToast(`📥 "${mat.title}" saved to your offline vault!`, 'success');
  };

  const languages: { id: AppLanguage; label: string }[] = [
    { id: 'en', label: 'EN' },
    { id: 'hinglish', label: 'Hing' },
    { id: 'hi', label: 'हिंदी' },
    { id: 'mr', label: 'मराठी' }
  ];

  return (
    <div className="w-full bg-slate-100/70 dark:bg-slate-950 pb-28 space-y-3 sm:space-y-4">
      
      {/* 1. TOP APP BAR (Physics Wallah Native Mobile Style) */}
      <div className="bg-gradient-to-r from-[#0052CC] via-[#0066FF] to-[#0A2540] text-white px-3.5 py-2.5 flex items-center justify-between shadow-md sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenDrawer}
            className="w-9 h-9 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center cursor-pointer shadow-md ring-2 ring-white/30 shrink-0"
            title="Open Menu & Profile"
          >
            {studentAvatar}
          </button>
          <div className="leading-tight">
            <div className="text-xs font-black text-white flex items-center gap-1">
              <span>{currentStudent ? `Hi, ${currentStudent.name.split(' ')[0]}!` : t.hiLearner}</span>
              <span>👋</span>
            </div>
            <div className="text-[10px] font-semibold text-blue-100 flex items-center gap-1.5">
              <span>{t.appName}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5">
          {/* Language Switcher Pill */}
          <div className="flex items-center bg-black/20 rounded-full p-0.5 border border-white/20">
            {languages.map(l => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLanguage(l.id)}
                className={`px-1.5 py-0.5 rounded-full text-[9px] font-black transition-all ${
                  language === l.id ? 'bg-amber-400 text-slate-950' : 'text-white/80 hover:text-white'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Offline Vault Button */}
          <button
            type="button"
            onClick={onOpenOfflineVault}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white relative cursor-pointer"
            title="Offline Download Vault"
          >
            <DownloadCloud className="w-4 h-4 text-emerald-300" />
          </button>

          {/* Notifications */}
          <button
            type="button"
            onClick={() => navigateTo('notices', 'notices-section')}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white relative cursor-pointer"
            title="Notice Board"
          >
            <Bell className="w-4 h-4" />
            {notices.filter(n => n.isImportant).length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
            )}
          </button>

          {/* Doubts WhatsApp */}
          <a
            href={`https://wa.me/91${contactPhone}?text=${encodeURIComponent('Hello Director Aman Sir, I need guidance regarding LCC Coaching courses.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1 shadow-xs"
          >
            <MessageSquare className="w-3 h-3 fill-current" />
            <span>{t.doubts}</span>
          </a>
        </div>
      </div>

      {/* 2. ACTIVE GOAL & SUBJECT SWITCHER BANNER */}
      <div className="px-3">
        <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#0066FF] flex items-center justify-center shrink-0">
              <Target className="w-4 h-4" />
            </div>
            <div className="min-w-0 leading-tight">
              <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                {t.activeGoal}
              </span>
              <span className="text-xs font-black text-slate-900 dark:text-white truncate block">
                {studentGoal} • {studentSubjects.slice(0, 2).join(', ')}{studentSubjects.length > 2 ? ` +${studentSubjects.length - 2}` : ''}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenGoalModal}
            className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950 text-[#0066FF] dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-[11px] font-black uppercase tracking-wider hover:bg-[#0066FF] hover:text-white transition-all cursor-pointer shrink-0"
          >
            {t.changeGoal}
          </button>
        </div>
      </div>

      {/* 3. FEATURED TOUCH-SWIPE BANNERS CAROUSEL (Top) */}
      <div className="px-3">
        <div className="relative rounded-3xl overflow-hidden shadow-md aspect-[16/9] sm:aspect-[21/9] bg-slate-900">
          {defaultSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                idx === currentSlide ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              <img
                src={slide.img}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-end text-white">
                <span className="text-[9px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full w-max mb-1 shadow-sm">
                  {slide.tag}
                </span>
                <h3 className="text-sm sm:text-base font-black leading-snug line-clamp-2 drop-shadow">
                  {slide.title}
                </h3>
                <p className="text-[10px] text-slate-200 line-clamp-1 mt-0.5">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          ))}

          {/* Dots Indicator */}
          <div className="absolute bottom-2 right-3 z-10 flex gap-1">
            {defaultSlides.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === currentSlide ? 'bg-amber-400 w-3' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 4. PERSONALIZED CLASS & SUBJECT FEED (Batches for student's class) */}
      <div className="px-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-base">🎯</span>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {t.recommendedForYou}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('batches', 'batches-section')}
            className="text-[11px] font-bold text-[#0066FF] dark:text-blue-400 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>See All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {displayPersonalizedCourses.map(course => (
            <div
              key={course.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2.5 flex flex-col justify-between space-y-2 shadow-xs"
            >
              <div>
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-1.5">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-1 left-1 text-[8px] font-black uppercase tracking-wider bg-black/70 text-amber-300 px-1.5 py-0.5 rounded backdrop-blur-xs">
                    {course.targetClass}
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-2 leading-tight">
                  {course.title}
                </h4>
              </div>

              <div className="pt-1 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-[#0066FF] dark:text-blue-400">
                    ₹{course.discountFee}
                  </span>
                  <span className="text-[10px] text-slate-400 line-through ml-1">
                    ₹{course.fee}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCourseForPayment(course)}
                  style={{ backgroundColor: '#0066FF', color: '#ffffff' }}
                  className="px-2.5 py-1 rounded-xl bg-[#0066FF] text-white text-[10px] font-black uppercase tracking-wider shadow-xs hover:bg-blue-700 cursor-pointer"
                >
                  {t.enrollNow}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. CHAPTER NOTES & OFFLINE VAULT CARDS (Directly for student's subjects) */}
      <div className="px-3 space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-base">📚</span>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {t.freeNotes}
            </h3>
          </div>
          <button
            type="button"
            onClick={onOpenOfflineVault}
            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>{t.offlineVault}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {displayPersonalizedNotes.map(mat => {
            const alreadySaved = isDocOffline(mat.id);
            return (
              <div
                key={mat.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.2 rounded">
                      {mat.targetClass} • {mat.subject}
                    </span>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white truncate mt-0.5">
                      {mat.title}
                    </h4>
                  </div>
                </div>

                <div className="shrink-0">
                  {alreadySaved ? (
                    <button
                      type="button"
                      onClick={onOpenOfflineVault}
                      className="px-2.5 py-1 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold flex items-center gap-1 border border-emerald-300 dark:border-emerald-800 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{t.downloaded}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSaveOffline(mat)}
                      className="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <DownloadCloud className="w-3 h-3" />
                      <span>{t.downloadOffline}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. YOUTUBE VIDEO LECTURES & SHORTS */}
      {videos && videos.length > 0 && (
        <div className="px-3 space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-base">🎥</span>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {t.videoClasses}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('videos', 'videos-section')}
              className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>Watch More</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-2.5 overflow-x-auto scrollbar-none pb-1">
            {videos.slice(0, 5).map((vid: any) => (
              <a
                key={vid.id}
                href={vid.youtubeUrl || (vid.youtubeId ? `https://youtube.com/watch?v=${vid.youtubeId}` : '#')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-48 shrink-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-2 space-y-1.5 shadow-xs block"
              >
                <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950">
                  <img
                    src={vid.thumbnail || `https://img.youtube.com/vi/${vid.videoId || vid.youtubeId}/hqdefault.jpg`}
                    alt={vid.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <span className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-xs shadow-md">
                      ▶
                    </span>
                  </div>
                  <span className="absolute bottom-1 right-1 text-[8px] bg-black/80 text-white px-1 rounded font-mono">
                    {vid.duration || 'LIVE'}
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900 dark:text-white line-clamp-1 leading-tight">
                  {vid.title}
                </h4>
                <p className="text-[10px] text-slate-400">
                  {vid.instructor || 'Aman Arora Sir'}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 7. INSTAGRAM REELS & POSTS */}
      {instagramPosts && instagramPosts.length > 0 && (
        <div className="px-3 space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-base">📸</span>
              <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Instagram Reels & Highlights
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('gallery', 'gallery-section')}
              className="text-[11px] font-bold text-pink-600 hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              <span>View Feed</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {instagramPosts.slice(0, 3).map(post => (
              <a
                key={post.id}
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="aspect-square rounded-2xl overflow-hidden relative group bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs block"
              >
                <img
                  src={post.imageUrl}
                  alt="LCC Instagram"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-1.5 flex items-end justify-between text-white text-[9px] font-black">
                  <span>❤️ {post.likes || 120}</span>
                  <span>💬 {post.comments || 15}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 8. EXPLORE ALL COURSES & BATCHES */}
      <div className="px-3 space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-base">⚡</span>
            <h3 className="text-xs sm:text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {t.exploreAllCourses}
            </h3>
          </div>
        </div>

        <div className="space-y-2">
          {courses.slice(0, 6).map(c => (
            <div
              key={c.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 flex items-center justify-between gap-3 shadow-xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[9px] font-black uppercase text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.2 rounded">
                    {c.targetClass}
                  </span>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white truncate mt-0.5">
                    {c.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mt-0.5">
                    <span className="text-[#0066FF] dark:text-blue-400 font-black">₹{c.discountFee}</span>
                    <span className="line-through text-slate-400 text-[10px]">₹{c.fee}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCourseForPayment(c)}
                style={{ backgroundColor: '#0066FF', color: '#ffffff' }}
                className="px-3 py-1.5 rounded-xl bg-[#0066FF] text-white text-xs font-black uppercase tracking-wider shadow-xs hover:bg-blue-700 cursor-pointer shrink-0"
              >
                {t.enrollNow}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 9. BOTTOM NATIVE NAVIGATION DOCK (Physics Wallah EdTech App Bar) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-3 py-2 flex items-center justify-around shadow-2xl">
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center gap-0.5 text-[#0066FF] dark:text-blue-400 font-black text-[10px] cursor-pointer"
        >
          <span className="text-xl leading-none">🏠</span>
          <span className="mt-0.5">{t.navHome}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (currentStudent) {
              navigateTo('student-portal');
            } else {
              navigateTo('batches');
            }
          }}
          className="flex flex-col items-center gap-0.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-[10px] cursor-pointer"
        >
          <span className="text-xl leading-none">📚</span>
          <span className="mt-0.5">{t.myBatches}</span>
        </button>

        <button
          type="button"
          onClick={onOpenOfflineVault}
          className="flex flex-col items-center gap-0.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-[10px] cursor-pointer relative"
        >
          <span className="text-xl leading-none">📥</span>
          <span className="mt-0.5">{t.offlineVault}</span>
        </button>

        <a
          href={`https://wa.me/${contactPhone}?text=Hello%20Aman%20Sir%2C%20I%20have%20a%20doubt%20regarding%20my%20studies.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] cursor-pointer"
        >
          <span className="text-xl leading-none">💬</span>
          <span className="mt-0.5">{t.askDoubt}</span>
        </a>

        <button
          type="button"
          onClick={onOpenDrawer}
          className="flex flex-col items-center gap-0.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-[10px] cursor-pointer"
        >
          <span className="text-xl leading-none">👤</span>
          <span className="mt-0.5">{studentAvatar}</span>
        </button>
      </div>

    </div>
  );
};
