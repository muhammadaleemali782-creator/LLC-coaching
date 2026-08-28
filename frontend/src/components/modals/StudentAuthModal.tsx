import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Mail, Lock, Phone, X, GraduationCap, ArrowRight, Loader2 } from 'lucide-react';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export const StudentAuthModal: React.FC = () => {
  const { isStudentAuthModalOpen, setIsStudentAuthModalOpen, loginStudent, registerStudent, showToast } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [targetClass, setTargetClass] = useState('Class 10');
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!isStudentAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (tab === 'login') {
      if (!email || !password) {
        showToast('Please enter both student email and password.', 'warning');
        setIsLoading(false);
        return;
      }
      const success = await loginStudent(email.trim(), password);
      setIsLoading(false);
      if (success) {
        setIsStudentAuthModalOpen(false);
        setEmail('');
        setPassword('');
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
            <div className="p-2 rounded-xl bg-white/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black">Student Portal</h3>
              <span className="text-[11px] text-blue-100 font-medium">L.C.C. Academic & Test Hub</span>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
            
            {/* Tab Selector */}
            <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200">
              <button
                type="button"
                onClick={() => setTab('login')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  tab === 'login'
                    ? 'bg-[#0066FF] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setTab('register')}
                className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                  tab === 'register'
                    ? 'bg-[#0066FF] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                New Registration
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
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
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Student Email Address *</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="student@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-slate-700">Password *</label>
                  {tab === 'login' && (
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
                  className="w-full py-3 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>{tab === 'login' ? 'SIGN IN TO PORTAL' : 'CREATE STUDENT ACCOUNT'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>

        </div>
      </div>

      {/* Forgot Password OTP Modal */}
      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        onSuccess={() => {
          setTab('login');
          showToast('Password updated! Please enter your new password to sign in.', 'success');
        }}
      />
    </>
  );
};
