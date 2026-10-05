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
  ChevronLeft,
  ChevronRight,
  Home,
  User,
  Menu,
  Play,
  GraduationCap,
  X,
  Heart,
  Sparkles,
  Search,
  ExternalLink
} from 'lucide-react';
import { getTranslation, AppLanguage } from '../../utils/i18n';
import { saveOfflineDoc, isDocOffline } from '../../utils/offlineStorage';
import { Course, VideoLecture, GalleryItem, InstagramPost } from '../../types';

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
    currentStaff,
    courses,
    studyMaterials,
    videos,
    instagramPosts,
    galleryItems,
    notices,
    websiteSettings,
    language,
    setLanguage,
    setSelectedCourseForPayment,
    setSelectedVideoForPlayer,
    setIsStudentAuthModalOpen,
    setIsLiveSupportChatOpen,
    navigateTo,
    showToast
  } = useApp();

  const t = getTranslation(language);
  const studentGoal = currentStudent?.targetClass || currentStudent?.classEnrolled || 'Class 9-10';
  const studentSubjects = currentStudent?.selectedSubjects || ['Mathematics', 'Science', 'English'];
  const contactPhone = (websiteSettings?.contactPhone || '9250703092').replace(/[^0-9]/g, '');

  // In-app Modal States (Zero redirection outside the app)
  const [isAllBatchesOpen, setIsAllBatchesOpen] = useState(false);
  const [isAllVideosOpen, setIsAllVideosOpen] = useState(false);
  const [isAllGalleryOpen, setIsAllGalleryOpen] = useState(false);
  const [selectedPhotoForModal, setSelectedPhotoForModal] = useState<any | null>(null);
  const [batchCategoryFilter, setBatchCategoryFilter] = useState<string>('all');
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState<string>('all');

  // Featured Announcement Slides (Admin Official Poster + ONLY Admin Uploaded Gallery Photos)
  const allSlides = React.useMemo(() => {
    const list: Array<{ id: string; title: string; subtitle: string; tag: string; img: string }> = [
      {
        id: 's-hero-poster',
        title: websiteSettings?.emergencyAlertText || 'Admissions Open 2026-27 | Classes 1–12 & DCA',
        subtitle: 'Classes 1–12, NEET/JEE & DCA Coaching at L.C.C. Campus',
        tag: 'NEW SESSION',
        img: websiteSettings?.heroPosterUrl || '/assets/hero_poster.jpg'
      }
    ];

    if (galleryItems && galleryItems.length > 0) {
      const seen = new Set(list.map(s => s.img));
      galleryItems.forEach(g => {
        if (!seen.has(g.imageUrl)) {
          seen.add(g.imageUrl);
          list.push({
            id: g.id,
            title: g.title,
            subtitle: g.description || 'L.C.C. Campus & Academic Achievement',
            tag: (g.category || 'CAMPUS').toUpperCase(),
            img: g.imageUrl
          });
        }
      });
    }
    return list;
  }, [websiteSettings?.heroPosterUrl, websiteSettings?.emergencyAlertText, galleryItems]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // NO AUTO TIMER! Strictly static so user can read without unexpected auto-sliding
  const prevSlide = () => {
    setCurrentSlide(prev => (prev === 0 ? allSlides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % allSlides.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    setTouchStartX(null);
  };

  // Personalized Batches - matching survey choices
  const matchedCourses = courses.filter(c => {
    const cClass = (c.targetClass || '').toLowerCase();
    const cTitle = (c.title || '').toLowerCase();
    const cCat = (c.category || '').toLowerCase();
    const gClass = studentGoal.toLowerCase();

    if (cClass.includes(gClass) || gClass.includes(cClass) || cTitle.includes(gClass) || cCat.includes(gClass)) {
      return true;
    }
    if (gClass.includes('1-5') && (c.category === 'primary' || cClass.includes('1-5'))) return true;
    if (gClass.includes('6-8') && (c.category === 'middle' || cClass.includes('6-8'))) return true;
    if ((gClass.includes('9') || gClass.includes('10')) && (c.category === 'secondary' || cClass.includes('9') || cClass.includes('10'))) return true;
    if ((gClass.includes('11') || gClass.includes('12')) && (c.category === 'senior' || cClass.includes('11') || cClass.includes('12'))) return true;
    if ((gClass.includes('dca') || gClass.includes('computer')) && (c.category === 'computer' || cTitle.includes('computer') || cTitle.includes('dca'))) return true;
    if ((gClass.includes('english') || gClass.includes('spoken')) && (cTitle.includes('english') || cTitle.includes('spoken') || cTitle.includes('fluency'))) return true;
    if ((gClass.includes('neet') || gClass.includes('jee')) && (cTitle.includes('neet') || cTitle.includes('jee') || c.category === 'senior')) return true;

    return false;
  });
  const displayPersonalizedCourses = matchedCourses.length > 0 ? matchedCourses.slice(0, 4) : courses.slice(0, 4);

  // Personalized Study Materials matching survey class & subjects
  const matchedMaterials = studyMaterials.filter(m => {
    const mClass = (m.targetClass || '').toLowerCase();
    const mSubj = (m.subject || '').toLowerCase();
    const gClass = studentGoal.toLowerCase();

    const matchClass = mClass.includes(gClass) || gClass.includes(mClass);
    const matchSubj = studentSubjects.some(s => mSubj.includes(s.toLowerCase()) || s.toLowerCase().includes(mSubj));
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
    <div className="w-full bg-gray-50 pb-24 overflow-x-hidden" style={{ backgroundColor: '#f5f7fa' }}>

      {/* ═══════════ TOP APP BAR ═══════════ */}
      <div
        className="sticky top-0 z-30 px-3 py-2.5 flex items-center justify-between shadow-sm"
        style={{ background: 'linear-gradient(135deg, #0052CC 0%, #0066FF 60%, #1a73e8 100%)' }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            id="mobile-drawer-toggle"
            aria-label="Open App Menu"
            onClick={onOpenDrawer}
            className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shrink-0"
            style={{ backgroundColor: '#fbbf24', color: '#1e293b' }}
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white leading-tight truncate">
              {currentStaff
                ? `Faculty: ${currentStaff.name.split(' ')[0]}`
                : currentStudent
                ? `Hi, ${currentStudent.name.split(' ')[0]}`
                : 'L.C.C. Learning'}
            </div>
            <div className="text-[10px] font-medium text-blue-100 leading-tight truncate">
              {currentStaff ? (currentStaff.designation || 'Faculty Desk') : t.appSubtitle}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {/* Language pills */}
          <div className="flex items-center rounded-full overflow-hidden border border-white/30" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
            {languages.map(l => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLanguage(l.id)}
                className="px-1.5 py-0.5 text-[9px] font-bold cursor-pointer transition-all"
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
            className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer relative shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
          >
            <Bell className="w-3.5 h-3.5 text-white" />
            {notices.filter(n => n.isImportant).length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ backgroundColor: '#ef4444' }} />
            )}
          </button>
        </div>
      </div>

      {/* ═══════════ STAFF / FACULTY DESK BANNER ═══════════ */}
      {currentStaff && (
        <div className="px-3 pt-2.5">
          <div
            className="p-3 rounded-2xl flex items-center justify-between gap-2 shadow-sm text-white"
            style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', border: '1px solid #4338ca' }}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#fbbf24' }}
              >
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] font-black uppercase tracking-wider block" style={{ color: '#fbbf24' }}>
                  FACULTY DESK ACTIVE
                </span>
                <h4 className="text-xs font-bold leading-tight truncate">
                  {currentStaff.name} ({currentStaff.designation || 'Teacher'})
                </h4>
                <p className="text-[10px] opacity-80 truncate">
                  {currentStaff.branch}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigateTo('staff-portal')}
              className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider shrink-0 cursor-pointer shadow-sm active:scale-95"
              style={{ backgroundColor: '#fbbf24', color: '#1e293b' }}
            >
              OPEN DESK
            </button>
          </div>
        </div>
      )}

      {/* ═══════════ GOAL STRIP ═══════════ */}
      <div className="px-3 pt-2.5">
        <div
          className="p-2.5 rounded-xl flex items-center justify-between gap-2 shadow-sm"
          style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: '#eff6ff', color: '#0066FF' }}
            >
              <Target className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: '#94a3b8' }}>
                {t.activeGoal}
              </div>
              <div className="text-[11px] font-bold truncate" style={{ color: '#1e293b' }}>
                {studentGoal} • {studentSubjects.slice(0, 2).join(', ')}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenGoalModal}
            className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer shrink-0"
            style={{ backgroundColor: '#eff6ff', color: '#0066FF', border: '1px solid #bfdbfe' }}
          >
            {t.changeGoal}
          </button>
        </div>
      </div>

      {/* ═══════════ CAROUSEL / BANNER SLIDER (MANUAL ONLY, ZERO AUTO-ADVANCE) ═══════════ */}
      <div className="px-3 pt-3">
        <div
          className="relative rounded-2xl overflow-hidden shadow-md select-none touch-pan-y"
          style={{ aspectRatio: '16/9', backgroundColor: '#0f172a' }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {allSlides.map((slide, idx) => (
            <div
              key={slide.id}
              className="absolute inset-0 transition-opacity duration-500"
              style={{ opacity: idx === currentSlide ? 1 : 0, pointerEvents: idx === currentSlide ? 'auto' : 'none' }}
            >
              <img
                src={slide.img}
                alt={slide.title}
                className="w-full h-full object-cover object-center"
                loading="lazy"
                onError={(e: any) => {
                  e.currentTarget.src = '/assets/hero_poster.jpg';
                }}
              />
              <div
                className="absolute inset-0 p-3 sm:p-4 flex flex-col justify-end text-white"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 55%, transparent 100%)' }}
              >
                <span
                  className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full w-max mb-1"
                  style={{ backgroundColor: '#fbbf24', color: '#1e293b' }}
                >
                  {slide.tag}
                </span>
                <h3 className="text-xs sm:text-sm font-bold leading-snug drop-shadow-md pr-12 line-clamp-1">
                  {slide.title}
                </h3>
                <p className="text-[10px] sm:text-[11px] mt-0.5 drop-shadow-sm opacity-90 line-clamp-1">
                  {slide.subtitle}
                </p>
              </div>
            </div>
          ))}

          {/* Previous Slide Chevron Button */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/45 hover:bg-black/70 text-white flex items-center justify-center cursor-pointer transition-transform active:scale-90"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Next Slide Chevron Button */}
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-black/45 hover:bg-black/70 text-white flex items-center justify-center cursor-pointer transition-transform active:scale-90"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Slide Counter & Dots */}
          <div className="absolute bottom-2.5 right-3 z-10 flex items-center gap-2">
            <span
              className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md"
              style={{ backgroundColor: 'rgba(0,0,0,0.65)', color: '#ffffff' }}
            >
              {currentSlide + 1}/{allSlides.length}
            </span>
            <div className="flex gap-1">
              {allSlides.slice(0, 8).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentSlide(i)}
                  className="rounded-full transition-all cursor-pointer"
                  style={{
                    width: i === currentSlide ? 12 : 5,
                    height: 5,
                    backgroundColor: i === currentSlide ? '#fbbf24' : 'rgba(255,255,255,0.6)'
                  }}
                />
              ))}
            </div>
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
            onClick={() => setIsAllBatchesOpen(true)}
            className="text-[11px] font-bold flex items-center gap-0.5 cursor-pointer"
            style={{ color: '#0066FF' }}
          >
            {t.seeAll} <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {displayPersonalizedCourses.length === 0 ? (
          <div className="p-4 rounded-2xl border border-dashed border-blue-200 bg-blue-50/50 text-center">
            <span className="text-[10px] font-black uppercase text-[#0066FF] px-2 py-0.5 rounded bg-blue-100">
              Pending / Coming Soon
            </span>
            <p className="text-xs font-bold text-slate-800 mt-1.5">New Batches Under Finalization</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Admissions for 2026-27 session in progress. Batches will appear shortly.</p>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {displayPersonalizedCourses.map(course => (
              <div
                key={course.id}
                className="shrink-0 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between"
                style={{ width: '220px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
              >
                <div className="relative" style={{ height: '110px' }}>
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <span
                    className="absolute top-2 left-2 text-[9px] font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#0066FF', color: '#ffffff' }}
                  >
                    {course.targetClass}
                  </span>
                  <span
                    className="absolute bottom-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: 'rgba(0,0,0,0.75)', color: '#ffffff' }}
                  >
                    ⭐ {course.rating}
                  </span>
                </div>

                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold line-clamp-2 leading-tight" style={{ color: '#1e293b' }}>
                      {course.title}
                    </h4>
                    <p className="text-[10px] mt-1" style={{ color: '#94a3b8' }}>
                      {course.instructor || 'Aman Arora & Senior Council'}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 flex items-center justify-between" style={{ borderTop: '1px solid #f1f5f9' }}>
                    <div>
                      <span className="text-xs font-bold" style={{ color: '#0066FF' }}>
                        ₹{course.discountFee || course.fee}
                      </span>
                      {course.discountFee && course.discountFee < course.fee && (
                        <span className="text-[10px] line-through ml-1" style={{ color: '#94a3b8' }}>
                          ₹{course.fee}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedCourseForPayment(course)}
                      className="px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                      style={{ backgroundColor: '#0066FF', color: '#ffffff' }}
                    >
                      {t.enrollNow}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══════════ FREE STUDY NOTES & DPPS ═══════════ */}
      <div className="px-3 pt-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold" style={{ color: '#1e293b' }}>
            {t.freeNotesDpp}
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
            OFFLINE READY
          </span>
        </div>

        {displayPersonalizedNotes.length === 0 ? (
          <div className="p-4 rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 text-center">
            <span className="text-[10px] font-black uppercase text-emerald-700 px-2 py-0.5 rounded bg-emerald-100">
              Pending / Uploading Soon
            </span>
            <p className="text-xs font-bold text-slate-800 mt-1.5">Chapter Notes & DPPs in Preparation</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Academic Council is compiling verified PDF modules for your subjects.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {displayPersonalizedNotes.map(mat => {
              const offline = isDocOffline(mat.id);
              return (
                <div
                  key={mat.id}
                  className="p-3 rounded-2xl flex items-center justify-between gap-2 shadow-sm"
                  style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: '#eff6ff', color: '#0066FF' }}
                    >
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold truncate leading-tight" style={{ color: '#1e293b' }}>
                        {mat.title}
                      </h4>
                      <p className="text-[10px] mt-0.5" style={{ color: '#94a3b8' }}>
                        {mat.subject} • {mat.targetClass}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    {offline ? (
                      <span
                        className="px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1"
                        style={{ backgroundColor: '#ecfdf5', color: '#059669' }}
                      >
                        <CheckCircle2 className="w-3 h-3" /> Saved
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSaveOffline(mat)}
                        className="px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                        style={{ backgroundColor: '#f1f5f9', color: '#475569' }}
                      >
                        <DownloadCloud className="w-3 h-3" /> Save
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ═══════════ VIDEO LECTURES (IN-APP PLAYER) ═══════════ */}
      <div className="px-3 pt-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold" style={{ color: '#1e293b' }}>
            {t.videoClasses}
          </h3>
          {videos && videos.length > 0 && (
            <button
              type="button"
              onClick={() => setIsAllVideosOpen(true)}
              className="text-[11px] font-bold flex items-center gap-0.5 cursor-pointer"
              style={{ color: '#dc2626' }}
            >
              Watch More <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {(!videos || videos.length === 0) ? (
          <div className="p-4 rounded-2xl border border-dashed border-rose-200 bg-rose-50/50 text-center">
            <span className="text-[10px] font-black uppercase text-rose-700 px-2 py-0.5 rounded bg-rose-100">
              Pending / Live Recording
            </span>
            <p className="text-xs font-bold text-slate-800 mt-1.5">Next Video Lecture in Production</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Live concept marathons are held regularly at campus. Lectures will be posted here.</p>
          </div>
        ) : (
          <div className="flex gap-2.5 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {videos.slice(0, 5).map((vid: any) => (
              <div
                key={vid.id}
                onClick={() => setSelectedVideoForPlayer(vid)}
                className="shrink-0 rounded-2xl overflow-hidden shadow-sm block cursor-pointer transition-transform active:scale-95"
                style={{ width: '180px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}
              >
                <div className="relative" style={{ aspectRatio: '16/9', backgroundColor: '#1e293b' }}>
                  <img
                    src={vid.thumbnail || (vid.youtubeId ? `https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80')}
                    alt={vid.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e: any) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}>
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shadow-md"
                      style={{ backgroundColor: '#dc2626' }}
                    >
                      <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  <span
                    className="absolute bottom-1 right-1 text-[8px] font-mono px-1 rounded font-bold"
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══════════ CAMPUS LIFE & HIGHLIGHTS (IN-APP MODAL) ═══════════ */}
      {instagramPosts && instagramPosts.length > 0 && (
        <div className="px-3 pt-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold" style={{ color: '#1e293b' }}>
              Campus Life & Topper Highlights
            </h3>
            <button
              type="button"
              onClick={() => setIsAllGalleryOpen(true)}
              className="text-[11px] font-bold flex items-center gap-0.5 cursor-pointer"
              style={{ color: '#db2777' }}
            >
              View Feed <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {instagramPosts.slice(0, 3).map(post => (
              <div
                key={post.id}
                onClick={() => setSelectedPhotoForModal(post)}
                className="block rounded-xl overflow-hidden relative shadow-sm cursor-pointer transition-transform active:scale-95"
                style={{ aspectRatio: '1/1', border: '1px solid #e2e8f0', backgroundColor: '#e2e8f0' }}
              >
                <img
                  src={post.imageUrl}
                  alt={post.title}
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════ ALL COURSES LIST ═══════════ */}
      <div className="px-3 pt-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold" style={{ color: '#1e293b' }}>
            {t.exploreAllCourses}
          </h3>
          <button
            type="button"
            onClick={() => setIsAllBatchesOpen(true)}
            className="text-[11px] font-bold text-[#0066FF] cursor-pointer"
          >
            Filter & View
          </button>
        </div>

        {courses.length === 0 ? (
          <div className="p-4 rounded-2xl border border-dashed border-slate-200 bg-white text-center shadow-xs">
            <span className="text-[10px] font-black uppercase text-[#0066FF] px-2 py-0.5 rounded bg-blue-50">
              Pending / Updating
            </span>
            <p className="text-xs font-bold text-slate-800 mt-1.5">Course Catalog Refreshing</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Classes 1–12 and DCA curriculum are being updated by Director Aman Arora.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {courses.slice(0, 5).map(c => (
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
                      className="text-[9px] font-bold uppercase px-1.5 py-0.2 rounded"
                      style={{ color: '#0066FF', backgroundColor: '#eff6ff' }}
                    >
                      {c.targetClass}
                    </span>
                    <h4 className="text-xs font-bold truncate mt-0.5" style={{ color: '#1e293b' }}>
                      {c.title}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] font-bold" style={{ color: '#0066FF' }}>₹{c.discountFee || c.fee}</span>
                      {c.discountFee && c.discountFee < c.fee && (
                        <span className="text-[10px] line-through" style={{ color: '#94a3b8' }}>₹{c.fee}</span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCourseForPayment(c)}
                  className="px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider cursor-pointer shrink-0"
                  style={{ backgroundColor: '#0066FF', color: '#ffffff' }}
                >
                  {t.enrollNow}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══════════ L.C.C. CAMPUS DESK & OFFICIAL HELPLINE (CLEAN DOCKING FOOTER) ═══════════ */}
      <div className="px-3 pt-6 pb-2">
        <div
          className="p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3"
          style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)' }}
        >
          <div className="flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="L.C.C."
              className="w-10 h-10 rounded-2xl object-contain bg-white shadow-xs border border-blue-100"
            />
            <div className="min-w-0">
              <h4 className="text-xs font-black text-slate-900 leading-tight">
                Learning Coaching Center (L.C.C.)
              </h4>
              <p className="text-[10px] text-slate-500 font-medium">
                Varanasi • Top Academic Coaching & Computer Institute
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/80 border border-slate-100 space-y-1.5 text-[11px] text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">Director:</span>
              <span>{websiteSettings?.directorName || 'Aman Arora (Aman Singh Gautam)'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-slate-900 shrink-0">Campus:</span>
              <span className="line-clamp-2">{websiteSettings?.contactAddress || 'Near City Central, Education Hub, Varanasi (U.P.)'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900">Timing:</span>
              <span>Mon–Sat: 7:00 AM – 8:00 PM | Sun: Doubt Clinic</span>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsLiveSupportChatOpen(true)}
              className="flex-1 py-2.5 rounded-2xl bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-black text-center shadow-sm active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Live Support & Helpdesk</span>
            </button>
            <a
              href={`tel:${contactPhone}`}
              className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs font-bold shadow-xs active:scale-98 transition-all flex items-center justify-center cursor-pointer"
            >
              📞 Call
            </a>
          </div>
        </div>
      </div>

      {/* ═══════════ IN-APP ALL BATCHES MODAL ═══════════ */}
      {isAllBatchesOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-5"
            style={{ backgroundColor: '#ffffff', color: '#1e293b' }}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0066FF] flex items-center justify-center font-bold">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black">All Coaching Batches (2026-27)</h3>
                  <p className="text-[10px] text-slate-500">Tap to enroll or view syllabus</p>
                </div>
              </div>
              <button
                type="button"
                id="close-batches-sheet"
                aria-label="Close Batches Sheet"
                onClick={() => setIsAllBatchesOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className="p-3 border-b border-slate-100 flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {[
                { id: 'all', label: 'All Batches' },
                { id: 'secondary', label: 'Class 9-10' },
                { id: 'senior', label: 'Class 11-12' },
                { id: 'computer', label: 'Computer DCA' },
                { id: 'language', label: 'Spoken English' },
                { id: 'primary', label: 'Primary (1-5)' },
                { id: 'middle', label: 'Middle (6-8)' }
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setBatchCategoryFilter(cat.id)}
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 cursor-pointer transition-all"
                  style={{
                    backgroundColor: batchCategoryFilter === cat.id ? '#0066FF' : '#f1f5f9',
                    color: batchCategoryFilter === cat.id ? '#ffffff' : '#475569'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Courses List */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {courses
                .filter(c => batchCategoryFilter === 'all' || c.category === batchCategoryFilter)
                .map(c => (
                  <div
                    key={c.id}
                    className="p-3 rounded-2xl border border-slate-200 bg-white flex flex-col gap-2.5 shadow-sm"
                  >
                    <div className="flex gap-3 items-start">
                      <img
                        src={c.image}
                        alt={c.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-[#0066FF]">
                          {c.targetClass}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 leading-tight mt-1">
                          {c.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                          {c.instructor}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-xs font-bold text-[#0066FF]">₹{c.discountFee || c.fee}</span>
                        {c.discountFee && c.discountFee < c.fee && (
                          <span className="text-[10px] line-through text-slate-400 ml-1">₹{c.fee}</span>
                        )}
                        <span className="text-[10px] text-slate-400 ml-2">• {c.duration}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsAllBatchesOpen(false);
                          setSelectedCourseForPayment(c);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#0066FF] text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ IN-APP ALL VIDEOS MODAL ═══════════ */}
      {isAllVideosOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-5"
            style={{ backgroundColor: '#ffffff', color: '#1e293b' }}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
                  <Play className="w-4 h-4 fill-red-600 ml-0.5" />
                </div>
                <div>
                  <h3 className="text-sm font-black">Video Lectures & Masterclasses</h3>
                  <p className="text-[10px] text-slate-500">Tap to watch directly inside the app</p>
                </div>
              </div>
              <button
                type="button"
                id="close-videos-sheet"
                aria-label="Close Videos Sheet"
                onClick={() => setIsAllVideosOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video List */}
            <div className="p-4 overflow-y-auto space-y-3 flex-1">
              {(!videos || videos.length === 0) ? (
                <div className="p-8 text-center text-slate-500">
                  <span className="text-[10px] font-black uppercase text-rose-700 px-2 py-0.5 rounded bg-rose-50">
                    Pending / In Production
                  </span>
                  <p className="text-xs font-bold text-slate-700 mt-2">No Video Lectures Published Yet</p>
                  <p className="text-[10px] text-slate-400 mt-1">Live concept classes are ongoing at campus.</p>
                </div>
              ) : (
                videos.map(vid => (
                  <div
                    key={vid.id}
                    onClick={() => {
                      setIsAllVideosOpen(false);
                      setSelectedVideoForPlayer(vid);
                    }}
                    className="p-2.5 rounded-2xl border border-slate-200 bg-white flex gap-3 items-center cursor-pointer shadow-sm active:scale-98 transition-transform"
                  >
                    <div className="relative w-24 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-900">
                      <img
                        src={vid.thumbnail || (vid.youtubeId ? `https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80')}
                        alt={vid.title}
                        className="w-full h-full object-cover"
                        onError={(e: any) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center">
                          <Play className="w-3 h-3 text-white fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded">
                        {vid.targetClass || 'Lecture'}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight mt-1 line-clamp-2">
                        {vid.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {vid.instructor} • {vid.duration || 'Video'}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ IN-APP ALL GALLERY & HIGHLIGHTS MODAL ═══════════ */}
      {isAllGalleryOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[85vh] flex flex-col shadow-2xl animate-in slide-in-from-bottom-5"
            style={{ backgroundColor: '#ffffff', color: '#1e293b' }}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black">Campus Life & Highlights</h3>
                  <p className="text-[10px] text-slate-500">Tap any photo to view full size</p>
                </div>
              </div>
              <button
                type="button"
                id="close-gallery-sheet"
                aria-label="Close Gallery Sheet"
                onClick={() => setIsAllGalleryOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className="p-3 border-b border-slate-100 flex gap-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              {[
                { id: 'all', label: 'All Photos' },
                { id: 'toppers', label: 'Toppers' },
                { id: 'classroom', label: 'Classrooms' },
                { id: 'event', label: 'Events & Labs' },
                { id: 'students', label: 'Debates & Skills' }
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setGalleryCategoryFilter(cat.id)}
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 cursor-pointer transition-all"
                  style={{
                    backgroundColor: galleryCategoryFilter === cat.id ? '#db2777' : '#f1f5f9',
                    color: galleryCategoryFilter === cat.id ? '#ffffff' : '#475569'
                  }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Photo Grid */}
            <div className="p-4 overflow-y-auto grid grid-cols-2 gap-2.5 flex-1">
              {(galleryItems && galleryItems.length > 0 ? galleryItems : [])
                .filter(item => galleryCategoryFilter === 'all' || item.category === galleryCategoryFilter)
                .map(item => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedPhotoForModal(item)}
                    className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm cursor-pointer active:scale-95 transition-transform"
                  >
                    <div style={{ aspectRatio: '4/3' }}>
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-2">
                      <h4 className="text-[11px] font-bold text-slate-900 line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-[9px] text-slate-400 mt-0.5">
                        {item.date || 'LCC Campus'}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ FULL-SCREEN PHOTO LIGHTBOX MODAL ═══════════ */}
      {selectedPhotoForModal && (
        <div
          onClick={() => setSelectedPhotoForModal(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl text-white"
          >
            <button
              type="button"
              id="close-photo-lightbox"
              aria-label="Close Photo Lightbox"
              onClick={() => setSelectedPhotoForModal(null)}
              className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center cursor-pointer shadow-md"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-full" style={{ maxHeight: '60vh', backgroundColor: '#000000' }}>
              <img
                src={selectedPhotoForModal.imageUrl}
                alt={selectedPhotoForModal.title}
                className="w-full h-full object-contain max-h-[60vh] mx-auto"
              />
            </div>

            <div className="p-4 space-y-2 bg-slate-900">
              <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
                {selectedPhotoForModal.title}
              </h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {selectedPhotoForModal.description || 'L.C.C. Learning Coaching Center, Varanasi'}
              </p>
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                <span>{selectedPhotoForModal.date || 'Official L.C.C. Record'}</span>
                {selectedPhotoForModal.likes && (
                  <span className="text-pink-400 font-bold">♥ {selectedPhotoForModal.likes} Likes</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ BOTTOM NAVIGATION DOCK ═══════════ */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-5 items-center shadow-2xl"
        style={{
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          paddingTop: '6px',
          paddingBottom: 'max(6px, env(safe-area-inset-bottom))'
        }}
      >
        {/* Home */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center justify-center gap-0.5 cursor-pointer py-1"
        >
          <Home className="w-5 h-5" style={{ color: '#0066FF' }} />
          <span className="text-[10px] font-bold truncate max-w-full" style={{ color: '#0066FF' }}>{t.navHome}</span>
        </button>

        {/* My Batches */}
        <button
          type="button"
          onClick={() => {
            if (currentStaff) {
              navigateTo('staff-portal');
            } else if (currentStudent) {
              navigateTo('student-portal');
            } else {
              setIsStudentAuthModalOpen(true);
            }
          }}
          className="flex flex-col items-center justify-center gap-0.5 cursor-pointer py-1"
        >
          <BookOpen className="w-5 h-5" style={{ color: '#64748b' }} />
          <span className="text-[10px] font-semibold truncate max-w-full" style={{ color: '#64748b' }}>
            {currentStaff ? 'Desk' : t.myBatches}
          </span>
        </button>

        {/* Offline Vault */}
        <button
          type="button"
          onClick={onOpenOfflineVault}
          className="flex flex-col items-center justify-center gap-0.5 cursor-pointer py-1"
        >
          <DownloadCloud className="w-5 h-5" style={{ color: '#64748b' }} />
          <span className="text-[10px] font-semibold truncate max-w-full" style={{ color: '#64748b' }}>{t.offlineVault}</span>
        </button>

        {/* Ask Doubt (In-App Live Support Chat) */}
        <button
          type="button"
          onClick={() => setIsLiveSupportChatOpen(true)}
          className="flex flex-col items-center justify-center gap-0.5 cursor-pointer py-1"
        >
          <MessageSquare className="w-5 h-5" style={{ color: '#059669' }} />
          <span className="text-[10px] font-semibold truncate max-w-full" style={{ color: '#059669' }}>{t.askDoubt}</span>
        </button>

        {/* Profile */}
        <button
          type="button"
          onClick={onOpenDrawer}
          className="flex flex-col items-center justify-center gap-0.5 cursor-pointer py-1"
        >
          <User className="w-5 h-5" style={{ color: '#64748b' }} />
          <span className="text-[10px] font-semibold truncate max-w-full" style={{ color: '#64748b' }}>Profile</span>
        </button>
      </nav>

    </div>
  );
};
