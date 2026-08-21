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
  ColorTheme
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

export type ActiveView = 
  | 'home'
  | 'courses'
  | 'study-material'
  | 'syllabus'
  | 'batches'
  | 'videos'
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

  theme: 'dark' | 'light';
  toggleTheme: () => void;

  courses: Course[];
  studyMaterials: StudyMaterial[];
  syllabuses: SyllabusItem[];
  notices: Notice[];
  videos: VideoLecture[];
  instagramPosts: InstagramPost[];
  galleryItems: GalleryItem[];
  students: Student[];
  transactions: Transaction[];
  inquiries: AdmissionInquiry[];
  mockTests: MockTest[];

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
  isAdminLoggedIn: boolean;
  loginStudent: (email: string, pass?: string) => boolean;
  registerStudent: (name: string, email: string, phone: string, targetClass: string) => boolean;
  logoutStudent: () => void;
  loginAdmin: (pass: string) => boolean;
  logoutAdmin: () => void;

  enrollInCourse: (courseId: string, paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'QR') => Promise<boolean>;
  submitAdmissionInquiry: (inquiry: Omit<AdmissionInquiry, 'id' | 'date' | 'status'>) => void;
  addCourse: (course: Omit<Course, 'id' | 'enrolledCount' | 'rating'>) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
  addStudyMaterial: (mat: Omit<StudyMaterial, 'id' | 'dateAdded' | 'downloadsCount'>) => void;
  deleteStudyMaterial: (id: string) => void;
  addNotice: (notice: Omit<Notice, 'id' | 'date'>) => void;
  deleteNotice: (id: string) => void;
  addVideoLecture: (video: Omit<VideoLecture, 'id' | 'views'>) => void;
  deleteVideoLecture: (id: string) => void;
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'date'>) => void;
  deleteGalleryItem: (id: string) => void;
  incrementDownloadCount: (matId: string) => void;
  updateStudentProgress: (courseId: string, progressDelta: number) => void;

  colorTheme: ColorTheme;
  setColorTheme: (t: ColorTheme) => void;

  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    return (localStorage.getItem('lcc_color_theme') as ColorTheme) || 'cobalt';
  });

  const setColorTheme = (t: ColorTheme) => {
    setColorThemeState(t);
    localStorage.setItem('lcc_color_theme', t);
    document.documentElement.setAttribute('data-theme', t);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorTheme);
  }, [colorTheme]);

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('lcc_theme') as 'dark' | 'light') || 'dark';
  });

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('lcc_theme', next);
      return next;
    });
  };

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('lcc_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>(() => {
    const saved = localStorage.getItem('lcc_materials');
    return saved ? JSON.parse(saved) : INITIAL_STUDY_MATERIALS;
  });

  const [syllabuses] = useState<SyllabusItem[]>(INITIAL_SYLLABUS);

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('lcc_notices');
    return saved ? JSON.parse(saved) : INITIAL_NOTICES;
  });

  const [videos, setVideos] = useState<VideoLecture[]>(() => {
    const saved = localStorage.getItem('lcc_videos');
    return saved ? JSON.parse(saved) : INITIAL_VIDEOS;
  });

  const [instagramPosts] = useState<InstagramPost[]>(INITIAL_INSTAGRAM_POSTS);

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('lcc_gallery');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('lcc_students');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('lcc_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [inquiries, setInquiries] = useState<AdmissionInquiry[]>(() => {
    const saved = localStorage.getItem('lcc_inquiries');
    return saved ? JSON.parse(saved) : [];
  });

  const [mockTests] = useState<MockTest[]>(INITIAL_MOCK_TESTS);

  const [selectedCourseForPayment, setSelectedCourseForPayment] = useState<Course | null>(null);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<StudyMaterial | null>(null);
  const [selectedVideoForPlayer, setSelectedVideoForPlayer] = useState<VideoLecture | null>(null);
  const [isStudentAuthModalOpen, setIsStudentAuthModalOpen] = useState(false);
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState(false);

  const [currentStudent, setCurrentStudent] = useState<Student | null>(() => {
    const saved = localStorage.getItem('lcc_current_student');
    return saved ? JSON.parse(saved) : null;
  });
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('lcc_admin_logged') === 'true';
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    localStorage.setItem('lcc_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('lcc_materials', JSON.stringify(studyMaterials));
  }, [studyMaterials]);

  useEffect(() => {
    localStorage.setItem('lcc_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('lcc_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('lcc_gallery', JSON.stringify(galleryItems));
  }, [galleryItems]);

  useEffect(() => {
    localStorage.setItem('lcc_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('lcc_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('lcc_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  useEffect(() => {
    if (currentStudent) {
      localStorage.setItem('lcc_current_student', JSON.stringify(currentStudent));
    } else {
      localStorage.removeItem('lcc_current_student');
    }
  }, [currentStudent]);

  useEffect(() => {
    localStorage.setItem('lcc_admin_logged', isAdminLoggedIn ? 'true' : 'false');
  }, [isAdminLoggedIn]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' | 'warning' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const navigateTo = (view: ActiveView, anchorId?: string) => {
    if (anchorId) {
      setActiveView('home');
      setTimeout(() => {
        const el = document.getElementById(anchorId);
        if (el) {
          const yOffset = -80;
          const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 80);
    } else {
      setActiveView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const loginStudent = (email: string): boolean => {
    const student = students.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (student) {
      setCurrentStudent(student);
      showToast(`Welcome back, ${student.name}!`, 'success');
      return true;
    }
    const demoStudent: Student = {
      id: `stu-${Date.now()}`,
      name: email.split('@')[0].toUpperCase(),
      email,
      phone: '+91 98765 43210',
      classEnrolled: 'Class 10',
      enrolledCourses: ['c-9-10'],
      courseProgress: { 'c-9-10': 35 },
      completedLessons: ['lesson-1'],
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setStudents(prev => [...prev, demoStudent]);
    setCurrentStudent(demoStudent);
    showToast(`Logged in successfully as ${demoStudent.name}!`, 'success');
    return true;
  };

  const registerStudent = (name: string, email: string, phone: string, targetClass: string): boolean => {
    const newStudent: Student = {
      id: `stu-${Date.now()}`,
      name,
      email,
      phone,
      classEnrolled: targetClass,
      enrolledCourses: [],
      courseProgress: {},
      completedLessons: [],
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setStudents(prev => [...prev, newStudent]);
    setCurrentStudent(newStudent);
    showToast(`Registration complete! Welcome to L.C.C., ${name}!`, 'success');
    return true;
  };

  const logoutStudent = () => {
    setCurrentStudent(null);
    showToast('Logged out from Student Portal.', 'info');
    setActiveView('home');
  };

  const loginAdmin = (pass: string): boolean => {
    if (pass === 'admin123' || pass === 'lcc2026' || pass === 'admin') {
      setIsAdminLoggedIn(true);
      showToast('Admin Access Granted. Welcome, Administrator!', 'success');
      setActiveView('admin-panel');
      return true;
    }
    showToast('Invalid Admin Password. (Use: admin123)', 'error');
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    showToast('Admin logged out successfully.', 'info');
    setActiveView('home');
  };

  const enrollInCourse = async (courseId: string, paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'QR'): Promise<boolean> => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return false;

    const student = currentStudent || {
      id: `stu-${Date.now()}`,
      name: 'Registered Scholar',
      email: 'student@lcc.edu',
      phone: '+91 98765 43210',
      classEnrolled: course.targetClass,
      enrolledCourses: [],
      courseProgress: {},
      completedLessons: [],
      joinedDate: new Date().toISOString().split('T')[0]
    };

    const newTxn: Transaction = {
      id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
      studentName: student.name,
      studentEmail: student.email,
      studentPhone: student.phone,
      courseId: course.id,
      courseName: course.title,
      amount: course.discountFee,
      paymentMethod,
      date: new Date().toLocaleString(),
      status: 'Completed',
      utrNumber: `${paymentMethod}/${new Date().getFullYear()}/${Math.floor(1000000 + Math.random() * 9000000)}`
    };

    setTransactions(prev => [newTxn, ...prev]);

    const updatedStudent: Student = {
      ...student,
      enrolledCourses: Array.from(new Set([...student.enrolledCourses, course.id])),
      courseProgress: {
        ...student.courseProgress,
        [course.id]: student.courseProgress[course.id] || 10
      }
    };

    setCurrentStudent(updatedStudent);
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, enrolledCount: c.enrolledCount + 1 } : c));

    showToast(`Payment of ₹${course.discountFee} successful! Enrolled in ${course.title}`, 'success');
    return true;
  };

  const submitAdmissionInquiry = (data: Omit<AdmissionInquiry, 'id' | 'date' | 'status'>) => {
    const newInquiry: AdmissionInquiry = {
      ...data,
      id: `INQ-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      status: 'New'
    };
    setInquiries(prev => [newInquiry, ...prev]);
    showToast('Admission inquiry submitted successfully! Our counseling team will contact you shortly.', 'success');
  };

  const addCourse = (courseData: Omit<Course, 'id' | 'enrolledCount' | 'rating'>) => {
    const newCourse: Course = {
      ...courseData,
      id: `c-${Date.now()}`,
      enrolledCount: 0,
      rating: 5.0
    };
    setCourses(prev => [newCourse, ...prev]);
    showToast(`New Course "${newCourse.title}" created successfully!`, 'success');
  };

  const updateCourse = (updatedCourse: Course) => {
    setCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
    showToast(`Course "${updatedCourse.title}" updated!`, 'success');
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
    showToast('Course removed from catalog.', 'info');
  };

  const addStudyMaterial = (matData: Omit<StudyMaterial, 'id' | 'dateAdded' | 'downloadsCount'>) => {
    const newMat: StudyMaterial = {
      ...matData,
      id: `mat-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
      downloadsCount: 0
    };
    setStudyMaterials(prev => [newMat, ...prev]);
    showToast(`Study Material "${newMat.title}" uploaded!`, 'success');
  };

  const deleteStudyMaterial = (id: string) => {
    setStudyMaterials(prev => prev.filter(m => m.id !== id));
    showToast('Study material deleted.', 'info');
  };

  const addNotice = (noticeData: Omit<Notice, 'id' | 'date'>) => {
    const newNotice: Notice = {
      ...noticeData,
      id: `not-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setNotices(prev => [newNotice, ...prev]);
    showToast(`Notice "${newNotice.title}" published!`, 'success');
  };

  const deleteNotice = (id: string) => {
    setNotices(prev => prev.filter(n => n.id !== id));
    showToast('Notice deleted.', 'info');
  };

  const addVideoLecture = (videoData: Omit<VideoLecture, 'id' | 'views'>) => {
    const newVideo: VideoLecture = {
      ...videoData,
      id: `vid-${Date.now()}`,
      views: '1.2K views'
    };
    setVideos(prev => [newVideo, ...prev]);
    showToast(`Video Lecture "${newVideo.title}" added!`, 'success');
  };

  const deleteVideoLecture = (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
    showToast('Video lecture removed.', 'info');
  };

  const addGalleryItem = (itemData: Omit<GalleryItem, 'id' | 'date'>) => {
    const newItem: GalleryItem = {
      ...itemData,
      id: `gal-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };
    setGalleryItems(prev => [newItem, ...prev]);
    showToast('New photo added to gallery!', 'success');
  };

  const deleteGalleryItem = (id: string) => {
    setGalleryItems(prev => prev.filter(g => g.id !== id));
    showToast('Gallery item removed.', 'info');
  };

  const incrementDownloadCount = (matId: string) => {
    setStudyMaterials(prev => prev.map(m => m.id === matId ? { ...m, downloadsCount: m.downloadsCount + 1 } : m));
  };

  const updateStudentProgress = (courseId: string, progressDelta: number) => {
    if (!currentStudent) return;
    const current = currentStudent.courseProgress[courseId] || 0;
    const updatedProgress = Math.min(100, Math.max(0, current + progressDelta));
    const updatedStudent: Student = {
      ...currentStudent,
      courseProgress: {
        ...currentStudent.courseProgress,
        [courseId]: updatedProgress
      }
    };
    setCurrentStudent(updatedStudent);
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        navigateTo,
        theme,
        toggleTheme,
        courses,
        studyMaterials,
        syllabuses,
        notices,
        videos,
        instagramPosts,
        galleryItems,
        students,
        transactions,
        inquiries,
        mockTests,
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
        isAdminLoggedIn,
        loginStudent,
        registerStudent,
        logoutStudent,
        loginAdmin,
        logoutAdmin,
        enrollInCourse,
        submitAdmissionInquiry,
        addCourse,
        updateCourse,
        deleteCourse,
        addStudyMaterial,
        deleteStudyMaterial,
        addNotice,
        deleteNotice,
        addVideoLecture,
        deleteVideoLecture,
        addGalleryItem,
        deleteGalleryItem,
        incrementDownloadCount,
        updateStudentProgress,
        colorTheme,
        setColorTheme,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
