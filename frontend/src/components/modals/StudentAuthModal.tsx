import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Mail, Lock, Phone, X, GraduationCap, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export const StudentAuthModal: React.FC = () => {
  const { isStudentAuthModalOpen, setIsStudentAuthModalOpen, setIsGoalModalOpen, loginStudent, loginStaff, registerStudent, updateStudentPassword, navigateTo, showToast } = useApp();
  const [tab, setTab] = useState<'student' | 'staff' | 'register'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [targetClass, setTargetClass] = useState('Class 10');
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [needsNewPass, setNeedsNewPass] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');

  if (!isStudentAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (needsNewPass) {
      if (newPass.length < 6) {
        showToast('New password must be at least 6 characters.', 'warning');
        setIsLoading(false);
        return;
      }
      if (newPass !== confirmNewPass) {
        showToast('Passwords do not match.', 'error');
        setIsLoading(false);
        return;
      }
      const success = await updateStudentPassword(password, newPass);
      setIsLoading(false);
      if (success) {
        setNeedsNewPass(false);
        setIsStudentAuthModalOpen(false);
        setEmail('');
        setPassword('');
        setNewPass('');
        setConfirmNewPass('');
      }
      return;
    }

    if (tab === 'staff') {
      if (!email || !password) {
        showToast('Please enter both staff email and password.', 'warning');
        setIsLoading(false);
        return;
      }
      const success = await loginStaff(email.trim(), password);
      setIsLoading(false);
      if (success) {
        setIsStudentAuthModalOpen(false);
        setEmail('');
        setPassword('');
      }
      return;
    }

    if (tab === 'student') {
      if (!email || !password) {
        showToast('Please enter both student email and password.', 'warning');
        setIsLoading(false);
        return;
      }
      const success = await loginStudent(email.trim(), password);
      setIsLoading(false);
      if (success) {
        const savedSession = localStorage.getItem('lcc_student_session');
        const userObj = savedSession ? JSON.parse(savedSession) : null;
        if (userObj?.mustChangePassword || userObj?.tempPassword === password) {
          setNeedsNewPass(true);
          showToast('Temporary password verified! Please set your new password now.', 'info');
          return;
        }
        setIsStudentAuthModalOpen(false);
        setEmail('');
        setPassword('');
        // Trigger quick survey if student has not yet personalized their subjects
        if (!userObj?.selectedSubjects || userObj.selectedSubjects.length === 0) {
          setIsGoalModalOpen(true);
        }
      }
    } else {
      if (!name || !email || !phone || !password) {
        showToast('Please fill all required fields.', 'warning');
        setIsLoading(false);
        return;
      }
      const success = await registerStudent(name.trim(), email.trim(), phone.trim(), password, targetClass);
      setIsLoading(false);
      if (success) {
        setIsStudentAuthModalOpen(false);
        setIsGoalModalOpen(true);
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
      }
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
        <div className="relative w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
          
          {/* Close Button */}
          <button
            onClick={() => setIsStudentAuthModalOpen(false)}
            className="absolute top-3 right-3 z-30 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer"
            title="Close Modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Compact Blue Header */}
          <div className="px-5 py-4 bg-[#0066FF] text-white flex items-center gap-3">
            <img
              src="/logo.jpg"
              alt="L.C.C."
              className="w-10 h-10 rounded-xl object-contain bg-white shadow-sm border border-white/20"
            />
            <div>
              <h3 className="text-sm sm:text-base font-black">L.C.C. Learning & Campus Portal</h3>
              <span className="text-[11px] text-blue-100 font-medium">Students, Faculty & Academic Desk</span>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
            
            {needsNewPass ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#0066FF] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-blue-950">Set Your New Password</h4>
                    <p className="text-[11px] text-blue-850 leading-relaxed mt-0.5">
                      Temporary password verified! Please choose a new permanent password for your student portal.
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    New Secret Password * (Min 6 characters)
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="Enter new password"
                      value={newPass}
                      onChange={e => setNewPass(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      placeholder="Re-enter new password"
                      value={confirmNewPass}
                      onChange={e => setConfirmNewPass(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{ backgroundColor: '#0066FF', color: '#ffffff' }}
                    className="w-full py-3 rounded-xl bg-[#0066FF] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                    ) : (
                      <>
                        <span className="text-white font-black">SET PASSWORD & ENTER PORTAL</span>
                        <ArrowRight className="w-3.5 h-3.5 text-white" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* 3-Tab Selector: Student | Teacher / Staff | New Registration */}
                <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200 gap-1">
                  <button
                    type="button"
                    onClick={() => setTab('student')}
                    style={tab === 'student' ? { backgroundColor: '#0066FF', color: '#ffffff' } : { color: '#475569' }}
                    className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      tab === 'student'
                        ? 'bg-[#0066FF] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Student</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTab('staff')}
                    style={tab === 'staff' ? { backgroundColor: '#4f46e5', color: '#ffffff' } : { color: '#475569' }}
                    className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      tab === 'staff'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Teacher / Staff</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTab('register')}
                    style={tab === 'register' ? { backgroundColor: '#0066FF', color: '#ffffff' } : { color: '#475569' }}
                    className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      tab === 'register'
                        ? 'bg-[#0066FF] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Register</span>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  {tab === 'staff' && (
                    <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center gap-2.5 text-xs text-indigo-900 font-semibold">
                      <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>Faculty & Teacher desk login. Access your assigned branch & attendance.</span>
                    </div>
                  )}

                  {tab === 'register' && (
                    <>
                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Full Student Name *</label>
                        <div className="relative">
                          <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Aarav Patel"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Mobile / WhatsApp Number *</label>
                        <div className="relative">
                          <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            placeholder="9876543210"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700 block mb-1">Target Class / Course *</label>
                        <select
                          value={targetClass}
                          onChange={e => setTargetClass(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0066FF] font-medium"
                        >
                          <option>Class 1–5</option>
                          <option>Class 6–8</option>
                          <option>Class 9</option>
                          <option>Class 10 (Board)</option>
                          <option>Class 11</option>
                          <option>Class 12 (Board)</option>
                          <option>Computer DCA / ADCA</option>
                          <option>Spoken English Masterclass</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      {tab === 'staff' ? 'Staff Registered Email *' : 'Registered Email Address *'}
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        placeholder={tab === 'staff' ? 'faculty@lcc.edu' : 'name@example.com'}
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-slate-700">Password *</label>
                      {tab === 'student' && (
                        <button
                          type="button"
                          onClick={() => setIsForgotOpen(true)}
                          className="text-[10px] font-bold text-[#0066FF] hover:underline cursor-pointer"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      style={{
                        backgroundColor: tab === 'staff' ? '#4f46e5' : '#0066FF',
                        color: '#ffffff'
                      }}
                      className={`w-full py-3 rounded-xl text-white font-black text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                        tab === 'staff'
                          ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/25'
                          : 'bg-[#0066FF] hover:bg-blue-700 shadow-blue-500/25'
                      }`}
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        <>
                          <span className="text-white font-black">
                            {tab === 'staff'
                              ? 'SIGN IN AS TEACHER / STAFF'
                              : tab === 'student'
                              ? 'SIGN IN TO STUDENT PORTAL'
                              : 'CREATE STUDENT ACCOUNT'}
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-white" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}

          </div>

        </div>
      </div>

      {/* Forgot Password OTP Modal */}
      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        onSuccess={() => {
          setTab('student');
          showToast('Password updated! Please enter your new password to sign in.', 'success');
        }}
      />
    </>
  );
};
