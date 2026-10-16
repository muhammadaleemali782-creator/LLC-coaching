import express from 'express';
import {
  getStaffList,
  createStaff,
  resetStaffPassword,
  getAttendance,
  markAttendance,
  getAdmissions,
  createAdmission,
  getDashboardStats,
  getTeacherTasks,
  createTeacherTask,
  submitTeacherTaskReport,
  getStudentAttendance,
  markStudentAttendance,
  updateStaff
} from '../controllers/staffController.js';
import { requireAdmin, requireStaffOrAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Staff accounts & directory (Admin only for creation/modifications)
router.get('/', requireStaffOrAdmin, getStaffList);
router.post('/', requireAdmin, createStaff);
router.put('/:id', requireAdmin, updateStaff);
router.post('/reset-password', requireAdmin, resetStaffPassword);

// Staff Attendance
router.get('/attendance', requireStaffOrAdmin, getAttendance);
router.post('/attendance', requireStaffOrAdmin, markAttendance);

// Student Branch Admissions & Visits
router.get('/admissions', requireStaffOrAdmin, getAdmissions);
router.post('/admissions', requireStaffOrAdmin, createAdmission);

// Consolidated Dashboard & Stats for Admin and Branch Analytics
router.get('/stats', requireStaffOrAdmin, getDashboardStats);

// Tasks & Work Reports
router.get('/tasks', requireStaffOrAdmin, getTeacherTasks);
router.post('/tasks', requireStaffOrAdmin, createTeacherTask);
router.post('/tasks/report', requireStaffOrAdmin, submitTeacherTaskReport);

// Student Daily Attendance & Leaves
router.get('/student-attendance', requireStaffOrAdmin, getStudentAttendance);
router.post('/student-attendance', requireStaffOrAdmin, markStudentAttendance);

export default router;
