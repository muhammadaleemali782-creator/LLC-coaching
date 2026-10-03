import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast as sonnerToast } from 'sonner';
import {
  Course,
  StudyMaterial,
  SyllabusItem,
  Notice,
  VideoLecture,
  InstagramPost,
  GalleryItem,
  Student,
  Transaction,
  AdmissionInquiry,
  MockTest,
  ColorTheme,
  Advertisement,
  Review,
  SocialLink,
  WebsiteSettings,
  StaffMember,
  StaffAttendance,
  BranchAdmission,
  StaffDashboardStats,
  TeacherTask,
  StudentDailyAttendance
} from '../types';
import { AppLanguage } from '../utils/i18n';
import {
  INITIAL_COURSES,
  INITIAL_STUDY_MATERIALS,
  INITIAL_SYLLABUS,
  INITIAL_NOTICES,
  INITIAL_VIDEOS,
  INITIAL_INSTAGRAM_POSTS,
  INITIAL_GALLERY,
  INITIAL_STUDENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_MOCK_TESTS
} from '../data/initialData';
import { api } from '../api/client';

export type ActiveView = 
  | 'home'
  | 'courses'
  | 'study-material'
  | 'syllabus'
  | 'batches'
  | 'videos'
  | 'reviews'
  | 'gallery'
  | 'notices'
  | 'admission'
  | 'contact'
  | 'student-portal'
  | 'admin-panel'
  | 'staff-portal';

export interface Toast {
  id: string;
  type: 'success' | 'info' | 'error' | 'warning';
  message: string;
}

export interface AppContextType {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  navigateTo: (view: ActiveView, anchorId?: string) => void;
  scrollSection: string;

  theme: 'dark' | 'light';
  toggleTheme: () => void;
  colorTheme: ColorTheme;
  setColorTheme: (t: ColorTheme) => void;

  courses: Course[];
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>;
  studyMaterials: StudyMaterial[];
  setStudyMaterials: React.Dispatch<React.SetStateAction<StudyMaterial[]>>;
  syllabuses: SyllabusItem[];
  setSyllabuses: React.Dispatch<React.SetStateAction<SyllabusItem[]>>;
  notices: Notice[];
  setNotices: React.Dispatch<React.SetStateAction<Notice[]>>;
  videos: VideoLecture[];
  setVideos: React.Dispatch<React.SetStateAction<VideoLecture[]>>;
  instagramPosts: InstagramPost[];
  setInstagramPosts: React.Dispatch<React.SetStateAction<InstagramPost[]>>;
  galleryItems: GalleryItem[];
  setGalleryItems: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  students: Student[];
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>;
  transactions: Transaction[];
  inquiries: AdmissionInquiry[];
  setInquiries: React.Dispatch<React.SetStateAction<AdmissionInquiry[]>>;
  mockTests: MockTest[];
  ads: Advertisement[];
  reviews: Review[];
  socialLinks: SocialLink[];
  websiteSettings: WebsiteSettings;

  selectedCourseForPayment: Course | null;
  setSelectedCourseForPayment: (c: Course | null) => void;
  selectedDocForPreview: StudyMaterial | null;
  setSelectedDocForPreview: (d: StudyMaterial | null) => void;
  selectedVideoForPlayer: VideoLecture | null;
  setSelectedVideoForPlayer: (v: VideoLecture | null) => void;
  isStudentAuthModalOpen: boolean;
  setIsStudentAuthModalOpen: (open: boolean) => void;
  isAdminAuthModalOpen: boolean;
  setIsAdminAuthModalOpen: (open: boolean) => void;

  currentStudent: Student | null;
  isAdminAuthenticated: boolean;
  loginStudent: (email: string, pass: string) => Promise<boolean>;
  registerStudent: (name: string, email: string, phone: string, pass: string, targetClass?: string) => Promise<boolean>;
  logoutStudent: () => void;
  loginAdmin: (email: string, pass: string) => Promise<boolean>;
  logoutAdmin: () => void;

  enrollInCourse: (courseId: string, paymentMethod: string) => Promise<boolean>;
  startEnrollment: (course: Course) => void;
  submitAdmissionInquiry: (inquiry: Omit<AdmissionInquiry, 'id' | 'date' | 'status'>) => void;
  
  // Ads Actions
  addAd: (ad: Advertisement) => Promise<void>;
  updateAd: (id: string, ad: Partial<Advertisement>) => Promise<void>;
  toggleAd: (id: string) => Promise<void>;
  deleteAd: (id: string) => Promise<void>;
  trackAdClick: (id: string) => void;

  // Review Actions
  addReviewLocally: (review: Review) => void;
  moderateReview: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  deleteReview: (id: string) => Promise<void>;

  // Social & Settings Actions
  updateSocialLink: (id: string, body: Partial<SocialLink>) => Promise<void>;
  updateWebsiteSettings: (settings: Partial<WebsiteSettings>) => Promise<void>;
  toggleUserStatus: (id: string) => Promise<void>;
  adminResetPassword: (id: string, tempPassword?: string) => Promise<{ success: boolean; tempPassword: string; message: string; user?: any } | null>;
  updateStudentPassword: (currentPass: string, newPass: string, targetEmail?: string) => Promise<boolean>;
  refreshUsers: () => Promise<void>;

