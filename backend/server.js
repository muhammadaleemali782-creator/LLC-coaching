import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './src/routes/authRoutes.js';
import adsRoutes from './src/routes/adsRoutes.js';
import mediaRoutes from './src/routes/mediaRoutes.js';
import reviewsRoutes from './src/routes/reviewsRoutes.js';
import socialRoutes from './src/routes/socialRoutes.js';
import settingsRoutes from './src/routes/settingsRoutes.js';
import coursesRoutes from './src/routes/coursesRoutes.js';
import { getDB, connectOnlineMongoDB } from './src/config/db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Storage & Online Cloud MongoDB Atlas
getDB();
connectOnlineMongoDB();

// Security & Middleware
app.use(cors({
  origin: '*', // Allows Vercel preview & local development
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    institute: 'Lakshya Career Classes (L.C.C.)',
    version: '2.0.0-production',
    database: process.env.MONGODB_URI ? 'MongoDB Atlas (Online Cloud)' : 'Persistent JSON Engine',
    timestamp: new Date().toISOString()
  });
});

// REST API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/ads', adsRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/socials', socialRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/courses', coursesRoutes);

// Inquiries Endpoint
app.get('/api/inquiries', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.inquiries || [] });
});

app.post('/api/inquiries', (req, res) => {
  const db = getDB();
  const inquiry = {
    id: `inq-${Date.now()}`,
    ...req.body,
    date: new Date().toISOString().split('T')[0],
    status: 'New'
  };
  if (!db.inquiries) db.inquiries = [];
  db.inquiries.unshift(inquiry);
  res.status(201).json({ success: true, message: 'Inquiry received. Counseling desk will contact you.', data: inquiry });
});

// Notices Endpoint
app.get('/api/notices', (req, res) => {
  const db = getDB();
  res.json({ success: true, data: db.notices || [] });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Endpoint not found.' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error occurred.' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 L.C.C. Production Backend API active on port ${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
});
