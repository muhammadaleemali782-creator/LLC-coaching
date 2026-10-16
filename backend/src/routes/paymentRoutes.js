import express from 'express';
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  submitManualUTR,
  getTransactions,
  handleRazorpayWebhook,
  approveTransaction,
  rejectTransaction
} from '../controllers/paymentController.js';
import { requireAdmin, verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyRazorpayPayment);
router.post('/manual-utr', submitManualUTR);
router.get('/transactions', requireAdmin, getTransactions);
router.patch('/transactions/:id/approve', requireAdmin, approveTransaction);
router.patch('/transactions/:id/reject', requireAdmin, rejectTransaction);
router.post('/webhook', handleRazorpayWebhook);

export default router;
