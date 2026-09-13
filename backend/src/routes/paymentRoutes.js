import express from 'express';
import { verifyRazorpayPayment, submitManualUTR, getTransactions, handleRazorpayWebhook } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/verify', verifyRazorpayPayment);
router.post('/manual-utr', submitManualUTR);
router.get('/transactions', getTransactions);
router.post('/webhook', handleRazorpayWebhook);

export default router;
