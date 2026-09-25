import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UserCheck,
  UserX,
  Clock,
  UserPlus,
  Users,
  Building,
  LogOut,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Phone,
  Mail,
  GraduationCap,
  Sparkles,
  Search,
  Eye,
  BadgeAlert,
  ClipboardList,
  CheckSquare,
  Send,
  BookOpen,
  ArrowRight,
  FileText
} from 'lucide-react';

const COACHING_BRANCHES = [
  'Palahipatti Main Campus (Sindhora Rd)',
  'Sindhora Market Branch',
  'Babatpur City Center'
];

export const StaffDashboard: React.FC = () => {
  const {
    currentStaff,
    loginStaff,
    logoutStaff,
    markStaffAttendance,
    registerBranchAdmission,
    branchAdmissions,
    staffAttendance,
    teacherTasks,
    studentAttendanceRecords,
    submitTeacherWorkReport,
    markBatchStudentAttendance,
    showToast,
    navigateTo
  } = useApp();

  // Login form state (if not logged in)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<'attendance' | 'student-attendance' | 'tasks' | 'admission' | 'my-records'>('attendance');

  // Teacher self-attendance form state
  const [attStatus, setAttStatus] = useState<'Present' | 'Absent' | 'On Leave'>('Present');
  const [attReason, setAttReason] = useState('');
  const [isSubmittingAtt, setIsSubmittingAtt] = useState(false);

  // Student Attendance tab state
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedAttDate, setSelectedAttDate] = useState(todayStr);
  const [studentAttMap, setStudentAttMap] = useState<Record<string, { status: 'Present' | 'Absent' | 'On Leave'; reason: string }>>({});
  const [isSavingStudentAtt, setIsSavingStudentAtt] = useState(false);

  // Tasks reporting state
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [taskReportNote, setTaskReportNote] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  // Admission form state
  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [targetClass, setTargetClass] = useState('Class 10');
  const [courseName, setCourseName] = useState('Board Exam Ace: Class 9 & 10 Target 95%+');
  const [admissionType, setAdmissionType] = useState<'Enrolled' | 'Visited'>('Enrolled');
  const [feesPaid, setFeesPaid] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmittingAdm, setIsSubmittingAdm] = useState(false);

  // Filter & search in My Records
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Enrolled' | 'Visited'>('all');

  // Current staff today's attendance record
  const myTodayAtt = staffAttendance.find(
    a => currentStaff && a.staffId === currentStaff.id && a.date === todayStr
  );

  // Handle staff login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showToast('Please enter your staff email and password.', 'error');
      return;
    }
    setIsLoggingIn(true);
    await loginStaff(loginEmail, loginPassword);
    setIsLoggingIn(false);
  };

  // Quick autofill for demo staff logins
  const autofillStaff = (email: string) => {
    setLoginEmail(email);
    setLoginPassword('Staff@123');
  };

  // Handle marking self attendance
  const handleAttendanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((attStatus === 'On Leave' || attStatus === 'Absent') && !attReason.trim()) {
      showToast('Please provide a mandatory reason for absence or leave.', 'warning');
      return;
    }
    setIsSubmittingAtt(true);
    const success = await markStaffAttendance(attStatus, attReason);
    if (success) {
      setAttReason('');
    }
    setIsSubmittingAtt(false);
  };

  // Students list for this teacher
  const teacherEnrolledStudents = branchAdmissions.filter(
    r => r.admissionType === 'Enrolled' &&
      currentStaff &&
      (r.assignedTeacherId === currentStaff.id || r.assignedTeacherName === currentStaff.name || r.branch === currentStaff.branch)
  );

  // Default mock students if none enrolled yet
  const displayStudents = teacherEnrolledStudents.length > 0 ? teacherEnrolledStudents : [
    { id: 'st-01', studentName: 'Aarav Sharma', parentName: 'Ramesh Sharma', targetClass: 'Class 10', phone: '9876543211', branch: currentStaff?.branch || 'Palahipatti' },
    { id: 'st-02', studentName: 'Kavya Singh', parentName: 'Sanjay Singh', targetClass: 'Class 9', phone: '9876543212', branch: currentStaff?.branch || 'Palahipatti' },
    { id: 'st-03', studentName: 'Rohan Gupta', parentName: 'Manish Gupta', targetClass: 'Class 12', phone: '9876543213', branch: currentStaff?.branch || 'Palahipatti' },
    { id: 'st-04', studentName: 'Sneha Patel', parentName: 'Rajesh Patel', targetClass: 'Class 10', phone: '9876543214', branch: currentStaff?.branch || 'Palahipatti' },
    { id: 'st-05', studentName: 'Vikas Maurya', parentName: 'Sunil Maurya', targetClass: 'Class 11', phone: '9876543215', branch: currentStaff?.branch || 'Palahipatti' }
  ];

  // Handle student attendance submission
  const handleSaveStudentAttendance = async () => {
    if (!currentStaff) return;
    setIsSavingStudentAtt(true);

    const records = displayStudents.map(st => {
      const entry = studentAttMap[st.id] || { status: 'Present', reason: '' };
      return {
        studentId: st.id,
        studentName: st.studentName,
        teacherId: currentStaff.id,
        branch: currentStaff.branch || COACHING_BRANCHES[0],
        date: selectedAttDate,
        status: entry.status,
        reason: entry.reason
      };
    });

    const success = await markBatchStudentAttendance(records);
    if (success) {
      showToast(`Student attendance for ${records.length} students saved successfully!`, 'success');
    }
    setIsSavingStudentAtt(false);
  };

  // Handle work report submission
  const handleSubmitTaskReport = async (taskId: string) => {
    if (!taskReportNote.trim()) {
      showToast('Please write a brief summary of what you completed.', 'warning');
      return;
    }
    setIsSubmittingReport(true);
    const success = await submitTeacherWorkReport(taskId, taskReportNote.trim());
    if (success) {
      setTaskReportNote('');
      setSelectedTaskId(null);
    }
    setIsSubmittingReport(false);
  };

  // Handle student admission / visit inquiry submit
  const handleAdmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !phone.trim()) {
      showToast('Student name and phone number are required.', 'warning');
      return;
    }

    setIsSubmittingAdm(true);
    const success = await registerBranchAdmission({
      studentName: studentName.trim(),
      parentName: parentName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      targetClass,
      courseName,
      branch: currentStaff?.branch || COACHING_BRANCHES[0],
      assignedTeacherId: currentStaff?.id || 'staff-unassigned',
      assignedTeacherName: currentStaff?.name || 'Staff Mentor',
      admissionType,
      feesPaid: Number(feesPaid) || 0,
      notes: notes.trim(),
      date: todayStr,
      status: 'Active'
    });

    if (success) {
      setStudentName('');
      setParentName('');
      setPhone('');
      setEmail('');
      setFeesPaid('');
      setNotes('');
      setActiveTab('my-records');
    }
    setIsSubmittingAdm(false);
  };

  // My filtered student admissions & visit records
  const myRecords = branchAdmissions.filter(rec => {
    const isMine = currentStaff && (rec.assignedTeacherId === currentStaff.id || rec.assignedTeacherName === currentStaff.name);
    const matchesSearch =
      rec.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rec.phone && rec.phone.includes(searchTerm)) ||
      (rec.parentName && rec.parentName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || rec.admissionType === typeFilter;
    return isMine && matchesSearch && matchesType;
  });

  const myEnrolledCount = branchAdmissions.filter(
    r => currentStaff && (r.assignedTeacherId === currentStaff.id || r.assignedTeacherName === currentStaff.name) && r.admissionType === 'Enrolled'
  ).length;

  const myVisitedCount = branchAdmissions.filter(
    r => currentStaff && (r.assignedTeacherId === currentStaff.id || r.assignedTeacherName === currentStaff.name) && r.admissionType === 'Visited'
  ).length;

  // Filter tasks assigned to me
  const myTasks = teacherTasks.filter(
    t => currentStaff && (t.assignedToStaffId === currentStaff.id || t.assignedToStaffName === currentStaff.name)
  );

  // Filter student attendance for this teacher
  const myStudentAttRecords = studentAttendanceRecords.filter(
    r => currentStaff && (r.teacherId === currentStaff.id || r.branch === currentStaff.branch)
  );

  // IF NOT LOGGED IN: Render Staff Login Portal
  if (!currentStaff) {
    return (
      <div className="min-h-screen bg-slate-950 py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-500/20 text-primary-400 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary-500/30">
              <Users className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary-400 bg-primary-950/60 px-3 py-1 rounded-full border border-primary-800/40">
              Staff & Teacher Portal
            </span>
            <h1 className="text-2xl font-black text-white mt-3">Employee & Faculty Login</h1>
            <p className="text-sm text-slate-400 mt-1">
              Mark daily attendance, manage student cohorts, and submit daily task reports.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="e.g. rajesh@lcc.edu"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="Enter your staff password"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2 mt-6 cursor-pointer"
            >
              {isLoggingIn ? (
                <span>Logging in...</span>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  <span>Log In to Staff Portal</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Staff Logins */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-xs text-slate-400 font-semibold mb-3 text-center">
              Quick Faculty Accounts:
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => autofillStaff('rajesh@lcc.edu')}
                className="w-full text-left bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 rounded-xl p-2.5 transition-all flex items-center justify-between text-xs cursor-pointer"
              >
                <div>
                  <p className="font-bold text-white">Rajesh Verma (Senior Faculty)</p>
                  <p className="text-[11px] text-slate-400">Palahipatti Main Campus • rajesh@lcc.edu</p>
                </div>
                <span className="text-[10px] bg-primary-950 text-primary-300 border border-primary-800 px-2 py-0.5 rounded font-mono">
                  Select
                </span>
              </button>

              <button
                type="button"
                onClick={() => autofillStaff('ananya@lcc.edu')}
                className="w-full text-left bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 rounded-xl p-2.5 transition-all flex items-center justify-between text-xs cursor-pointer"
              >
                <div>
                  <p className="font-bold text-white">Mrs. Ananya Sharma (Specialist)</p>
                  <p className="text-[11px] text-slate-400">Sindhora Market Branch • ananya@lcc.edu</p>
                </div>
                <span className="text-[10px] bg-primary-950 text-primary-300 border border-primary-800 px-2 py-0.5 rounded font-mono">
                  Select
                </span>
              </button>

              <button
                type="button"
                onClick={() => autofillStaff('amit@lcc.edu')}
                className="w-full text-left bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 rounded-xl p-2.5 transition-all flex items-center justify-between text-xs cursor-pointer"
              >
                <div>
                  <p className="font-bold text-white">Amit Kumar (Counselor & Commerce)</p>
                  <p className="text-[11px] text-slate-400">Babatpur City Center • amit@lcc.edu</p>
                </div>
                <span className="text-[10px] bg-primary-950 text-primary-300 border border-primary-800 px-2 py-0.5 rounded font-mono">
                  Select
                </span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 text-center mt-3">
              Default password: <span className="text-slate-300 font-mono">Staff@123</span>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // IF LOGGED IN: Render Staff Command Dashboard
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-primary-500/20">
                {currentStaff.name.charAt(0)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-white">{currentStaff.name}</h1>
                  <span className="text-xs bg-primary-950 text-primary-400 border border-primary-800/60 px-2.5 py-0.5 rounded-full font-semibold">
                    {currentStaff.designation || 'Faculty Mentor'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-primary-400" />
                    {currentStaff.branch || COACHING_BRANCHES[0]}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Logout and Today Status Action */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-2 rounded-2xl text-right">
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Today&apos;s Status</p>
                <div className="flex items-center gap-1.5 justify-end mt-0.5">
                  {myTodayAtt ? (
                    myTodayAtt.status === 'Present' ? (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Present ({myTodayAtt.checkInTime || 'Active'})
                      </span>
                    ) : myTodayAtt.status === 'On Leave' ? (
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> On Leave
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                        <UserX className="w-3.5 h-3.5" /> Absent
                      </span>
                    )
                  ) : (
                    <span className="text-xs font-bold text-amber-400">Attendance Pending</span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={logoutStaff}
                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60">
              <p className="text-xs text-slate-400 font-medium">Enrolled Students</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">{myEnrolledCount}</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60">
              <p className="text-xs text-slate-400 font-medium">Campus Visit Leads</p>
              <p className="text-2xl font-black text-amber-400 mt-1">{myVisitedCount}</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60">
              <p className="text-xs text-slate-400 font-medium">Assigned Tasks</p>
              <p className="text-2xl font-black text-primary-400 mt-1">{myTasks.length}</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60">
              <p className="text-xs text-slate-400 font-medium">Completed Reports</p>
              <p className="text-2xl font-black text-indigo-400 mt-1">
                {myTasks.filter(t => t.status === 'Completed').length} / {myTasks.length}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-800 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('attendance')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'attendance'
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>1. My Daily Attendance</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('student-attendance')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'student-attendance'
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>2. Mark Student Attendance</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tasks')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'tasks'
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>3. Assigned Tasks & Daily Reports ({myTasks.filter(t => t.status === 'Pending').length} Pending)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('admission')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'admission'
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>4. New Admission / Visit Inquiry</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('my-records')}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'my-records'
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>5. My Students Directory ({myRecords.length})</span>
          </button>
        </div>

        {/* TAB 1: TEACHER SELF ATTENDANCE */}
        {activeTab === 'attendance' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-400 bg-primary-950/60 px-3 py-1 rounded-full border border-primary-800/40">
                  Daily Attendance Log
                </span>
                <h2 className="text-xl font-black text-white mt-2">Record Your Attendance for Today</h2>
                <p className="text-sm text-slate-400 mt-1">
                  Select &ldquo;Present&rdquo; if on campus. If on leave or absent, provide a documented reason for the Director&apos;s review.
                </p>
              </div>

              {myTodayAtt && (
                <div className="mb-6 p-4 rounded-2xl bg-slate-800/70 border border-slate-700 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-300">
                      Today&apos;s Recorded Attendance:
                    </p>
                    <p className="text-sm font-black text-white mt-1">
                      Status:{' '}
                      <span
                        className={
                          myTodayAtt.status === 'Present'
                            ? 'text-emerald-400'
                            : myTodayAtt.status === 'On Leave'
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }
                      >
                        {myTodayAtt.status}
                      </span>{' '}
                      {myTodayAtt.checkInTime !== 'N/A' && `• Time: ${myTodayAtt.checkInTime}`}
                    </p>
                    {myTodayAtt.reason && (
                      <p className="text-xs text-amber-300 mt-1 bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-800/40">
                        Reason: {myTodayAtt.reason}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-1 rounded">
                    Synced to Cloud
                  </span>
                </div>
              )}

              <form onSubmit={handleAttendanceSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                    Select Today&apos;s Status
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setAttStatus('Present')}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        attStatus === 'Present'
                          ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <p className="font-bold text-sm text-emerald-400">Present</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Active on campus duties</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAttStatus('On Leave')}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        attStatus === 'On Leave'
                          ? 'bg-amber-950/60 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                      <p className="font-bold text-sm text-amber-400">On Leave</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Approved or planned leave</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAttStatus('Absent')}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        attStatus === 'Absent'
                          ? 'bg-rose-950/60 border-rose-500 text-white shadow-lg shadow-rose-500/10'
                          : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-2">
                        <UserX className="w-4 h-4" />
                      </div>
                      <p className="font-bold text-sm text-rose-400">Absent</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Emergency or unexpected absence</p>
                    </button>
                  </div>
                </div>

                {(attStatus === 'On Leave' || attStatus === 'Absent') && (
                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-amber-500/30">
                    <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <BadgeAlert className="w-4 h-4" />
                      Reason for Absence / Leave (Mandatory) *
                    </label>
                    <textarea
                      rows={3}
                      value={attReason}
                      onChange={e => setAttReason(e.target.value)}
                      placeholder="e.g. Due to viral fever, attending family obligation, traveling for medical appointment..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmittingAtt}
                  className="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>
                    {isSubmittingAtt
                      ? 'Saving Attendance...'
                      : `Save Today's Attendance (${attStatus})`}
                  </span>
                </button>
              </form>
            </div>

            {/* Attendance Guidelines Card */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary-400" />
                  Faculty Policy & Guidelines
                </h3>
                <ul className="text-xs text-slate-400 space-y-2.5">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    Daily attendance must be recorded by 10:00 AM each morning.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    Document clear reasons for any absence so the Director is notified instantly.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-400 font-bold">•</span>
                    Your Campus Branch: <strong className="text-white">{currentStaff.branch}</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MARK STUDENT ATTENDANCE */}
        {activeTab === 'student-attendance' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
                  Student Cohort Attendance
                </span>
                <h2 className="text-xl font-black text-white mt-2">Mark Student Daily Attendance</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Record Present, Absent, or Leave for students studying under you at {currentStaff.branch}.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-xs text-slate-400 font-semibold">Attendance Date:</label>
                <input
                  type="date"
                  value={selectedAttDate}
                  onChange={e => setSelectedAttDate(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Class & Batch</th>
                    <th className="py-3 px-3">Contact</th>
                    <th className="py-3 px-3 text-center">Status</th>
                    <th className="py-3 px-3">Absence / Leave Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {displayStudents.map(st => {
                    const currentEntry = studentAttMap[st.id] || { status: 'Present', reason: '' };
                    return (
                      <tr key={st.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-3">
                          <p className="font-bold text-white text-sm">{st.studentName}</p>
                          {st.parentName && <p className="text-slate-400 text-[11px]">Parent: {st.parentName}</p>}
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="font-semibold text-slate-200">{st.targetClass}</span>
                          <p className="text-slate-400 text-[11px]">{st.branch}</p>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="text-slate-300 font-mono">📞 {st.phone}</span>
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <div className="inline-flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-800">
                            <button
                              type="button"
                              onClick={() => setStudentAttMap(prev => ({
                                ...prev,
                                [st.id]: { status: 'Present', reason: '' }
                              }))}
                              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                                currentEntry.status === 'Present'
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              onClick={() => setStudentAttMap(prev => ({
                                ...prev,
                                [st.id]: { ...currentEntry, status: 'On Leave' }
                              }))}
                              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                                currentEntry.status === 'On Leave'
                                  ? 'bg-amber-600 text-white shadow-xs'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              Leave
                            </button>
                            <button
                              type="button"
                              onClick={() => setStudentAttMap(prev => ({
                                ...prev,
                                [st.id]: { ...currentEntry, status: 'Absent' }
                              }))}
                              className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                                currentEntry.status === 'Absent'
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'text-slate-400 hover:text-white'
                              }`}
                            >
                              Absent
                            </button>
                          </div>
                        </td>

                        <td className="py-3.5 px-3">
                          {currentEntry.status !== 'Present' ? (
                            <input
                              type="text"
                              placeholder="Reason for student absence..."
                              value={currentEntry.reason}
                              onChange={e => {
                                const val = e.target.value;
                                setStudentAttMap(prev => ({
                                  ...prev,
                                  [st.id]: { ...currentEntry, reason: val }
                                }));
                              }}
                              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                            />
                          ) : (
                            <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Present in Class
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={handleSaveStudentAttendance}
                disabled={isSavingStudentAtt}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer text-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isSavingStudentAtt ? 'Saving Cohort Attendance...' : `Save Attendance for ${displayStudents.length} Students`}</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: ASSIGNED TASKS & DAILY WORK REPORTS */}
        {activeTab === 'tasks' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary-400 bg-primary-950/60 px-3 py-1 rounded-full border border-primary-800/40">
                  Director Assignments
                </span>
                <h2 className="text-xl font-black text-white mt-2">Tasks & Daily Work Reports</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Complete assigned institutional goals, syllabus milestones, and submit your daily execution reports.
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-400">Total Assigned:</span>
                <p className="text-xl font-black text-white">{myTasks.length} Tasks</p>
              </div>
            </div>

            {myTasks.length === 0 ? (
              <div className="text-center py-16 bg-slate-950/40 rounded-2xl border border-slate-800/80">
                <ClipboardList className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-300">No Pending Tasks Assigned</p>
                <p className="text-xs text-slate-500 mt-1">You are all caught up! New tasks assigned by Director Aman Arora will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myTasks.map(task => (
                  <div
                    key={task.id}
                    className={`bg-slate-950/80 border rounded-2xl p-5 space-y-4 transition-all ${
                      task.status === 'Completed' ? 'border-emerald-800/60 bg-emerald-950/10' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              task.priority === 'High'
                                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                                : 'bg-primary-950 text-primary-300 border border-primary-800'
                            }`}
                          >
                            {task.priority || 'Normal'} Priority
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              task.status === 'Completed'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-amber-950 text-amber-400 border border-amber-800'
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                        <h3 className="font-bold text-white text-base">{task.title}</h3>
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">Due: {task.dueDate}</span>
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900 p-3 rounded-xl border border-slate-800">
                        {task.description}
                      </p>
                    )}

                    {task.status === 'Completed' ? (
                      <div className="bg-emerald-950/40 border border-emerald-800/40 p-3.5 rounded-xl space-y-1">
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Submitted Work Report:
                        </p>
                        <p className="text-xs text-slate-200 italic font-medium leading-relaxed">
                          &ldquo;{task.reportNote}&rdquo;
                        </p>
                        {task.submittedAt && (
                          <p className="text-[10px] text-slate-400 pt-1">
                            Submitted at: {new Date(task.submittedAt).toLocaleString()}
                          </p>
                        )}
                      </div>
                    ) : selectedTaskId === task.id ? (
                      <div className="space-y-3 bg-slate-900 p-4 rounded-xl border border-primary-500/40">
                        <label className="block text-xs font-bold text-primary-400 uppercase tracking-wider">
                          Write Your Work Completion Note:
                        </label>
                        <textarea
                          rows={3}
                          value={taskReportNote}
                          onChange={e => setTaskReportNote(e.target.value)}
                          placeholder="Describe what was accomplished today, syllabus covered, or student follow-up outcomes..."
                          className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                        />
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            type="button"
                            onClick={() => setSelectedTaskId(null)}
                            className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSubmitTaskReport(task.id)}
                            disabled={isSubmittingReport}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-1.5 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{isSubmittingReport ? 'Submitting...' : 'Submit Report'}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTaskId(task.id);
                          setTaskReportNote('');
                        }}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer border border-slate-700"
                      >
                        <FileText className="w-3.5 h-3.5 text-primary-400" />
                        <span>Write & Submit Daily Report</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: NEW ADMISSION OR VISIT INQUIRY ENTRY */}
        {activeTab === 'admission' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
                Student Intake Desk
              </span>
              <h2 className="text-2xl font-black text-white mt-2">
                Register New Student Admission or Visit Lead
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Confirm formal student enrollment or log an inquiry visit for systematic follow-up.
              </p>
            </div>

            <form onSubmit={handleAdmissionSubmit} className="space-y-6">
              {/* Admission Type Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Select Intake Category *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setAdmissionType('Enrolled')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      admissionType === 'Enrolled'
                        ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg shadow-emerald-500/10'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-emerald-400 flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        Enrolled Student (Confirmed)
                      </span>
                      {admissionType === 'Enrolled' && (
                        <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300">
                      Student has completed fee payment and joined coaching batch.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdmissionType('Visited')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      admissionType === 'Visited'
                        ? 'bg-amber-950/60 border-amber-500 text-white shadow-lg shadow-amber-500/10'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-amber-400 flex items-center gap-2 text-sm">
                        <Eye className="w-4 h-4" />
                        Campus Visit Lead (Inquiry)
                      </span>
                      {admissionType === 'Visited' && (
                        <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300">
                      Student or parent visited branch for course inquiry or demo class.
                    </p>
                  </button>
                </div>
              </div>

              {/* Student Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    placeholder="e.g. Rahul Singh"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Father / Guardian Name
                  </label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={e => setParentName(e.target.value)}
                    placeholder="e.g. Shri Mukesh Singh"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 9876543210"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Target Class / Level
                  </label>
                  <select
                    value={targetClass}
                    onChange={e => setTargetClass(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary-500"
                  >
                    <option value="Class 1-5">Class 1 to 5 (Primary Foundation)</option>
                    <option value="Class 6">Class 6</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 10">Class 10 (Board Target 95%+)</option>
                    <option value="Class 11">Class 11 (Science / Commerce)</option>
                    <option value="Class 12">Class 12 (Boards + CUET / JEE)</option>
                    <option value="Computer DCA">Computer DCA / ADCA Diploma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Course / Batch Name
                  </label>
                  <input
                    type="text"
                    value={courseName}
                    onChange={e => setCourseName(e.target.value)}
                    placeholder="e.g. Board Exam Ace / Foundation Batch"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary-500"
                  />
                </div>

                {admissionType === 'Enrolled' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Fees Paid (₹)
                    </label>
                    <input
                      type="number"
                      value={feesPaid}
                      onChange={e => setFeesPaid(e.target.value)}
                      placeholder="e.g. 5000"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Branch Campus
                  </label>
                  <input
                    type="text"
                    value={currentStaff.branch || COACHING_BRANCHES[0]}
                    readOnly
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-300 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Follow-up Notes / Counseling Details
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Demo class scheduled for Monday, scored 85% in diagnostic test..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmittingAdm}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {admissionType === 'Enrolled' ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>
                      {isSubmittingAdm ? 'Registering Student...' : 'Confirm Student Enrollment'}
                    </span>
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5" />
                    <span>
                      {isSubmittingAdm ? 'Saving Inquiry...' : 'Log Campus Visit Lead'}
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* TAB 5: MY STUDENTS & VISITORS DIRECTORY */}
        {activeTab === 'my-records' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white">My Students & Leads Directory</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Students enrolled under your guidance and visitors who consulted with you.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search by name, phone..."
                    className="bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
                  <button
                    type="button"
                    onClick={() => setTypeFilter('all')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      typeFilter === 'all' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All ({myRecords.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTypeFilter('Enrolled')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      typeFilter === 'Enrolled' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Enrolled ({myEnrolledCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTypeFilter('Visited')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                      typeFilter === 'Visited' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Visited ({myVisitedCount})
                  </button>
                </div>
              </div>
            </div>

            {myRecords.length === 0 ? (
              <div className="text-center py-16 bg-slate-950/40 rounded-2xl border border-slate-800/80">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-sm font-bold text-slate-300">No Student Records Found</p>
                <p className="text-xs text-slate-500 mt-1">
                  Click the &ldquo;New Admission / Visit&rdquo; tab to enroll your first student.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('admission')}
                  className="mt-4 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  + Add New Student
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="py-3 px-3">Student Name & Contact</th>
                      <th className="py-3 px-3">Class & Course</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Fees / Date</th>
                      <th className="py-3 px-3">Follow-up Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {myRecords.map(rec => (
                      <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-3">
                          <p className="font-bold text-white text-sm">{rec.studentName}</p>
                          <p className="text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>📞 {rec.phone}</span>
                            {rec.parentName && <span>• Parent: {rec.parentName}</span>}
                          </p>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="font-semibold text-slate-200">{rec.targetClass}</span>
                          <p className="text-[11px] text-slate-400 truncate max-w-[180px]">{rec.courseName}</p>
                        </td>
                        <td className="py-3.5 px-3">
                          {rec.admissionType === 'Enrolled' ? (
                            <span className="bg-emerald-950 text-emerald-300 border border-emerald-800/80 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 w-max">
                              <CheckCircle2 className="w-3 h-3" />
                              Enrolled
                            </span>
                          ) : (
                            <span className="bg-amber-950 text-amber-300 border border-amber-800/80 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 w-max">
                              <Eye className="w-3 h-3" />
                              Visited Lead
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3">
                          {rec.admissionType === 'Enrolled' ? (
                            <p className="font-bold text-emerald-400">₹{rec.feesPaid?.toLocaleString() || 0}</p>
                          ) : (
                            <p className="text-slate-500 font-mono">Inquiry Only</p>
                          )}
                          <p className="text-[11px] text-slate-500">{rec.date}</p>
                        </td>
                        <td className="py-3.5 px-3 max-w-[220px]">
                          <p className="text-slate-300 italic truncate">{rec.notes || '—'}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
