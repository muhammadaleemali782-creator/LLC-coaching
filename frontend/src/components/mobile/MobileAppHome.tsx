import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  DownloadCloud,
  FileText,
  ArrowRight,
  CheckCircle2,
  Bell,
  MessageSquare,
  Target,
  ChevronRight,
  Home,
  User,
  Menu,
  Play
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
    setIsStudentAuthModalOpen,
    navigateTo,
    showToast
  } = useApp();

  const t = getTranslation(language);
  const studentGoal = currentStudent?.targetClass || currentStudent?.classEnrolled || 'Class 10';
  const studentSubjects = currentStudent?.selectedSubjects || ['Mathematics', 'Science'];
  const studentAvatar = currentStudent?.avatar || '🎓';
  const contactPhone = (websiteSettings?.contactPhone || '9250703092').replace(/[^0-9]/g, '');

  // Featured Announcement Slides
  const defaultSlides = [
    {
      id: 's1',
      title: 'Admissions Open 2026-27',
      subtitle: 'Classes 1–12, NEET/JEE & DCA Coaching',
      tag: 'NEW SESSION',
      img: websiteSettings?.heroPosterUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 's2',
      title: 'Computer Lab & DCA Diplomas',
      subtitle: 'Tally Prime, ADCA & Govt Certified',
      tag: 'TECH ACADEMY',
      img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=60'
    },
    {
      id: 's3',
      title: 'Spoken English Championship',
      subtitle: 'Build Confidence with Mentor Aman Arora',
      tag: 'ENGLISH MASTERY',
      img: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=60'
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % defaultSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [defaultSlides.length]);

  // Personalized Batches
  const matchedCourses = courses.filter(c => {
    const cClass = (c.targetClass || '').toLowerCase();
    const gClass = studentGoal.toLowerCase();
    return cClass.includes(gClass) || gClass.includes(cClass) || c.category === 'secondary' || c.category === 'senior';
  });
  const displayPersonalizedCourses = matchedCourses.length > 0 ? matchedCourses.slice(0, 4) : courses.slice(0, 4);

  // Personalized Study Materials
  const matchedMaterials = studyMaterials.filter(m => {
    const mClass = (m.targetClass || '').toLowerCase();
    const gClass = studentGoal.toLowerCase();
    const matchClass = mClass.includes(gClass) || gClass.includes(mClass);
    const matchSubj = studentSubjects.some(s => (m.subject || '').toLowerCase().includes(s.toLowerCase()));
    return matchClass || matchSubj;
  });
  const displayPersonalizedNotes = matchedMaterials.length > 0 ? matchedMaterials.slice(0, 4) : studyMaterials.slice(0, 4);

  // Offline Download Handler
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
    showToast(`"${mat.title}" saved offline!`, 'success');
  };

  const languages: { id: AppLanguage; label: string }[] = [
    { id: 'en', label: 'EN' },
    { id: 'hinglish', label: 'HI' },
    { id: 'hi', label: 'हि' },
    { id: 'mr', label: 'मर' }
  ];

  return (
    <div className="w-full bg-gray-50 pb-20 overflow-x-hidden" style={{ backgroundColor: '#f5f7fa' }}>

      {/* ═══════════ TOP APP BAR ═══════════ */}
      <div
        className="sticky top-0 z-30 px-4 py-3 flex items-center justify-between shadow-sm"
        style={{ background: 'linear-gradient(135deg, #0052CC 0%, #0066FF 60%, #1a73e8 100%)' }}
      >
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onOpenDrawer}
            className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer shrink-0"
            style={{ backgroundColor: '#fbbf24', color: '#1e293b' }}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <div className="text-sm font-bold text-white leading-tight">
              {currentStudent ? `Hi, ${currentStudent.name.split(' ')[0]}` : 'L.C.C. Learning'}
            </div>
            <div className="text-[11px] font-medium text-blue-100 leading-tight">
              {t.appSubtitle}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language pills */}
          <div className="flex items-center rounded-full overflow-hidden border border-white/30" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
            {languages.map(l => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLanguage(l.id)}
                className="px-2 py-1 text-[10px] font-bold cursor-pointer transition-all"
                style={{
                  backgroundColor: language === l.id ? '#fbbf24' : 'transparent',
                  color: language === l.id ? '#1e293b' : 'rgba(255,255,255,0.8)'
                }}
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Notification bell */}
          <button
            type="button"
            onClick={() => navigateTo('notices', 'notices-section')}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer relative"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            <Bell className="w-4 h-4 text-white" />
            {notices.filter(n => n.isImportant).length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ backgroundColor: '#ef4444' }} />
            )}
          </button>
        </div>
      </div>

      {/* ═══════════ GOAL STRIP ═══════════ */}
      <div className="px-3 pt-3">
        <div
          className="p-3 rounded-2xl flex items-center justify-between gap-2 shadow-sm"
          style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#eff6ff', color: '#0066FF' }}
            >
              <Target className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>
                {t.activeGoal}
              </div>
              <div className="text-xs font-bold truncate" style={{ color: '#1e293b' }}>
                {studentGoal} • {studentSubjects.slice(0, 2).join(', ')}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenGoalModal}
            className="px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider cursor-pointer shrink-0"
            style={{ backgroundColor: '#eff6ff', color: '#0066FF', border: '1px solid #bfdbfe' }}
          >
            {t.changeGoal}
          </button>
        </div>
      </div>

      {/* ═══════════ CAROUSEL ═══════════ */}
      <div className="px-3 pt-3">
        <div className="relative rounded-2xl overflow-hidden shadow-md" style={{ aspectRatio: '16/8' }}>
          {defaultSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className="absolute inset-0 transition-opacity duration-700"
              style={{ opacity: idx === currentSlide ? 1 : 0, pointerEvents: idx === currentSlide ? 'auto' : 'none' }}
            >
              <img
                src={slide.img}
                alt={slide.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div
                className="absolute inset-0 p-4 flex flex-col justify-end text-white"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)' }}
              >
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full w-max mb-1"
                  style={{ backgroundColor: '#fbbf24', color: '#1e293b' }}
                >
                  {slide.tag}
                </span>
                <h3 className="text-sm font-bold leading-snug" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                  {slide.title}
                </h3>
                <p className="text-[11px] mt-0.5" style={{ color: '#d1d5db' }}>
                  {slide.subtitle}
                </p>
              </div>
            </div>
          ))}
          {/* Dots */}
          <div className="absolute bottom-2.5 right-3 z-10 flex gap-1.5">
            {defaultSlides.map((_, i) => (
              <span
                key={i}
                className="rounded-full transition-all"
                style={{
                  width: i === currentSlide ? 14 : 6,
                  height: 6,
                  backgroundColor: i === currentSlide ? '#fbbf24' : 'rgba(255,255,255,0.5)'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════ RECOMMENDED BATCHES ═══════════ */}
      <div className="px-3 pt-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold" style={{ color: '#1e293b' }}>
            {t.recommendedForYou}
          </h3>
          <button
            type="button"
            onClick={() => navigateTo('batches', 'batches-section')}
            className="text-[11px] font-bold flex items-center gap-0.5 cursor-pointer"
            style={{ color: '#0066FF' }}
          >
            See All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {displayPersonalizedCourses.map(course => (
            <div
              key={course.id}
              className="shrink-0 rounded-2xl overflow-hidden shadow-sm flex flex-col"
              style={{ width: '160px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
            >
              <div className="relative" style={{ aspectRatio: '16/10' }}>
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <span
                  className="absolute top-1.5 left-1.5 text-[8px] font-bold uppercase px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: 'rgba(0,0,0,0.7)', color: '#fbbf24' }}
                >
                  {course.targetClass}
                </span>
              </div>
              <div className="p-2 flex flex-col gap-1.5 flex-1">
                <h4 className="text-[11px] font-bold leading-tight line-clamp-2" style={{ color: '#1e293b' }}>
                  {course.title}
                </h4>
                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold" style={{ color: '#0066FF' }}>₹{course.discountFee}</span>
                    <span className="text-[10px] line-through ml-1" style={{ color: '#94a3b8' }}>₹{course.fee}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCourseForPayment(course)}
                  className="w-full py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                  style={{ backgroundColor: '#0066FF', color: '#ffffff' }}
                >
                  {t.enrollNow}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════ CHAPTER NOTES WITH OFFLINE ═══════════ */}
      <div className="px-3 pt-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold" style={{ color: '#1e293b' }}>
            {t.freeNotes}
          </h3>
          <button
            type="button"
            onClick={onOpenOfflineVault}
            className="text-[11px] font-bold flex items-center gap-0.5 cursor-pointer"
            style={{ color: '#059669' }}
          >
            {t.offlineVault} <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {displayPersonalizedNotes.map(mat => {
            const alreadySaved = isDocOffline(mat.id);
            return (
              <div
                key={mat.id}
                className="rounded-2xl p-3 flex items-center justify-between gap-3 shadow-sm"
                style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: '#ecfdf5', color: '#059669' }}
                  >
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span
                      className="text-[9px] font-bold uppercase px-1.5 rounded"
                      style={{ color: '#059669', backgroundColor: '#ecfdf5' }}
                    >
                      {mat.targetClass} • {mat.subject}
                    </span>
                    <h4 className="text-xs font-bold truncate mt-0.5" style={{ color: '#1e293b' }}>
                      {mat.title}
                    </h4>
                  </div>
                </div>

                <div className="shrink-0">
                  {alreadySaved ? (
                    <button
                      type="button"
                      onClick={onOpenOfflineVault}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      style={{ backgroundColor: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' }}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {t.downloaded}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSaveOffline(mat)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                      style={{ backgroundColor: '#059669', color: '#ffffff' }}
                    >
                      <DownloadCloud className="w-3 h-3" />
                      Save
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══════════ VIDEO LECTURES ═══════════ */}
      {videos && videos.length > 0 && (
        <div className="px-3 pt-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold" style={{ color: '#1e293b' }}>
              {t.videoClasses}
            </h3>
            <button
              type="button"
              onClick={() => navigateTo('videos', 'videos-section')}
              className="text-[11px] font-bold flex items-center gap-0.5 cursor-pointer"
              style={{ color: '#dc2626' }}
            >
              Watch More <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {videos.slice(0, 5).map((vid: any) => (
              <a
                key={vid.id}
                href={vid.youtubeUrl || (vid.youtubeId ? `https://youtube.com/watch?v=${vid.youtubeId}` : '#')}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 rounded-2xl overflow-hidden shadow-sm block"
                style={{ width: '180px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
              >
                <div className="relative" style={{ aspectRatio: '16/9', backgroundColor: '#1e293b' }}>
                  <img
                    src={vid.thumbnail || `https://img.youtube.com/vi/${vid.videoId || vid.youtubeId}/hqdefault.jpg`}
                    alt={vid.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#dc2626' }}
                    >
                      <Play className="w-4 h-4 text-white fill-white" />
                    </div>
                  </div>
                  <span
                    className="absolute bottom-1 right-1 text-[8px] font-mono px-1 rounded"
                    style={{ backgroundColor: 'rgba(0,0,0,0.8)', color: '#ffffff' }}
                  >
                    {vid.duration || 'LIVE'}
                  </span>
                </div>
                <div className="p-2">
                  <h4 className="text-[11px] font-bold line-clamp-1 leading-tight" style={{ color: '#1e293b' }}>
                    {vid.title}
                  </h4>
                  <p className="text-[10px] mt-0.5" style={{ color: '#94a3b8' }}>
                    {vid.instructor || 'Aman Arora Sir'}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════ INSTAGRAM REELS ═══════════ */}
      {instagramPosts && instagramPosts.length > 0 && (
        <div className="px-3 pt-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold" style={{ color: '#1e293b' }}>
              Instagram Highlights
            </h3>
            <button
              type="button"
              onClick={() => navigateTo('gallery', 'gallery-section')}
              className="text-[11px] font-bold flex items-center gap-0.5 cursor-pointer"
              style={{ color: '#db2777' }}
            >
              View Feed <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {instagramPosts.slice(0, 3).map(post => (
              <a
                key={post.id}
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl overflow-hidden relative shadow-sm"
                style={{ aspectRatio: '1/1', border: '1px solid #e2e8f0' }}
              >
                <img
                  src={post.imageUrl}
                  alt="LCC Instagram"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div
                  className="absolute inset-0 p-1.5 flex items-end justify-between text-white text-[9px] font-bold"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)' }}
                >
                  <span>♥ {post.likes || 120}</span>
                  <span>💬 {post.comments || 15}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════ ALL COURSES LIST ═══════════ */}
      <div className="px-3 pt-4 space-y-2.5">
        <h3 className="text-sm font-bold" style={{ color: '#1e293b' }}>
          {t.exploreAllCourses}
        </h3>

        <div className="space-y-2">
          {courses.slice(0, 6).map(c => (
            <div
              key={c.id}
              className="rounded-2xl p-3 flex items-center justify-between gap-3 shadow-sm"
              style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-12 h-12 rounded-xl object-cover shrink-0"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <span
                    className="text-[9px] font-bold uppercase px-1.5 rounded"
                    style={{ color: '#0066FF', backgroundColor: '#eff6ff' }}
                  >
                    {c.targetClass}
                  </span>
                  <h4 className="text-xs font-bold truncate mt-0.5" style={{ color: '#1e293b' }}>
                    {c.title}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[11px] font-bold" style={{ color: '#0066FF' }}>₹{c.discountFee}</span>
                    <span className="text-[10px] line-through" style={{ color: '#94a3b8' }}>₹{c.fee}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCourseForPayment(c)}
                className="px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider cursor-pointer shrink-0"
                style={{ backgroundColor: '#0066FF', color: '#ffffff' }}
              >
                {t.enrollNow}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════ BOTTOM NAVIGATION DOCK ═══════════ */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 shadow-2xl"
        style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          paddingTop: '8px',
          paddingBottom: 'max(8px, env(safe-area-inset-bottom))'
        }}
      >
        {/* Home */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center gap-0.5 cursor-pointer"
          style={{ minWidth: '52px' }}
        >
          <Home className="w-5 h-5" style={{ color: '#0066FF' }} />
          <span className="text-[10px] font-bold" style={{ color: '#0066FF' }}>{t.navHome}</span>
        </button>

        {/* My Batches */}
        <button
          type="button"
          onClick={() => {
            if (currentStudent) {
              navigateTo('student-portal');
            } else {
              setIsStudentAuthModalOpen(true);
            }
          }}
          className="flex flex-col items-center gap-0.5 cursor-pointer"
          style={{ minWidth: '52px' }}
        >
          <BookOpen className="w-5 h-5" style={{ color: '#64748b' }} />
          <span className="text-[10px] font-semibold" style={{ color: '#64748b' }}>{t.myBatches}</span>
        </button>

        {/* Offline Vault */}
        <button
          type="button"
          onClick={onOpenOfflineVault}
          className="flex flex-col items-center gap-0.5 cursor-pointer"
          style={{ minWidth: '52px' }}
        >
          <DownloadCloud className="w-5 h-5" style={{ color: '#64748b' }} />
          <span className="text-[10px] font-semibold" style={{ color: '#64748b' }}>{t.offlineVault}</span>
        </button>

        {/* Ask Doubt (WhatsApp) */}
        <a
          href={`https://wa.me/91${contactPhone}?text=Hello%20Aman%20Sir%2C%20I%20have%20a%20doubt.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-0.5 cursor-pointer"
          style={{ minWidth: '52px' }}
        >
          <MessageSquare className="w-5 h-5" style={{ color: '#059669' }} />
          <span className="text-[10px] font-semibold" style={{ color: '#059669' }}>{t.askDoubt}</span>
        </a>

        {/* Profile */}
        <button
          type="button"
          onClick={onOpenDrawer}
          className="flex flex-col items-center gap-0.5 cursor-pointer"
          style={{ minWidth: '52px' }}
        >
          <User className="w-5 h-5" style={{ color: '#64748b' }} />
          <span className="text-[10px] font-semibold" style={{ color: '#64748b' }}>Profile</span>
        </button>
      </div>

    </div>
  );
};
