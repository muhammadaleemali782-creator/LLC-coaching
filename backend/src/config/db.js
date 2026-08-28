import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '../data/store.json');

// Mongoose Models Schemas
const UserSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: { type: String, unique: true },
  phone: String,
  passwordHash: String,
  role: { type: String, default: 'student' },
  targetClass: String,
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

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
});

const StudyMaterialSchema = new mongoose.Schema({
  id: String,
  title: String,
  category: String,
  targetClass: String,
  subject: String,
  chapter: String,
  pages: Number,
  downloadUrl: String,
  isPremium: Boolean,
  fileType: String,
  dateAdded: String,
  downloadsCount: { type: Number, default: 0 },
  previewContent: String
});

const VideoSchema = new mongoose.Schema({
  id: String,
  title: String,
  youtubeUrl: String,
  videoId: String,
  duration: String,
  views: String,
  subject: String,
  targetClass: String,
  instructor: String,
  isPublished: { type: Boolean, default: true },
  dateAdded: String
});

const ReviewSchema = new mongoose.Schema({
  id: String,
  studentName: String,
  studentClass: String,
  rating: Number,
  comment: String,
  status: { type: String, default: 'pending' },
  date: String
});

const SocialLinkSchema = new mongoose.Schema({
  id: String,
  platform: String,
  label: String,
  url: String,
  isEnabled: { type: Boolean, default: true }
});

const SettingSchema = new mongoose.Schema({
  instituteName: String,
  directorName: String,
  contactPhone: String,
  contactEmail: String,
  contactAddress: String,
  emergencyAlertText: String,
  noticeTickerSpeed: String,
  heroBadgeText: String,
  allowStudentReviews: Boolean,
  maintenanceMode: Boolean
});

const CourseSchema = new mongoose.Schema({
  id: String,
  title: String,
  category: String,
  targetClass: String,
  duration: String,
  fee: Number,
  discountFee: Number,
  rating: Number,
  instructor: String,
  image: String,
  badge: String,
  features: [String],
  description: String
});

export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export const AdModel = mongoose.models.Ad || mongoose.model('Ad', AdSchema);
export const StudyMaterialModel = mongoose.models.StudyMaterial || mongoose.model('StudyMaterial', StudyMaterialSchema);
export const VideoModel = mongoose.models.Video || mongoose.model('Video', VideoSchema);
export const ReviewModel = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
export const SocialLinkModel = mongoose.models.SocialLink || mongoose.model('SocialLink', SocialLinkSchema);
export const SettingModel = mongoose.models.Setting || mongoose.model('Setting', SettingSchema);
export const CourseModel = mongoose.models.Course || mongoose.model('Course', CourseSchema);