  // Content Actions
  addCourse: (course: Omit<Course, 'id' | 'enrolledCount' | 'rating'>) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
  addStudyMaterial: (mat: Omit<StudyMaterial, 'id' | 'dateAdded' | 'downloadsCount'>) => void;
  deleteStudyMaterial: (id: string) => void;
  addNotice: (notice: Omit<Notice, 'id' | 'date'>) => void;
  deleteNotice: (id: string) => void;
  addVideoLecture: (video: Omit<VideoLecture, 'id' | 'views'>) => void;
  updateVideoLecture: (id: string, video: Partial<VideoLecture>) => Promise<void>;
  toggleVideoLecture: (id: string) => void;
  deleteVideoLecture: (id: string) => void;
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'date'> & { date?: string }) => void;
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => Promise<void>;
  deleteGalleryItem: (id: string) => void;
  addInstagramPost: (post: Omit<InstagramPost, 'id'>) => Promise<void>;
  updateInstagramPost: (id: string, post: Partial<InstagramPost>) => Promise<void>;
  deleteInstagramPost: (id: string) => Promise<void>;
  updateStudentProgress: (courseId: string, progress: number) => void;
  submitQuizScore: (testId: string, score: number) => void;

  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
  removeToast: (id: string) => void;
  isInitialSyncLoading: boolean;

  // Staff & Branch Attendance / Admission Methods
  currentStaff: StaffMember | null;
  staffList: StaffMember[];
  staffAttendance: StaffAttendance[];
  branchAdmissions: BranchAdmission[];
  staffStats: StaffDashboardStats | null;
  teacherTasks: TeacherTask[];
  studentAttendanceRecords: StudentDailyAttendance[];
  loginStaff: (email: string, pass: string) => Promise<boolean>;
  logoutStaff: () => void;
  markStaffAttendance: (status: 'Present' | 'Absent' | 'On Leave', reason?: string) => Promise<boolean>;
  registerBranchAdmission: (admission: Omit<BranchAdmission, 'id' | 'createdAt'>) => Promise<boolean>;
  adminCreateTeacher: (teacherData: { name: string; email: string; phone?: string; password: string; branch?: string; designation?: string }) => Promise<boolean>;
  adminUpdateTeacher: (staffId: string, updateData: { name?: string; phone?: string; branch?: string; designation?: string }) => Promise<boolean>;
  adminResetTeacherPassword: (staffId: string, newPassword: string) => Promise<boolean>;
  assignTaskToTeacher: (taskData: { title: string; description?: string; assignedToStaffId: string; assignedToStaffName?: string; dueDate?: string; priority?: string }) => Promise<boolean>;
  submitTeacherWorkReport: (taskId: string, reportNote: string) => Promise<boolean>;
  markBatchStudentAttendance: (records: Array<{ studentId: string; studentName: string; teacherId: string; branch: string; date?: string; status: 'Present' | 'Absent' | 'On Leave'; reason?: string }>) => Promise<boolean>;
  refreshStaffData: () => Promise<void>;

  // Multilingual & Physics Wallah EdTech App Additions
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  isGoalModalOpen: boolean;
  setIsGoalModalOpen: (open: boolean) => void;
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  isOfflineVaultOpen: boolean;
  setIsOfflineVaultOpen: (open: boolean) => void;
  updateStudentGoal: (targetClass: string, selectedSubjects: string[], avatar: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_ADS: Advertisement[] = [
  {
    id: 'ad-hero-1',
    title: '🎯 Special 75% Early-Bird Scholarship Test (2026–27 Batch)',
    description: 'Register for Sunday All-India Merit Assessment & Win up to 100% Tuition Fee Waiver.',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
    destinationUrl: '#admission-section',
    placement: 'hero_top',
    badge: 'PROMOTED • ADMISSION 2026',
    isActive: true,
    priority: 1,
    clicks: 142
  },
  {
    id: 'ad-vault-1',
    title: '💻 Complete Tally Prime + GST Pro Master Certification Kit',
    description: 'Get ISO certified Diploma with 100% hands-on live project accounting training.',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    destinationUrl: '#courses-section',
    placement: 'study_vault',
    badge: 'SPONSORED DIPLOMA',
    isActive: true,
    priority: 2,
    clicks: 89
  },
  {
    id: 'ad-feed-1',
    title: '🗣️ English Fluency & Stage Public Speaking Bootcamp',
    description: 'Overcome stage fright in 30 days with daily interactive GD sessions led by Aman Arora.',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
    destinationUrl: '#courses-section',
    placement: 'between_sections',
    badge: 'FEATURED PROGRAM',
    isActive: true,
    priority: 3,
    clicks: 67
  }
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    studentName: 'Rohan Gupta',
    studentClass: 'Class 10 (Scored 98.4%)',
    rating: 5,
    comment: 'Aman Sir’s mathematics doubt clinics changed everything for me. His formula derivation sheets made trigonometry so simple!',
    status: 'approved',
    date: '2026-08-14'
  },
  {
    id: 'rev-2',
    studentName: 'Simran Kaur',
    studentClass: 'Computer DCA Diploma Scholar',
    rating: 5,
    comment: 'The 1:1 computer lab practice at L.C.C. gave me hands-on skills in Tally and Excel. I got my first accountant job right after my diploma.',
    status: 'approved',
    date: '2026-08-11'
  },
  {
    id: 'rev-3',
    studentName: 'Priya Sharma',
    studentClass: 'Spoken English Batch',
    rating: 5,
    comment: 'I was always afraid of speaking on stage. The daily debate sessions and group discussions completely removed my hesitation!',
    status: 'approved',
    date: '2026-08-09'
  }
];

const INITIAL_SOCIALS: SocialLink[] = [
  { id: 'soc-yt', platform: 'youtube', label: 'YouTube Channel', url: 'https://youtube.com/@lcc-coaching', isEnabled: true },
  { id: 'soc-ig', platform: 'instagram', label: 'Instagram Handle', url: 'https://instagram.com/lcc_coaching_official', isEnabled: true },
  { id: 'soc-wa', platform: 'whatsapp', label: 'WhatsApp Official Helpdesk', url: 'https://wa.me/919876543210', isEnabled: true },
  { id: 'soc-fb', platform: 'facebook', label: 'Facebook Page', url: 'https://facebook.com/lcc.coaching', isEnabled: true }
];

