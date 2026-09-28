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

const router = express.Router();

// Staff accounts & directory
router.get('/', getStaffList);
router.post('/', createStaff);
router.put('/:id', updateStaff);
router.post('/reset-password', resetStaffPassword);

// Staff Attendance
router.get('/attendance', getAttendance);
router.post('/attendance', markAttendance);

// Student Branch Admissions & Visits
router.get('/admissions', getAdmissions);
router.post('/admissions', createAdmission);

// Consolidated Dashboard & Stats for Admin and Branch Analytics
router.get('/stats', getDashboardStats);

// Tasks & Work Reports
router.get('/tasks', getTeacherTasks);
router.post('/tasks', createTeacherTask);
router.post('/tasks/report', submitTeacherTaskReport);

// Student Daily Attendance & Leaves
router.get('/student-attendance', getStudentAttendance);
router.post('/student-attendance', markStudentAttendance);

export default router;
