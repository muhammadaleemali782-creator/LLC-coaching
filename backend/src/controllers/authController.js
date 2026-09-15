import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDB, saveDB, UserModel } from '../config/db.js';
import mongoose from 'mongoose';

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
export const register = async (req, res) => {
  const { name, email, phone, password, targetClass } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ success: false, message: 'All required fields (Name, Email, Phone, Password) must be provided.' });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    if (mongoose.connection.readyState === 1) {
      const existing = await UserModel.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
      }

      const newUser = await UserModel.create({
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        passwordHash: bcrypt.hashSync(password, 10),
        role: 'student',
        targetClass: targetClass || 'Class 10',
        createdAt: new Date(),
        isActive: true
      });

      const token = generateToken(newUser);
      return res.status(201).json({
        success: true,
        message: 'Student account created successfully!',
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone, role: newUser.role, targetClass: newUser.targetClass }
      });
    }
  } catch (err) {}

  const db = getDB();
  const existingUser = (db.users || []).find(u => u.email.toLowerCase() === cleanEmail);
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    phone: phone.trim(),
    passwordHash: bcrypt.hashSync(password, 10),
    role: 'student',
    targetClass: targetClass || 'Class 10',
    createdAt: new Date().toISOString(),
    isActive: true
  };

  if (!db.users) db.users = [];
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
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide both email and password.' });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    if (mongoose.connection.readyState === 1) {
      const user = await UserModel.findOne({ email: cleanEmail });
      if (user && user.isActive) {
        const isMatch = bcrypt.compareSync(password, user.passwordHash) || (user.tempPassword && password === user.tempPassword);
        if (isMatch) {
          const token = generateToken(user);
          return res.json({
            success: true,
            message: `Welcome back, ${user.name}!`,
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              role: user.role,
              targetClass: user.targetClass,
              enrolledCourses: user.enrolledCourses || [],
              mustChangePassword: Boolean(user.mustChangePassword)
            }
          });
        }
      }
    }
  } catch (err) {}

  const db = getDB();
  const user = (db.users || []).find(u => u.email.toLowerCase() === cleanEmail);

  if (!user || !user.isActive) {
    return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash) || (user.tempPassword && password === user.tempPassword);
  if (!isMatch) {
    return res.status(401).json({ success: false, message: 'Invalid email address or password.' });
  }

  const token = generateToken(user);
  const { passwordHash, ...safeUser } = user;

  res.json({
    success: true,
    message: `Welcome back, ${user.name}!`,
    token,
    user: {
      ...safeUser,
      enrolledCourses: safeUser.enrolledCourses || [],
      mustChangePassword: Boolean(safeUser.mustChangePassword)
    }
  });
};

// 3. Admin Login
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Admin email and password are required.' });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    if (mongoose.connection.readyState === 1) {
      const admin = await UserModel.findOne({
        $or: [{ email: cleanEmail }, { email: 'admin@lcc.edu' }],
        role: 'admin'
      });
      if (admin) {
        const isMatch = bcrypt.compareSync(password, admin.passwordHash);
        if (isMatch) {
          const token = generateToken(admin);
          return res.json({
            success: true,
            message: 'Admin authorization successful.',
            token,
            admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }
          });
        }
      }
    }
  } catch (err) {}

  const db = getDB();
  const admin = (db.users || []).find(
    u => (u.email.toLowerCase() === cleanEmail || u.email === 'admin@lcc.edu') && u.role === 'admin'
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
export const getUsers = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const users = await UserModel.find().select('-passwordHash');
      if (users && users.length > 0) {
        return res.json({ success: true, data: users });
      }
    }
  } catch (err) {}

  const db = getDB();
  const safeUsers = (db.users || []).map(({ passwordHash, ...u }) => u);
  res.json({ success: true, data: safeUsers });
};

// 8. Toggle User Active Status (Admin Only)
export const toggleUserStatus = async (req, res) => {
  const { id } = req.params;

  try {
    if (mongoose.connection.readyState === 1) {
      const user = await UserModel.findOne({ id });
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
      if (user.role === 'admin') {
        return res.status(400).json({ success: false, message: 'Cannot deactivate master admin account.' });
      }
      user.isActive = !user.isActive;
      await user.save();
      return res.json({
        success: true,
        message: `User status changed to ${user.isActive ? 'Active' : 'Inactive'}.`,
        user: { id: user.id, isActive: user.isActive }
      });
    }
  } catch (err) {}

  const db = getDB();
  const user = (db.users || []).find(u => u.id === id);

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

// 9. Admin Reset Password for any Student
export const adminResetPassword = async (req, res) => {
  const { id } = req.params;
  const customPass = req.body?.tempPassword;

  // Generate crisp, clean temporary password
  const tempPassword = customPass && customPass.trim().length >= 6
    ? customPass.trim()
    : `LCC@${Math.floor(1000 + Math.random() * 9000)}`;

  const hashed = bcrypt.hashSync(tempPassword, 10);

  try {
    if (mongoose.connection.readyState === 1) {
      const user = await UserModel.findOne({ id });
      if (user) {
        user.passwordHash = hashed;
        user.mustChangePassword = true;
        user.tempPassword = tempPassword;
        await user.save();
        return res.json({
          success: true,
          message: `Temporary password generated for ${user.name}`,
          tempPassword,
          user: { id: user.id, name: user.name, email: user.email, phone: user.phone }
        });
      }
    }
  } catch (e) {}

  const db = getDB();
  const user = (db.users || []).find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Student account not found.' });
  }

  user.passwordHash = hashed;
  user.mustChangePassword = true;
  user.tempPassword = tempPassword;
  saveDB(db);

  return res.json({
    success: true,
    message: `Temporary password generated for ${user.name}`,
    tempPassword,
    user: { id: user.id, name: user.name, email: user.email, phone: user.phone }
  });
};

// 10. Student Update Password (after login with temporary password or from profile)
export const updatePassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;
  if (!email || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
  }
  const cleanEmail = email.toLowerCase().trim();

  try {
    if (mongoose.connection.readyState === 1) {
      const user = await UserModel.findOne({ email: cleanEmail });
      if (user) {
        if (currentPassword && !bcrypt.compareSync(currentPassword, user.passwordHash) && currentPassword !== user.tempPassword) {
          return res.status(400).json({ success: false, message: 'Current/temporary password does not match.' });
        }
        user.passwordHash = bcrypt.hashSync(newPassword, 10);
        user.mustChangePassword = false;
        user.tempPassword = '';
        await user.save();
        return res.json({ success: true, message: 'Password updated successfully! You can now log in.' });
      }
    }
  } catch (e) {}

  const db = getDB();
  const user = (db.users || []).find(u => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    return res.status(404).json({ success: false, message: 'Student account not found.' });
  }
  if (currentPassword && !bcrypt.compareSync(currentPassword, user.passwordHash) && currentPassword !== user.tempPassword) {
    return res.status(400).json({ success: false, message: 'Current/temporary password does not match.' });
  }
  user.passwordHash = bcrypt.hashSync(newPassword, 10);
  user.mustChangePassword = false;
  user.tempPassword = '';
  saveDB(db);

  return res.json({ success: true, message: 'Password updated successfully! You can now log in.' });
};
