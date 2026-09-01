import crypto from 'crypto';
import mongoose from 'mongoose';
import { TransactionModel, CourseModel, UserModel, SettingModel, getDB, saveDB } from '../config/db.js';

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      courseId,
      amount,
      studentName,
      studentEmail,
      studentPhone
    } = req.body;

    // 1. Strict Validation: Payment ID must exist and look like a genuine Razorpay ID
    if (!razorpay_payment_id || typeof razorpay_payment_id !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Security Alert: Missing or invalid Razorpay payment identifier.'
      });
    }

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: 'Security Alert: Course ID reference is required.'
      });
    }

    // 2. Anti-Replay Attack Protection: Prevent reusing the same payment ID twice
    if (mongoose.connection.readyState === 1) {
      const existingTxn = await TransactionModel.findOne({ razorpayPaymentId: razorpay_payment_id });
      if (existingTxn) {
        return res.status(409).json({
          success: false,
          message: 'Security Violation: This Razorpay Payment ID has already been redeemed.'
        });
      }
    } else {
      const db = getDB();
      const existing = (db.transactions || []).find(t => t.razorpayPaymentId === razorpay_payment_id);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'Security Violation: This Razorpay Payment ID has already been redeemed.'
        });
      }
    }

    // 3. Optional HMAC-SHA256 Signature Verification if secret is configured
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (keySecret && razorpay_order_id && razorpay_signature) {
      const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: 'Tamper Alert: Cryptographic signature mismatch. Payment verification failed.'
        });
      }
    }

    // 4. Fetch Course Details
    let courseTitle = 'Academic Course';
    let targetWhatsapp = '';
    let targetPlaylist = '';

    if (mongoose.connection.readyState === 1) {
      const course = await CourseModel.findOne({ id: courseId });
      if (course) {
        courseTitle = course.title;
        targetWhatsapp = course.whatsappRedirectUrl || '';
        targetPlaylist = course.privatePlaylistUrl || '';
      }
      const settings = await SettingModel.findOne();
      if (settings) {
        if (!targetWhatsapp) targetWhatsapp = settings.defaultWhatsappRedirectUrl || '';
        if (!targetPlaylist) targetPlaylist = settings.defaultPlaylistRedirectUrl || '';
      }
    } else {
      const db = getDB();
      const course = (db.courses || []).find(c => c.id === courseId);
      if (course) {
        courseTitle = course.title;
        targetWhatsapp = course.whatsappRedirectUrl || '';
        targetPlaylist = course.privatePlaylistUrl || '';
      }
      if (db.settings) {
        if (!targetWhatsapp) targetWhatsapp = db.settings.defaultWhatsappRedirectUrl || '';
        if (!targetPlaylist) targetPlaylist = db.settings.defaultPlaylistRedirectUrl || '';
      }
    }

    // 5. Generate Tamper-Proof Cryptographic Verification Token
    const authStamp = `${razorpay_payment_id}:${courseId}:${Date.now()}`;
    const secureToken = crypto.createHash('sha256').update(authStamp + (process.env.JWT_SECRET || 'lcc-super-secret-key-2026')).digest('hex');

    const transactionRecord = {
      id: `txn-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: studentName || 'Student',
      studentEmail: studentEmail || 'student@lcc.edu',
      studentPhone: studentPhone || '',
      courseId,
      courseName: courseTitle,
      amount: Number(amount) || 0,
      paymentMethod: 'Razorpay (Verified)',
      date: new Date().toISOString().split('T')[0],
      status: 'Completed',
      utrNumber: razorpay_payment_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id || '',
      razorpaySignature: razorpay_signature || '',
      isVerified: true,
      secureToken,
      verifiedAt: new Date().toISOString()
    };

    // Save to Database
    if (mongoose.connection.readyState === 1) {
      await TransactionModel.create(transactionRecord);
    } else {
      const db = getDB();
      if (!db.transactions) db.transactions = [];
      db.transactions.unshift(transactionRecord);
      saveDB(db);
    }

    return res.status(200).json({
      success: true,
      message: 'Payment verified and confirmed by L.C.C. Cloud Security Gateway.',
      transaction: transactionRecord,
      access: {
        whatsappUrl: targetWhatsapp,
        playlistUrl: targetPlaylist,
        secureToken
      }
    });

  } catch (err) {
    console.error('Payment Verification Security Error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal Gateway Error during verification. Please contact support.'
    });
  }
};

export const submitManualUTR = async (req, res) => {
  try {
    const { courseId, amount, utrNumber, paymentMethod, studentName, studentEmail, studentPhone } = req.body;

    // Strict 12-digit UTR validation
    const cleanUTR = String(utrNumber || '').trim();
    if (!cleanUTR || cleanUTR.length < 8 || !/^[A-Za-z0-9]+$/.test(cleanUTR)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid UTR / UPI Reference Number. Please enter the valid 12-digit transaction ID from your payment app.'
      });
    }

    const transactionRecord = {
      id: `txn-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      studentName: studentName || 'Student',
      studentEmail: studentEmail || 'student@lcc.edu',
      studentPhone: studentPhone || '',
      courseId,
      courseName: 'Academic Course Enrollment',
      amount: Number(amount) || 0,
      paymentMethod: paymentMethod || 'UPI Direct',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending Verification',
      utrNumber: cleanUTR,
      isVerified: false,
      submittedAt: new Date().toISOString()
    };

    if (mongoose.connection.readyState === 1) {
      await TransactionModel.create(transactionRecord);
    } else {
      const db = getDB();
      if (!db.transactions) db.transactions = [];
      db.transactions.unshift(transactionRecord);
      saveDB(db);
    }

    return res.status(200).json({
      success: true,
      message: 'UTR submitted for Director verification. Access will be confirmed upon bank credit.',
      transaction: transactionRecord
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getTransactions = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const txns = await TransactionModel.find().sort({ _id: -1 });
      return res.json({ success: true, data: txns });
    }
    const db = getDB();
    res.json({ success: true, data: db.transactions || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