// Initial Default Seed Data
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
      id: 'usr-student-1',
      name: 'Aarav Patel',
      email: 'aarav@example.com',
      phone: '9876543210',
      passwordHash: bcrypt.hashSync('Student@123', 10),
      role: 'student',
      targetClass: 'Class 10',
      createdAt: new Date().toISOString(),
      isActive: true
    }
  ],
  otpSessions: [],
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
      imageUrl: '/assets/debate.jpg',
      destinationUrl: '#courses-section',
      placement: 'between_sections',
      badge: 'FEATURED PROGRAM',
      isActive: true,
      priority: 3,
      clicks: 67
    }
  ],
  studyMaterials: [
    {
      id: 'm-1',
      title: 'Class 10 Science Formula & Quick Revision Vault',
      category: 'pdf_notes',
      targetClass: 'Class 10',
      subject: 'Science',
      chapter: 'Chemical Reactions & Equations',
      pages: 18,
      downloadUrl: '/assets/sample_notes.pdf',
      isPremium: false,
      fileType: 'pdf',
      dateAdded: '2026-08-15',
      downloadsCount: 1240,
      previewContent: 'Detailed revision formulas, balance equations, reaction mechanisms, and 10-year board questions.'
    },
    {
      id: 'm-2',
      title: 'Class 12 Physics Complete Derivations Handbook',
      category: 'formulas',
      targetClass: 'Class 12',
      subject: 'Physics',
      chapter: 'Electrostatics & Magnetism',
      pages: 34,
      downloadUrl: '/assets/sample_notes.pdf',
      isPremium: false,
      fileType: 'pdf',
      dateAdded: '2026-08-12',
      downloadsCount: 980,
      previewContent: 'All 45 step-by-step calculus derivations for CBSE & State Boards with high-yield diagrams.'
    },
    {
      id: 'm-3',
      title: 'Computer DCA & Tally Prime Shortcut Keys Cheat Sheet',
      category: 'cheat_sheets',
      targetClass: 'Computer / DCA',
      subject: 'Computer',
      chapter: 'Tally Prime & Accounting Shortcuts',
      pages: 12,
      downloadUrl: '/assets/sample_notes.pdf',
      isPremium: false,
      fileType: 'pdf',
      dateAdded: '2026-08-18',
      downloadsCount: 1560,
      previewContent: 'Master voucher keys (F4-F9), GST calculations, inventory reconciliation, and ledger rules.'
    }
  ],
  videos: [
    {
      id: 'v-1',
      title: 'Trigonometry Zero to Hero Mastery - Class 10 Board Secrets',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoId: 'dQw4w9WgXcQ',
      duration: '45:20',
      views: '12.4K',
      subject: 'Mathematics',
      targetClass: 'Class 10',
      instructor: 'Aman Arora',
      isPublished: true,
      dateAdded: '2026-08-10'
    },
    {
      id: 'v-2',
      title: 'Tally Prime Full Course in 1 Video with Live GST Billing',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoId: 'dQw4w9WgXcQ',
      duration: '1:15:00',
      views: '28.9K',
      subject: 'Computer Science',
      targetClass: 'Computer / DCA',
      instructor: 'Mr. Amit Kumar',
      isPublished: true,
      dateAdded: '2026-08-08'
    },
    {
      id: 'v-3',
      title: 'How to Speak English Confidently Without Hesitation',
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      videoId: 'dQw4w9WgXcQ',
      duration: '32:10',
      views: '18.1K',
      subject: 'Spoken English',
      targetClass: 'All Age Groups',
      instructor: 'Ms. Priyanshi Saxena',
      isPublished: true,
      dateAdded: '2026-08-05'
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
  ],
  socialLinks: [
    { id: 'soc-yt', platform: 'youtube', label: 'YouTube Channel', url: 'https://youtube.com/@lcc-coaching', isEnabled: true },
    { id: 'soc-ig', platform: 'instagram', label: 'Instagram Handle', url: 'https://instagram.com/lcc_coaching_official', isEnabled: true },
    { id: 'soc-wa', platform: 'whatsapp', label: 'WhatsApp Official Helpdesk', url: 'https://wa.me/919876543210', isEnabled: true },
    { id: 'soc-fb', platform: 'facebook', label: 'Facebook Page', url: 'https://facebook.com/lcc.coaching', isEnabled: true }
  ],
  settings: {
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
  },
  courses: [
    {
      id: 'c-1-5',
      title: 'Junior Champs: Class 1 to 5 Foundation Mastery',
      category: 'primary',
      targetClass: 'Class 1–5',
      duration: '1 Year Academic',
      fee: 4000,
      discountFee: 2999,
      rating: 4.9,
      instructor: 'Ms. Sunita Sharma',
      image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
      description: 'A nurturing foundational program designed to build strong cognitive fundamentals, math speed, and reading skills.',
      badge: 'Popular Foundation',
      features: ['Daily Mental Math Practice', 'Reading & Vocabulary Builders', 'Creative Science Activities', 'Weekly Parent Report Cards']
    },
    {
      id: 'c-9-10',
      title: 'Class 9 & 10 Board Exam Ace: Science & Math Mastery',
      category: 'secondary',
      targetClass: 'Class 9–10',
      duration: '1 Year Full Course',
      fee: 9500,
      discountFee: 6999,
      rating: 5.0,
      instructor: 'Aman Arora (Managing Director)',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
      description: 'Comprehensive coaching for CBSE and State Board examinations focusing on step-by-step formula derivations and high-yield question patterns.',
      badge: 'Board Toppers Batch',
      features: ['10-Year Chapterwise PYQs', 'Weekly Sunday Board Mocks', '1:1 Doubt Solving Clinics', 'Printed Color Theory Modules']
    },
    {
      id: 'c-computer-diploma',
      title: 'Professional Computer Diploma (DCA / ADCA / Tally Prime)',
      category: 'computer',
      targetClass: 'All Students & Job Seekers',
      duration: '6 Months to 1 Year',
      fee: 7000,
      discountFee: 4999,
      rating: 4.9,
      instructor: 'Mr. Amit Kumar',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      description: 'Hands-on practical diploma covering MS Office, Advanced Excel, Tally Prime with GST accounting, Internet & Typing.',
      badge: 'Govt. Recognized Diploma',
      features: ['1:1 Dedicated PC Lab Slot', 'ISO 9001:2015 Verified Certificate', 'Live GST Billing Practice', 'Job Placement Guidance']
    },
    {
      id: 'c-english-fluency',
      title: 'Fluent Spoken English & Stage Public Speaking Masterclass',
      category: 'spoken',
      targetClass: 'Open for All Age Groups',
      duration: '3 Months Intensive',
      fee: 4000,
      discountFee: 2499,
      rating: 4.8,
      instructor: 'Ms. Priyanshi Saxena',
      image: '/assets/debate.jpg',
      description: 'Transform your communication skills with real-time stage debates, extempore speeches, and accent correction.',
      badge: 'Confidence Booster',
      features: ['Daily Stage Debates & GDs', 'Grammar & Vocabulary Drills', 'Interview & Presentation Mastery', 'Confidence Building Workshops']
    }
  ],
  notices: [
    {
      id: 'not-1',
      title: 'Admission Open for Session 2026-2027 (Scholarship Test on Sunday)',
      category: 'admission',
      date: '2026-08-20',
      isImportant: true,
      badgeText: 'ADMISSIONS OPEN',
      description: 'Admissions are now open for school batches (1-12), Computer Diplomas, and Spoken English. Early bird 75% discount available.'
    }
  ],
  inquiries: []
};

