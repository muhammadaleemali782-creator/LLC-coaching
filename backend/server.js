import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-Memory Database (Ready to connect with MongoDB / PostgreSQL / Prisma)
let courses = [
  {
    id: 'c-1-5',
    title: 'Primary Foundation (Classes 1 to 5)',
    category: 'primary',
    targetClass: 'Class 1–5',
    fee: 4000,
    discountFee: 2999,
    rating: 4.9,
    instructor: 'Ms. Sunita Sharma',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    badge: 'Foundation Batch'
  },
  {
    id: 'c-9-10',
    title: 'Class 9 & 10 Board Excellence Mastery Batch',
    category: 'secondary',
    targetClass: 'Class 9–10',
    fee: 8000,
    discountFee: 5999,
    rating: 5.0,
    instructor: 'Aman Arora (Managing Director)',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    badge: 'Most Popular'
  },
  {
    id: 'c-computer-diploma',
    title: 'Master Computer Diploma (DCA / ADCA / Tally Prime)',
    category: 'computer',
    targetClass: 'All Students & Job Aspirants',
    fee: 7000,
    discountFee: 4999,
    rating: 4.9,
    instructor: 'Mr. Amit Kumar',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    badge: 'Govt. Recognized Diploma'
  },
  {
    id: 'c-english-fluency',
    title: 'Spoken English & Public Speaking Masterclass',
    category: 'spoken',
    targetClass: 'Open for All Age Groups',
    fee: 4000,
    discountFee: 2499,
    rating: 4.8,
    instructor: 'Ms. Priyanshi Saxena',
    image: '/assets/debate.jpg',
    badge: 'Confidence Booster'
  }
];

let inquiries = [];
let notices = [
  {
    id: 'not-1',
    title: 'Admission Open for Session 2026-2027 (Scholarship Test on Sunday)',
    category: 'admission',
    date: '2026-08-20',
    isImportant: true,
    badgeText: 'ADMISSIONS OPEN',
    description: 'Admissions are now open for school batches (1-12), Computer Diplomas, and Spoken English. Early bird 75% discount available.'
  }
];

// Health Route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'L.C.C. Coaching Backend API is running perfectly!' });
});

// Courses API
app.get('/api/courses', (req, res) => {
  res.json({ success: true, data: courses });
});

app.post('/api/courses', (req, res) => {
  const newCourse = { id: `c-${Date.now()}`, ...req.body };
  courses.unshift(newCourse);
  res.status(201).json({ success: true, message: 'Course created successfully', data: newCourse });
});

app.delete('/api/courses/:id', (req, res) => {
  courses = courses.filter(c => c.id !== req.params.id);
  res.json({ success: true, message: 'Course deleted successfully' });
});

// Inquiries API
app.get('/api/inquiries', (req, res) => {
  res.json({ success: true, data: inquiries });
});

app.post('/api/inquiries', (req, res) => {
  const inquiry = {
    id: `inq-${Date.now()}`,
    ...req.body,
    date: new Date().toISOString().split('T')[0],
    status: 'New'
  };
  inquiries.unshift(inquiry);
  res.status(201).json({ success: true, message: 'Inquiry received. Counseling desk will contact you.', data: inquiry });
});

// Notices API
app.get('/api/notices', (req, res) => {
  res.json({ success: true, data: notices });
});

app.post('/api/notices', (req, res) => {
  const newNotice = {
    id: `not-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    ...req.body
  };
  notices.unshift(newNotice);
  res.status(201).json({ success: true, data: newNotice });
});

// Admin Auth Route
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  if (password === 'admin123' || password === process.env.ADMIN_PASSWORD) {
    return res.json({ success: true, message: 'Admin authorized', token: 'mock-jwt-admin-token' });
  }
  return res.status(401).json({ success: false, message: 'Invalid Admin Password' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 L.C.C. Backend Server running on port ${PORT}`);
});
