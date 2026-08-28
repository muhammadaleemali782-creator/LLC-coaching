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
import noticesRoutes from './src/routes/noticesRoutes.js';
import galleryRoutes from './src/routes/galleryRoutes.js';
import instagramRoutes from './src/routes/instagramRoutes.js';
import syllabusRoutes from './src/routes/syllabusRoutes.js';
import { getDB, saveDB, connectOnlineMongoDB, InquiryModel } from './src/config/db.js';
import mongoose from 'mongoose';

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
  origin: '*',
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
app.use('/api/notices', noticesRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/instagram', instagramRoutes);
app.use('/api/syllabus', syllabusRoutes);

// Inquiries Endpoints
app.get('/api/inquiries', async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const inquiries = await InquiryModel.find().sort({ _id: -1 });
      return res.json({ success: true, data: inquiries });
    }
    const db = getDB();
    res.json({ success: true, data: db.inquiries || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/inquiries', async (req, res) => {
  try {
    const inquiry = {
      id: `inq-${Date.now()}`,
      ...req.body,
      date: new Date().toISOString().split('T')[0],
      status: 'New'
    };
    if (mongoose.connection.readyState === 1) {
      const created = await InquiryModel.create(inquiry);
      return res.status(201).json({ success: true, message: 'Inquiry received. Counseling desk will contact you.', data: created });
    }
    const db = getDB();
    if (!db.inquiries) db.inquiries = [];
    db.inquiries.unshift(inquiry);
    saveDB(db);
    res.status(201).json({ success: true, message: 'Inquiry received. Counseling desk will contact you.', data: inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.patch('/api/inquiries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (mongoose.connection.readyState === 1) {
      const updated = await InquiryModel.findOneAndUpdate({ id }, { status }, { new: true });
      return res.json({ success: true, message: 'Inquiry status updated', data: updated });
    }
    const db = getDB();
    const inq = (db.inquiries || []).find(i => i.id === id);
    if (inq) inq.status = status;
    saveDB(db);
    res.json({ success: true, message: 'Inquiry status updated', data: inq });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
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