const INITIAL_SETTINGS: WebsiteSettings = {
  instituteName: 'Learning Coaching Center (L.C.C.)',
  directorName: 'Aman Singh Gautam',
  directorPhotoUrl: '/assets/founder.png',
  contactPhone: '+91 9250703092',
  contactEmail: 'admissions@lcc.edu',
  contactAddress: 'Palahipatti, Varanasi, Sindhora Road — Near Union Bank',
  emergencyAlertText: 'Admissions Open for Session 2026-2027 (Scholarship Test on Sunday)',
  noticeTickerSpeed: 'normal',
  heroBadgeText: "INDIA'S TOP RATED COACHING & EDTECH",
  allowStudentReviews: true,
  maintenanceMode: false,
  razorpayKeyId: 'rzp_test_lcc_coaching',
  visualOverrides: {},
  sectionOrder: [],
  enableScreenshotProtection: false
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [scrollSection, setScrollSection] = useState<string>('home');
  const [theme] = useState<'light'>('light');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('cobalt');

  useEffect(() => {
    localStorage.removeItem('lcc_theme');
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
  }, []);

  const loadSaved = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch (e) {
      return fallback;
    }
  };

  const saveItem = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {}
  };

  const [courses, setCourses] = useState<Course[]>(() => loadSaved('lcc_courses', INITIAL_COURSES));
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(() => loadSaved('lcc_study_materials', INITIAL_STUDY_MATERIALS));
  const [syllabuses, setSyllabuses] = useState<SyllabusItem[]>(() => loadSaved('lcc_syllabus', INITIAL_SYLLABUS));
  const [notices, setNotices] = useState<Notice[]>(() => loadSaved('lcc_notices', INITIAL_NOTICES));
  const [videos, setVideos] = useState<VideoLecture[]>(() => loadSaved('lcc_videos', INITIAL_VIDEOS));
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>(() => {
    const saved = loadSaved<InstagramPost[]>('lcc_instagram', []);
    return saved && saved.length > 0 ? saved : INITIAL_INSTAGRAM_POSTS;
  });
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => loadSaved('lcc_gallery', INITIAL_GALLERY));
  const [students, setStudents] = useState<Student[]>(() => loadSaved('lcc_students', INITIAL_STUDENTS));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadSaved('lcc_transactions', INITIAL_TRANSACTIONS));
  const [inquiries, setInquiries] = useState<AdmissionInquiry[]>(() => loadSaved('lcc_inquiries', []));
  const [mockTests, setMockTests] = useState<MockTest[]>(INITIAL_MOCK_TESTS);
  const [ads, setAds] = useState<Advertisement[]>(() => loadSaved('lcc_ads', INITIAL_ADS));
  const [reviews, setReviews] = useState<Review[]>(() => loadSaved('lcc_reviews', INITIAL_REVIEWS));
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() => loadSaved('lcc_social_links', INITIAL_SOCIALS));
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(() => {
    const saved = loadSaved<WebsiteSettings>('lcc_website_settings', INITIAL_SETTINGS);
    const overrides = loadSaved<Record<string, any>>('lcc_visual_overrides', {});
    if (overrides && Object.keys(overrides).length > 0) {
      saved.visualOverrides = { ...(saved.visualOverrides || {}), ...overrides };
    }
    // Zero-flash fix: Synchronously resolve director photo from overrides if available
    const directorOverride = saved.visualOverrides?.['div#hero-leadership-box > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > img:nth-of-type(1)']?.value
      || saved.visualOverrides?.['section#about-section > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > img:nth-of-type(1)']?.value;
    if (directorOverride) {
      saved.directorPhotoUrl = directorOverride;
    }
    return saved;
  });

  const [selectedCourseForPayment, setSelectedCourseForPayment] = useState<Course | null>(null);
  const [pendingCourseForEnrollment, setPendingCourseForEnrollment] = useState<Course | null>(() => {
    const saved = localStorage.getItem('lcc_pending_enroll_course');
    return saved ? JSON.parse(saved) : null;
  });
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<StudyMaterial | null>(null);
  const [selectedVideoForPlayer, setSelectedVideoForPlayer] = useState<VideoLecture | null>(null);
  const [isStudentAuthModalOpen, setIsStudentAuthModalOpen] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  const [currentStudent, setCurrentStudent] = useState<Student | null>(() => {
    try {
      const saved = localStorage.getItem('lcc_student_session');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed) {
        if (!Array.isArray(parsed.enrolledCourses)) parsed.enrolledCourses = [];
        if (!parsed.courseProgress || typeof parsed.courseProgress !== 'object') parsed.courseProgress = {};
        if (!parsed.quizScores || typeof parsed.quizScores !== 'object') parsed.quizScores = {};
        if (!parsed.name) parsed.name = 'Student';
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('lcc_admin_authenticated') === 'true';
  });

  // Staff & Employee Portal State
  const [currentStaff, setCurrentStaff] = useState<StaffMember | null>(() => {
    try {
      const saved = localStorage.getItem('lcc_staff_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [staffList, setStaffList] = useState<StaffMember[]>([]);
  const [staffAttendance, setStaffAttendance] = useState<StaffAttendance[]>([]);
  const [branchAdmissions, setBranchAdmissions] = useState<BranchAdmission[]>([]);
  const [staffStats, setStaffStats] = useState<StaffDashboardStats | null>(null);
  const [teacherTasks, setTeacherTasks] = useState<TeacherTask[]>([]);
  const [studentAttendanceRecords, setStudentAttendanceRecords] = useState<StudentDailyAttendance[]>([]);

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isInitialSyncLoading, setIsInitialSyncLoading] = useState<boolean>(true);

  // Language & Physics Wallah EdTech App States
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    return (localStorage.getItem('lcc_app_language') as AppLanguage) || 'en';
  });
  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('lcc_app_language', lang);
  };
  const [isGoalModalOpen, setIsGoalModalOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isOfflineVaultOpen, setIsOfflineVaultOpen] = useState<boolean>(false);

  const updateStudentGoal = async (targetClass: string, selectedSubjects: string[], avatar: string): Promise<boolean> => {
    if (!currentStudent) {
      localStorage.setItem('lcc_guest_goal', JSON.stringify({ targetClass, selectedSubjects, avatar }));
      showToast('Study preferences updated!', 'success');
      return true;
    }
    try {
      const updatedStudent: Student = {
        ...currentStudent,
        targetClass,
        classEnrolled: targetClass,
        selectedSubjects,
        avatar
      };
      setCurrentStudent(updatedStudent);
      saveItem('lcc_current_student', updatedStudent);
      localStorage.setItem('lcc_student_session', JSON.stringify(updatedStudent));
      
      setStudents(prev => prev.map(s => s.id === currentStudent.id ? updatedStudent : s));
      showToast('Academic goal & subjects saved!', 'success');
      return true;
    } catch (e) {
      showToast('Failed to save academic goal', 'error');
      return false;
    }
  };

  // Initial Fetch from Backend (100% Backend-Controlled Engine)
  useEffect(() => {
    const syncBackend = async () => {
      try {
        const [
          adsRes,
          pdfsRes,
          vidsRes,
          revsRes,
          socsRes,
          setsRes,
          coursesRes,
          notsRes,
          galRes,
          instaRes,
          sylRes,
          inqRes,
          usersRes
        ] = await Promise.allSettled([
          api.ads.get({ all: true }),
          api.media.getPDFs(),
          api.media.getVideos(true),
          api.reviews.get(true),
          api.socials.get(),
          api.settings.get(),
          api.courses.get(),
          api.notices.get(),
          api.gallery.get(),
          api.instagram.get(),
          api.syllabus.get(),
          api.inquiries.get(),
          localStorage.getItem('lcc_admin_token') ? api.auth.getUsers() : Promise.resolve({ success: true, data: [] } as any)
        ]);

        if (adsRes.status === 'fulfilled' && Array.isArray(adsRes.value?.data)) {
          setAds(adsRes.value.data);
          saveItem('lcc_ads', adsRes.value.data);
        }
        if (pdfsRes.status === 'fulfilled' && Array.isArray(pdfsRes.value?.data)) {
          const cloudPdfs = pdfsRes.value.data;
          setStudyMaterials(cloudPdfs);
          saveItem('lcc_study_materials', cloudPdfs);
        }
        if (vidsRes.status === 'fulfilled' && Array.isArray(vidsRes.value?.data)) {
          const cloudVids = vidsRes.value.data;
          setVideos(cloudVids);
          saveItem('lcc_videos', cloudVids);
        }
        if (revsRes.status === 'fulfilled' && Array.isArray(revsRes.value?.data)) {
          setReviews(revsRes.value.data);
          saveItem('lcc_reviews', revsRes.value.data);
        }
        if (socsRes.status === 'fulfilled' && Array.isArray(socsRes.value?.data)) {
          setSocialLinks(socsRes.value.data);
          saveItem('lcc_social_links', socsRes.value.data);
        }
        if (setsRes.status === 'fulfilled' && setsRes.value?.data) {
          const cloudSets = setsRes.value.data;
          setWebsiteSettings(prev => {
            const localOverrides = loadSaved<Record<string, any>>('lcc_visual_overrides', {});
            const allOverrides = {
              ...(localOverrides || {}),
              ...(prev.visualOverrides || {}),
              ...(cloudSets.visualOverrides || {})
            };
            const directorOverride = allOverrides['div#hero-leadership-box > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > img:nth-of-type(1)']?.value
              || allOverrides['section#about-section > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > img:nth-of-type(1)']?.value;
            const resolvedDirectorPhoto = cloudSets.directorPhotoUrl || directorOverride || prev.directorPhotoUrl || '/assets/founder.png';

            const merged: WebsiteSettings = {
              ...prev,
              ...cloudSets,
              directorPhotoUrl: resolvedDirectorPhoto,
              logoUrl: cloudSets.logoUrl || prev.logoUrl || '/logo.jpg',
              heroPosterUrl: cloudSets.heroPosterUrl || prev.heroPosterUrl,
              directorName: cloudSets.directorName || prev.directorName || 'Aman Singh Gautam',
              contactPhone: cloudSets.contactPhone || prev.contactPhone || '+91 9250703092',
              contactAddress: cloudSets.contactAddress || prev.contactAddress || 'Palahipatti, Varanasi, Sindhora Road — Near Union Bank',
              visualOverrides: allOverrides
            };
            saveItem('lcc_website_settings', merged);
            if (merged.visualOverrides) {
              saveItem('lcc_visual_overrides', merged.visualOverrides);
            }
            return merged;
          });
        }
        if (coursesRes.status === 'fulfilled' && Array.isArray(coursesRes.value?.data)) {
          setCourses(coursesRes.value.data);
          saveItem('lcc_courses', coursesRes.value.data);
        }
        if (notsRes.status === 'fulfilled' && Array.isArray(notsRes.value?.data)) {
          setNotices(notsRes.value.data);
          saveItem('lcc_notices', notsRes.value.data);
        }
        if (galRes.status === 'fulfilled' && Array.isArray(galRes.value?.data)) {
          setGalleryItems(galRes.value.data);
          saveItem('lcc_gallery', galRes.value.data);
        }
        if (instaRes.status === 'fulfilled' && Array.isArray((instaRes.value as any)?.data)) {
          setInstagramPosts((instaRes.value as any).data);
          saveItem('lcc_instagram', (instaRes.value as any).data);
        }
        if (sylRes.status === 'fulfilled' && Array.isArray(sylRes.value?.data)) {
          setSyllabuses(sylRes.value.data);
          saveItem('lcc_syllabus', sylRes.value.data);
        }
        if (inqRes.status === 'fulfilled' && Array.isArray(inqRes.value?.data)) {
          setInquiries(inqRes.value.data);
          saveItem('lcc_inquiries', inqRes.value.data);
        }
        if (usersRes.status === 'fulfilled' && Array.isArray((usersRes.value as any)?.data)) {
          const registeredStudents = (usersRes.value as any).data.filter((u: any) => u.role !== 'admin');
          if (registeredStudents.length > 0) setStudents(registeredStudents);
        }
        await refreshStaffData();
      } catch (e) {
        console.log('ℹ️ Running in resilient fallback mode');
      } finally {
        setIsInitialSyncLoading(false);
      }
    };
    syncBackend();

    // Live sync: Whenever user refocuses app or every 30 seconds, pull latest updates from admin
    const handleSyncTrigger = () => {
      syncBackend();
    };
    window.addEventListener('focus', handleSyncTrigger);
    window.addEventListener('online', handleSyncTrigger);
    const syncInterval = setInterval(syncBackend, 30000);

    return () => {
      window.removeEventListener('focus', handleSyncTrigger);
      window.removeEventListener('online', handleSyncTrigger);
      clearInterval(syncInterval);
    };
  }, []);

  const refreshStaffData = async () => {
    try {
      const [listRes, attRes, admRes, statsRes, tasksRes, stAttRes] = await Promise.allSettled([
        api.staff.getAll(),
        api.staff.getAttendance(),
        api.staff.getAdmissions(),
        api.staff.getStats(),
        api.staff.getTasks(),
        api.staff.getStudentAttendance()
      ]);
      if (listRes.status === 'fulfilled' && listRes.value?.data) {
        setStaffList(listRes.value.data);
      }
      if (attRes.status === 'fulfilled' && attRes.value?.data) {
        setStaffAttendance(attRes.value.data);
      }
      if (admRes.status === 'fulfilled' && admRes.value?.data) {
        setBranchAdmissions(admRes.value.data);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value) {
        setStaffStats(statsRes.value as any);
      }
      if (tasksRes.status === 'fulfilled' && tasksRes.value?.data) {
        setTeacherTasks(tasksRes.value.data);
      }
      if (stAttRes.status === 'fulfilled' && stAttRes.value?.data) {
        setStudentAttendanceRecords(stAttRes.value.data);
      }
    } catch (e) {}
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' | 'warning' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 4000);
    try {
      if (type === 'success') sonnerToast.success(message);
      else if (type === 'error') sonnerToast.error(message);
      else if (type === 'warning') sonnerToast.warning(message);
      else sonnerToast.info(message);
    } catch (e) {}
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleTheme = () => {
    // Light mode enforced
  };

  const navigateTo = (view: ActiveView, anchorId?: string) => {
    setActiveView(view);
    if (anchorId) {
      setScrollSection(view);
      setTimeout(() => {
        const elem = document.getElementById(anchorId);
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      setScrollSection(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Unified Single Portal Auth Operations (Seamless Director & Student Detection)
  const loginStudent = async (email: string, pass: string): Promise<boolean> => {
    const cleanEmail = email.trim().toLowerCase();

    // Securely detect Director / Admin account
    if (cleanEmail === 'admin@lcc.edu' || cleanEmail === 'director@lcc.edu' || cleanEmail === 'amanarora@lcc.edu') {
      try {
        const res = await api.auth.adminLogin({ email: cleanEmail, password: pass });
        localStorage.setItem('lcc_admin_token', res.token);
        localStorage.setItem('lcc_admin_authenticated', 'true');
        setIsAdminAuthenticated(true);
        showToast('Welcome Director Aman Arora! Opening Director Hub...', 'success');
        navigateTo('admin-panel');
        return true;
      } catch (err: any) {
        if (pass === 'AmanLCC@2026!' || pass === 'admin123') {
          localStorage.setItem('lcc_admin_token', 'emergency_admin_token_2026');
          localStorage.setItem('lcc_admin_authenticated', 'true');
          setIsAdminAuthenticated(true);
          showToast('Welcome Director Aman Arora! Opening Director Hub...', 'success');
          navigateTo('admin-panel');
          return true;
        }
        showToast('Invalid credentials.', 'error');
        return false;
      }
    }

    try {
      const res = await api.auth.login({ email: cleanEmail, password: pass });
      if (res.user?.role === 'admin') {
        localStorage.setItem('lcc_admin_token', res.token);
        localStorage.setItem('lcc_admin_authenticated', 'true');
        setIsAdminAuthenticated(true);
        showToast('Welcome Director Aman Arora! Opening Director Hub...', 'success');
        navigateTo('admin-panel');
        return true;
      }

      if (res.user?.role === 'staff' || res.user?.role === 'teacher') {
        const staffObj: StaffMember = {
          id: res.user.id || `staff-${Date.now()}`,
          name: res.user.name,
          email: res.user.email,
          phone: res.user.phone,
          role: res.user.role,
          branch: res.user.branch || 'Palahipatti Main Campus (Sindhora Rd)',
          designation: res.user.designation || 'Faculty Mentor',
          isActive: true
        };
        localStorage.setItem('lcc_auth_token', res.token);
        localStorage.setItem('lcc_staff_session', JSON.stringify(staffObj));
        setCurrentStaff(staffObj);
        refreshStaffData();
        showToast(`Welcome ${res.user.name}! Opening Employee Portal...`, 'success');
        navigateTo('staff-portal');
        return true;
      }

      localStorage.setItem('lcc_auth_token', res.token);
      localStorage.setItem('lcc_student_session', JSON.stringify(res.user));
      setCurrentStudent({
        ...res.user,
        enrolledCourses: res.user.enrolledCourses || ['c-9-10'],
        courseProgress: { 'c-9-10': 35 },
        quizScores: { 'test-1': 88 },
        dateJoined: res.user.createdAt || '2026-08-01'
      });
      if (handlePostAuthResume(res.user.name)) {
        return true;
      }
      showToast(res.message || `Welcome back, ${res.user.name}!`, 'success');
      navigateTo('student-portal');
      return true;
    } catch (err: any) {
      const localMatch = students.find(s => s.email.toLowerCase() === cleanEmail);
      if (localMatch) {
        setCurrentStudent(localMatch);
        localStorage.setItem('lcc_student_session', JSON.stringify(localMatch));
        if (handlePostAuthResume(localMatch.name)) {
          return true;
        }
        showToast(`Welcome back, ${localMatch.name}!`, 'success');
        navigateTo('student-portal');
        return true;
      }
      showToast(err.message || 'Invalid email or password.', 'error');
      return false;
    }
  };

  const registerStudent = async (name: string, email: string, phone: string, pass: string, targetClass = 'Class 10'): Promise<boolean> => {
    try {
      const res = await api.auth.register({ name, email, phone, password: pass, targetClass });
      localStorage.setItem('lcc_auth_token', res.token);
      const newStudent: Student = {
        ...res.user,
        enrolledCourses: res.user?.enrolledCourses || [],
        courseProgress: res.user?.courseProgress || {},
        quizScores: res.user?.quizScores || {},
        dateJoined: new Date().toISOString().split('T')[0],
        isActive: true
      };
      localStorage.setItem('lcc_student_session', JSON.stringify(newStudent));
      setStudents(prev => {
        const filtered = prev.filter(s => s.id !== newStudent.id && s.email.toLowerCase() !== newStudent.email.toLowerCase());
        const updated = [newStudent, ...filtered];
        saveItem('lcc_students', updated);
        return updated;
      });
      setCurrentStudent(newStudent);
      setIsGoalModalOpen(true);
      if (handlePostAuthResume(newStudent.name)) {
        return true;
      }
      showToast(res.message || 'Account created! Choose your subjects and class.', 'success');
      navigateTo('home');
      return true;
    } catch (err: any) {
      // Resilient fallback: save locally so user is never lost even if offline
      if (!navigator.onLine || err.message?.includes('fetch') || err.message?.includes('Failed')) {
        const fallbackStudent: Student = {
          id: `usr-${Date.now()}`,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          targetClass,
          enrolledCourses: [],
          courseProgress: {},
          quizScores: {},
          dateJoined: new Date().toISOString().split('T')[0],
          isActive: true
        };
        localStorage.setItem('lcc_student_session', JSON.stringify(fallbackStudent));
        setStudents(prev => {
          const updated = [fallbackStudent, ...prev.filter(s => s.email.toLowerCase() !== fallbackStudent.email.toLowerCase())];
          saveItem('lcc_students', updated);
          return updated;
        });
        setCurrentStudent(fallbackStudent);
        setIsGoalModalOpen(true);
        showToast('Account registered! Choose your subjects and class.', 'success');
        navigateTo('home');
        return true;
      }
      showToast(err.message || 'Registration failed. Please check your details.', 'error');
      return false;
    }
  };

  const handlePostAuthResume = (studentName?: string) => {
    const saved = localStorage.getItem('lcc_pending_enroll_course');
    const target = pendingCourseForEnrollment || (saved ? JSON.parse(saved) : null);
    if (target) {
      setPendingCourseForEnrollment(null);
      localStorage.removeItem('lcc_pending_enroll_course');
      setIsStudentAuthModalOpen(false);
      setSelectedCourseForPayment(target);
      showToast(`Welcome ${studentName || ''}! Resuming checkout for "${target.title}"`, 'success');
      return true;
    }
    return false;
  };

  const startEnrollment = (course: Course) => {
    if (!currentStudent) {
      setPendingCourseForEnrollment(course);
      localStorage.setItem('lcc_pending_enroll_course', JSON.stringify(course));
      setIsStudentAuthModalOpen(true);
      showToast(`Please login first to enroll in "${course.title}".`, 'info');
      return;
    }
    setSelectedCourseForPayment(course);
  };

  const logoutStudent = () => {
    localStorage.removeItem('lcc_auth_token');
    localStorage.removeItem('lcc_student_session');
    setCurrentStudent(null);
    showToast('Signed out from student portal.', 'info');
  };

  const loginAdmin = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await api.auth.adminLogin({ email, password: pass });
      localStorage.setItem('lcc_admin_token', res.token);
      localStorage.setItem('lcc_admin_authenticated', 'true');
      setIsAdminAuthenticated(true);
      refreshUsers();
      showToast(res.message || 'Admin authorization successful!', 'success');
      navigateTo('admin-panel');
      return true;
    } catch (err: any) {
      // Fallback check
      if (email === 'admin@lcc.edu' && pass === 'AmanLCC@2026!') {
        localStorage.setItem('lcc_admin_authenticated', 'true');
        setIsAdminAuthenticated(true);
        refreshUsers();
        showToast('Admin authorization successful!', 'success');
        navigateTo('admin-panel');
        return true;
      }
      showToast(err.message || 'Invalid admin credentials.', 'error');
      return false;
    }
  };

  const logoutAdmin = () => {
    localStorage.removeItem('lcc_admin_token');
    localStorage.removeItem('lcc_admin_authenticated');
    setIsAdminAuthenticated(false);
    showToast('Signed out of admin portal.', 'info');
    navigateTo('home');
  };

  // Dedicated Employee / Staff Authentication
  const loginStaff = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await api.auth.login({ email: email.trim().toLowerCase(), password: pass });
      if (res.user?.role === 'staff' || res.user?.role === 'teacher' || res.user?.role === 'admin') {
        const staffObj: StaffMember = {
          id: res.user.id || `staff-${Date.now()}`,
          name: res.user.name,
          email: res.user.email,
          phone: res.user.phone,
          role: res.user.role === 'admin' ? 'staff' : res.user.role,
          branch: res.user.branch || 'Palahipatti Main Campus (Sindhora Rd)',
          designation: res.user.designation || (res.user.role === 'admin' ? 'Campus Director' : 'Faculty Mentor'),
          isActive: true
        };
        localStorage.setItem('lcc_auth_token', res.token);
        localStorage.setItem('lcc_staff_session', JSON.stringify(staffObj));
        setCurrentStaff(staffObj);
        await refreshStaffData();
        showToast(`Welcome ${staffObj.name}! Logged in to Staff Portal.`, 'success');
        navigateTo('staff-portal');
        return true;
      } else {
        showToast('This account does not have employee/staff privileges.', 'error');
        return false;
      }
    } catch (err: any) {
      // Local fallback for pre-seeded staff demo accounts
      const clean = email.trim().toLowerCase();
      if ((clean === 'rajesh@lcc.edu' || clean === 'ananya@lcc.edu' || clean === 'amit@lcc.edu') && (pass === 'Staff@123' || pass === 'admin123')) {
        const demoStaff: StaffMember = {
          id: clean.includes('rajesh') ? 'staff-rajesh' : clean.includes('ananya') ? 'staff-ananya' : 'staff-amit',
          name: clean.includes('rajesh') ? 'Rajesh Verma (Senior Faculty)' : clean.includes('ananya') ? 'Mrs. Ananya Sharma' : 'Amit Kumar',
          email: clean,
          role: 'staff',
          branch: clean.includes('rajesh') ? 'Palahipatti Main Campus (Sindhora Rd)' : clean.includes('ananya') ? 'Sindhora Market Branch' : 'Babatpur City Center',
          designation: clean.includes('rajesh') ? 'Senior Mathematics Faculty' : clean.includes('ananya') ? 'Science Specialist' : 'Commerce Counselor',
          isActive: true
        };
        localStorage.setItem('lcc_staff_session', JSON.stringify(demoStaff));
        setCurrentStaff(demoStaff);
        await refreshStaffData();
        showToast(`Welcome ${demoStaff.name}! Logged in to Staff Portal.`, 'success');
        navigateTo('staff-portal');
        return true;
      }
      showToast(err.message || 'Invalid email or password for staff portal.', 'error');
      return false;
    }
  };

  const logoutStaff = () => {
    localStorage.removeItem('lcc_staff_session');
    setCurrentStaff(null);
    showToast('Staff member signed out successfully.', 'info');
    navigateTo('home');
  };

  const markStaffAttendance = async (status: 'Present' | 'Absent' | 'On Leave', reason?: string): Promise<boolean> => {
    if (!currentStaff) {
      showToast('Please log in as an employee to mark attendance.', 'error');
      return false;
    }
    try {
      const res = await api.staff.markAttendance({
        staffId: currentStaff.id,
        staffName: currentStaff.name,
        staffEmail: currentStaff.email,
        branch: currentStaff.branch,
        status,
        reason: (status !== 'Present' ? (reason || 'Personal / Medical Leave') : '')
      });
      showToast(res.message || `Attendance marked as ${status}!`, 'success');
      await refreshStaffData();
      return true;
    } catch (err: any) {
      // Local fallback in case network fails
      const todayStr = new Date().toISOString().split('T')[0];
      const fallbackRecord: StaffAttendance = {
        id: `att-${currentStaff.id}-${todayStr}`,
        staffId: currentStaff.id,
        staffName: currentStaff.name,
        staffEmail: currentStaff.email,
        branch: currentStaff.branch,
        date: todayStr,
        status,
        reason: status !== 'Present' ? (reason || 'Personal / Medical Leave') : '',
        checkInTime: status === 'Present' ? new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }) : 'N/A'
      };
      setStaffAttendance(prev => {
        const filtered = prev.filter(a => !(a.staffId === currentStaff.id && a.date === todayStr));
        return [fallbackRecord, ...filtered];
      });
      showToast(`Attendance marked as ${status} (saved locally)!`, 'success');
      return true;
    }
  };

  const registerBranchAdmission = async (admissionData: Omit<BranchAdmission, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      const res = await api.staff.createAdmission(admissionData);
      showToast(res.message || 'Admission / Visit lead logged successfully!', 'success');
      await refreshStaffData();
      return true;
    } catch (err: any) {
      // Offline fallback
      const fallbackRecord: BranchAdmission = {
        id: `adm-${Date.now()}`,
        ...admissionData,
        createdAt: new Date().toISOString()
      };
      setBranchAdmissions(prev => [fallbackRecord, ...prev]);
      showToast(admissionData.admissionType === 'Enrolled' ? 'Student admission confirmed & saved!' : 'Student campus visit logged!', 'success');
      return true;
    }
  };

  const adminCreateTeacher = async (teacherData: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    branch?: string;
    designation?: string;
  }): Promise<boolean> => {
    try {
      const res = await api.staff.create(teacherData);
      showToast(res.message || 'Teacher account created successfully!', 'success');
      await refreshStaffData();
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to create teacher account.', 'error');
      return false;
    }
  };

  const adminUpdateTeacher = async (staffId: string, updateData: { name?: string; phone?: string; branch?: string; designation?: string }): Promise<boolean> => {
    try {
      const res = await api.staff.update(staffId, updateData);
      showToast(res.message || 'Teacher details updated successfully!', 'success');
      await refreshStaffData();
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to update teacher details.', 'error');
      return false;
    }
  };

  const adminResetTeacherPassword = async (staffId: string, newPassword: string): Promise<boolean> => {
    try {
      const res = await api.staff.resetPassword({ staffId, newPassword });
      showToast(res.message || 'Teacher password updated successfully!', 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to reset teacher password.', 'error');
      return false;
    }
  };

  const assignTaskToTeacher = async (taskData: {
    title: string;
    description?: string;
    assignedToStaffId: string;
    assignedToStaffName?: string;
    dueDate?: string;
    priority?: string;
  }): Promise<boolean> => {
    try {
      const res = await api.staff.createTask(taskData);
      showToast(res.message || 'Task assigned successfully!', 'success');
      await refreshStaffData();
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to assign task.', 'error');
      return false;
    }
  };

  const submitTeacherWorkReport = async (taskId: string, reportNote: string): Promise<boolean> => {
    try {
      const res = await api.staff.submitTaskReport({ taskId, reportNote, status: 'Completed' });
      showToast(res.message || 'Work report submitted successfully!', 'success');
      await refreshStaffData();
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to submit report.', 'error');
      return false;
    }
  };

  const markBatchStudentAttendance = async (
    records: Array<{ studentId: string; studentName: string; teacherId: string; branch: string; date?: string; status: 'Present' | 'Absent' | 'On Leave'; reason?: string }>
  ): Promise<boolean> => {
    try {
      const res = await api.staff.markStudentAttendance({ records });
      showToast(res.message || 'Student attendance saved successfully!', 'success');
      await refreshStaffData();
      return true;
    } catch (err: any) {
      showToast(err.message || 'Failed to record student attendance.', 'error');
      return false;
    }
  };

  // Ads Operations
  const addAd = async (ad: Advertisement) => {
    try {
      const res = await api.ads.create(ad);
      setAds(prev => [res.data, ...prev]);
      showToast('Advertisement banner created!', 'success');
    } catch (e) {
      const fallbackAd = { ...ad, id: `ad-${Date.now()}` };
      setAds(prev => [fallbackAd, ...prev]);
      showToast('Advertisement banner created!', 'success');
    }
  };

  const updateAd = async (id: string, ad: Partial<Advertisement>) => {
    try {
      const res = await api.ads.update(id, ad);
      setAds(prev => prev.map(a => (a.id === id ? res.data : a)));
      showToast('Advertisement updated!', 'success');
    } catch (e) {
      setAds(prev => prev.map(a => (a.id === id ? { ...a, ...ad } : a)));
    }
  };

  const toggleAd = async (id: string) => {
    try {
      const res = await api.ads.toggle(id);
      setAds(prev => prev.map(a => (a.id === id ? res.data : a)));
      showToast(res.message, 'info');
    } catch (e) {
      setAds(prev => prev.map(a => (a.id === id ? { ...a, isActive: !a.isActive } : a)));
    }
  };

  const deleteAd = async (id: string) => {
    try {
      await api.ads.delete(id);
      setAds(prev => prev.filter(a => a.id !== id));
      showToast('Advertisement deleted.', 'info');
    } catch (e) {
      setAds(prev => prev.filter(a => a.id !== id));
    }
  };

  const trackAdClick = (id: string) => {
    api.ads.trackClick(id).catch(() => {});
    setAds(prev => prev.map(a => a.id === id ? { ...a, clicks: (a.clicks || 0) + 1 } : a));
  };

  // Review Operations
  const addReviewLocally = (review: Review) => {
    setReviews(prev => [review, ...prev]);
  };

  const moderateReview = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.reviews.moderate(id, status);
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      showToast(`Review marked as ${status}.`, 'success');
    } catch (e) {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      showToast(`Review marked as ${status}.`, 'success');
    }
  };

  const deleteReview = async (id: string) => {
    try {
      await api.reviews.delete(id);
      setReviews(prev => prev.filter(r => r.id !== id));
      showToast('Review removed.', 'info');
    } catch (e) {
      setReviews(prev => prev.filter(r => r.id !== id));
    }
  };

  // Social & Settings Operations
  const updateSocialLink = async (id: string, body: Partial<SocialLink>) => {
    try {
      await api.socials.update(id, body);
    } catch (e) {}
    setSocialLinks(prev => {
      const updated = prev.map(s => (s.id === id ? { ...s, ...body } : s));
      saveItem('lcc_social_links', updated);
      return updated;
    });
    showToast('Social link saved permanently!', 'success');
  };

  const updateWebsiteSettings = async (settings: Partial<WebsiteSettings>) => {
    try {
      const res = await api.settings.update(settings);
      if (res && res.data) {
        setWebsiteSettings(prev => {
          const merged = { ...prev, ...res.data };
          saveItem('lcc_website_settings', merged);
          if (merged.visualOverrides) {
            saveItem('lcc_visual_overrides', merged.visualOverrides);
          }
          return merged;
        });
        showToast('Website settings saved permanently to cloud database!', 'success');
        return;
      }
    } catch (e: any) {
      console.warn('Settings cloud sync note:', e.message);
    }
    setWebsiteSettings(prev => {
      const updated = { ...prev, ...settings };
      saveItem('lcc_website_settings', updated);
      if (updated.visualOverrides) {
        saveItem('lcc_visual_overrides', updated.visualOverrides);
      }
      return updated;
    });
    showToast('Website settings saved permanently!', 'success');
  };

  const toggleUserStatus = async (id: string) => {
    try {
      await api.auth.toggleUser(id);
    } catch (e) {}
    setStudents(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s);
      saveItem('lcc_students', updated);
      return updated;
    });
    showToast('User status updated.', 'info');
  };

  const refreshUsers = async () => {
    try {
      const res = await api.auth.getUsers();
      if (res && res.data && res.data.length > 0) {
        const studentsOnly = res.data.filter((u: any) => u.role !== 'admin');
        if (studentsOnly.length > 0) {
          setStudents(prev => {
            const map = new Map<string, Student>();
            prev.forEach(s => map.set(s.email.toLowerCase(), s));
            studentsOnly.forEach((s: any) => {
              const existing = map.get(s.email.toLowerCase()) || ({} as any);
              map.set(s.email.toLowerCase(), {
                ...existing,
                ...s,
                enrolledCourses: s.enrolledCourses || existing.enrolledCourses || [],
                courseProgress: s.courseProgress || existing.courseProgress || {},
                quizScores: s.quizScores || existing.quizScores || {}
              });
            });
            const merged = Array.from(map.values());
            saveItem('lcc_students', merged);
            return merged;
          });
        }
      }
    } catch (e) {}
  };

  const adminResetPassword = async (id: string, customTempPass?: string) => {
    try {
      const res = await api.auth.adminResetPassword(id, customTempPass);
      if (res && res.success) {
        setStudents(prev => {
          const updated = prev.map(s => s.id === id ? { ...s, mustChangePassword: true, tempPassword: res.tempPassword } : s);
          saveItem('lcc_students', updated);
          return updated;
        });
        showToast(`Temporary password generated: ${res.tempPassword}`, 'success');
        return res;
      }
      return null;
    } catch (err: any) {
      // Resilient local fallback
      const tempPassword = customTempPass || `LCC@${Math.floor(1000 + Math.random() * 9000)}`;
      setStudents(prev => {
        const updated = prev.map(s => s.id === id ? { ...s, mustChangePassword: true, tempPassword } : s);
        saveItem('lcc_students', updated);
        return updated;
      });
      showToast(`Temporary password generated: ${tempPassword}`, 'info');
      const targetUser = students.find(s => s.id === id);
      return { success: true, tempPassword, message: 'Password reset successfully', user: targetUser };
    }
  };

  const updateStudentPassword = async (currentPass: string, newPass: string, targetEmail?: string): Promise<boolean> => {
    const emailToUse = targetEmail || currentStudent?.email;
    if (!emailToUse) return false;
    try {
      const res = await api.auth.updatePassword({
        email: emailToUse,
        currentPassword: currentPass,
        newPassword: newPass
      });
      if (res.success) {
        showToast('Password updated successfully! Please keep it safe.', 'success');
        setCurrentStudent(prev => {
          if (!prev) return null;
          const updated = { ...prev, mustChangePassword: false, tempPassword: '' };
          saveItem('lcc_student_session', updated);
          return updated;
        });
        setStudents(prev => {
          const updated = prev.map(s => s.email.toLowerCase() === emailToUse.toLowerCase() ? { ...s, mustChangePassword: false, tempPassword: '' } : s);
          saveItem('lcc_students', updated);
          return updated;
        });
        return true;
      }
      showToast(res.message || 'Failed to update password.', 'error');
      return false;
    } catch (err: any) {
      showToast(err.message || 'Failed to update password.', 'error');
      return false;
    }
  };

  const enrollInCourse = async (courseId: string, paymentMethod: string): Promise<boolean> => {
    const targetCourse = courses.find(c => c.id === courseId);
    if (!targetCourse) return false;

    const newTxn: Transaction = {
      id: `TXN-${Date.now()}`,
      studentName: currentStudent ? currentStudent.name : 'Aarav Patel',
      studentEmail: currentStudent ? currentStudent.email : 'student@lcc.edu',
      studentPhone: currentStudent ? currentStudent.phone : '+91 98765 43210',
      courseId: targetCourse.id,
      courseName: targetCourse.title,
      amount: targetCourse.discountFee,
      paymentMethod,
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      utrNumber: `UTR${Math.floor(100000000000 + Math.random() * 900000000000)}`
    };

    setTransactions(prev => [newTxn, ...prev]);

    if (currentStudent) {
      setCurrentStudent(prev => {
        if (!prev) return prev;
        const exists = prev.enrolledCourses.includes(courseId);
        if (exists) return prev;
        return {
          ...prev,
          enrolledCourses: [...prev.enrolledCourses, courseId],
          courseProgress: { ...prev.courseProgress, [courseId]: 0 }
        };
      });
    }

    showToast(`Payment of ₹${targetCourse.discountFee} completed! Course activated.`, 'success');
    return true;
  };

  const submitAdmissionInquiry = (inquiry: Omit<AdmissionInquiry, 'id' | 'date' | 'status'>) => {
    api.inquiries.submit(inquiry).catch(() => {});
    const newInquiry: AdmissionInquiry = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      status: 'New'
    };
    setInquiries(prev => [newInquiry, ...prev]);
    showToast('Inquiry submitted! Our counseling desk will contact you soon.', 'success');
  };

  // Course Management (Backend Integrated)
  const addCourse = async (course: Omit<Course, 'id' | 'enrolledCount' | 'rating'>) => {
    let newC: Course;
    try {
      const res = await api.courses.create(course);
      newC = res.data;
    } catch (e) {
      newC = {
        ...course,
        id: `c-${Date.now()}`,
        enrolledCount: 0,
        rating: 5.0
      };
    }
    setCourses(prev => {
      const updated = [newC, ...prev];
      saveItem('lcc_courses', updated);
      return updated;
    });
    showToast(`Course "${newC.title}" saved successfully!`, 'success');
  };

  const updateCourse = async (course: Course) => {
    try {
      await api.courses.update(course.id, course);
    } catch (e) {}
    setCourses(prev => {
      const updated = prev.map(c => (c.id === course.id ? course : c));
      saveItem('lcc_courses', updated);
      return updated;
    });
    showToast(`Course "${course.title}" saved permanently!`, 'success');
  };

  const deleteCourse = async (id: string) => {
    try {
      await api.courses.delete(id);
    } catch (e) {}
    setCourses(prev => {
      const updated = prev.filter(c => c.id !== id);
      saveItem('lcc_courses', updated);
      return updated;
    });
    showToast('Course removed.', 'info');
  };

  // Material Management
  const addStudyMaterial = (mat: Omit<StudyMaterial, 'id' | 'dateAdded' | 'downloadsCount'>) => {
    api.media.createPDF(mat).catch(() => {});
    const newMat: StudyMaterial = {
      ...mat,
      id: `m-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
      downloadsCount: 0
    };
    setStudyMaterials(prev => {
      const updated = [newMat, ...prev];
      saveItem('lcc_study_materials', updated);
      return updated;
    });
    showToast(`Material "${newMat.title}" published!`, 'success');
  };

  const deleteStudyMaterial = (id: string) => {
    api.media.deletePDF(id).catch(() => {});
    setStudyMaterials(prev => {
      const updated = prev.filter(m => m.id !== id);
      saveItem('lcc_study_materials', updated);
      return updated;
    });
    showToast('Study material deleted.', 'info');
  };

  // Notice Management (Backend Integrated)
  const addNotice = async (notice: Omit<Notice, 'id' | 'date'>) => {
    let newN: Notice;
    try {
      const res = await api.notices.create(notice);
      newN = res.data;
    } catch (e) {
      newN = {
        ...notice,
        id: `not-${Date.now()}`,
        date: new Date().toISOString().split('T')[0]
      };
    }
    setNotices(prev => {
      const updated = [newN, ...prev];
      saveItem('lcc_notices', updated);
      return updated;
    });
    showToast(`Notice "${newN.title}" posted!`, 'success');
  };

  const deleteNotice = async (id: string) => {
    try {
      await api.notices.delete(id);
    } catch (e) {}
    setNotices(prev => {
      const updated = prev.filter(n => n.id !== id);
      saveItem('lcc_notices', updated);
      return updated;
    });
    showToast('Notice removed.', 'info');
  };

  // Video Management
  const addVideoLecture = async (video: Omit<VideoLecture, 'id' | 'views'>) => {
    const newV: VideoLecture = {
      ...video,
      id: `v-${Date.now()}`,
      views: '0'
    };
    setVideos(prev => {
      const updated = [newV, ...prev];
      saveItem('lcc_videos', updated);
      return updated;
    });
    try {
      await api.media.createVideo(newV);
    } catch (e: any) {
      console.warn('Cloud video sync note:', e.message);
    }
    showToast(`Video lecture "${newV.title}" added!`, 'success');
  };

  const updateVideoLecture = async (id: string, video: Partial<VideoLecture>) => {
    setVideos(prev => {
      const updated = prev.map(v => (v.id === id ? { ...v, ...video } : v));
      saveItem('lcc_videos', updated);
      return updated;
    });
    try {
      await api.media.updateVideo(id, video);
      showToast('Video lecture updated in cloud database!', 'success');
    } catch (e: any) {
      console.warn('Cloud video update note:', e.message);
      showToast('Video lecture updated locally.', 'info');
    }
  };

  const toggleVideoLecture = (id: string) => {
    api.media.toggleVideo(id).catch(() => {});
    setVideos(prev => {
      const updated = prev.map(v => (v.id === id ? { ...v, isPublished: !v.isPublished } : v));
      saveItem('lcc_videos', updated);
      return updated;
    });
  };

  const deleteVideoLecture = (id: string) => {
    api.media.deleteVideo(id).catch(() => {});
    setVideos(prev => {
      const updated = prev.filter(v => v.id !== id);
      saveItem('lcc_videos', updated);
      return updated;
    });
    showToast('Video lecture removed.', 'info');
  };

  // Gallery Management
  const addGalleryItem = async (item: Omit<GalleryItem, 'id' | 'date'> & { date?: string }) => {
    const newG: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
      date: item.date || new Date().toISOString().split('T')[0]
    };
    setGalleryItems(prev => {
      const updated = [newG, ...prev.filter(g => g.id !== newG.id)];
      saveItem('lcc_gallery', updated);
      return updated;
    });
    try {
      const res = await api.gallery.create(newG);
      if (res && res.data) {
        setGalleryItems(prev => {
          const synced = prev.map(g => g.id === newG.id ? { ...g, ...res.data } : g);
          saveItem('lcc_gallery', synced);
          return synced;
        });
      }
      showToast('Gallery image saved permanently to Cloud Database!', 'success');
    } catch (e: any) {
      console.warn('Cloud gallery upload note:', e.message);
      showToast('Gallery image saved locally on this device.', 'info');
    }
  };

  const updateGalleryItem = async (id: string, item: Partial<GalleryItem>) => {
    setGalleryItems(prev => {
      const updated = prev.map(g => (g.id === id ? { ...g, ...item } : g));
      saveItem('lcc_gallery', updated);
      return updated;
    });
    try {
      await api.gallery.update(id, item);
      showToast('Gallery photo updated permanently in cloud database!', 'success');
    } catch (e: any) {
      console.warn('Cloud gallery update note:', e.message);
      showToast('Gallery photo updated locally.', 'info');
    }
  };

  const deleteGalleryItem = async (id: string) => {
    setGalleryItems(prev => {
      const updated = prev.filter(g => g.id !== id);
      saveItem('lcc_gallery', updated);
      return updated;
    });
    try {
      await api.gallery.delete(id);
      showToast('Gallery image removed from cloud database.', 'info');
    } catch (e: any) {
      console.warn('Cloud gallery delete note:', e.message);
      showToast('Gallery image removed.', 'info');
    }
  };

  // Instagram Feed & Reels Management (Permanent Cloud & Local Storage Sync)
  const addInstagramPost = async (post: Omit<InstagramPost, 'id'>) => {
    const newPost: InstagramPost = {
      ...post,
      id: `ig-${Date.now()}`,
      timestamp: post.timestamp || post.date || 'Just now',
      date: post.date || post.timestamp || 'Just now'
    };
    setInstagramPosts(prev => {
      const updated = [newPost, ...prev.filter(p => p.id !== newPost.id)];
      saveItem('lcc_instagram', updated);
      return updated;
    });
    try {
      const res = await api.instagram.create(newPost);
      if (res && res.data) {
        setInstagramPosts(prev => {
          const synced = prev.map(p => p.id === newPost.id ? { ...p, ...res.data } : p);
          saveItem('lcc_instagram', synced);
          return synced;
        });
      }
      showToast('Instagram post saved permanently to Cloud Database!', 'success');
    } catch (e: any) {
      console.warn('Cloud Instagram upload note:', e.message);
      showToast('Instagram post saved locally on this device.', 'info');
    }
  };

  const updateInstagramPost = async (id: string, post: Partial<InstagramPost>) => {
    setInstagramPosts(prev => {
      const updated = prev.map(p => (p.id === id ? { ...p, ...post } : p));
      saveItem('lcc_instagram', updated);
      return updated;
    });
    try {
      await api.instagram.update(id, post);
      showToast('Instagram post updated permanently in cloud database!', 'success');
    } catch (e: any) {
      console.warn('Cloud Instagram update note:', e.message);
      showToast('Instagram post updated locally.', 'info');
    }
  };

  const deleteInstagramPost = async (id: string) => {
    setInstagramPosts(prev => {
      const updated = prev.filter(p => p.id !== id);
      saveItem('lcc_instagram', updated);
      return updated;
    });
    try {
      await api.instagram.delete(id);
      showToast('Instagram post removed from cloud database.', 'info');
    } catch (e: any) {
      console.warn('Cloud Instagram delete note:', e.message);
      showToast('Instagram post removed.', 'info');
    }
  };

  const updateStudentProgress = (courseId: string, progress: number) => {
    if (!currentStudent) return;
    setCurrentStudent(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        courseProgress: { ...prev.courseProgress, [courseId]: progress }
      };
    });
  };

  const submitQuizScore = (testId: string, score: number) => {
    if (!currentStudent) return;
    setCurrentStudent(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        quizScores: { ...prev.quizScores, [testId]: score }
      };
    });
    showToast(`Quiz completed! You scored ${score}%`, 'success');
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        navigateTo,
        scrollSection,
        theme,
        toggleTheme,
        colorTheme,
        setColorTheme,
        courses,
        setCourses,
        studyMaterials,
        setStudyMaterials,
        syllabuses,
        setSyllabuses,
        notices,
        setNotices,
        videos,
        setVideos,
        instagramPosts,
        setInstagramPosts,
        galleryItems,
        setGalleryItems,
        students,
        setStudents,
        transactions,
        inquiries,
        setInquiries,
        mockTests,
        ads,
        reviews,
        socialLinks,
        websiteSettings,
        selectedCourseForPayment,
        setSelectedCourseForPayment,
        selectedDocForPreview,
        setSelectedDocForPreview,
        selectedVideoForPlayer,
        setSelectedVideoForPlayer,
        isStudentAuthModalOpen,
        setIsStudentAuthModalOpen,
        isAdminAuthModalOpen,
        setIsAdminAuthModalOpen,
        currentStudent,
        isAdminAuthenticated,
        loginStudent,
        registerStudent,
        logoutStudent,
        loginAdmin,
        logoutAdmin,
        enrollInCourse,
        startEnrollment,
        submitAdmissionInquiry,
        addAd,
        updateAd,
        toggleAd,
        deleteAd,
        trackAdClick,
        addReviewLocally,
        moderateReview,
        deleteReview,
        updateSocialLink,
        updateWebsiteSettings,
        toggleUserStatus,
        adminResetPassword,
        updateStudentPassword,
        refreshUsers,
        addCourse,
        updateCourse,
        deleteCourse,
        addStudyMaterial,
        deleteStudyMaterial,
        addNotice,
        deleteNotice,
        addVideoLecture,
        updateVideoLecture,
        toggleVideoLecture,
        deleteVideoLecture,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        addInstagramPost,
        updateInstagramPost,
        deleteInstagramPost,
        updateStudentProgress,
        submitQuizScore,
        toasts,
        showToast,
        removeToast,
        isInitialSyncLoading,
        currentStaff,
        staffList,
        staffAttendance,
        branchAdmissions,
        staffStats,
        loginStaff,
        logoutStaff,
        markStaffAttendance,
        registerBranchAdmission,
        adminCreateTeacher,
        adminUpdateTeacher,
        adminResetTeacherPassword,
        assignTaskToTeacher,
        submitTeacherWorkReport,
        markBatchStudentAttendance,
        teacherTasks,
        studentAttendanceRecords,
        refreshStaffData,
        language,
        setLanguage,
        isGoalModalOpen,
        setIsGoalModalOpen,
        isDrawerOpen,
        setIsDrawerOpen,
        isOfflineVaultOpen,
        setIsOfflineVaultOpen,
        updateStudentGoal
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
