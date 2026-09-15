import React, { useState } from 'react';
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
  Loader2
} from 'lucide-react';
import { Youtube } from '../SocialIcons';
import confetti from 'canvas-confetti';

export const StudentDashboard: React.FC = () => {
  const {
    currentStudent,
    logoutStudent,
    courses,
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
  const fallbackCourse = {
    id: 'batch-foundation',
    title: 'Comprehensive Board & Academic Coaching',
    category: 'secondary' as const,
    targetClass: currentStudent?.targetClass || currentStudent?.classEnrolled || 'Class 10',
    duration: 'Full Academic Session',
    fee: 3999,
    discountFee: 2999,
    rating: 5,
    enrolledCount: 150,
    instructor: 'Director Aman Arora',
    image: '/logo.jpg',
    badge: 'Premier',
    features: ['Daily Live Classes', 'Notes PDF Vault', 'Weekly Tests'],
    description: 'Premier curriculum batch designed for academic excellence.',
    syllabusHighlights: ['Complete NCERT & State Board syllabus', 'PYQ Mastery'],
    isPaid: true
  };
  const activeCourse = enrolledCourseList[0] || courses[0] || fallbackCourse;

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
      updateStudentProgress(activeCourse.id, 25);
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

        {/* Welcome Header Card */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-card-clean flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#0066FF] to-blue-400 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-blue-500/25 shrink-0">
              {(currentStudent.name || 'S').charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-slate-900">
                  Welcome Back, {currentStudent.name || 'Student'}!
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0066FF] font-bold text-xs">
                  {currentStudent.targetClass || currentStudent.classEnrolled || 'Class 10'}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Student ID: <span className="font-mono text-slate-700 font-bold">{currentStudent.id}</span> • Email: {currentStudent.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap justify-center">
            <button
              onClick={() => setIsChangePasswordOpen(true)}
              className="px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Change Password"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Change Password</span>
            </button>
            <button
              onClick={() => setActiveTab('certificate')}
              className="px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100 text-[#0066FF] border border-blue-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>My Certificate</span>
            </button>
            <button
              onClick={logoutStudent}
              className="px-4 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
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
                  {(currentStudent.courseProgress || {})[activeCourse.id] || 35}%
                </span>
                <div className="w-full bg-slate-100 rounded-full h-2 mt-3 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${(currentStudent.courseProgress || {})[activeCourse.id] || 35}%` }}
                  />
                </div>
              </div>
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card-clean">
                <span className="text-xs text-slate-500 font-bold block mb-1">Mock Quizzes Attempted</span>
                <span className="text-3xl font-black text-purple-600">3 Tests</span>
                <span className="text-[11px] text-emerald-600 font-bold block mt-2">Passed with 92% Average</span>
              </div>
            </div>

            {/* Current Active Batch Feed */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card-clean space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black text-[#0066FF] uppercase">Active Program</span>
                  <h3 className="text-xl font-black text-slate-900 mt-0.5">{activeCourse.title}</h3>
                </div>
                <button
                  onClick={() => setActiveTab('courses')}
                  className="text-xs font-bold text-[#0066FF] hover:underline"
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
          </div>
        )}

        {/* TAB 2: MY COURSES */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900">Enrolled Courses & Video Classes</h3>
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
                      <span>{(currentStudent.courseProgress || {})[course.id] || 35}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-[#0066FF] h-full rounded-full" style={{ width: `${(currentStudent.courseProgress || {})[course.id] || 35}%` }} />
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
            <h3 className="text-xl font-black text-slate-900">Enrolled Study Notes & PYQ Vault</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studyMaterials.map(m => (
                <div key={m.id} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card-clean flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold text-[#0066FF] uppercase">{m.targetClass} • {m.subject}</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-0.5">{m.title}</h4>
                    <span className="text-xs text-slate-400 font-medium">{m.pages} Pages</span>
                  </div>
                  <button
                    onClick={() => setSelectedDocForPreview(m)}
                    className="px-4 py-2 rounded-full bg-blue-50 text-[#0066FF] text-xs font-bold hover:bg-blue-100"
                  >
                    Read Online
                  </button>
                </div>
              ))}
            </div>
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
              <button
                onClick={handlePrintCertificate}
                className="px-5 py-2.5 rounded-full bg-[#0066FF] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>
            </div>

            {/* Official Printable Certificate Canvas */}
            <div className="bg-white rounded-3xl p-8 sm:p-14 border-8 border-double border-[#0066FF] shadow-2xl text-center space-y-6 relative max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0066FF] text-white flex items-center justify-center font-black text-xl shadow-md">
                  LCC
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">LAKSHYA CAREER CLASSES</h2>
                  <span className="text-xs text-slate-500 uppercase tracking-widest font-bold block">Premier Coaching & Computer Institute</span>
                </div>
              </div>

              <div className="py-2">
                <span className="text-xs text-slate-400 uppercase tracking-widest font-bold block">CERTIFICATE OF EXCELLENCE</span>
                <h3 className="text-3xl font-serif font-black text-slate-900 mt-2 italic">{currentStudent.name}</h3>
                <p className="text-xs text-slate-600 max-w-lg mx-auto mt-2 leading-relaxed">
                  has successfully completed the comprehensive academic coaching program in <strong>{activeCourse.title}</strong> with distinction and outstanding performance.
                </p>
              </div>

              <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <div className="text-left">
                  <span className="font-mono text-[11px] block text-slate-400">Cert ID: LCC-2026-CERT-8842</span>
                  <span className="font-bold">Verified Date: August 2026</span>
                </div>
                <div className="text-right">
                  <span className="font-serif italic font-bold text-base text-slate-900 block">Aman Arora</span>
                  <span className="font-bold text-[11px] text-slate-500">Director, Learning Coaching Center</span>
                </div>
              </div>
            </div>
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
