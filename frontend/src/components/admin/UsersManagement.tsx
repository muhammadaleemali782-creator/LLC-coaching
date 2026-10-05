import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Search, UserCheck, UserX, Shield, Mail, Phone, Calendar, KeyRound, Copy, Check, MessageSquare, X, RefreshCw, Clock, Eye, CheckCircle2, XCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { Student, Transaction } from '../../types';

export const UsersManagement: React.FC = () => {
  const {
    students,
    transactions,
    approveTransaction,
    rejectTransaction,
    refreshTransactions,
    toggleUserStatus,
    adminResetPassword,
    refreshUsers,
    showToast
  } = useApp();

  const [viewMode, setViewMode] = useState<'admissions' | 'students'>('admissions');
  const [search, setSearch] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeResetModal, setActiveResetModal] = useState<{ student: Student; tempPassword: string } | null>(null);
  const [previewEvidenceImage, setPreviewEvidenceImage] = useState<{ txn: Transaction; img: string } | null>(null);
  const [processingTxnId, setProcessingTxnId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    refreshUsers();
    refreshTransactions();
  }, []);

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([refreshUsers(), refreshTransactions()]);
    setIsRefreshing(false);
    showToast('Student & Admissions data refreshed from database.', 'info');
  };

  const handleApprove = async (txnId: string) => {
    setProcessingTxnId(txnId);
    try {
      await approveTransaction(txnId);
      await refreshUsers();
    } finally {
      setProcessingTxnId(null);
    }
  };

  const handleReject = async (txnId: string) => {
    setProcessingTxnId(txnId);
    try {
      await rejectTransaction(txnId);
    } finally {
      setProcessingTxnId(null);
    }
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

  const pendingTransactions = (transactions || []).filter(
    t => t.status === 'Pending Verification' || t.status === 'Pending'
  );

  const filteredStudents = students.filter(s =>
    (s.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.phone || '').includes(search)
  );

  const filteredTransactions = (transactions || []).filter(t =>
    (t.studentName || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.studentEmail || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.utrNumber || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.courseName || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header and Switcher Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white">Admissions & Student Management</h2>
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#0066FF]' : ''}`} />
            </button>
          </div>
          <p className="text-xs text-slate-400">
            Verify UPI payment screenshots & approve course admissions, or manage registered student accounts.
          </p>
        </div>

        <div className="w-full sm:w-64 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={viewMode === 'admissions' ? 'Search UTR, student, course...' : 'Search student by name, email...'}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
          />
        </div>
      </div>

      {/* Mode Toggle Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setViewMode('admissions')}
          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
            viewMode === 'admissions'
              ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Pending Admissions & UPI Proofs</span>
          {pendingTransactions.length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] animate-pulse">
              {pendingTransactions.length}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setViewMode('students')}
          className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer transition-all ${
            viewMode === 'students'
              ? 'bg-[#0066FF] text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>All Registered Students ({students.length})</span>
        </button>
      </div>

      {/* VIEW 1: ADMISSIONS & UPI TRANSACTIONS TABLE */}
      {viewMode === 'admissions' && (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                  <th className="p-4 font-bold">Student Details</th>
                  <th className="p-4 font-bold">Course Applied</th>
                  <th className="p-4 font-bold">Amount (₹)</th>
                  <th className="p-4 font-bold">UTR / UPI Ref</th>
                  <th className="p-4 font-bold">Evidence / Screenshot</th>
                  <th className="p-4 font-bold">Date</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Director Decision</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredTransactions.map(txn => {
                  const isPending = txn.status === 'Pending Verification' || txn.status === 'Pending';
                  const isApproved = txn.status === 'Completed';
                  const isRejected = txn.status === 'Rejected';

                  return (
                    <tr
                      key={txn.id}
                      className={`hover:bg-slate-900/40 transition-colors ${
                        isPending ? 'bg-amber-950/15' : ''
                      }`}
                    >
                      <td className="p-4">
                        <div className="font-black text-white">{txn.studentName || 'Student'}</div>
                        <div className="text-slate-400 font-mono text-[11px]">{txn.studentEmail}</div>
                        {txn.studentPhone && (
                          <div className="text-emerald-400 font-mono text-[10px]">{txn.studentPhone}</div>
                        )}
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-blue-400">{txn.courseName}</span>
                      </td>

                      <td className="p-4 font-black text-white text-sm">
                        ₹{txn.amount}
                      </td>

                      <td className="p-4 font-mono font-bold text-amber-300">
                        {txn.utrNumber}
                      </td>

                      <td className="p-4">
                        {txn.evidenceImage ? (
                          <button
                            type="button"
                            onClick={() => setPreviewEvidenceImage({ txn, img: txn.evidenceImage! })}
                            className="px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-blue-400 font-bold text-[11px] flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5 text-blue-400" />
                            <span>View Proof</span>
                          </button>
                        ) : (
                          <span className="text-slate-500 italic text-[11px]">No image attached</span>
                        )}
                      </td>

                      <td className="p-4 text-slate-400 font-mono text-[11px]">
                        {txn.date}
                      </td>

                      <td className="p-4">
                        {isPending && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 w-max">
                            <Clock className="w-3 h-3 animate-pulse" />
                            <span>Pending Review</span>
                          </span>
                        )}
                        {isApproved && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 w-max">
                            <Check className="w-3 h-3" />
                            <span>Approved & Enrolled</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1 w-max">
                            <X className="w-3 h-3" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        {isPending ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => handleApprove(txn.id)}
                              disabled={processingTxnId === txn.id}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                              title="Approve fee and officially enroll student"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{processingTxnId === txn.id ? 'Approving...' : 'Approve & Enroll'}</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(txn.id)}
                              disabled={processingTxnId === txn.id}
                              className="px-2.5 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/30 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                              title="Reject invalid transaction"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : isApproved ? (
                          <span className="text-[11px] font-bold text-emerald-400 flex items-center justify-end gap-1">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            <span>Enrolled in Batch</span>
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-red-400">Decision: Rejected</span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={8} className="p-10 text-center text-slate-500">
                      No transactions found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: REGISTERED STUDENTS DIRECTORY */}
      {viewMode === 'students' && (
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 bg-slate-900/60">
                <th className="p-4 font-bold">Student Name</th>
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold">Phone (WhatsApp)</th>
                <th className="p-4 font-bold">Target Class</th>
                <th className="p-4 font-bold">Enrolled Courses</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredStudents.map(user => (
                <tr key={user.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="p-4 font-black text-white">{user.name}</td>
                  <td className="p-4 text-slate-400 font-mono">{user.email}</td>
                  <td className="p-4 text-emerald-400 font-mono">{user.phone}</td>
                  <td className="p-4 text-blue-400 font-bold">{user.targetClass || user.classEnrolled || 'Class 10'}</td>
                  <td className="p-4 font-mono text-[11px] text-slate-300">
                    {user.enrolledCourses && user.enrolledCourses.length > 0 ? (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold">
                        {user.enrolledCourses.length} Course(s)
                      </span>
                    ) : (
                      <span className="text-slate-500">None</span>
                    )}
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
              {filteredStudents.length === 0 && (
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
      )}

      {/* Payment Evidence Screenshot Modal */}
      {previewEvidenceImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4">
            <button
              onClick={() => setPreviewEvidenceImage(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Payment Receipt Evidence</h3>
                <p className="text-xs text-slate-400">
                  {previewEvidenceImage.txn.studentName} • UTR: {previewEvidenceImage.txn.utrNumber}
                </p>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2 max-h-[60vh] flex items-center justify-center">
              <img
                src={previewEvidenceImage.img}
                alt="Payment Evidence Screenshot"
                className="max-h-[55vh] w-auto object-contain rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-slate-400">
                Amount: <strong className="text-white font-mono">₹{previewEvidenceImage.txn.amount}</strong>
              </div>
              <div className="flex items-center gap-2">
                {previewEvidenceImage.txn.status === 'Pending Verification' && (
                  <button
                    onClick={() => {
                      handleApprove(previewEvidenceImage.txn.id);
                      setPreviewEvidenceImage(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve & Enroll</span>
                  </button>
                )}
                <button
                  onClick={() => setPreviewEvidenceImage(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
