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
  razorpayKeyId?: string;
  whatsappRedirectUrl?: string;
  privatePlaylistUrl?: string;
}

export type MaterialCategory = 'pdf_notes' | 'formulas' | 'cheat_sheets' | 'worksheets' | 'homework' | 'practice_sets' | 'pyq' | 'important_questions';

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
  googleDriveUrl?: string;
  isGoogleDrive?: boolean;
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

export interface Notice {
  id: string;
  title: string;
  category: 'admission' | 'exam' | 'batch' | 'holiday' | 'event' | 'general' | 'ptm';
  date: string;
  isImportant: boolean;
  badgeText?: string;
  description: string;
}

export type VideoPlatform = 'youtube' | 'instagram' | 'facebook';

export interface VideoLecture {
  id: string;
  title: string;
  youtubeUrl: string;
  videoUrl?: string;
  platform?: VideoPlatform;
  videoId?: string;
  youtubeId?: string;
  thumbnail?: string;
  duration: string;
  views: string;
  subject: string;
  targetClass: string;
  instructor: string;
  isPublished?: boolean;
  isFeatured?: boolean;
  notesPdfUrl?: string;
  dateAdded?: string;
}

export interface InstagramPost {
  id: string;
  postUrl: string;
  title?: string;
  caption?: string;
  likes: number | string;
  comments: number | string;
  date?: string;
  timestamp?: string;
  imageUrl: string;
  type?: 'reel' | 'post' | string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  category: 'classroom' | 'computer_lab' | 'celebration' | 'awards' | 'toppers' | 'event' | 'students' | 'lab' | 'events' | string;
  imageUrl: string;
  date: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  targetClass?: string;
  classEnrolled?: string;
  avatarUrl?: string;
  enrolledCourses: string[];
  completedLessons?: string[];
  courseProgress: { [courseId: string]: number };
  quizScores?: { [testId: string]: number };
  dateJoined?: string;
  joinedDate?: string;
  role?: 'student' | 'admin';
  isActive?: boolean;
}

export interface Transaction {
  id: string;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  courseId: string;
  courseName: string;
  amount: number;
  paymentMethod: string;
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

// Advertisement Types
export type AdPlacement = 'hero_top' | 'between_sections' | 'study_vault' | 'mobile_in_feed';

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  destinationUrl: string;
  placement: AdPlacement;
  badge?: string;
  isActive: boolean;
  priority: number;
  startDate?: string;
  endDate?: string;
  clicks?: number;
  createdAt?: string;
}

// Review Types
export interface Review {
  id: string;
  studentName: string;
  studentClass: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
}

// Social Media Link
export interface SocialLink {
  id: string;
  platform: 'youtube' | 'instagram' | 'whatsapp' | 'facebook';
  label: string;
  url: string;
  isEnabled: boolean;
}

// Website Global Settings
export interface WebsiteSettings {
  instituteName: string;
  shortName?: string;
  instituteTagline?: string;
  logoUrl?: string;
  faviconUrl?: string;
  directorName: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
  emergencyAlertText: string;
  noticeTickerSpeed: 'slow' | 'normal' | 'fast';
  heroBadgeText: string;
  allowStudentReviews: boolean;
  maintenanceMode: boolean;
  razorpayKeyId?: string;
  defaultWhatsappRedirectUrl?: string;
  defaultPlaylistRedirectUrl?: string;
}
