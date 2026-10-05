import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// In Vercel serverless (AWS Lambda), /var/task is read-only; use /tmp which is writable
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production');
const DB_FILE = isServerless 
  ? path.join(os.tmpdir(), 'lcc_store.json')
  : path.join(__dirname, '../data/store.json');
const DEFAULT_SEED_FILE = path.join(__dirname, '../data/store.json');

// Mongoose Models Schemas
const UserSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: { type: String, unique: true },
  phone: String,
  passwordHash: String,
  role: { type: String, default: 'student' },
  branch: String,
  designation: String,
  targetClass: String,
  enrolledCourses: [String],
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, { strict: false });

const CourseSchema = new mongoose.Schema({
  id: String,
  title: String,
  category: String,
  targetClass: String,
  duration: String,
  fee: Number,
  discountFee: Number,
  rating: Number,
  enrolledCount: Number,
  instructor: String,
  image: String,
  badge: String,
  features: [String],
  description: String,
  syllabusHighlights: [String],
  isPaid: { type: Boolean, default: true },
  schedule: String,
  whatsappRedirectUrl: String,
  privatePlaylistUrl: String,
  razorpayKeyId: String
}, { strict: false });

const StudyMaterialSchema = new mongoose.Schema({
  id: String,
  title: String,
  category: String,
  targetClass: String,
  subject: String,
  chapter: String,
  pages: Number,
  downloadUrl: String,
  googleDriveUrl: String,
  isGoogleDrive: { type: Boolean, default: false },
  isPremium: Boolean,
  fileType: String,
  dateAdded: String,
  downloadsCount: { type: Number, default: 0 },
  previewContent: String
}, { strict: false });

const VideoSchema = new mongoose.Schema({
  id: String,
  title: String,
  youtubeUrl: String,
  videoUrl: String,
  platform: { type: String, default: 'youtube' },
  videoId: String,
  youtubeId: String,
  thumbnail: String,
  duration: String,
  views: String,
  subject: String,
  targetClass: String,
  instructor: String,
  isPublished: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: true },
  dateAdded: String
}, { strict: false });

const NoticeSchema = new mongoose.Schema({
  id: String,
  title: String,
  category: String,
  date: String,
  isImportant: Boolean,
  badgeText: String,
  description: String
}, { strict: false });

const GallerySchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  category: String,
  imageUrl: String,
  date: String
}, { strict: false });

const InstagramSchema = new mongoose.Schema({
  id: String,
  imageUrl: String,
  caption: String,
  title: String,
  likes: mongoose.Schema.Types.Mixed,
  comments: mongoose.Schema.Types.Mixed,
  postUrl: String,
  timestamp: String,
  date: String,
  type: { type: String, default: 'post' }
}, { strict: false });

const SyllabusSchema = new mongoose.Schema({
  id: String,
  targetClass: String,
  subject: String,
  examBoard: String,
  totalMarks: Number,
  academicYear: String,
  pdfUrl: String,
  chapters: [{
    name: String,
    subtopics: [String],
    weightage: String,
    estimatedHours: Number
  }]
}, { strict: false });

const AdSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  imageUrl: String,
  destinationUrl: String,
  placement: String,
  badge: String,
  isActive: { type: Boolean, default: true },
  priority: { type: Number, default: 1 },
  startDate: String,
  endDate: String,
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

const ReviewSchema = new mongoose.Schema({
  id: String,
  studentName: String,
  studentClass: String,
  rating: Number,
  comment: String,
  status: { type: String, default: 'approved' },
  date: String
}, { strict: false });

const SocialLinkSchema = new mongoose.Schema({
  id: String,
  platform: String,
  label: String,
  url: String,
  isEnabled: { type: Boolean, default: true }
}, { strict: false });

