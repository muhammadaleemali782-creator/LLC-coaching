export type ColorTheme = 'cobalt' | 'emerald' | 'purple' | 'sunset' | 'midnight';

export type CourseCategory = 'primary' | 'middle' | 'secondary' | 'senior' | 'computer' | 'spoken' | 'competitive';

export interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  targetClass: string;
  duration: string;
  fee: number;
  discountFee: number;
  rating: number;
  enrolledCount: number;
  instructor: string;
  image: string;
  badge?: string;
  features: string[];
  description: string;
  syllabusHighlights: string[];
  isPaid: boolean;
  schedule?: string;
}

export type MaterialCategory = 'pdf_notes' | 'worksheets' | 'homework' | 'practice_sets' | 'pyq' | 'important_questions';

export interface StudyMaterial {
  id: string;
  title: string;
  category: MaterialCategory;
  targetClass: string;
  subject: string;
  chapter: string;
  pages: number;
  downloadUrl: string;
  isPremium: boolean;
  fileType: 'pdf' | 'doc' | 'zip';
  dateAdded: string;
  downloadsCount: number;
  previewContent?: string;
}

export interface SyllabusChapter {
  name: string;
  subtopics: string[];
  weightage: string;
  estimatedHours: number;
}

export interface SyllabusItem {
  id: string;
  targetClass: string;
  subject: string;
  examBoard: string;
  chapters: SyllabusChapter[];
  pdfUrl: string;
  totalMarks: number;
  academicYear: string;
}

export type NoticeCategory = 'exam' | 'holiday' | 'batch' | 'admission' | 'ptm' | 'general';

export interface Notice {
  id: string;
  title: string;
  date: string;
  category: NoticeCategory;
  description: string;
  isImportant: boolean;
  fileUrl?: string;
  badgeText?: string;
}

export interface VideoLecture {
  id: string;
  title: string;
  subject: string;
  targetClass: string;
  duration: string;
  youtubeId: string;
  youtubeUrl: string;
  thumbnail: string;
  instructor: string;
  views: string;
  isFeatured: boolean;
  notesPdfUrl?: string;
}

export interface InstagramPost {
  id: string;
  title: string;
  likes: string;
  comments: string;
  imageUrl: string;
  postUrl: string;
  type: 'reel' | 'post';
  date: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'event' | 'students' | 'achievements' | 'classroom' | 'toppers';
  imageUrl: string;
  date: string;
  description: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  classEnrolled: string;
  enrolledCourses: string[];
  courseProgress: { [courseId: string]: number };
  completedLessons: string[];
  joinedDate: string;
  avatarUrl?: string;
}

export interface Transaction {
  id: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  courseId: string;
  courseName: string;
  amount: number;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'QR';
  date: string;
  status: 'Completed' | 'Pending' | 'Failed';
  utrNumber: string;
}

export interface MockQuestion {
  id: number;
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

export interface MockTest {
  id: string;
  title: string;
  targetClass: string;
  subject: string;
  durationMinutes: number;
  totalMarks: number;
  passingMarks: number;
  questions: MockQuestion[];
}

export interface AdmissionInquiry {
  id: string;
  studentName: string;
  parentName: string;
  phone: string;
  email: string;
  currentClass: string;
  targetCourse: string;
  message: string;
  date: string;
  status: 'New' | 'Contacted' | 'Enrolled';
}
