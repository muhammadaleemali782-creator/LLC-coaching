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

const router = express.Router();

router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyRazorpayPayment);
router.post('/manual-utr', submitManualUTR);
router.get('/transactions', getTransactions);
router.patch('/transactions/:id/approve', approveTransaction);
router.patch('/transactions/:id/reject', rejectTransaction);
router.post('/webhook', handleRazorpayWebhook);

export default router;
