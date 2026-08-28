import express from 'express';
import { register, login, adminLogin, forgotPassword, verifyOTP, resetPassword, getUsers, toggleUserStatus } from '../controllers/authController.js';
import { requireAdmin, verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

// Admin user management
router.get('/users', requireAdmin, getUsers);
router.patch('/users/:id/toggle', requireAdmin, toggleUserStatus);

export default router;