const SettingSchema = new mongoose.Schema({
  instituteName: String,
  shortName: { type: String, default: 'L.C.C.' },
  instituteTagline: { type: String, default: 'Learning Coaching Center' },
  logoUrl: { type: String, default: '/logo.jpg' },
  faviconUrl: { type: String, default: '/logo.jpg' },
  directorName: String,
  contactPhone: String,
  contactEmail: String,
  contactAddress: String,
  googleMapsEmbedUrl: { type: String, default: '' },
  emergencyAlertText: String,
  noticeTickerSpeed: String,
  heroBadgeText: String,
  allowStudentReviews: Boolean,
  maintenanceMode: Boolean,
  razorpayKeyId: { type: String, default: 'rzp_live_TbWh7wBlq0NQuz' },
  defaultWhatsappRedirectUrl: String,
  defaultPlaylistRedirectUrl: String,
  heroPosterUrl: String,
  directorPhotoUrl: String,
  visualOverrides: { type: mongoose.Schema.Types.Mixed, default: {} },
  sectionOrder: { type: [String], default: [] },
  heroColumnsOrder: { type: [String], default: [] },
  headerOrder: { type: [String], default: [] }
}, { strict: false });

const InquirySchema = new mongoose.Schema({
  id: String,
  studentName: String,
  parentName: String,
  phone: String,
  email: String,
  currentClass: String,
  targetCourse: String,
  message: String,
  date: String,
  status: { type: String, default: 'New' }
});

const TransactionSchema = new mongoose.Schema({
  id: String,
  studentName: String,
  studentEmail: String,
  studentPhone: String,
  courseId: String,
  courseName: String,
  amount: Number,
  paymentMethod: String,
  date: String,
  status: { type: String, default: 'Completed' },
  utrNumber: String,
  razorpayPaymentId: String,
  razorpayOrderId: String,
  razorpaySignature: String,
  isVerified: { type: Boolean, default: false },
  secureToken: String,
  verifiedAt: String
});

