import { getDB, saveDB, UserModel, StaffAttendanceModel, BranchAdmissionModel, TeacherTaskModel, StudentAttendanceModel } from '../config/db.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Predefined coaching branches
export const COACHING_BRANCHES = [
  'Palahipatti Main Campus (Sindhora Rd)',
  'Sindhora Market Branch',
  'Babatpur City Center'
];

// 1. Get all staff / teachers
export const getStaffList = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const staff = await UserModel.find({ role: { $in: ['staff', 'teacher'] } }).select('-passwordHash');
      return res.json({ success: true, data: staff });
    }
    const db = getDB();
    const staff = (db.users || []).filter(u => u.role === 'staff' || u.role === 'teacher').map(({ passwordHash, ...rest }) => rest);
    res.json({ success: true, data: staff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 2. Add / Register a staff member (Admin only)
export const createStaff = async (req, res) => {
  const { name, email, phone, password, branch, designation } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const staffData = {
    id: `staff-${Date.now()}`,
    name: name.trim(),
    email: cleanEmail,
    phone: phone ? phone.trim() : '',
    passwordHash: bcrypt.hashSync(password, 10),
    role: 'staff',
    branch: branch || COACHING_BRANCHES[0],
    designation: designation || 'Faculty Mentor',
    isActive: true,
    createdAt: new Date().toISOString()
  };

  try {
    if (mongoose.connection.readyState === 1) {
      const existing = await UserModel.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Staff with this email already exists.' });
      }
      const created = await UserModel.create(staffData);
      const { passwordHash, ...safeStaff } = created.toObject ? created.toObject() : staffData;
      return res.status(201).json({ success: true, message: 'Staff member added successfully!', data: safeStaff });
    }
  } catch (err) {}

  const db = getDB();
  if (!db.users) db.users = [];
  if (db.users.some(u => u.email.toLowerCase() === cleanEmail)) {
    return res.status(400).json({ success: false, message: 'Staff with this email already exists.' });
  }
  db.users.push(staffData);
  saveDB(db);

  const { passwordHash, ...safeStaff } = staffData;
  res.status(201).json({ success: true, message: 'Staff member added successfully!', data: safeStaff });
};

// 3. Get Staff Attendance
export const getAttendance = async (req, res) => {
  const { date, branch, staffId } = req.query;
  const query = {};
  if (date) query.date = date;
  if (branch && branch !== 'all') query.branch = branch;
  if (staffId && staffId !== 'all') query.staffId = staffId;

  try {
    if (mongoose.connection.readyState === 1) {
      const attendance = await StaffAttendanceModel.find(query).sort({ _id: -1 });
      return res.json({ success: true, data: attendance });
    }
    const db = getDB();
    let attendance = db.staffAttendance || [];
    if (date) attendance = attendance.filter(a => a.date === date);
    if (branch && branch !== 'all') attendance = attendance.filter(a => a.branch === branch);
    if (staffId && staffId !== 'all') attendance = attendance.filter(a => a.staffId === staffId);
    res.json({ success: true, data: attendance });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 4. Mark / Update Staff Attendance
export const markAttendance = async (req, res) => {
  const { staffId, staffName, staffEmail, branch, date, status, reason, checkInTime } = req.body;
  if (!staffId || !status) {
    return res.status(400).json({ success: false, message: 'Staff ID and status (Present, Absent, On Leave) are required.' });
  }

  const todayStr = date || new Date().toISOString().split('T')[0];
  const currentTime = checkInTime || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  const record = {
    id: `att-${staffId}-${todayStr}`,
    staffId,
    staffName: staffName || 'Staff Member',
    staffEmail: staffEmail || '',
    branch: branch || COACHING_BRANCHES[0],
    date: todayStr,
    status: status, // 'Present' | 'Absent' | 'On Leave'
    reason: (status !== 'Present' ? (reason || 'Not specified') : ''),
    checkInTime: status === 'Present' ? currentTime : 'N/A',
    createdAt: new Date().toISOString()
  };

  try {
    if (mongoose.connection.readyState === 1) {
      const updated = await StaffAttendanceModel.findOneAndUpdate(
        { staffId, date: todayStr },
        { $set: record },
        { new: true, upsert: true }
      );
      return res.json({ success: true, message: `Attendance marked as "${status}" successfully!`, data: updated });
    }
  } catch (err) {}

  const db = getDB();
  if (!db.staffAttendance) db.staffAttendance = [];
  const existingIdx = db.staffAttendance.findIndex(a => a.staffId === staffId && a.date === todayStr);
  if (existingIdx >= 0) {
    db.staffAttendance[existingIdx] = { ...db.staffAttendance[existingIdx], ...record };
  } else {
    db.staffAttendance.unshift(record);
  }
  saveDB(db);

  res.json({ success: true, message: `Attendance marked as "${status}" successfully!`, data: record });
};

// 5. Get Student Admissions & Visits
export const getAdmissions = async (req, res) => {
  const { branch, teacherId, type } = req.query;
  const query = {};
  if (branch && branch !== 'all') query.branch = branch;
  if (teacherId && teacherId !== 'all') query.assignedTeacherId = teacherId;
  if (type && type !== 'all') query.admissionType = type; // 'Enrolled' | 'Visited'

  try {
    if (mongoose.connection.readyState === 1) {
      const admissions = await BranchAdmissionModel.find(query).sort({ _id: -1 });
      return res.json({ success: true, data: admissions });
    }
    const db = getDB();
    let admissions = db.branchAdmissions || [];
    if (branch && branch !== 'all') admissions = admissions.filter(a => a.branch === branch);
    if (teacherId && teacherId !== 'all') admissions = admissions.filter(a => a.assignedTeacherId === teacherId);
    if (type && type !== 'all') admissions = admissions.filter(a => a.admissionType === type);
    res.json({ success: true, data: admissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 6. Create Student Admission or Log Visit Entry
export const createAdmission = async (req, res) => {
  const {
    studentName,
    parentName,
    phone,
    email,
    targetClass,
    courseName,
    branch,
    assignedTeacherId,
    assignedTeacherName,
    admissionType,
    feesPaid,
    notes,
    date
  } = req.body;

  if (!studentName || !phone) {
    return res.status(400).json({ success: false, message: 'Student name and phone number are required.' });
  }

  const todayStr = date || new Date().toISOString().split('T')[0];
  const newAdmission = {
    id: `adm-${Date.now()}`,
    studentName: studentName.trim(),
    parentName: (parentName || '').trim(),
    phone: phone.trim(),
    email: (email || '').trim().toLowerCase(),
    targetClass: targetClass || 'Class 10',
    courseName: courseName || 'Comprehensive Coaching',
    branch: branch || COACHING_BRANCHES[0],
    assignedTeacherId: assignedTeacherId || 'staff-admin',
    assignedTeacherName: assignedTeacherName || 'General Desk',
    admissionType: admissionType === 'Visited' ? 'Visited' : 'Enrolled', // Enrolled vs Visited
    feesPaid: Number(feesPaid) || 0,
    notes: (notes || '').trim(),
    date: todayStr,
    status: 'Active',
    createdAt: new Date().toISOString()
  };

  try {
    if (mongoose.connection.readyState === 1) {
      const created = await BranchAdmissionModel.create(newAdmission);

      // If enrolled and email provided, also ensure student user profile is created
      if (newAdmission.admissionType === 'Enrolled' && newAdmission.email) {
        const studentExists = await UserModel.findOne({ email: newAdmission.email });
        if (!studentExists) {
          await UserModel.create({
            id: `usr-${Date.now()}`,
            name: newAdmission.studentName,
            email: newAdmission.email,
            phone: newAdmission.phone,
            passwordHash: bcrypt.hashSync('Student@123', 10),
            role: 'student',
            targetClass: newAdmission.targetClass,
            createdAt: new Date(),
            isActive: true
          });
        }
      }

      return res.status(201).json({
        success: true,
        message: newAdmission.admissionType === 'Enrolled' ? 'Student admission confirmed & registered!' : 'Student campus visit & inquiry logged!',
        data: created
      });
    }
  } catch (err) {}

  const db = getDB();
  if (!db.branchAdmissions) db.branchAdmissions = [];
  db.branchAdmissions.unshift(newAdmission);
  saveDB(db);

  res.status(201).json({
    success: true,
    message: newAdmission.admissionType === 'Enrolled' ? 'Student admission confirmed & registered!' : 'Student campus visit & inquiry logged!',
    data: newAdmission
  });
};

// 7. Comprehensive Command Center Stats (Branch-wise & Teacher-wise Breakdown)
export const getDashboardStats = async (req, res) => {
  try {
    let staffList = [];
    let admissionsList = [];
    let attendanceList = [];
    const todayStr = new Date().toISOString().split('T')[0];

    if (mongoose.connection.readyState === 1) {
      staffList = await UserModel.find({ role: { $in: ['staff', 'teacher'] } }).select('-passwordHash');
      admissionsList = await BranchAdmissionModel.find();
      attendanceList = await StaffAttendanceModel.find({ date: todayStr });
    } else {
      const db = getDB();
      staffList = (db.users || []).filter(u => u.role === 'staff' || u.role === 'teacher');
      admissionsList = db.branchAdmissions || [];
      attendanceList = (db.staffAttendance || []).filter(a => a.date === todayStr);
    }

    // Branch-wise aggregation
    const branchStats = COACHING_BRANCHES.map(branchName => {
      const branchStaff = staffList.filter(s => (s.branch || COACHING_BRANCHES[0]) === branchName);
      const branchAdmissions = admissionsList.filter(a => a.branch === branchName);
      const enrolled = branchAdmissions.filter(a => a.admissionType === 'Enrolled');
      const visited = branchAdmissions.filter(a => a.admissionType === 'Visited');

      const branchAttendance = attendanceList.filter(a => a.branch === branchName);
      const present = branchAttendance.filter(a => a.status === 'Present');
      const absent = branchAttendance.filter(a => a.status === 'Absent');
      const onLeave = branchAttendance.filter(a => a.status === 'On Leave');

      return {
        branch: branchName,
        totalStaff: branchStaff.length,
        staffPresent: present.length,
        staffAbsent: absent.length,
        staffOnLeave: onLeave.length,
        totalEnrolled: enrolled.length,
        totalVisited: visited.length,
        totalStudents: branchAdmissions.length,
        conversionRate: branchAdmissions.length > 0 ? Math.round((enrolled.length / branchAdmissions.length) * 100) : 0
      };
    });

    // Teacher-wise breakdown
    const teacherStats = staffList.map(teacher => {
      const teacherAdmissions = admissionsList.filter(a => a.assignedTeacherId === teacher.id || a.assignedTeacherName === teacher.name);
      const enrolled = teacherAdmissions.filter(a => a.admissionType === 'Enrolled');
      const visited = teacherAdmissions.filter(a => a.admissionType === 'Visited');

      const todayAtt = attendanceList.find(a => a.staffId === teacher.id);
      const status = todayAtt ? todayAtt.status : 'Not Marked';
      const reason = todayAtt ? (todayAtt.reason || '') : '';
      const checkInTime = todayAtt ? (todayAtt.checkInTime || 'N/A') : 'N/A';

      return {
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        branch: teacher.branch || COACHING_BRANCHES[0],
        designation: teacher.designation || 'Faculty',
        totalEnrolled: enrolled.length,
        totalVisited: visited.length,
        totalStudents: teacherAdmissions.length,
        todayStatus: status,
        todayReason: reason,
        todayCheckIn: checkInTime
      };
    });

    // Reasons for absence/leave log
    const leaveReasons = attendanceList
      .filter(a => a.status === 'On Leave' || a.status === 'Absent')
      .map(a => ({
        staffName: a.staffName,
        branch: a.branch,
        status: a.status,
        reason: a.reason || 'Personal / Medical Leave',
        checkInTime: a.checkInTime
      }));

    const totalEnrolledAll = admissionsList.filter(a => a.admissionType === 'Enrolled').length;
    const totalVisitedAll = admissionsList.filter(a => a.admissionType === 'Visited').length;
    const staffPresentCount = attendanceList.filter(a => a.status === 'Present').length;
    const staffAbsentCount = attendanceList.filter(a => a.status === 'Absent').length;
    const staffOnLeaveCount = attendanceList.filter(a => a.status === 'On Leave').length;

    res.json({
      success: true,
      branches: COACHING_BRANCHES,
      summary: {
        totalStaff: staffList.length,
        totalEnrolled: totalEnrolledAll,
        totalVisited: totalVisitedAll,
        totalInteractions: admissionsList.length,
        staffPresent: staffPresentCount,
        staffAbsent: staffAbsentCount,
        staffOnLeave: staffOnLeaveCount,
        overallConversionRate: admissionsList.length > 0 ? Math.round((totalEnrolledAll / admissionsList.length) * 100) : 0
      },
      branchStats,
      teacherStats,
      leaveReasons
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 8. Admin Reset Staff / Teacher Password
export const resetStaffPassword = async (req, res) => {
  const { staffId, newPassword } = req.body;
  if (!staffId || !newPassword) {
    return res.status(400).json({ success: false, message: 'Staff ID and new password are required.' });
  }

  const passwordHash = bcrypt.hashSync(newPassword, 10);
  try {
    if (mongoose.connection.readyState === 1) {
      const user = await UserModel.findOneAndUpdate(
        { $or: [{ id: staffId }, { _id: mongoose.isValidObjectId(staffId) ? staffId : null }] },
        { $set: { passwordHash } },
        { new: true }
      );
      if (user) {
        return res.json({ success: true, message: `Password reset successfully for ${user.name}` });
      }
    }
  } catch (err) {}

  const db = getDB();
  const user = (db.users || []).find(u => u.id === staffId);
  if (user) {
    user.passwordHash = passwordHash;
    saveDB(db);
    return res.json({ success: true, message: `Password reset successfully for ${user.name}` });
  }

  res.status(404).json({ success: false, message: 'Staff member not found.' });
};

// 9. Get Teacher Tasks
export const getTeacherTasks = async (req, res) => {
  const { teacherId } = req.query;
  const query = {};
  if (teacherId && teacherId !== 'all') query.assignedToStaffId = teacherId;

  try {
    if (mongoose.connection.readyState === 1) {
      const tasks = await TeacherTaskModel.find(query).sort({ _id: -1 });
      return res.json({ success: true, data: tasks });
    }
    const db = getDB();
    let tasks = db.teacherTasks || [];
    if (teacherId && teacherId !== 'all') tasks = tasks.filter(t => t.assignedToStaffId === teacherId);
    res.json({ success: true, data: tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 10. Assign Task to Teacher (Admin)
export const createTeacherTask = async (req, res) => {
  const { title, description, assignedToStaffId, assignedToStaffName, dueDate, priority } = req.body;
  if (!title || !assignedToStaffId) {
    return res.status(400).json({ success: false, message: 'Title and assigned staff member are required.' });
  }

  const newTask = {
    id: `task-${Date.now()}`,
    title: title.trim(),
    description: (description || '').trim(),
    assignedToStaffId,
    assignedToStaffName: assignedToStaffName || 'Teacher',
    dueDate: dueDate || new Date().toISOString().split('T')[0],
    priority: priority || 'Normal',
    status: 'Pending', // 'Pending' | 'Completed'
    reportNote: '',
    submittedAt: '',
    createdAt: new Date().toISOString()
  };

  try {
    if (mongoose.connection.readyState === 1) {
      const created = await TeacherTaskModel.create(newTask);
      return res.status(201).json({ success: true, message: 'Task assigned successfully!', data: created });
    }
  } catch (err) {}

  const db = getDB();
  if (!db.teacherTasks) db.teacherTasks = [];
  db.teacherTasks.unshift(newTask);
  saveDB(db);
  res.status(201).json({ success: true, message: 'Task assigned successfully!', data: newTask });
};

// 11. Submit Task Work Report (Teacher)
export const submitTeacherTaskReport = async (req, res) => {
  const { taskId, reportNote, status } = req.body;
  if (!taskId || !reportNote) {
    return res.status(400).json({ success: false, message: 'Task ID and report note are required.' });
  }

  const submittedAt = new Date().toISOString();
  const updateData = {
    reportNote: reportNote.trim(),
    status: status || 'Completed',
    submittedAt
  };

  try {
    if (mongoose.connection.readyState === 1) {
      const updated = await TeacherTaskModel.findOneAndUpdate(
        { $or: [{ id: taskId }, { _id: mongoose.Types.ObjectId.isValid(taskId) ? taskId : null }] },
        { $set: updateData },
        { new: true }
      );
      if (updated) {
        return res.json({ success: true, message: 'Work report submitted successfully!', data: updated });
      }
    }
  } catch (err) {}

  const db = getDB();
  if (!db.teacherTasks) db.teacherTasks = [];
  const task = db.teacherTasks.find(t => t.id === taskId || t._id === taskId);
  if (task) {
    task.reportNote = updateData.reportNote;
    task.status = updateData.status;
    task.submittedAt = submittedAt;
    saveDB(db);
    return res.json({ success: true, message: 'Work report submitted successfully!', data: task });
  }
  res.status(404).json({ success: false, message: 'Task not found.' });
};

// 12. Get Student Attendance & Leaves
export const getStudentAttendance = async (req, res) => {
  const { teacherId, date, branch } = req.query;
  const query = {};
  if (teacherId && teacherId !== 'all') query.teacherId = teacherId;
  if (date) query.date = date;
  if (branch && branch !== 'all') query.branch = branch;

  try {
    if (mongoose.connection.readyState === 1) {
      const records = await StudentAttendanceModel.find(query).sort({ _id: -1 });
      return res.json({ success: true, data: records });
    }
    const db = getDB();
    let records = db.studentAttendance || [];
    if (teacherId && teacherId !== 'all') records = records.filter(r => r.teacherId === teacherId);
    if (date) records = records.filter(r => r.date === date);
    if (branch && branch !== 'all') records = records.filter(r => r.branch === branch);
    res.json({ success: true, data: records });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 13. Mark Batch Student Attendance (Teacher or Admin)
export const markStudentAttendance = async (req, res) => {
  const { records } = req.body;
  if (!Array.isArray(records) || records.length === 0) {
    return res.status(400).json({ success: false, message: 'Student attendance records array is required.' });
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const processedRecords = records.map(r => ({
    id: `st-att-${r.studentId}-${r.date || todayStr}`,
    studentId: r.studentId,
    studentName: r.studentName,
    teacherId: r.teacherId,
    branch: r.branch,
    date: r.date || todayStr,
    status: r.status || 'Present', // 'Present' | 'Absent' | 'On Leave'
    reason: r.reason || '',
    recordedAt: new Date().toISOString()
  }));

  try {
    if (mongoose.connection.readyState === 1) {
      for (const rec of processedRecords) {
        await StudentAttendanceModel.findOneAndUpdate(
          { studentId: rec.studentId, date: rec.date },
          { $set: rec },
          { upsert: true, new: true }
        );
      }
      return res.json({ success: true, message: `Attendance marked for ${processedRecords.length} students!` });
    }
  } catch (err) {}

  const db = getDB();
  if (!db.studentAttendance) db.studentAttendance = [];
  for (const rec of processedRecords) {
    const idx = db.studentAttendance.findIndex(a => a.studentId === rec.studentId && a.date === rec.date);
    if (idx >= 0) {
      db.studentAttendance[idx] = { ...db.studentAttendance[idx], ...rec };
    } else {
      db.studentAttendance.unshift(rec);
    }
  }
  saveDB(db);

  res.json({ success: true, message: `Attendance marked for ${processedRecords.length} students!` });
};

// 12. Update Staff / Teacher (Branch, Designation, Phone, Name)
export const updateStaff = async (req, res) => {
  const { id } = req.params;
  const { branch, designation, phone, name } = req.body;
  try {
    const updateFields = {};
    if (branch !== undefined) updateFields.branch = branch;
    if (designation !== undefined) updateFields.designation = designation;
    if (phone !== undefined) updateFields.phone = phone;
    if (name !== undefined) updateFields.name = name;

    if (mongoose.connection.readyState === 1) {
      const updated = await UserModel.findOneAndUpdate(
        { $or: [{ id }, { _id: mongoose.Types.ObjectId.isValid(id) ? id : null }] },
        { $set: updateFields },
        { new: true }
      ).select('-passwordHash');
      if (updated) {
        return res.json({ success: true, message: 'Teacher details updated successfully!', data: updated });
      }
    }
    const db = getDB();
    const user = (db.users || []).find(u => u.id === id || u._id === id);
    if (user) {
      Object.assign(user, updateFields);
      saveDB(db);
      const { passwordHash, ...safeUser } = user;
      return res.json({ success: true, message: 'Teacher details updated successfully!', data: safeUser });
    }
    res.status(404).json({ success: false, message: 'Teacher not found' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

