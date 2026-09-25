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
  BadgeAlert
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
    showToast,
    navigateTo
  } = useApp();

  // Login form state (if not logged in)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<'attendance' | 'admission' | 'my-records'>('attendance');

  // Attendance form state
  const [attStatus, setAttStatus] = useState<'Present' | 'Absent' | 'On Leave'>('Present');
  const [attReason, setAttReason] = useState('');
  const [isSubmittingAtt, setIsSubmittingAtt] = useState(false);

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

  // Today's date string
  const todayStr = new Date().toISOString().split('T')[0];

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

  // Handle marking attendance
  const handleAttendanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((attStatus === 'On Leave' || attStatus === 'Absent') && !attReason.trim()) {
      showToast('कृपया छुट्टी या ना आने का कारण (Reason) अवश्य दर्ज करें।', 'warning');
      return;
    }
    setIsSubmittingAtt(true);
    const success = await markStaffAttendance(attStatus, attReason);
    if (success) {
      setAttReason('');
    }
    setIsSubmittingAtt(false);
  };

  // Handle student admission / visit inquiry submit
  const handleAdmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !phone.trim()) {
      showToast('छात्र का नाम और मोबाइल नंबर अनिवार्य हैं।', 'warning');
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
              कर्मचारी पोर्टल • Staff Portal
            </span>
            <h1 className="text-2xl font-black text-white mt-3">Employee & Faculty Login</h1>
            <p className="text-sm text-slate-400 mt-1">
              शाखा अनुसार उपस्थिति (Attendance) लगाएं और नए छात्रों का दाखिला या विज़िट दर्ज करें
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
                  <span>कर्मचारी लॉगिन करें (Log In)</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Staff Logins */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <p className="text-xs text-slate-400 font-semibold mb-3 text-center">
              त्वरित डेमो अकाउंट्स (Demo Staff Shortcuts):
            </p>
            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => autofillStaff('rajesh@lcc.edu')}
                className="w-full text-left bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 rounded-xl p-2.5 transition-all flex items-center justify-between text-xs"
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
                className="w-full text-left bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 rounded-xl p-2.5 transition-all flex items-center justify-between text-xs"
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
                className="w-full text-left bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 rounded-xl p-2.5 transition-all flex items-center justify-between text-xs"
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
              Default demo password: <span className="text-slate-300 font-mono">Staff@123</span>
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
                    {new Date().toLocaleDateString('hi-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Logout and Today Status Action */}
            <div className="flex items-center gap-3">
              <div className="bg-slate-800/80 border border-slate-700/80 px-4 py-2 rounded-2xl text-right">
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">आज की उपस्थिति (Status)</p>
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
                    <span className="text-xs font-bold text-slate-400">हाजिरी नहीं लगी (Not Marked)</span>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={logoutStaff}
                className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>लॉगआउट</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60">
              <p className="text-xs text-slate-400 font-medium">मेरे कुल नामांकित छात्र (Enrolled)</p>
              <p className="text-2xl font-black text-emerald-400 mt-1">{myEnrolledCount}</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60">
              <p className="text-xs text-slate-400 font-medium">विज़िट व पूछताछ (Visited Leads)</p>
              <p className="text-2xl font-black text-amber-400 mt-1">{myVisitedCount}</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60">
              <p className="text-xs text-slate-400 font-medium">कुल संपर्क छात्र (Total)</p>
              <p className="text-2xl font-black text-primary-400 mt-1">{myEnrolledCount + myVisitedCount}</p>
            </div>
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60">
              <p className="text-xs text-slate-400 font-medium">कन्वर्जन दर (Conversion)</p>
              <p className="text-2xl font-black text-indigo-400 mt-1">
                {myEnrolledCount + myVisitedCount > 0
                  ? `${Math.round((myEnrolledCount / (myEnrolledCount + myVisitedCount)) * 100)}%`
                  : '0%'}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-800 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('attendance')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'attendance'
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>1. आज की उपस्थिति दर्ज करें (Daily Attendance)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('admission')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'admission'
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>2. नया दाखिला / विज़िट दर्ज करें (New Student / Visit)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('my-records')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'my-records'
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>3. मेरे छात्र व पूछताछ सूची (My Students List - {myRecords.length})</span>
          </button>
        </div>

        {/* TAB 1: ATTENDANCE MARKING */}
        {activeTab === 'attendance' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-primary-400 bg-primary-950/60 px-3 py-1 rounded-full border border-primary-800/40">
                  Daily Attendance Log
                </span>
                <h2 className="text-xl font-black text-white mt-2">अपनी आज की उपस्थिति लगाएं (Mark Attendance)</h2>
                <p className="text-sm text-slate-400 mt-1">
                  यदि आप उपस्थित हैं तो &ldquo;Present&rdquo; चुनें, यदि छुट्टी पर हैं या नहीं आ सकते तो कारण अवश्य लिखें।
                </p>
              </div>

              {myTodayAtt && (
                <div className="mb-6 p-4 rounded-2xl bg-slate-800/70 border border-slate-700 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold text-slate-300">
                      आज की रिकॉर्ड की गई उपस्थिति (Recorded for Today):
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
                    Updated
                  </span>
                </div>
              )}

              <form onSubmit={handleAttendanceSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                    स्थिति चुनें (Select Today&apos;s Status)
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
                      <p className="font-bold text-sm text-emerald-400">Present (उपस्थित)</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Campus duties on track</p>
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
                      <p className="font-bold text-sm text-amber-400">On Leave (छुट्टी पर)</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Approved / planned leave</p>
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
                      <p className="font-bold text-sm text-rose-400">Absent (अनुपस्थित)</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Urgent emergency / unavail</p>
                    </button>
                  </div>
                </div>

                {(attStatus === 'On Leave' || attStatus === 'Absent') && (
                  <div className="bg-slate-950/60 p-4 rounded-2xl border border-amber-500/30">
                    <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <BadgeAlert className="w-4 h-4" />
                      ना आने या छुट्टी का कारण (Reason for Leave/Absence - अनिवार्य) *
                    </label>
                    <textarea
                      rows={3}
                      value={attReason}
                      onChange={e => setAttReason(e.target.value)}
                      placeholder="उदा. 'तबीयत खराब होने के कारण', 'पारिवारिक कार्यक्रम में जाना है', आदि लिखें..."
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
                      ? 'दर्ज हो रही है...'
                      : `आज की उपस्थिति सेव करें (${attStatus})`}
                  </span>
                </button>
              </form>
            </div>

            {/* Attendance Guidelines Card */}
            <div className="space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary-400" />
                  हाजिरी नियम व निर्देश (Guidelines)
                </h3>
                <ul className="text-xs text-slate-400 space-y-2.5">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    प्रतिदिन सुबह 10:00 बजे से पहले अपनी उपस्थिति दर्ज करना अनिवार्य है।
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    यदि आप छुट्टी पर हैं तो कारण स्पष्ट रूप से लिखें ताकि डायरेक्टर सर को तुरंत डैशबोर्ड पर दिखाई दे।
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-400 font-bold">•</span>
                    आपकी शाखा: <strong className="text-white">{currentStaff.branch}</strong>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: NEW ADMISSION OR VISIT INQUIRY ENTRY */}
        {activeTab === 'admission' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto">
            <div className="mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
                Student Intake Desk
              </span>
              <h2 className="text-2xl font-black text-white mt-2">
                नया छात्र दाखिला या विज़िट दर्ज करें (Admission & Visit Registration)
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                अपनी शाखा में आए छात्र का नामांकन (Enrollment) पक्का करें या केवल पूछताछ/विज़िट को फॉलो-अप के लिए सेव करें।
              </p>
            </div>

            <form onSubmit={handleAdmissionSubmit} className="space-y-6">
              {/* Admission Type Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  छात्र की स्थिति चुनें (Intake Type) *
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
                        एडमिशन हो गया (Enrolled Student)
                      </span>
                      {admissionType === 'Enrolled' && (
                        <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300">
                      छात्र ने फीस देकर कोचिंग में एडमिशन पक्का कर लिया है।
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
                        विज़िट के लिए आए थे (Campus Visit / Inquiry)
                      </span>
                      {admissionType === 'Visited' && (
                        <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded">
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-300">
                      छात्र या अभिभावक केवल पूछताछ या डेमो क्लास के लिए शाखा में आए थे।
                    </p>
                  </button>
                </div>
              </div>

              {/* Student Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    छात्र का नाम (Student Full Name) *
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
                    पिता / अभिभावक का नाम (Father / Parent Name)
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
                    मोबाइल नंबर (Phone Number) *
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
                    ईमेल आईडी (Email ID - Optional)
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
                    कक्षा (Target Class)
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
                    कोर्स का नाम (Course / Program)
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
                      जमा की गई फीस (Fees Paid in ₹)
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
                    शाखा (Branch)
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
                  टिप्पणी / विज़िट विवरण (Notes & Follow-up Details)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. डेमो क्लास के लिए सोमवार को आएंगे, स्कॉलरशिप टेस्ट में 80% नंबर आए..."
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
                      {isSubmittingAdm ? 'सेव हो रहा है...' : 'छात्र का दाखिला पक्का करें (Confirm Admission)'}
                    </span>
                  </>
                ) : (
                  <>
                    <Eye className="w-5 h-5" />
                    <span>
                      {isSubmittingAdm ? 'सेव हो रहा है...' : 'कैंपस विज़िट पूछताछ दर्ज करें (Log Visit Lead)'}
                    </span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: MY STUDENTS & VISITORS LEDGER */}
        {activeTab === 'my-records' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-white">मेरे छात्र व विज़िटर्स लेजर (My Records)</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  आपके मार्गदर्शन में नामांकित छात्र और विज़िट करने वाले विद्यार्थी
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
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      typeFilter === 'all' ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    All ({myRecords.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTypeFilter('Enrolled')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      typeFilter === 'Enrolled' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Enrolled ({myEnrolledCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setTypeFilter('Visited')}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
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
                <p className="text-sm font-bold text-slate-300">कोई छात्र या विज़िट रिकॉर्ड नहीं मिला</p>
                <p className="text-xs text-slate-500 mt-1">
                  नए छात्र का दाखिला या विज़िट दर्ज करने के लिए ऊपर &ldquo;नया दाखिला&rdquo; टैब पर क्लिक करें।
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('admission')}
                  className="mt-4 bg-primary-600 hover:bg-primary-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
                >
                  + नया दाखिला दर्ज करें
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                      <th className="py-3 px-3">छात्र का नाम / विवरण</th>
                      <th className="py-3 px-3">कक्षा व कोर्स</th>
                      <th className="py-3 px-3">स्टेटस (Status)</th>
                      <th className="py-3 px-3">फीस / तारीख</th>
                      <th className="py-3 px-3">टिप्पणी / नोट्स</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {myRecords.map(rec => (
                      <tr key={rec.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-3">
                          <p className="font-bold text-white text-sm">{rec.studentName}</p>
                          <p className="text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>📞 {rec.phone}</span>
                            {rec.parentName && <span>• P: {rec.parentName}</span>}
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
                              Enrolled (दाखिला हो गया)
                            </span>
                          ) : (
                            <span className="bg-amber-950 text-amber-300 border border-amber-800/80 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 w-max">
                              <Eye className="w-3 h-3" />
                              Visited (पूछताछ/विज़िट)
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
                          <p className="text-slate-300 italic truncate">{rec.notes || 'कोई टिप्पणी नहीं'}</p>
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