const StaffAttendanceSchema = new mongoose.Schema({
  id: String,
  staffId: String,
  staffName: String,
  staffEmail: String,
  branch: String,
  date: String,
  status: { type: String, default: 'Present' }, // 'Present' | 'Absent' | 'On Leave'
  reason: { type: String, default: '' },
  checkInTime: { type: String, default: 'N/A' },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

const BranchAdmissionSchema = new mongoose.Schema({
  id: String,
  studentName: String,
  parentName: String,
  phone: String,
  email: String,
  targetClass: String,
  courseName: String,
  branch: String,
  assignedTeacherId: String,
  assignedTeacherName: String,
  admissionType: { type: String, default: 'Enrolled' }, // 'Enrolled' | 'Visited'
  feesPaid: { type: Number, default: 0 },
  notes: String,
  date: String,
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

const TeacherTaskSchema = new mongoose.Schema({
  id: String,
  title: String,
  description: String,
  assignedToStaffId: String,
  assignedToStaffName: String,
  dueDate: String,
  priority: { type: String, default: 'Normal' },
  status: { type: String, default: 'Pending' }, // 'Pending' | 'Completed'
  reportNote: { type: String, default: '' },
  submittedAt: String,
  createdAt: { type: Date, default: Date.now }
}, { strict: false });

const StudentAttendanceSchema = new mongoose.Schema({
  id: String,
  studentId: String,
  studentName: String,
  teacherId: String,
  branch: String,
  date: String,
  status: { type: String, default: 'Present' }, // 'Present' | 'Absent' | 'On Leave'
  reason: { type: String, default: '' },
  recordedAt: { type: Date, default: Date.now }
}, { strict: false });

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export const CourseModel = mongoose.models.Course || mongoose.model('Course', CourseSchema);
export const StudyMaterialModel = mongoose.models.StudyMaterial || mongoose.model('StudyMaterial', StudyMaterialSchema);
export const VideoModel = mongoose.models.Video || mongoose.model('Video', VideoSchema);
export const NoticeModel = mongoose.models.Notice || mongoose.model('Notice', NoticeSchema);
export const GalleryModel = mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);
export const InstagramModel = mongoose.models.Instagram || mongoose.model('Instagram', InstagramSchema);
export const SyllabusModel = mongoose.models.Syllabus || mongoose.model('Syllabus', SyllabusSchema);
export const AdModel = mongoose.models.Ad || mongoose.model('Ad', AdSchema);
export const ReviewModel = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
export const SocialLinkModel = mongoose.models.SocialLink || mongoose.model('SocialLink', SocialLinkSchema);
export const SettingModel = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
export const InquiryModel = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
export const TransactionModel = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);
export const StaffAttendanceModel = mongoose.models.StaffAttendance || mongoose.model('StaffAttendance', StaffAttendanceSchema);
export const BranchAdmissionModel = mongoose.models.BranchAdmission || mongoose.model('BranchAdmission', BranchAdmissionSchema);
export const TeacherTaskModel = mongoose.models.TeacherTask || mongoose.model('TeacherTask', TeacherTaskSchema);
export const StudentAttendanceModel = mongoose.models.StudentAttendance || mongoose.model('StudentAttendance', StudentAttendanceSchema);

// Full Comprehensive Seed Dataset (Matches 100% of Frontend Needs)
const defaultData = {
  users: [
    {
      id: 'usr-admin',
      name: 'Aman Arora (Director)',
      email: 'admin@lcc.edu',
      phone: '+919876543210',
      passwordHash: bcrypt.hashSync(process.env.ADMIN_INITIAL_PASSWORD || 'AmanLCC@2026!', 10),
      role: 'admin',
      targetClass: 'Admin',
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      id: 'staff-rajesh',
      name: 'Rajesh Verma (Senior Faculty)',
      email: 'rajesh@lcc.edu',
      phone: '+919876543211',
      passwordHash: bcrypt.hashSync('Staff@123', 10),
      role: 'staff',
      branch: 'Palahipatti Main Campus (Sindhora Rd)',
      designation: 'Senior Mathematics Faculty',
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      id: 'staff-ananya',
      name: 'Mrs. Ananya Sharma',
      email: 'ananya@lcc.edu',
      phone: '+919876543212',
      passwordHash: bcrypt.hashSync('Staff@123', 10),
      role: 'staff',
      branch: 'Sindhora Market Branch',
      designation: 'Science & Foundation Specialist',
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      id: 'staff-amit',
      name: 'Amit Kumar',
      email: 'amit@lcc.edu',
      phone: '+919876543213',
      passwordHash: bcrypt.hashSync('Staff@123', 10),
      role: 'staff',
      branch: 'Babatpur City Center',
      designation: 'Commerce & Career Counselor',
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      id: 'usr-student-1',
      name: 'Aarav Patel',
      email: 'student@lcc.edu',
      phone: '+919876543210',
      passwordHash: bcrypt.hashSync('Student@123', 10),
      role: 'student',
      targetClass: 'Class 10',
      enrolledCourses: ['c-9-10', 'c-computer-diploma'],
      createdAt: new Date().toISOString(),
      isActive: true
    }
  ],
  courses: [
    {
      id: 'c-1-5',
      title: 'Junior Champs: Class 1 to 5 Foundation',
      category: 'primary',
      targetClass: 'Class 1-5',
      duration: 'Full Academic Year',
      fee: 4500,
      discountFee: 2999,
      rating: 4.9,
      enrolledCount: 142,
      instructor: 'Mrs. Ananya Sharma & Expert Faculty',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
      badge: 'Popular Foundation',
      features: ['Maths, EVS, English & Hindi', 'Daily Activity Worksheets', 'Concept Building & Mental Maths', 'Personal Attention (Max 15/batch)'],
      description: 'A nurturing foundational program designed to build strong cognitive, arithmetic, and linguistic skills for young learners with play-way methodology.',
      isPaid: true,
      schedule: 'Mon - Fri | 3:30 PM - 5:00 PM'
    },
    {
      id: 'c-6-8',
      title: 'Middle School Mastery: Class 6 to 8',
      category: 'middle',
      targetClass: 'Class 6-8',
      duration: 'Full Academic Year',
      fee: 6500,
      discountFee: 4499,
      rating: 4.8,
      enrolledCount: 210,
      instructor: 'Mr. Rajesh Verma & Team',
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&auto=format&fit=crop&q=80',
      badge: 'Core Strong',
      features: ['Mathematics, Science, SST & English', 'Chapter Practice Sheets & Weekly Tests', 'Olympiad & NTSE Orientation', 'Doubt Solving Clinics'],
      description: 'Comprehensive subject mastery for middle school students, bridging school curriculum with advanced logical reasoning.',
      isPaid: true,
      schedule: 'Mon - Sat | 4:00 PM - 6:00 PM'
    },
    {
      id: 'c-9-10',
      title: 'Board Exam Ace: Class 9 & 10 Target 95%+',
      category: 'secondary',
      targetClass: 'Class 9-10',
      duration: 'Full Academic Year + Crash Revision',
      fee: 9500,
      discountFee: 6999,
      rating: 5.0,
      enrolledCount: 380,
      instructor: 'Aman Arora (Managing Director) & Senior Mentors',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
      badge: 'Topper Choice',
      features: ['CBSE & State Board Syllabus Mastery', '10 Years PYQs with Model Solutions', '5 Full-length Mock Board Exams', 'Answer Writing Skill Workshop'],
      description: 'Our flagship board preparation program renowned for producing district toppers year after year with precise pedagogy and test series.',
      isPaid: true,
      schedule: 'Mon - Sat | 5:00 PM - 7:30 PM'
    },
    {
      id: 'c-11-12-sci',
      title: 'Class 11 & 12 Science (PCM / PCB) + Target Boards',
      category: 'senior',
      targetClass: 'Class 11-12',
      duration: '1 & 2 Year Target Program',
      fee: 14500,
      discountFee: 9999,
      rating: 4.9,
      enrolledCount: 295,
      instructor: 'Aman Arora & Senior Mentors',
      image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
      badge: 'Rankers Batch',
      features: ['Physics, Chemistry, Maths & Biology', 'Formula Booklets & Derivation Guides', 'Competitive Exam Foundation (JEE/NEET/CUET)', '1-on-1 Mentorship & Test Analysis'],
      description: 'Rigorous conceptual coaching for senior secondary students aiming for top board percentages and strong competitive readiness.',
      isPaid: true,
      schedule: 'Daily | 6:00 AM - 8:30 AM & 6:00 PM - 8:30 PM'
    },
    {
      id: 'c-computer-diploma',
      title: 'Master Computer Diploma (DCA / ADCA / Tally Prime)',
      category: 'computer',
      targetClass: 'All Students & Job Aspirants',
      duration: '6 Months / 1 Year Certificate',
      fee: 7000,
      discountFee: 4999,
      rating: 4.9,
      enrolledCount: 310,
      instructor: 'Mr. Amit Kumar (Lead Tech Trainer)',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      badge: 'Govt. Recognized Diploma',
      features: ['100% Practical Lab Training (1:1 PC)', 'MS Office, Word, Excel, PowerPoint', 'Tally Prime with GST & Accounting', 'Job Placement Support'],
      description: 'Empower yourself with high-demand digital and computational skills. Includes practical lab exposure, projects, and verifiable certification.',
      isPaid: true,
      schedule: 'Flexible Batches (Morning / Evening / Weekend)'
    },
    {
      id: 'c-english-fluency',
      title: 'Spoken English & Public Speaking Masterclass',
      category: 'spoken',
      targetClass: 'Open for All Age Groups',
      duration: '3 Months Intensive Bootcamp',
      fee: 4000,
      discountFee: 2499,
      rating: 4.8,
      enrolledCount: 185,
      instructor: 'Ms. Priyanshi Saxena (Communication Coach)',
      image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
      badge: 'Confidence Booster',
      features: ['Daily Group Discussions & Debates', 'Accent & Vocabulary Enhancement', 'Hesitation Removal & Stage Speech', 'Interview & Resume Prep'],
      description: 'Overcome fear and hesitation. Speak fluent, confident English in public, school, college, and professional job interviews.',
      isPaid: true,
      schedule: 'Mon - Fri | 7:00 PM - 8:15 PM'
    }
  ],
  studyMaterials: [
    {
      id: 'admin-verified-c10-math',
      title: 'Class 10 Mathematics: Real Numbers Board Notes',
      category: 'pdf_notes',
      targetClass: 'Class 10',
      subject: 'Mathematics',
      chapter: 'Chapter 1',
      pages: 18,
      downloadUrl: '/assets/sample_notes.pdf',
      googleDriveUrl: 'https://drive.google.com/file/d/12345/preview',
      isGoogleDrive: true,
      isPremium: false,
      fileType: 'pdf',
      dateAdded: '2026-10-06',
      downloadsCount: 5,
      previewContent: 'Real Numbers and Euclidean Division Lemma notes for Class 10.'
    }
  ],
  videos: [
    {
      id: 'vid-1',
      title: 'Class 10 Science: Complete Chemical Reactions in 1 Shot | Full Chapter Marathon',
      subject: 'Science (Chemistry)',
      targetClass: 'Class 10',
      duration: '48:30',
      youtubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
      platform: 'youtube',
      videoId: 'kJQP7kiw5Fk',
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
      instructor: 'Aman Arora',
      views: '18.4K views',
      isFeatured: true
    },
    {
      id: 'vid-2',
      title: 'Class 10 Maths: Real Numbers & Polynomials Most Repeated Board Questions',
      subject: 'Mathematics',
      targetClass: 'Class 10',
      duration: '35:15',
      youtubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
      platform: 'youtube',
      videoId: 'kJQP7kiw5Fk',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&auto=format&fit=crop&q=80',
      instructor: 'Mr. Rajesh Verma',
      views: '12.9K views',
      isFeatured: true
    }
  ],
  notices: [
    {
      id: 'not-1',
      title: 'Admission Open for Session 2026-2027 (Scholarship Test on Sunday)',
      date: '2026-08-20',
      category: 'admission',
      description: 'Admissions are now open for Classes 1 to 12, Computer DCA/ADCA, and Spoken English. Early bird scholarship test offers up to 50% discount on tuition fees.',
      isImportant: true,
      badgeText: 'ADMISSIONS OPEN'
    },
    {
      id: 'not-2',
      title: 'Class 10 & 12 Pre-Board Mock Exam Schedule Released',
      date: '2026-08-18',
      category: 'exam',
      description: 'The Phase-1 Mock Board Examination will commence from 5th September. Timing: 9:00 AM to 12:15 PM.',
      isImportant: true,
      badgeText: 'EXAM ALERT'
    }
  ],
  gallery: [
    {
      id: 'gal-1',
      title: 'Annual Felicitation & Merit Award Ceremony 2026',
      category: 'toppers',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
      date: 'July 2026',
      description: 'Awarding gold medals and scholarships to 10th and 12th board state rankers.'
    },
    {
      id: 'gal-2',
      title: 'Interactive Smart Classroom in Session',
      category: 'classroom',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
      date: 'August 2026',
      description: 'Modern digital smart boards making concepts vivid and clear.'
    },
    {
      id: 'gal-3',
      title: 'High-Tech DCA Computer & Tally Lab',
      category: 'lab',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      date: 'August 2026',
      description: 'Dedicated high-speed PC workstations with real-world accounting software.'
    }
  ],
  instagramPosts: [
    {
      id: 'ig-1',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
      caption: 'Celebration of District Toppers at L.C.C. Annual Felicitation Day! Proud moments ❤️🎉',
      likes: 1420,
      comments: 88,
      postUrl: 'https://instagram.com/lcc_coaching_official',
      timestamp: '2 days ago'
    },
    {
      id: 'ig-2',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      caption: 'Hands-on practical session in our advanced computer lab! Students mastering Tally Prime & GST Billing. 💻✨',
      likes: 980,
      comments: 42,
      postUrl: 'https://instagram.com/lcc_coaching_official',
      timestamp: '4 days ago'
    },
    {
      id: 'ig-3',
      imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?w=800&auto=format&fit=crop&q=80',
      caption: 'Spoken English stage debate on "AI in Modern Education" by Aman Arora. Great energy in class today! 🔥🎙️',
      likes: 1250,
      comments: 67,
      postUrl: 'https://instagram.com/lcc_coaching_official',
      timestamp: '1 week ago'
    }
  ],
  syllabus: [
    {
      id: 'syl-10-sci',
      targetClass: 'Class 10',
      subject: 'Science',
      examBoard: 'CBSE & State Board',
      totalMarks: 100,
      academicYear: '2026-2027',
      pdfUrl: '#',
      chapters: [
        { name: 'Chemical Reactions and Equations', subtopics: ['Types of Reactions', 'Balancing Equations', 'Corrosion & Rancidity'], weightage: '6 Marks', estimatedHours: 12 },
        { name: 'Acids, Bases and Salts', subtopics: ['pH Scale', 'Indicators', 'Salts Preparation'], weightage: '6 Marks', estimatedHours: 10 },
        { name: 'Metals and Non-Metals', subtopics: ['Reactivity Series', 'Ionic Bonds', 'Metallurgy'], weightage: '7 Marks', estimatedHours: 14 }
      ]
    },
    {
      id: 'syl-10-maths',
      targetClass: 'Class 10',
      subject: 'Mathematics',
      examBoard: 'CBSE & State Board',
      totalMarks: 100,
      academicYear: '2026-2027',
      pdfUrl: '#',
      chapters: [
        { name: 'Real Numbers', subtopics: ['Fundamental Theorem of Arithmetic', 'Irrationality Proofs'], weightage: '6 Marks', estimatedHours: 8 },
        { name: 'Polynomials', subtopics: ['Geometrical Meaning of Zeroes', 'Relationship of Coefficients'], weightage: '4 Marks', estimatedHours: 8 },
        { name: 'Trigonometry', subtopics: ['Trigonometric Ratios', 'Standard Angles (0-90)', 'Trigonometric Identities'], weightage: '12 Marks', estimatedHours: 18 }
      ]
    }
  ],
  ads: [
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
  ],
  reviews: [
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
    }
  ],
  socialLinks: [
    { id: 'soc-yt', platform: 'youtube', label: 'YouTube Channel', url: 'https://youtube.com/@lcc-coaching', isEnabled: true },
    { id: 'soc-ig', platform: 'instagram', label: 'Instagram Handle', url: 'https://instagram.com/lcc_coaching_official', isEnabled: true },
    { id: 'soc-wa', platform: 'whatsapp', label: 'WhatsApp Official Helpdesk', url: 'https://wa.me/919876543210', isEnabled: true },
    { id: 'soc-fb', platform: 'facebook', label: 'Facebook Page', url: 'https://facebook.com/lcc.coaching', isEnabled: true }
  ],
  settings: {
    instituteName: 'Learning Coaching Center (L.C.C.)',
    shortName: 'L.C.C.',
    instituteTagline: 'Learning Coaching Center',
    logoUrl: '/logo.jpg',
    faviconUrl: '/logo.jpg',
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
    razorpayKeyId: process.env.RAZORPAY_KEY_ID || 'rzp_live_TbWh7wBlq0NQuz'
  },
  inquiries: [],
  branchAdmissions: [
    {
      id: 'adm-demo-1',
      studentName: 'Rohan Gupta',
      parentName: 'Sanjay Gupta',
      phone: '+919876500001',
      email: 'rohan.gupta@gmail.com',
      targetClass: 'Class 10',
      courseName: 'Board Exam Ace: Class 9 & 10 Target 95%+',
      branch: 'Palahipatti Main Campus (Sindhora Rd)',
      assignedTeacherId: 'staff-rajesh',
      assignedTeacherName: 'Rajesh Verma (Senior Faculty)',
      admissionType: 'Enrolled',
      feesPaid: 6999,
      notes: 'Completed admission with full fee payment. Started in batch A.',
      date: new Date().toISOString().split('T')[0],
      status: 'Active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'adm-demo-2',
      studentName: 'Priya Tiwari',
      parentName: 'Manoj Tiwari',
      phone: '+919876500002',
      email: 'priya.t@gmail.com',
      targetClass: 'Class 8',
      courseName: 'Middle School Mastery: Class 6 to 8',
      branch: 'Sindhora Market Branch',
      assignedTeacherId: 'staff-ananya',
      assignedTeacherName: 'Mrs. Ananya Sharma',
      admissionType: 'Visited',
      feesPaid: 0,
      notes: 'Visited campus for inquiry with father. Requested trial class on Monday.',
      date: new Date().toISOString().split('T')[0],
      status: 'Active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'adm-demo-3',
      studentName: 'Vikas Maurya',
      parentName: 'Ramesh Maurya',
      phone: '+919876500003',
      email: 'vikas.m@gmail.com',
      targetClass: 'Class 12',
      courseName: 'Senior Secondary Excellence: Class 11 & 12',
      branch: 'Babatpur City Center',
      assignedTeacherId: 'staff-amit',
      assignedTeacherName: 'Amit Kumar',
      admissionType: 'Enrolled',
      feesPaid: 8499,
      notes: 'Admission confirmed. Preparing for JEE & CBSE boards.',
      date: new Date().toISOString().split('T')[0],
      status: 'Active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'adm-demo-4',
      studentName: 'Sneha Patel',
      parentName: 'Devendra Patel',
      phone: '+919876500004',
      email: 'sneha.p@gmail.com',
      targetClass: 'Class 5',
      courseName: 'Junior Champs: Class 1 to 5 Foundation',
      branch: 'Palahipatti Main Campus (Sindhora Rd)',
      assignedTeacherId: 'staff-rajesh',
      assignedTeacherName: 'Rajesh Verma (Senior Faculty)',
      admissionType: 'Visited',
      feesPaid: 0,
      notes: 'Visited for demo class inquiry. Promised to join next month.',
      date: new Date().toISOString().split('T')[0],
      status: 'Active',
      createdAt: new Date().toISOString()
    }
  ],
  staffAttendance: [
    {
      id: 'att-rajesh-today',
      staffId: 'staff-rajesh',
      staffName: 'Rajesh Verma (Senior Faculty)',
      staffEmail: 'rajesh@lcc.edu',
      branch: 'Palahipatti Main Campus (Sindhora Rd)',
      date: new Date().toISOString().split('T')[0],
      status: 'Present',
      reason: '',
      checkInTime: '08:45 AM',
      createdAt: new Date().toISOString()
    },
    {
      id: 'att-ananya-today',
      staffId: 'staff-ananya',
      staffName: 'Mrs. Ananya Sharma',
      staffEmail: 'ananya@lcc.edu',
      branch: 'Sindhora Market Branch',
      date: new Date().toISOString().split('T')[0],
      status: 'On Leave',
      reason: 'Urgent medical & personal leave approved by Director',
      checkInTime: 'N/A',
      createdAt: new Date().toISOString()
    },
    {
      id: 'att-amit-today',
      staffId: 'staff-amit',
      staffName: 'Amit Kumar',
      staffEmail: 'amit@lcc.edu',
      branch: 'Babatpur City Center',
      date: new Date().toISOString().split('T')[0],
      status: 'Present',
      reason: '',
      checkInTime: '09:00 AM',
      createdAt: new Date().toISOString()
    }
  ],
  teacherTasks: [
    {
      id: 'task-seed-1',
      title: 'Conduct Class 10 Trigonometry Mock Assessment',
      description: 'Prepare and administer 50-mark test for Board Exam Ace batch and evaluate answer sheets.',
      assignedToStaffId: 'staff-rajesh',
      assignedToStaffName: 'Rajesh Verma (Senior Faculty)',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'High',
      status: 'Completed',
      reportNote: 'Mock test successfully conducted with 18 students. Top score was 48/50. Identified 3 students needing revision in Identities.',
      submittedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    },
    {
      id: 'task-seed-2',
      title: 'Class 8 Science Foundation Lab Session & Parent Call',
      description: 'Cover Chemical Effects of Current experiment and follow up with parents of visited leads.',
      assignedToStaffId: 'staff-ananya',
      assignedToStaffName: 'Mrs. Ananya Sharma',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'Normal',
      status: 'Pending',
      reportNote: '',
      submittedAt: '',
      createdAt: new Date().toISOString()
    }
  ],
  studentAttendance: [
    {
      id: 'st-att-demo-1',
      studentId: 'adm-demo-1',
      studentName: 'Rohan Gupta',
      teacherId: 'staff-rajesh',
      branch: 'Palahipatti Main Campus (Sindhora Rd)',
      date: new Date().toISOString().split('T')[0],
      status: 'Present',
      reason: '',
      recordedAt: new Date().toISOString()
    },
    {
      id: 'st-att-demo-2',
      studentId: 'adm-demo-3',
      studentName: 'Vikas Maurya',
      teacherId: 'staff-amit',
      branch: 'Babatpur City Center',
      date: new Date().toISOString().split('T')[0],
      status: 'Present',
      reason: '',
      recordedAt: new Date().toISOString()
    }
  ]
};

// In-memory cache fallback for serverless execution
let memoryDB = null;

// Initialize DB file fallback safely without throwing on read-only environments
export const initStorage = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      memoryDB = JSON.parse(raw);
      return;
    }
    // Check if default seed file exists
    if (fs.existsSync(DEFAULT_SEED_FILE)) {
      const raw = fs.readFileSync(DEFAULT_SEED_FILE, 'utf8');
      memoryDB = JSON.parse(raw);
    } else {
      memoryDB = { ...defaultData };
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryDB, null, 2), 'utf8');
  } catch (err) {
    // If filesystem write fails, keep memory cache safe
    if (!memoryDB) memoryDB = { ...defaultData };
  }
};

