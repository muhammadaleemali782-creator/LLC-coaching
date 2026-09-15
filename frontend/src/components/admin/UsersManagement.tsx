import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Search, UserCheck, UserX, Shield, Mail, Phone, Calendar, KeyRound, Copy, Check, MessageSquare, X, RefreshCw } from 'lucide-react';
import { Student } from '../../types';

export const UsersManagement: React.FC = () => {
  const { students, toggleUserStatus, adminResetPassword, refreshUsers, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeResetModal, setActiveResetModal] = useState<{ student: Student; tempPassword: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    refreshUsers();
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await refreshUsers();
    setIsRefreshing(false);
    showToast('Student list refreshed from database.', 'info');
  };

  const handleResetPasswordClick = async (student: Student) => {
    const res = await adminResetPassword(student.id);
    if (res && res.tempPassword) {
      setActiveResetModal({ student, tempPassword: res.tempPassword });
      setCopied(false);
    }
  };

  const handleCopyPassword = () => {
    if (!activeResetModal) return;
    navigator.clipboard.writeText(activeResetModal.tempPassword);
    setCopied(true);
    showToast('Temporary password copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const cleanPhone = (phone: string) => {
    return phone.replace(/[^0-9]/g, '').slice(-10);
  };

  const filtered = students.filter(s =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.phone || '').includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white">Registered Students & Users</h2>
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Refresh User List"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#0066FF]' : ''}`} />
            </button>
          </div>
          <p className="text-xs text-slate-400">Manage student accounts, active status, and generate temporary reset passwords.</p>
        </div>

        <div className="w-full sm:w-64 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
          />
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                <th className="p-4 font-bold">Student Name</th>
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold">Phone (WhatsApp)</th>
                <th className="p-4 font-bold">Target Class</th>
                <th className="p-4 font-bold">Role</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4 font-black text-white">{user.name}</td>
                  <td className="p-4 text-slate-400 font-mono">{user.email}</td>
                  <td className="p-4 text-emerald-400 font-mono">{user.phone}</td>
                  <td className="p-4 text-blue-400 font-bold">{user.targetClass || user.classEnrolled || 'Class 10'}</td>
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[10px]">
                      {user.role || 'student'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      user.isActive !== false ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {user.isActive !== false ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleResetPasswordClick(user)}
                        className="px-2.5 py-1 rounded-xl text-[11px] font-bold border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Generate Temporary Reset Password"
                      >
                        <KeyRound className="w-3 h-3" />
                        <span>Reset Pass</span>
                      </button>

                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                          user.isActive !== false
                            ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                            : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                        }`}
                      >
                        {user.isActive !== false ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No matching student profiles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Password Reset Modal / Card */}
      {activeResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setActiveResetModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Temporary Password Generated</h3>
                <p className="text-xs text-slate-400">For {activeResetModal.student.name}</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 block">Temporary Password:</span>
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-base font-black text-amber-400 tracking-wider">
                  {activeResetModal.tempPassword}
                </span>
                <button
                  onClick={handleCopyPassword}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                The student can log in with this temporary password and set their new permanent password from their profile dashboard.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              {activeResetModal.student.phone && (
                <a
                  href={`https://wa.me/91${cleanPhone(activeResetModal.student.phone)}?text=${encodeURIComponent(
                    `Hello ${activeResetModal.student.name},\n\nYour LCC Coaching Portal password has been reset by Director Admin.\n\nYour Temporary Password is: ${activeResetModal.tempPassword}\n\nPlease login at https://lcc-edu.vercel.app and change your password in your student profile.\n\n— Learning Coaching Center (LCC) Varanasi`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-current" />
                  <span>Send via WhatsApp (+91 {cleanPhone(activeResetModal.student.phone)})</span>
                </a>
              )}

              <button
                onClick={() => setActiveResetModal(null)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
