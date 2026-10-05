import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  BookOpen,
  Video,
  Award,
  FileCheck,
  CheckCircle2,
  Clock,
  Play,
  Download,
  Printer,
  ChevronRight,
  Sparkles,
  BarChart3,
  LogOut,
  User,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  ExternalLink,
  Lock,
  KeyRound,
  X,
  Check,
  Loader2,
  ArrowLeft,
  DownloadCloud,
  Eye,
  Trash2,
  ShieldCheck,
  History,
  ArrowRight,
  Layers
} from 'lucide-react';
import { Youtube } from '../SocialIcons';
import confetti from 'canvas-confetti';
import { getLearningHistory, clearLearningHistory, LearningHistoryItem } from '../../utils/learningHistory';
import { getOfflineDocs, saveOfflineDoc, isDocOffline, deleteOfflineDoc, OfflineDoc } from '../../utils/offlineStorage';

export const StudentDashboard: React.FC = () => {
  const {
    currentStudent,
    logoutStudent,
    courses,
    transactions,
    studyMaterials,
    videos,
    mockTests,
    updateStudentProgress,
    setSelectedDocForPreview,
    setSelectedVideoForPlayer,
    showToast,
    navigateTo,
    websiteSettings,
    updateStudentPassword
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'tests' | 'vault' | 'certificate'>('overview');

  // Test Runner State
  const [activeTest, setActiveTest] = useState<any | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [qId: number]: number }>({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [testScore, setTestScore] = useState(0);

  // Change Password State
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);

  // Learning Activity History State
  const [historyItems, setHistoryItems] = useState<LearningHistoryItem[]>(() =>
    getLearningHistory(currentStudent?.id || currentStudent?.email)
  );

  // Study Vault Filtering & Offline Reading State
  const [vaultSubTab, setVaultSubTab] = useState<'my' | 'offline' | 'all'>('my');
  const [offlineDocs, setOfflineDocs] = useState<OfflineDoc[]>(() => getOfflineDocs());
  const [readingOfflineDoc, setReadingOfflineDoc] = useState<OfflineDoc | null>(null);

  // Sync history and offline docs whenever tab or student changes
  useEffect(() => {
    if (currentStudent) {
      setHistoryItems(getLearningHistory(currentStudent.id || currentStudent.email));
      setOfflineDocs(getOfflineDocs());
    }
  }, [activeTab, currentStudent]);

  if (!currentStudent) {
    return (
      <div className="py-24 px-4 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-blue-100 text-[#0066FF] mx-auto flex items-center justify-center mb-4">
          <User className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-2">Student Portal Access</h3>
        <p className="text-xs text-slate-500 mb-6 font-medium">
          Please sign in with your student credentials to view your purchased courses, test series, and verified certificates.
        </p>
        <button
          onClick={() => navigateTo('home')}
          className="px-6 py-3 rounded-full bg-[#0066FF] text-white font-bold text-xs shadow-md shadow-blue-500/20 cursor-pointer"
        >
          Return to Home & Login
        </button>
      </div>
    );
  }

  const enrolledCourseList = courses.filter(c => (currentStudent?.enrolledCourses || []).includes(c.id));
  const pendingAdmissions = (transactions || []).filter(t =>
    t.studentEmail?.toLowerCase() === currentStudent?.email?.toLowerCase() &&
    (t.status === 'Pending Verification' || t.status === 'Pending')
  );
  const hasEnrollments = enrolledCourseList.length > 0;
  const activeCourse = enrolledCourseList[0] || null;

  // Derive student class: prioritize pending admission program or enrolled course target class
  const studentDisplayClass = React.useMemo(() => {
    if (pendingAdmissions.length > 0) {
      const p = pendingAdmissions[0];
      if (p.courseName?.includes('11 & 12')) return 'Class 11 & 12';
      if (p.courseName?.includes('9 & 10')) return 'Class 9 & 10';
      if (p.courseName?.includes('Computer')) return 'Computer Diploma';
      return p.courseName || 'Class 11 & 12';
    }
    if (enrolledCourseList.length > 0) {
      return enrolledCourseList[0].targetClass || 'Enrolled Student';
    }
    if (currentStudent.targetClass && currentStudent.targetClass !== 'Class 10') {
      return currentStudent.targetClass;
    }
    if (currentStudent.classEnrolled && currentStudent.classEnrolled !== 'Class 10') {
      return currentStudent.classEnrolled;
    }
    return 'Enrolled Student';
  }, [pendingAdmissions, enrolledCourseList, currentStudent]);

  // Real curriculum progress: exactly 0% if no enrollments!
  const overallCurriculumProgress = hasEnrollments
    ? Math.round(
        enrolledCourseList.reduce((acc, c) => acc + ((currentStudent.courseProgress || {})[c.id] || 0), 0) /
        enrolledCourseList.length
      )
    : 0;

  // Real mock tests attempted: from quizScores keys
  const attemptedQuizKeys = Object.keys(currentStudent.quizScores || {});
  const attemptedQuizCount = attemptedQuizKeys.length;
  const avgQuizScore = attemptedQuizCount > 0
    ? Math.round(Object.values(currentStudent.quizScores || {}).reduce((a, b) => a + b, 0) / attemptedQuizCount)
    : 0;

  // Real completed courses (100% completion) for certificate
  const completedCourses = enrolledCourseList.filter(c => ((currentStudent.courseProgress || {})[c.id] || 0) >= 100);
  const isCertificateUnlocked = completedCourses.length > 0;
  const certifiedCourse = completedCourses[0] || enrolledCourseList[0] || null;

  // Filter study materials for student's personal vault
  const userClass = (currentStudent.targetClass || currentStudent.classEnrolled || '').toLowerCase();
  const userSubjects = (currentStudent.selectedSubjects || []).map(s => s.toLowerCase());

  const relevantStudyMaterials = studyMaterials.filter(m => {
    const mClass = (m.targetClass || '').toLowerCase();
    const mSubj = (m.subject || '').toLowerCase();
    const mCat = (m.category || '').toLowerCase();
    const mTitle = (m.title || '').toLowerCase();

    // 1. Matches enrolled courses
    const matchesEnrolled = enrolledCourseList.some(c => {
      const cClass = (c.targetClass || '').toLowerCase();
      const cCat = (c.category || '').toLowerCase();
      const cTitle = (c.title || '').toLowerCase();
      return (
        (cClass && (mClass.includes(cClass) || cClass.includes(mClass))) ||
        (cCat && (mCat.includes(cCat) || cCat.includes(mCat))) ||
        (cTitle && cTitle.includes(mClass))
      );
    });
    if (matchesEnrolled) return true;

    // Strict stream isolation: Spoken English notes only for Spoken English students
    const isSpoken = mClass.includes('spoken') || mCat.includes('spoken') || mTitle.includes('manners') || mTitle.includes('vocabulary');
    if (isSpoken) {
      return userClass.includes('spoken');
    }

    // Strict stream isolation: Computer / DCA notes only for Computer students
    const isComputer = mClass.includes('computer') || mClass.includes('dca') || mCat.includes('computer');
    if (isComputer) {
      return userClass.includes('computer') || userClass.includes('dca');
    }

    // 2. Matches student's academic targetClass
    if (userClass) {
      const classMatch = (
        (userClass.includes('10') && mClass.includes('10')) ||
        (userClass.includes('9') && mClass.includes('9')) ||
        (userClass.includes('11') && mClass.includes('11')) ||
        (userClass.includes('12') && mClass.includes('12')) ||
        mClass.includes(userClass) ||
        userClass.includes(mClass)
      );
      if (classMatch) {
        return true;
      }
    }

    return false;
  });

  const handleSelectAnswer = (qId: number, optionIdx: number) => {
    if (testSubmitted) return;
    setUserAnswers({ ...userAnswers, [qId]: optionIdx });
  };

  const handleSubmitTest = () => {
    if (!activeTest) return;
    let score = 0;
    activeTest.questions.forEach((q: any) => {
      if (userAnswers[q.id] === q.correctOption) {
        score += 1;
      }
    });
    setTestScore(score);
    setTestSubmitted(true);

    if (score >= activeTest.passingMarks) {
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
      showToast(`Congratulations! You scored ${score}/${activeTest.totalMarks} Marks. Passed with distinction!`, 'success');
      if (activeCourse) {
        updateStudentProgress(activeCourse.id, 25);
      }
    } else {
      showToast(`You scored ${score}/${activeTest.totalMarks} Marks. Review explanations and try again!`, 'info');
    }
  };

  const handlePrintCertificate = () => {
    window.print();
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent.mustChangePassword && !currentPassInput) {
      showToast('Please enter your current password.', 'warning');
      return;
    }
    if (newPassInput.length < 6) {
      showToast('New password must be at least 6 characters long.', 'warning');
      return;
    }
    if (newPassInput !== confirmPassInput) {
      showToast('New password and confirm password do not match.', 'error');
      return;
    }
    setIsUpdatingPass(true);
    const passToSend = currentPassInput || currentStudent.tempPassword || '';
    const success = await updateStudentPassword(passToSend, newPassInput);
    setIsUpdatingPass(false);
    if (success) {
      setIsChangePasswordOpen(false);
      setCurrentPassInput('');
      setNewPassInput('');
      setConfirmPassInput('');
    }
  };
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Temporary Password Alert Banner if flagged */}
        {currentStudent.mustChangePassword && (
          <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-950">Temporary Password Active</h4>
                <p className="text-[11px] text-amber-800 font-medium">Your password was reset by Admin. Set your own password to secure your account.</p>
              </div>
            </div>
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors shrink-0 shadow-xs cursor-pointer"
            >
              Set New Password
            </button>
          </div>
        )}

        {/* Pending Admission Verification Alert Banner */}
        {pendingAdmissions.length > 0 && (
          <div className="relative overflow-hidden rounded-2xl border border-amber-200/90 bg-gradient-to-r from-amber-50 via-white to-amber-50/50 p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-amber-950">
                      Admission Verification In Progress
                    </h4>
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-bold">
                      {pendingAdmissions.length} Pending
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-amber-800 font-medium mt-1 leading-relaxed">
                    UPI payment received for <strong className="text-amber-950 font-bold">{pendingAdmissions.map(p => p.courseName).join(', ')}</strong> (Ref: <span className="font-mono text-amber-900 font-bold">{pendingAdmissions.map(p => p.utrNumber).join(', ')}</span>). Director review in progress.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('courses')}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shrink-0 shadow-xs flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <span>Check Admission Status</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Back to Home Button */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs hover:bg-slate-50 cursor-pointer transition-all active:scale-95"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#0066FF]" />
            <span>{typeof window !== 'undefined' && window.innerWidth >= 1024 ? 'Back to Website Home' : 'Back to Learning App'}</span>
          </button>
        </div>

        {/* Welcome Header Card - Executive Modern Design */}
        <div className="bg-white border border-slate-200/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xs relative overflow-hidden">
          {/* Subtle brand top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-sky-400" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 pt-1">
            {/* Left: Avatar & Profile Info */}
            <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
              <div className="w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-[#0066FF] to-blue-500 text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-sm ring-4 ring-blue-50 shrink-0 select-none">
                {(currentStudent.name || 'S').charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Student Portal
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0066FF] border border-blue-200/60 font-bold text-[11px]">
                    {studentDisplayClass}
                  </span>
                </div>

                <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight truncate mt-0.5">
                  Welcome Back, {currentStudent.name || 'Student'}!
                </h2>

                <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[11px] text-slate-500 font-medium mt-1">
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md font-mono text-slate-700 font-bold">
                    ID: {currentStudent.id}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="truncate max-w-[200px] sm:max-w-none text-slate-600">
                    {currentStudent.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
              <button
                onClick={() => setIsChangePasswordOpen(true)}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
                title="Change Password"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>Change Password</span>
              </button>
              
              <button
                onClick={() => setActiveTab('certificate')}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0066FF] border border-blue-200/80 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
              >
                <Award className="w-3.5 h-3.5 text-[#0066FF]" />
                <span>My Certificate</span>
              </button>

              <button
                onClick={logoutStudent}
                className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-2xs"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          {[
            { id: 'overview', label: 'My Progress', icon: BarChart3 },
            { id: 'courses', label: `My Courses (${enrolledCourseList.length})`, icon: GraduationCap },
            { id: 'tests', label: 'Online Mock Quizzes', icon: FileCheck },
            { id: 'vault', label: 'Study Vault', icon: BookOpen },
            { id: 'certificate', label: 'Verified Certificate', icon: Award }
          ].map(tab => (
            <button
              key={tab.id}
              data-tab={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card-clean">
                <span className="text-xs text-slate-500 font-bold block mb-1">Enrolled Batches</span>
                <span className="text-3xl font-black text-[#0066FF]">{enrolledCourseList.length}</span>
                <span className="text-[11px] text-slate-400 font-medium block mt-2">Active Academic Programs</span>
              </div>
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card-clean">
                <span className="text-xs text-slate-500 font-bold block mb-1">Overall Curriculum Completed</span>
                <span className="text-3xl font-black text-emerald-600">
                  {overallCurriculumProgress}%
                </span>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${overallCurriculumProgress}%` }}
                  />
                </div>
              </div>
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card-clean">
                <span className="text-xs text-slate-500 font-bold block mb-1">Mock Quizzes Attempted</span>
                <span className="text-3xl font-black text-purple-600">
                  {attemptedQuizCount} {attemptedQuizCount === 1 ? 'Test' : 'Tests'}
                </span>
                <span className="text-[11px] text-emerald-600 font-bold block mt-2">
                  {attemptedQuizCount > 0 ? `Passed with ${avgQuizScore}% Average` : 'No quizzes attempted yet'}
                </span>
              </div>
            </div>

            {/* Current Active Batch Feed or Empty Enrollment Banner */}
            {hasEnrollments && activeCourse ? (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card-clean space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black text-[#0066FF] uppercase">Active Program</span>
                    <h3 className="text-xl font-black text-slate-900 mt-0.5">{activeCourse.title}</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('courses')}
                    className="text-xs font-bold text-[#0066FF] hover:underline cursor-pointer"
                  >
                    View All Lectures
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.slice(0, 2).map(vid => (
                    <div
                      key={vid.id}
                      onClick={() => setSelectedVideoForPlayer(vid)}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-blue-300 transition-all cursor-pointer flex items-center gap-4 group"
                    >
                      <div className="w-16 h-16 rounded-xl bg-slate-900 overflow-hidden relative shrink-0">
                        <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="w-5 h-5 text-white fill-white" />
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#0066FF] uppercase">{vid.subject}</span>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-[#0066FF] transition-colors">{vid.title}</h4>
                        <span className="text-[10px] text-slate-400 font-medium">{vid.duration} • By {vid.instructor}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card-clean flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center shrink-0">
                    <GraduationCap className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">No Active Enrollment</span>
                    <h4 className="text-base font-black text-slate-900 mt-0.5">You haven't enrolled in any batch yet</h4>
                    <p className="text-xs text-slate-500 mt-1 max-w-md">
                      Enroll in Classes 1–12, DCA Computer, or Spoken English batches to unlock live class access, chapter notes, and completion certificates.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('batches')}
                  className="px-6 py-3 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-blue-500/25 shrink-0 transition-all cursor-pointer"
                >
                  Explore All Batches
                </button>
              </div>
            )}

            {/* ═══════════ RECENT LEARNING & ACTIVITY HISTORY ═══════════ */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card-clean space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-blue-50 text-[#0066FF]">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">My Learning History</h3>
                    <p className="text-[11px] text-slate-500 font-medium">Recently watched lectures and reviewed study notes.</p>
                  </div>
                </div>
                {historyItems.length > 0 && (
                  <button
                    onClick={() => {
                      clearLearningHistory(currentStudent.id || currentStudent.email);
                      setHistoryItems([]);
                      showToast('Learning history cleared.', 'info');
                    }}
                    className="text-[11px] text-slate-400 hover:text-rose-600 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear</span>
                  </button>
                )}
              </div>

              {historyItems.length === 0 ? (
                <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-medium">No recent learning activity recorded yet.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Watched video lectures and read notes will automatically appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {historyItems.slice(0, 6).map(item => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-blue-300 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          item.type === 'video' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-[#0066FF]'
                        }`}>
                          {item.type === 'video' ? <Play className="w-4 h-4 fill-current" /> : <BookOpen className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[9px] font-black uppercase text-[#0066FF] tracking-wider block">
                            {item.type === 'video' ? 'VIDEO LECTURE' : 'STUDY NOTE'} • {item.subject || item.targetClass || 'Curriculum'}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-[#0066FF] transition-colors">
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-slate-400">
                            {new Date(item.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (item.type === 'video') {
                            const foundVid = videos.find(v => v.id === item.itemId);
                            if (foundVid) {
                              setSelectedVideoForPlayer(foundVid);
                            } else {
                              setSelectedVideoForPlayer({
                                id: item.itemId,
                                title: item.title,
                                subject: item.subject || 'Lecture',
                                targetClass: item.targetClass || 'All Classes',
                                duration: item.duration || '15 min',
                                instructor: 'Director Aman Arora',
                                thumbnail: '/logo.jpg',
                                youtubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
                                views: '120 views',
                                dateAdded: '2026-09-01'
                              });
                            }
                          } else {
                            const foundMat = studyMaterials.find(m => m.id === item.itemId);
                            if (foundMat) {
                              setSelectedDocForPreview(foundMat);
                            } else {
                              setSelectedDocForPreview({
                                id: item.itemId,
                                title: item.title,
                                category: 'pdf_notes',
                                targetClass: item.targetClass || 'Class 10',
                                subject: item.subject || 'Notes',
                                chapter: 'Curriculum Unit',
                                pages: item.pages || 5,
                                downloadUrl: '/assets/sample_notes.pdf',
                                isPremium: false,
                                fileType: 'pdf',
                                dateAdded: '2026-09-01',
                                downloadsCount: 50,
                                previewContent: `Official study material for ${item.title}.`
                              });
                            }
                          }
                        }}
                        className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-blue-50 hover:border-blue-300 text-[#0066FF] text-[11px] font-bold shrink-0 transition-colors cursor-pointer"
                      >
                        Resume
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MY COURSES */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900">Enrolled Courses & Video Classes</h3>
              <span className="text-xs font-bold text-slate-500">
                {enrolledCourseList.length} Active • {pendingAdmissions.length} Pending
              </span>
            </div>

            {/* PENDING VERIFICATION COURSES */}
            {pendingAdmissions.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending Admin Verification ({pendingAdmissions.length})</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {pendingAdmissions.map(p => (
                    <div key={p.id} className="bg-amber-50/60 border border-amber-200 rounded-3xl p-6 shadow-card-clean space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3 animate-pulse" />
                          <span>Pending Admin Approval</span>
                        </span>
                        <span className="text-[11px] font-mono font-bold text-slate-500">Ref: {p.utrNumber}</span>
                      </div>
                      <h4 className="text-base font-black text-slate-900">{p.courseName}</h4>
                      <p className="text-xs text-amber-900 leading-relaxed font-medium">
                        Payment of ₹{p.amount} submitted with UTR/receipt proof. Director Aman Arora is currently verifying bank clearance. Your batch lectures and study vault materials will be activated upon approval.
                      </p>
                      <div className="pt-2">
                        <div className="flex justify-between text-xs text-slate-600 mb-1 font-bold">
                          <span>Curriculum Progress</span>
                          <span className="text-amber-700">0% (Locked until approved)</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div className="bg-amber-400 h-full rounded-full" style={{ width: '0%' }} />
                        </div>
                      </div>
                      <div className="pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs text-slate-500 font-medium">
                        <span>Status: Awaiting Verification</span>
                        <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-600 font-bold text-[11px]">
                          Locked
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACTIVE ENROLLED COURSES */}
            {enrolledCourseList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrolledCourseList.map(course => (
                  <div key={course.id} className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-card-clean space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] font-bold text-xs">
                        {course.targetClass}
                      </span>
                      <span className="text-xs font-bold text-emerald-600">Active Batch</span>
                    </div>
                    <h4 className="text-base font-black text-slate-900">{course.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{course.description}</p>
                    
                    <div className="pt-2">
                      <div className="flex justify-between text-xs text-slate-600 mb-1 font-bold">
                        <span>Batch Progress</span>
                        <span>{(currentStudent.courseProgress || {})[course.id] || 0}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-[#0066FF] h-full rounded-full" style={{ width: `${(currentStudent.courseProgress || {})[course.id] || 0}%` }} />
                      </div>
                    </div>

                    {/* Direct Batch Access: WhatsApp & Private Video Playlist */}
                    <div className="pt-2 flex flex-wrap gap-2">
                      {(course.whatsappRedirectUrl || websiteSettings?.defaultWhatsappRedirectUrl) && (
                        <a
                          href={course.whatsappRedirectUrl || websiteSettings?.defaultWhatsappRedirectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[11px] flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5 fill-current" />
                          <span>Join WhatsApp Group</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {(course.privatePlaylistUrl || websiteSettings?.defaultPlaylistRedirectUrl) && (
                        <a
                          href={course.privatePlaylistUrl || websiteSettings?.defaultPlaylistRedirectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-[11px] flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                        >
                          <Youtube className="w-3.5 h-3.5 fill-current" />
                          <span>Private Video Playlist</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">Instructor: {course.instructor}</span>
                      <button
                        onClick={() => {
                          if (videos.length > 0) setSelectedVideoForPlayer(videos[0]);
                        }}
                        className="px-4 py-2 rounded-full bg-[#0066FF] text-white text-xs font-bold shadow-sm cursor-pointer"
                      >
                        Watch Lecture
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : pendingAdmissions.length === 0 ? (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-10 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center mx-auto">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h4 className="text-base font-black text-slate-900">No Enrolled Courses Yet</h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium">
                  You have not enrolled in any academic or computer courses yet. Explore our courses on the home page.
                </p>
                <button
                  onClick={() => navigateTo('home')}
                  className="px-5 py-2.5 rounded-full bg-[#0066FF] text-white text-xs font-bold cursor-pointer"
                >
                  Browse Available Batches
                </button>
              </div>
            ) : null}
          </div>
        )}

        {/* TAB 3: ONLINE MOCK QUIZZES */}
        {activeTab === 'tests' && (
          <div className="space-y-6">
            {!activeTest ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Timed Online Mock Tests</h3>
                  <p className="text-xs text-slate-500 font-medium">Evaluate your speed, accuracy, and board examination preparedness.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockTests.map(test => (
                    <div key={test.id} className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-card-clean space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full bg-blue-50 text-[#0066FF] font-bold text-xs">
                          {test.targetClass} • {test.subject}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500">{test.durationMinutes} Mins</span>
                      </div>
                      <h4 className="text-base font-black text-slate-900">{test.title}</h4>
                      
                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600">Total Marks: {test.totalMarks}</span>
                        <button
                          onClick={() => {
                            setActiveTest(test);
                            setUserAnswers({});
                            setTestSubmitted(false);
                            setTestScore(0);
                          }}
                          className="px-5 py-2.5 rounded-full bg-[#0066FF] text-white text-xs font-bold shadow-sm"
                        >
                          Start Test
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Test Runner UI */
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-card-clean space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-[#0066FF] uppercase">{activeTest.subject}</span>
                    <h3 className="text-xl font-black text-slate-900">{activeTest.title}</h3>
                  </div>
                  <button
                    onClick={() => setActiveTest(null)}
                    className="px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold"
                  >
                    Exit Test
                  </button>
                </div>

                <div className="space-y-6">
                  {activeTest.questions.map((q: any, qIdx: number) => (
                    <div key={q.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
                      <h4 className="text-sm font-bold text-slate-900">
                        {qIdx + 1}. {q.question}
                      </h4>
                      <div className="space-y-2">
                        {q.options.map((opt: string, optIdx: number) => {
                          const isSelected = userAnswers[q.id] === optIdx;
                          const isCorrect = testSubmitted && optIdx === q.correctOption;
                          const isWrong = testSubmitted && isSelected && optIdx !== q.correctOption;

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectAnswer(q.id, optIdx)}
                              className={`w-full text-left p-3 rounded-xl text-xs font-medium border transition-all flex items-center gap-3 ${
                                isCorrect
                                  ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold'
                                  : isWrong
                                  ? 'bg-rose-100 border-rose-500 text-rose-900 font-bold'
                                  : isSelected
                                  ? 'bg-blue-100 border-[#0066FF] text-blue-900 font-bold'
                                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <span className="w-6 h-6 rounded-lg bg-slate-200 text-slate-800 flex items-center justify-center text-xs font-bold shrink-0">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {testSubmitted && (
                        <p className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 font-medium">
                          <strong>Explanation:</strong> {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {!testSubmitted ? (
                  <button
                    onClick={handleSubmitTest}
                    className="w-full py-4 rounded-full bg-[#0066FF] text-white font-black text-xs uppercase tracking-wider shadow-md shadow-blue-500/25"
                  >
                    Submit Test & Calculate Score
                  </button>
                ) : (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <h4 className="text-lg font-black text-slate-900">Your Score: {testScore} / {activeTest.totalMarks} Marks</h4>
                    <button
                      onClick={() => setActiveTest(null)}
                      className="px-6 py-2.5 rounded-full bg-[#0066FF] text-white text-xs font-bold shadow-sm"
                    >
                      Back to All Tests
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: STUDY VAULT */}
        {activeTab === 'vault' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">Study Notes & PYQ Vault</h3>
                <p className="text-xs text-slate-500 font-medium">Read online or save to your phone for offline zero-data access.</p>
              </div>

              {/* Vault Filter Tabs */}
              <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setVaultSubTab('my');
                    setReadingOfflineDoc(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    vaultSubTab === 'my'
                      ? 'bg-[#0066FF] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  My Notes ({relevantStudyMaterials.length})
                </button>
                <button
                  id="subtab-offline-vault"
                  type="button"
                  onClick={() => {
                    setVaultSubTab('offline');
                    setOfflineDocs(getOfflineDocs());
                  }}
                  className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    vaultSubTab === 'offline'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Offline Saved ({offlineDocs.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVaultSubTab('all');
                    setReadingOfflineDoc(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    vaultSubTab === 'all'
                      ? 'bg-[#0066FF] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Institute ({studyMaterials.length})
                </button>
              </div>
            </div>

            {/* Offline Reader View */}
            {readingOfflineDoc ? (
              <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-card-clean space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <button
                    type="button"
                    onClick={() => setReadingOfflineDoc(null)}
                    className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Notes List</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                      Offline Zero-Data Reader
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDocForPreview({
                          id: readingOfflineDoc.id,
                          title: readingOfflineDoc.title,
                          category: (readingOfflineDoc.category as any) || 'pdf_notes',
                          targetClass: readingOfflineDoc.targetClass,
                          subject: readingOfflineDoc.subject || 'Curriculum',
                          chapter: 'Offline Notes',
                          pages: 15,
                          downloadUrl: readingOfflineDoc.fileUrl,
                          googleDriveUrl: readingOfflineDoc.fileUrl?.includes('drive.google.com') ? readingOfflineDoc.fileUrl : undefined,
                          isGoogleDrive: Boolean(readingOfflineDoc.fileUrl?.includes('drive.google.com')),
                          isPremium: false,
                          fileType: (readingOfflineDoc.fileType as any) || 'pdf',
                          dateAdded: readingOfflineDoc.downloadedAt,
                          downloadsCount: 1,
                          previewContent: readingOfflineDoc.contentSnippet || 'Comprehensive theoretical study notes and formulas prepared by L.C.C. faculty.'
                        });
                      }}
                      className="px-3 py-1 rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white text-[11px] font-bold shadow-xs cursor-pointer"
                    >
                      Fullscreen Reader
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {readingOfflineDoc.targetClass} • {readingOfflineDoc.subject || 'Curriculum'}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 mt-0.5">{readingOfflineDoc.title}</h3>
                  <span className="text-[11px] text-slate-400 font-medium">Saved to Phone on {readingOfflineDoc.downloadedAt} • No Internet Needed</span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 sm:p-5 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs sm:text-sm text-slate-800 leading-relaxed font-sans">
                    <span className="font-bold text-[#0066FF] block mb-1">📘 Chapter Theory & Core Concepts:</span>
                    <p className="whitespace-pre-line">
                      {readingOfflineDoc.contentSnippet || 'Comprehensive theoretical study notes, formulas, and board questions prepared by L.C.C. faculty.'}
                    </p>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-2">
                    <span className="font-bold text-slate-900 block">📝 Essential Formulas & Key Exam Highlights:</span>
                    <ul className="space-y-1.5 list-disc list-inside text-xs text-slate-600">
                      <li>Complete step-by-step NCERT & Exemplar syllabus derivations included.</li>
                      <li>Standard board examination definitions and high-weightage question patterns.</li>
                      <li>Rapid revision summary and formula quick-reference chart.</li>
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs">
                    <span className="font-bold">💡 Faculty Study Advice:</span>
                    <p className="mt-0.5">Revise key definitions and solve corresponding chapter DPP questions to test your speed and accuracy.</p>
                  </div>
                </div>
              </div>
            ) : vaultSubTab === 'offline' ? (
              /* Offline Docs List */
              offlineDocs.length === 0 ? (
                <div className="py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-6 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <DownloadCloud className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-black text-slate-900">Offline Vault is Empty</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Click "Save Offline" on any study notes to read without internet data on your phone.
                  </p>
                  <button
                    onClick={() => setVaultSubTab('my')}
                    className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                  >
                    Browse My Curriculum Notes
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {offlineDocs.map(doc => (
                    <div key={doc.id} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card-clean flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-wider block">
                          OFFLINE SAVED • {doc.targetClass}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 truncate mt-0.5">{doc.title}</h4>
                        <span className="text-xs text-slate-400 font-medium">Saved: {doc.downloadedAt}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setReadingOfflineDoc(doc);
                            setSelectedDocForPreview({
                              id: doc.id,
                              title: doc.title,
                              category: (doc.category as any) || 'pdf_notes',
                              targetClass: doc.targetClass,
                              subject: doc.subject || 'Curriculum',
                              chapter: 'Offline Notes',
                              pages: 15,
                              downloadUrl: doc.fileUrl,
                              googleDriveUrl: doc.fileUrl?.includes('drive.google.com') ? doc.fileUrl : undefined,
                              isGoogleDrive: Boolean(doc.fileUrl?.includes('drive.google.com')),
                              isPremium: false,
                              fileType: (doc.fileType as any) || 'pdf',
                              dateAdded: doc.downloadedAt,
                              downloadsCount: 1,
                              previewContent: doc.contentSnippet || 'Comprehensive theoretical study notes and formulas prepared by L.C.C. faculty.'
                            });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                        >
                          Read Offline
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            deleteOfflineDoc(doc.id);
                            setOfflineDocs(getOfflineDocs());
                            showToast(`Removed "${doc.title}" from offline vault.`, 'info');
                          }}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete from offline storage"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* My Enrolled Notes or All Notes */
              (() => {
                const displayList = vaultSubTab === 'my' ? relevantStudyMaterials : studyMaterials;
                if (displayList.length === 0) {
                  return (
                    <div className="py-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 p-6 space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0066FF] flex items-center justify-center mx-auto">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <h4 className="text-base font-black text-slate-900">No Specific Notes Assigned Yet</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Your profile currently has target class <strong>"{currentStudent.targetClass || 'General'}"</strong>. Enroll in a batch or browse all institute notes below.
                      </p>
                      <button
                        onClick={() => setVaultSubTab('all')}
                        className="px-4 py-2 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                      >
                        View All Institute Notes ({studyMaterials.length})
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayList.map(m => {
                      const isOffline = isDocOffline(m.id);
                      return (
                        <div key={m.id} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card-clean flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-[#0066FF] uppercase">
                              {m.targetClass} • {m.subject}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 mt-0.5 truncate">{m.title}</h4>
                            <span className="text-xs text-slate-400 font-medium">{m.pages} Pages</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => setSelectedDocForPreview(m)}
                              className="px-3.5 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0066FF] text-xs font-bold cursor-pointer"
                            >
                              Read Online
                            </button>
                            <button
                              type="button"
                              disabled={isOffline}
                              onClick={() => {
                                saveOfflineDoc({
                                  id: m.id,
                                  title: m.title,
                                  category: m.category,
                                  targetClass: m.targetClass,
                                  subject: m.subject,
                                  fileUrl: m.downloadUrl || '#',
                                  fileType: m.fileType || 'pdf',
                                  contentSnippet: m.previewContent
                                });
                                setOfflineDocs(getOfflineDocs());
                                showToast(`✅ "${m.title}" saved offline!`, 'success');
                              }}
                              className={`p-2 rounded-full cursor-pointer transition-colors ${
                                isOffline
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                              }`}
                              title={isOffline ? 'Already saved offline' : 'Save for offline reading'}
                            >
                              {isOffline ? <Check className="w-3.5 h-3.5" /> : <DownloadCloud className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()
            )}
          </div>
        )}

        {/* TAB 5: CERTIFICATE */}
        {activeTab === 'certificate' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">Verified Academic Completion Certificate</h3>
                <p className="text-xs text-slate-500 font-medium">Official verified credential issued by Director Aman Arora.</p>
              </div>
              {isCertificateUnlocked && (
                <button
                  onClick={handlePrintCertificate}
                  className="px-5 py-2.5 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Official Certificate</span>
                </button>
              )}
            </div>

            {!isCertificateUnlocked ? (
              /* 🔒 LOCKED CERTIFICATE STATE */
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-card-clean max-w-2xl mx-auto text-center space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-amber-50 border-2 border-amber-200 text-amber-500 flex items-center justify-center mx-auto shadow-md">
                  <Lock className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-black uppercase tracking-widest text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                    CERTIFICATE LOCKED
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    100% Course Completion Required
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                    Official completion certificates signed by Director Aman Arora are awarded only upon enrolling in a batch and achieving 100% curriculum completion.
                  </p>
                </div>

                {/* Requirements Progress Card */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">Certificate Unlock Criteria:</span>

                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-200">
                    <span className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#0066FF]" />
                      <span>Active Batch Enrollment:</span>
                    </span>
                    <span className={`font-black ${hasEnrollments ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {hasEnrollments ? `Enrolled (${enrolledCourseList.length} Courses)` : 'Not Enrolled'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-200">
                    <span className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-emerald-600" />
                      <span>Curriculum Completion:</span>
                    </span>
                    <span className={`font-black ${overallCurriculumProgress >= 100 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {overallCurriculumProgress}% / 100%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs py-2">
                    <span className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-purple-600" />
                      <span>Chapter Mock Assessments:</span>
                    </span>
                    <span className={`font-black ${attemptedQuizCount > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {attemptedQuizCount > 0 ? `${attemptedQuizCount} Tests Cleared` : 'Pending (0 Tests)'}
                    </span>
                  </div>
                </div>

                {/* Action CTA */}
                <div>
                  {hasEnrollments ? (
                    <button
                      onClick={() => setActiveTab('courses')}
                      className="px-6 py-3 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                    >
                      Resume Learning to Unlock Certificate
                    </button>
                  ) : (
                    <button
                      onClick={() => navigateTo('batches')}
                      className="px-6 py-3 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-blue-500/25 transition-all cursor-pointer"
                    >
                      Enroll in a Batch to Start
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* 🎓 REDESIGNED WORLD-CLASS VERIFIED CERTIFICATE */
              <div className="bg-white rounded-3xl p-8 sm:p-14 border-8 border-double border-[#0066FF] ring-4 ring-amber-400/80 shadow-2xl text-center space-y-6 relative max-w-4xl mx-auto overflow-hidden">
                {/* Background Watermark Seal */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <div className="w-96 h-96 rounded-full border-[20px] border-[#0066FF] flex items-center justify-center font-black text-8xl font-serif">
                    LCC
                  </div>
                </div>

                {/* Institute Header */}
                <div className="flex items-center justify-center gap-4 relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0066FF] to-blue-800 text-white flex items-center justify-center font-black text-2xl shadow-md border-2 border-amber-400 shrink-0">
                    LCC
                  </div>
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
                      LAKSHYA CAREER CLASSES (L.C.C.)
                    </h2>
                    <span className="text-[11px] sm:text-xs text-amber-700 uppercase tracking-widest font-black block">
                      Government Registered Premier Academic & Computer Institute
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      Main Campus: Palahipatti, Sindhora Road, Varanasi - 221206 (U.P.)
                    </span>
                  </div>
                </div>

                <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto my-2" />

                {/* Proclamation */}
                <div className="py-2 space-y-2 relative z-10">
                  <span className="text-xs font-black uppercase tracking-[0.25em] text-slate-500 block">
                    CERTIFICATE OF MERIT & CURRICULUM MASTERY
                  </span>
                  <p className="text-xs text-slate-500 italic">This is proudly awarded to</p>
                  <h3 className="text-3xl sm:text-4xl font-serif font-black text-slate-900 italic tracking-tight underline decoration-amber-400/60 decoration-2 underline-offset-8">
                    {currentStudent.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto pt-4 leading-relaxed font-medium">
                    for satisfactorily attending all academic sessions, completing 100% of the prescribed coursework, and demonstrating outstanding excellence in
                  </p>
                  <div className="inline-block px-5 py-2 rounded-2xl bg-blue-50 border border-blue-200 text-[#0066FF] font-black text-sm sm:text-base tracking-wide shadow-xs">
                    {certifiedCourse?.title || 'Academic Coaching Program'}
                  </div>
                  <div className="pt-1">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                      Grade: A+ Distinction (100% Completed)
                    </span>
                  </div>
                </div>

                {/* Signatures & Live Verification Bar */}
                <div className="pt-8 border-t-2 border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-600 relative z-10">
                  <div className="text-left space-y-1">
                    <span className="font-mono text-[11px] block font-bold text-slate-500">
                      Cert ID: LCC-CERT-2026-{(certifiedCourse?.id || '8842').toUpperCase().slice(-5)}-{currentStudent.id?.slice(-4) || '9921'}
                    </span>
                    <span className="text-[11px] text-slate-400 block font-medium">
                      Date of Issue: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-bold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Tamper-Proof Digital Credential</span>
                    </span>
                  </div>

                  {/* Verification QR Code */}
                  <div className="flex flex-col items-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(
                        `https://lcc-coaching.edu/verify?cert=LCC-CERT-2026-${(certifiedCourse?.id || '8842').toUpperCase()}&student=${encodeURIComponent(currentStudent.name)}`
                      )}`}
                      alt="Verification QR Code"
                      className="w-16 h-16 rounded-xl border border-slate-300 p-1 bg-white shadow-xs"
                    />
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Scan to Verify</span>
                  </div>

                  <div className="text-right space-y-0.5">
                    <span className="font-serif italic font-bold text-lg text-slate-900 block tracking-tight">
                      Aman Arora
                    </span>
                    <span className="font-bold text-[11px] text-slate-700 block">Director & Head Faculty</span>
                    <span className="text-[10px] text-slate-400 block">Learning Coaching Center (L.C.C.)</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Change Password Modal */}
        {isChangePasswordOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 border border-slate-200">
              <button
                onClick={() => setIsChangePasswordOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-blue-100 text-[#0066FF] flex items-center justify-center shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Change Your Password</h3>
                  <p className="text-xs text-slate-500">Set a new secret password for your student portal.</p>
                </div>
              </div>

              <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
                {!currentStudent.mustChangePassword && (
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      placeholder="Enter current password"
                      value={currentPassInput}
                      onChange={e => setCurrentPassInput(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                )}

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    New Password * (Min 6 characters)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter new strong password"
                    value={newPassInput}
                    onChange={e => setNewPassInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Confirm new password"
                    value={confirmPassInput}
                    onChange={e => setConfirmPassInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsChangePasswordOpen(false)}
                    className="flex-1 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingPass}
                    className="flex-1 py-3 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isUpdatingPass ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Update Password</span>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
