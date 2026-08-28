import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDB, saveDB } from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'lcc_super_secret_jwt_key_2026_production_safe';

// Generate Token helper
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Normalize phone helper (remove +91, spaces, dashes)
const normalizePhone = (phone) => {
  if (!phone) return '';
  return phone.replace(/[^0-9]/g, '').slice(-10);
};

// 1. Student Registration
export const register = (req, res) => {
  const { name, email, phone, password, targetClass } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ success: false, message: 'All required fields (Name, Email, Phone, Password) must be provided.' });
  }

  const db = getDB();
  const existingUser = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    phone: phone.trim(),
    passwordHash: bcrypt.hashSync(password, 10),
    role: 'student',
    targetClass: targetClass || 'Class 10',
    createdAt: new Date().toISOString(),
    isActive: true
  };

  db.users.push(newUser);
  saveDB(db);

  const token = generateToken(newUser);
  const { passwordHash, ...safeUser } = newUser;

  res.status(201).json({
    success: true,
    message: 'Student account created successfully!',
    token,
    user: safeUser
  });
};

// 2. Student Login
export const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
  }

  const db = getDB();
  const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());

  if (!user || !user.isActive) {
    return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
  }

  const token = generateToken(user);
  const { passwordHash, ...safeUser } = user;

  res.json({
    success: true,
    message: `Welcome back, ${user.name}!`,
    token,
    user: safeUser
  });
};

// 3. Admin Login
export const adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Admin email and password are required.' });
  }

  const db = getDB();
  const admin = db.users.find(
    u => (u.email.toLowerCase() === email.toLowerCase().trim() || u.email === 'admin@lcc.edu') && u.role === 'admin'
  );

  if (!admin) {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials or unauthorized account.' });
  }

  const isMatch = bcrypt.compareSync(password, admin.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
  }

  const token = generateToken(admin);
  const { passwordHash, ...safeAdmin } = admin;

  res.json({
    success: true,
    message: 'Admin authorization successful.',
    token,
    admin: safeAdmin
  });
};

// 4. Forgot Password (Initiate WhatsApp / SMS OTP)
export const forgotPassword = (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ success: false, message: 'Please provide your registered mobile number.' });
  }

  const normalizedInput = normalizePhone(phone);
  const db = getDB();

  // Find user by normalized 10-digit phone
  const user = db.users.find(u => normalizePhone(u.phone) === normalizedInput);

  // Anti-enumeration: Generic response even if not found
  if (!user) {
    return res.json({
      success: true,
      message: 'If an account exists with this mobile number, a 6-digit verification code has been dispatched via WhatsApp / SMS.',
      sessionMobile: normalizedInput
    });
  }

  // Generate 6-digit random secure OTP
  const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = bcrypt.hashSync(rawOtp, 8);
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes validity

  // Remove existing pending sessions for this mobile
  db.otpSessions = db.otpSessions.filter(s => s.mobile !== normalizedInput);
  db.otpSessions.push({
    mobile: normalizedInput,
    userId: user.id,
    otpHash,
    expiresAt,
    attempts: 0
  });

  saveDB(db);

  // In production, dispatch via WhatsApp Business API / Twilio
  // For local demonstration and offline testing, return delivery notification with hint
  console.log(`📱 [WHATSAPP OTP DISPATCHER] To: +91${normalizedInput} | OTP Code: ${rawOtp} (Valid for 5 mins)`);

  res.json({
    success: true,
    message: `A 6-digit verification code has been dispatched to WhatsApp (+91 ${normalizedInput}).`,
    sessionMobile: normalizedInput,
    // Debug helper for testing in development mode
    devOtpHint: process.env.NODE_ENV === 'development' ? rawOtp : undefined
  });
};

// 5. Verify OTP
export const verifyOTP = (req, res) => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    return res.status(400).json({ success: false, message: 'Mobile number and 6-digit OTP code are required.' });
  }

  const normalizedInput = normalizePhone(mobile);
  const db = getDB();
  const session = db.otpSessions.find(s => s.mobile === normalizedInput);

  if (!session) {
    return res.status(400).json({ success: false, message: 'No active verification session found. Please request a new OTP.' });
  }

  if (Date.now() > session.expiresAt) {
    db.otpSessions = db.otpSessions.filter(s => s.mobile !== normalizedInput);
    saveDB(db);
    return res.status(400).json({ success: false, message: 'OTP verification code has expired. Please request a new one.' });
  }

  if (session.attempts >= 3) {
    db.otpSessions = db.otpSessions.filter(s => s.mobile !== normalizedInput);
    saveDB(db);
    return res.status(429).json({ success: false, message: 'Maximum attempts exceeded. Please request a new OTP.' });
  }

  const isOtpValid = bcrypt.compareSync(otp.toString().trim(), session.otpHash);
  if (!isOtpValid) {
    session.attempts += 1;
    saveDB(db);
    return res.status(400).json({ success: false, message: `Invalid OTP. ${3 - session.attempts} attempts remaining.` });
  }

  // Generate temporary reset token valid for 10 mins
  const resetToken = jwt.sign(
    { userId: session.userId, mobile: normalizedInput, purpose: 'password_reset' },
    JWT_SECRET,
    { expiresIn: '10m' }
  );

  // Clear used OTP session
  db.otpSessions = db.otpSessions.filter(s => s.mobile !== normalizedInput);
  saveDB(db);

  res.json({
    success: true,
    message: 'Mobile number verified successfully!',
    resetToken
  });
};

// 6. Reset Password
export const resetPassword = (req, res) => {
  const { resetToken, newPassword } = req.body;

  if (!resetToken || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'Please provide a valid new password (minimum 6 characters).' });
  }

  try {
    const decoded = jwt.verify(resetToken, JWT_SECRET);
    if (decoded.purpose !== 'password_reset') {
      return res.status(400).json({ success: false, message: 'Invalid reset authorization token.' });
    }

    const db = getDB();
    const user = db.users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User account not found.' });
    }

    user.passwordHash = bcrypt.hashSync(newPassword, 10);
    saveDB(db);

    res.json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.'
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: 'Password reset session has expired or is invalid. Please start again.' });
  }
};

// 7. Get All Users (Admin Only)
export const getUsers = (req, res) => {
  const db = getDB();
  const safeUsers = db.users.map(({ passwordHash, ...u }) => u);
  res.json({ success: true, data: safeUsers });
};

// 8. Toggle User Active Status (Admin Only)
export const toggleUserStatus = (req, res) => {
  const { id } = req.params;
  const db = getDB();
  const user = db.users.find(u => u.id === id);

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  if (user.role === 'admin') {
    return res.status(400).json({ success: false, message: 'Cannot deactivate master admin account.' });
  }

  user.isActive = !user.isActive;
  saveDB(db);

  res.json({
    success: true,
    message: `User status changed to ${user.isActive ? 'Active' : 'Inactive'}.`,
    user: { id: user.id, isActive: user.isActive }
  });
};
