import express from 'express';
import { register, login, adminLogin, forgotPassword, verifyOTP, resetPassword, getUsers, toggleUserStatus, adminResetPassword, updatePassword } from '../controllers/authController.js';
import { requireAdmin, verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.post('/update-password', updatePassword);

// Admin user management
router.get('/users', requireAdmin, getUsers);
router.patch('/users/:id/toggle', requireAdmin, toggleUserStatus);
router.post('/users/:id/reset-password', requireAdmin, adminResetPassword);

export default router;
