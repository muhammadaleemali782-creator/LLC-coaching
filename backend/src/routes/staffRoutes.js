import express from 'express';
import {
  getStaffList,
  createStaff,
  getAttendance,
  markAttendance,
  getAdmissions,
  createAdmission,
  getDashboardStats
} from '../controllers/staffController.js';

const router = express.Router();

// Staff accounts & directory
router.get('/', getStaffList);
router.post('/', createStaff);

// Staff Attendance
router.get('/attendance', getAttendance);
router.post('/attendance', markAttendance);

// Student Branch Admissions & Visits
router.get('/admissions', getAdmissions);
router.post('/admissions', createAdmission);

// Consolidated Dashboard & Stats for Admin and Branch Analytics
router.get('/stats', getDashboardStats);

export default router;