// Initialize DB file fallback
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
}

// Connect to Online MongoDB Atlas if MONGODB_URI provided
export const connectOnlineMongoDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    console.log('ℹ️ [DATABASE] MONGODB_URI not provided. Operating on persistent local JSON engine.');
    return false;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('🍃 [ONLINE CLOUD MONGODB] Connected successfully to MongoDB Atlas Cloud Database!');
    
    // Seed admin if not present
    const adminCount = await UserModel.countDocuments({ role: 'admin' });
    if (adminCount === 0) {
      console.log('🌱 Seeding initial admin and collections to MongoDB Atlas...');
      await UserModel.insertMany(defaultData.users);
      await AdModel.insertMany(defaultData.ads);
      await StudyMaterialModel.insertMany(defaultData.studyMaterials);
      await VideoModel.insertMany(defaultData.videos);
      await ReviewModel.insertMany(defaultData.reviews);
      await SocialLinkModel.insertMany(defaultData.socialLinks);
      await CourseModel.insertMany(defaultData.courses);
      await SettingModel.create(defaultData.settings);
      console.log('✅ MongoDB Atlas seeded successfully!');
    }
    return true;
  } catch (err) {
    console.warn('⚠️ [ONLINE MONGODB] Could not connect to MongoDB Atlas:', err.message);
    console.log('ℹ️ Falling back to persistent local storage engine.');
    return false;
  }
};

export const getDB = () => {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return defaultData;
  }
};

export const saveDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
};
