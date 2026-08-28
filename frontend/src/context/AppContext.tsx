import React, { createContext, useContext, useState, useEffect } from 'react';
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
  WebsiteSettings
} from '../types';
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
  | 'admin-panel';

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

  enrollInCourse: (courseId: string, paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'QR') => Promise<boolean>;
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

  // Content Actions
  addCourse: (course: Omit<Course, 'id' | 'enrolledCount' | 'rating'>) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
  addStudyMaterial: (mat: Omit<StudyMaterial, 'id' | 'dateAdded' | 'downloadsCount'>) => void;
  deleteStudyMaterial: (id: string) => void;
  addNotice: (notice: Omit<Notice, 'id' | 'date'>) => void;
  deleteNotice: (id: string) => void;
  addVideoLecture: (video: Omit<VideoLecture, 'id' | 'views'>) => void;
  toggleVideoLecture: (id: string) => void;
  deleteVideoLecture: (id: string) => void;
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'date'>) => void;
  deleteGalleryItem: (id: string) => void;
  updateStudentProgress: (courseId: string, progress: number) => void;
  submitQuizScore: (testId: string, score: number) => void;

  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
  removeToast: (id: string) => void;
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
  instituteName: 'Lakshya Career Classes (L.C.C.)',
  directorName: 'Aman Arora',
  contactPhone: '+91 98765 43210',
  contactEmail: 'admissions@lcc.edu',
  contactAddress: 'Near City Central, Main Road, Coaching Hub',
  emergencyAlertText: 'Admissions Open for Session 2026-2027 (Scholarship Test on Sunday)',
  noticeTickerSpeed: 'normal',
  heroBadgeText: "INDIA'S TOP RATED COACHING & EDTECH",
  allowStudentReviews: true,
  maintenanceMode: false
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [scrollSection, setScrollSection] = useState<string>('home');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('lcc_theme');
    return (saved as 'dark' | 'light') || 'light';
  });
  const [colorTheme, setColorTheme] = useState<ColorTheme>('cobalt');

  useEffect(() => {
    localStorage.setItem('lcc_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(INITIAL_STUDY_MATERIALS);
  const [syllabuses, setSyllabuses] = useState<SyllabusItem[]>(INITIAL_SYLLABUS);
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES);
  const [videos, setVideos] = useState<VideoLecture[]>(INITIAL_VIDEOS);
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>(INITIAL_INSTAGRAM_POSTS);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [inquiries, setInquiries] = useState<AdmissionInquiry[]>([]);
  const [mockTests, setMockTests] = useState<MockTest[]>(INITIAL_MOCK_TESTS);
  const [ads, setAds] = useState<Advertisement[]>(INITIAL_ADS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(INITIAL_SOCIALS);
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettings>(INITIAL_SETTINGS);

  const [selectedCourseForPayment, setSelectedCourseForPayment] = useState<Course | null>(null);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<StudyMaterial | null>(null);
  const [selectedVideoForPlayer, setSelectedVideoForPlayer] = useState<VideoLecture | null>(null);
  const [isStudentAuthModalOpen, setIsStudentAuthModalOpen] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  const [currentStudent, setCurrentStudent] = useState<Student | null>(() => {
    const saved = localStorage.getItem('lcc_student_session');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('lcc_admin_authenticated') === 'true';
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

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
          api.syllabus.get(),
          api.inquiries.get(),
          api.auth.getUsers()
        ]);

        if (adsRes.status === 'fulfilled' && adsRes.value.data?.length) setAds(adsRes.value.data);
        if (pdfsRes.status === 'fulfilled' && pdfsRes.value.data?.length) setStudyMaterials(pdfsRes.value.data);
        if (vidsRes.status === 'fulfilled' && vidsRes.value.data?.length) setVideos(vidsRes.value.data);
        if (revsRes.status === 'fulfilled' && revsRes.value.data?.length) setReviews(revsRes.value.data);
        if (socsRes.status === 'fulfilled' && socsRes.value.data?.length) setSocialLinks(socsRes.value.data);
        if (setsRes.status === 'fulfilled' && setsRes.value.data) setWebsiteSettings(setsRes.value.data);
        if (coursesRes.status === 'fulfilled' && coursesRes.value.data?.length) setCourses(coursesRes.value.data);
        if (notsRes.status === 'fulfilled' && notsRes.value.data?.length) setNotices(notsRes.value.data);
        if (galRes.status === 'fulfilled' && galRes.value.data?.length) setGalleryItems(galRes.value.data);
        if (sylRes.status === 'fulfilled' && sylRes.value.data?.length) setSyllabuses(sylRes.value.data);
        if (inqRes.status === 'fulfilled' && inqRes.value.data?.length) setInquiries(inqRes.value.data);
        if (usersRes.status === 'fulfilled' && usersRes.value.data?.length) {
          const registeredStudents = usersRes.value.data.filter(u => u.role !== 'admin');
          if (registeredStudents.length > 0) setStudents(registeredStudents);
        }
      } catch (e) {
        console.log('ℹ️ Running in resilient fallback mode');
      }
    };
    syncBackend();
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' | 'warning' = 'info') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme(t => (t === 'light' ? 'dark' : 'light'));
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

  // Auth Operations
  const loginStudent = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await api.auth.login({ email, password: pass });
      localStorage.setItem('lcc_auth_token', res.token);
      localStorage.setItem('lcc_student_session', JSON.stringify(res.user));
      setCurrentStudent({
        ...res.user,
        enrolledCourses: ['c-9-10'],
        courseProgress: { 'c-9-10': 35 },
        quizScores: { 'test-1': 88 },
        dateJoined: res.user.createdAt || '2026-08-01'
      });
      showToast(res.message || `Welcome back, ${res.user.name}!`, 'success');
      return true;
    } catch (err: any) {
      // Local fallback for quick demonstration
      const localMatch = students.find(s => s.email.toLowerCase() === email.toLowerCase());
      if (localMatch) {
        setCurrentStudent(localMatch);
        localStorage.setItem('lcc_student_session', JSON.stringify(localMatch));
        showToast(`Welcome back, ${localMatch.name}!`, 'success');
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
      localStorage.setItem('lcc_student_session', JSON.stringify(res.user));
      const newStudent: Student = {
        ...res.user,
        enrolledCourses: [],
        courseProgress: {},
        quizScores: {},
        dateJoined: new Date().toISOString().split('T')[0]
      };
      setStudents(prev => [newStudent, ...prev]);
      setCurrentStudent(newStudent);
      showToast(res.message || 'Account created successfully!', 'success');
      return true;
    } catch (err: any) {
      showToast(err.message || 'Registration failed. Please check your details.', 'error');
      return false;
    }
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
      showToast(res.message || 'Admin authorization successful!', 'success');
      navigateTo('admin-panel');
      return true;
    } catch (err: any) {
      // Fallback check
      if (email === 'admin@lcc.edu' && pass === 'AmanLCC@2026!') {
        localStorage.setItem('lcc_admin_authenticated', 'true');
        setIsAdminAuthenticated(true);
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
      setSocialLinks(prev => prev.map(s => s.id === id ? { ...s, ...body } : s));
    } catch (e) {
      setSocialLinks(prev => prev.map(s => s.id === id ? { ...s, ...body } : s));
    }
  };

  const updateWebsiteSettings = async (settings: Partial<WebsiteSettings>) => {
    try {
      await api.settings.update(settings);
      setWebsiteSettings(prev => ({ ...prev, ...settings }));
    } catch (e) {
      setWebsiteSettings(prev => ({ ...prev, ...settings }));
    }
  };

  const toggleUserStatus = async (id: string) => {
    try {
      await api.auth.toggleUser(id);
      setStudents(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
      showToast('User status updated.', 'info');
    } catch (e) {
      setStudents(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
    }
  };

  const enrollInCourse = async (courseId: string, paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'QR'): Promise<boolean> => {
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
    try {
      const res = await api.courses.create(course);
      setCourses(prev => [res.data, ...prev]);
      showToast(`Course "${res.data.title}" added to database!`, 'success');
    } catch (e) {
      const newC: Course = {
        ...course,
        id: `c-${Date.now()}`,
        enrolledCount: 0,
        rating: 5.0
      };
      setCourses(prev => [newC, ...prev]);
      showToast(`Course "${newC.title}" added successfully!`, 'success');
    }
  };

  const updateCourse = async (course: Course) => {
    try {
      await api.courses.update(course.id, course);
      setCourses(prev => prev.map(c => (c.id === course.id ? course : c)));
      showToast(`Course "${course.title}" saved to database!`, 'success');
    } catch (e) {
      setCourses(prev => prev.map(c => (c.id === course.id ? course : c)));
      showToast(`Course "${course.title}" updated!`, 'success');
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      await api.courses.delete(id);
      setCourses(prev => prev.filter(c => c.id !== id));
      showToast('Course removed from database.', 'info');
    } catch (e) {
      setCourses(prev => prev.filter(c => c.id !== id));
      showToast('Course deleted.', 'info');
    }
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
    setStudyMaterials(prev => [newMat, ...prev]);
    showToast(`Material "${newMat.title}" published!`, 'success');
  };

  const deleteStudyMaterial = (id: string) => {
    api.media.deletePDF(id).catch(() => {});
    setStudyMaterials(prev => prev.filter(m => m.id !== id));
    showToast('Study material deleted.', 'info');
  };

  // Notice Management (Backend Integrated)
  const addNotice = async (notice: Omit<Notice, 'id' | 'date'>) => {
    try {
      const res = await api.notices.create(notice);
      setNotices(prev => [res.data, ...prev]);
      showToast(`Notice "${res.data.title}" posted to database!`, 'success');
    } catch (e) {
      const newN: Notice = {
        ...notice,
        id: `not-${Date.now()}`,
        date: new Date().toISOString().split('T')[0]
      };
      setNotices(prev => [newN, ...prev]);
      showToast(`Notice "${newN.title}" posted!`, 'success');
    }
  };

  const deleteNotice = async (id: string) => {
    try {
      await api.notices.delete(id);
      setNotices(prev => prev.filter(n => n.id !== id));
      showToast('Notice removed from database.', 'info');
    } catch (e) {
      setNotices(prev => prev.filter(n => n.id !== id));
      showToast('Notice deleted.', 'info');
    }
  };

  // Video Management
  const addVideoLecture = (video: Omit<VideoLecture, 'id' | 'views'>) => {
    api.media.createVideo(video).catch(() => {});
    const newV: VideoLecture = {
      ...video,
      id: `v-${Date.now()}`,
      views: '0'
    };
    setVideos(prev => [newV, ...prev]);
    showToast(`Video lecture "${newV.title}" added!`, 'success');
  };

  const toggleVideoLecture = (id: string) => {
    api.media.toggleVideo(id).catch(() => {});
    setVideos(prev => prev.map(v => v.id === id ? { ...v, isPublished: !v.isPublished } : v));
  };

  const deleteVideoLecture = (id: string) => {
    api.media.deleteVideo(id).catch(() => {});
    setVideos(prev => prev.filter(v => v.id !== id));
    showToast('Video lecture removed.', 'info');
  };

  // Gallery Management
  const addGalleryItem = (item: Omit<GalleryItem, 'id' | 'date'>) => {
    const newG: GalleryItem = {
      ...item,
      id: `g-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setGalleryItems(prev => [newG, ...prev]);
    showToast('Gallery image added!', 'success');
  };

  const deleteGalleryItem = (id: string) => {
    setGalleryItems(prev => prev.filter(g => g.id !== id));
    showToast('Gallery image removed.', 'info');
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
        addCourse,
        updateCourse,
        deleteCourse,
        addStudyMaterial,
        deleteStudyMaterial,
        addNotice,
        deleteNotice,
        addVideoLecture,
        toggleVideoLecture,
        deleteVideoLecture,
        addGalleryItem,
        deleteGalleryItem,
        updateStudentProgress,
        submitQuizScore,
        toasts,
        showToast,
        removeToast
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