initStorage();

const DEFAULT_ATLAS_URI = 'mongodb+srv://rebelrebel766_db_user:TeJziU1lXTZS3nru@cluster0.n6izs7f.mongodb.net/lcc_coaching?retryWrites=true&w=majority';

// Cached Mongoose connection promise for serverless functions (Vercel)
let cachedPromise = null;

// Connect to Online MongoDB Atlas with cached connection for Serverless
export const connectOnlineMongoDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return true;
  }

  const mongoUri = process.env.MONGODB_URI || DEFAULT_ATLAS_URI;

  if (!cachedPromise) {
    const opts = {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 5000,
      bufferCommands: false
    };

    cachedPromise = mongoose.connect(mongoUri, opts)
      .then(async (m) => {
        console.log('🍃 [ONLINE CLOUD MONGODB] Connected successfully to MongoDB Atlas Cloud Database!');
        // Ensure all collections exist and are initialized in MongoDB Atlas
        try {
          const collectionsToCheck = [
            { model: UserModel, data: defaultData.users, name: 'users' },
            { model: CourseModel, data: defaultData.courses, name: 'courses' },
            { model: StudyMaterialModel, data: defaultData.studyMaterials, name: 'studyMaterials' },
            { model: VideoModel, data: defaultData.videos, name: 'videos' },
            { model: NoticeModel, data: defaultData.notices, name: 'notices' },
            { model: GalleryModel, data: defaultData.gallery, name: 'gallery' },
            { model: InstagramModel, data: defaultData.instagramPosts, name: 'instagramPosts' },
            { model: SyllabusModel, data: defaultData.syllabus, name: 'syllabus' },
            { model: AdModel, data: defaultData.ads, name: 'ads' },
            { model: ReviewModel, data: defaultData.reviews, name: 'reviews' },
            { model: SocialLinkModel, data: defaultData.socialLinks, name: 'socialLinks' },
            { model: BranchAdmissionModel, data: defaultData.branchAdmissions, name: 'branchAdmissions' },
            { model: StaffAttendanceModel, data: defaultData.staffAttendance, name: 'staffAttendance' },
            { model: TeacherTaskModel, data: defaultData.teacherTasks, name: 'teacherTasks' },
            { model: StudentAttendanceModel, data: defaultData.studentAttendance, name: 'studentAttendance' }
          ];

          for (const item of collectionsToCheck) {
            try {
              const count = await item.model.countDocuments();
              if (count === 0 && item.data && item.data.length > 0) {
                console.log(`🌱 Seeding initial ${item.name} to MongoDB Atlas...`);
                await item.model.insertMany(item.data);
              }
            } catch (colErr) {
              console.warn(`⚠️ Collection seed check note (${item.name}):`, colErr.message);
            }
          }

          try {
            await StudyMaterialModel.deleteMany({
              $or: [
                { id: 'mat-good-manners' },
                { id: 'mat-vocabulary-list' }
              ]
            });
          } catch (e) {}

          try {
            const settingsCount = await SettingModel.countDocuments();
            if (settingsCount === 0) {
              console.log('🌱 Seeding initial settings to MongoDB Atlas...');
              await SettingModel.create(defaultData.settings);
            }
          } catch (setErr) {
            console.warn('⚠️ Settings seed check note:', setErr.message);
          }
        } catch (seedErr) {
          console.warn('⚠️ Seed check error:', seedErr.message);
        }
        return m;
      })
      .catch((err) => {
        cachedPromise = null;
        console.warn('⚠️ [ONLINE MONGODB] Could not connect to MongoDB Atlas:', err.message);
        return null;
      });
  }

  try {
    const conn = await cachedPromise;
    return Boolean(conn && mongoose.connection.readyState === 1);
  } catch (err) {
    cachedPromise = null;
    return false;
  }
};

export const getDB = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      memoryDB = JSON.parse(raw);
      return memoryDB;
    }
  } catch (err) {}
  return memoryDB || defaultData;
};

export const saveDB = (data) => {
  memoryDB = data;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    // Gracefully handle read-only filesystems in serverless without crashing
  }
};
