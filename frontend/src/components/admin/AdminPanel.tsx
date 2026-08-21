import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  GraduationCap,
  FileText,
  Video,
  Bell,
  Image,
  Users,
  CreditCard,
  Plus,
  Trash2,
  Edit,
  DollarSign,
  Layers,
  Sparkles,
  BarChart3,
  Calendar,
  Clock,
  CheckCircle2,
  Search,
  MessageSquare
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const {
    courses,
    addCourse,
    deleteCourse,
    updateCourse,
    studyMaterials,
    addStudyMaterial,
    deleteStudyMaterial,
    notices,
    addNotice,
    deleteNotice,
    videos,
    addVideoLecture,
    deleteVideoLecture,
    galleryItems,
    addGalleryItem,
    deleteGalleryItem,
    students,
    transactions,
    inquiries,
    logoutAdmin,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'courses' | 'materials' | 'videos' | 'notices' | 'gallery' | 'students' | 'payments' | 'inquiries'
  >('overview');

  const [newCourse, setNewCourse] = useState({
    title: '',
    category: 'secondary' as any,
    targetClass: 'Class 10',
    duration: 'Full Academic Year',
    fee: 8000,
    discountFee: 5999,
    instructor: 'Aman Arora',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
    description: 'Comprehensive coaching program designed for academic success.',
    badge: 'New Batch',
    features: 'Daily DPPs, Weekly Tests, Expert Faculty, Study Materials',
    syllabusHighlights: 'Unit 1: Fundamentals, Unit 2: Advanced Concepts, Unit 3: Board Revision',
    isPaid: true
  });

  const [newMaterial, setNewMaterial] = useState({
    title: '',
    category: 'pdf_notes' as any,
    targetClass: 'Class 10',
    subject: 'Science',
    chapter: 'Chapter 1: Foundations',
    pages: 15,
    downloadUrl: '#',
    isPremium: false,
    fileType: 'pdf' as any,
    previewContent: 'Verified revision notes containing definitions, formulas, and board questions.'
  });

  const [newNotice, setNewNotice] = useState({
    title: '',
    category: 'general' as any,
    description: '',
    isImportant: true,
    badgeText: 'ANNOUNCEMENT'
  });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourse.title) return;
    addCourse({
      ...newCourse,
      features: newCourse.features.split(',').map(s => s.trim()),
      syllabusHighlights: newCourse.syllabusHighlights.split(',').map(s => s.trim())
    });
    setNewCourse({
      title: '',
      category: 'secondary' as any,
      targetClass: 'Class 10',
      duration: 'Full Academic Year',
      fee: 8000,
      discountFee: 5999,
      instructor: 'Aman Arora',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80',
      description: '',
      badge: '',
      features: '',
      syllabusHighlights: '',
      isPaid: true
    });
  };

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterial.title) return;
    addStudyMaterial(newMaterial);
    setNewMaterial({
      title: '',
      category: 'pdf_notes',
      targetClass: 'Class 10',
      subject: 'Science',
      chapter: '',
      pages: 12,
      downloadUrl: '#',
      isPremium: false,
      fileType: 'pdf',
      previewContent: ''
    });
  };

  const handleCreateNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title) return;
    addNotice(newNotice);
    setNewNotice({
      title: '',
      category: 'general',
      description: '',
      isImportant: true,
      badgeText: 'NOTICE'
    });
  };

  const totalRevenue = transactions.reduce((sum, t) => sum + (t.status === 'Completed' ? t.amount : 0), 0);
  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Admin Header */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-card-clean flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="p-3.5 rounded-2xl bg-[#0066FF] text-white shadow-md shadow-blue-500/25">
              <Shield className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-slate-900">L.C.C. Admin Control Center</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0066FF] font-bold text-xs">
                  Director Portal
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Manage courses, upload study material PDFs, publish notices, and view payment logs.
              </p>
            </div>
          </div>

          <button
            onClick={logoutAdmin}
            className="px-5 py-2.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-xs font-bold transition-colors"
          >
            Logout Admin
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
          {[
            { id: 'overview', label: 'Analytics', icon: BarChart3 },
            { id: 'courses', label: `Courses (${courses.length})`, icon: GraduationCap },
            { id: 'materials', label: `Study Notes (${studyMaterials.length})`, icon: FileText },
            { id: 'notices', label: `Notices (${notices.length})`, icon: Bell },
            { id: 'students', label: `Students (${students.length})`, icon: Users },
            { id: 'payments', label: `Payments (${transactions.length})`, icon: CreditCard },
            { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: MessageSquare }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card-clean">
                <span className="text-xs text-slate-500 font-bold block mb-1">Total Online Revenue</span>
                <span className="text-3xl font-black text-emerald-600">₹{totalRevenue.toLocaleString()}</span>
                <span className="text-[11px] text-slate-400 font-medium block mt-2">From {transactions.length} Verified Transactions</span>
              </div>
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card-clean">
                <span className="text-xs text-slate-500 font-bold block mb-1">Registered Students</span>
                <span className="text-3xl font-black text-slate-900">{students.length}</span>
                <span className="text-[11px] text-[#0066FF] font-bold block mt-2">Active Scholars</span>
              </div>
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card-clean">
                <span className="text-xs text-slate-500 font-bold block mb-1">Active Courses & Batches</span>
                <span className="text-3xl font-black text-[#0066FF]">{courses.length}</span>
                <span className="text-[11px] text-slate-400 font-medium block mt-2">School & Computer Diplomas</span>
              </div>
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card-clean">
                <span className="text-xs text-slate-500 font-bold block mb-1">PDF Study Downloads</span>
                <span className="text-3xl font-black text-amber-500">
                  {studyMaterials.reduce((sum, m) => sum + m.downloadsCount, 0).toLocaleString()}
                </span>
                <span className="text-[11px] text-slate-400 font-medium block mt-2">Across {studyMaterials.length} Uploaded Notes</span>
              </div>
            </div>

            {/* Quick Summary Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card-clean space-y-4">
                <h3 className="text-base font-black text-slate-900 flex items-center justify-between">
                  <span>Recent Payments & E-Receipts</span>
                  <button onClick={() => setActiveTab('payments')} className="text-xs text-[#0066FF] font-bold">
                    View All
                  </button>
                </h3>
                <div className="space-y-3">
                  {transactions.slice(0, 4).map(txn => (
                    <div key={txn.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-slate-900 block">{txn.studentName}</span>
                        <span className="text-slate-500 text-[11px]">{txn.courseName}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-emerald-600 text-sm block">₹{txn.amount}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{txn.paymentMethod}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card-clean space-y-4">
                <h3 className="text-base font-black text-slate-900 flex items-center justify-between">
                  <span>Admission Leads</span>
                  <button onClick={() => setActiveTab('inquiries')} className="text-xs text-[#0066FF] font-bold">
                    View All
                  </button>
                </h3>
                <div className="space-y-3">
                  {inquiries.length === 0 ? (
                    <p className="text-xs text-slate-400 py-6 text-center">No new admission inquiries submitted yet.</p>
                  ) : (
                    inquiries.slice(0, 4).map(inq => (
                      <div key={inq.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex items-center justify-between gap-3 text-xs">
                        <div>
                          <span className="font-bold text-slate-900 block">{inq.studentName} ({inq.phone})</span>
                          <span className="text-slate-500 text-[11px]">{inq.targetCourse}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                          {inq.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE COURSES */}
        {activeTab === 'courses' && (
          <div className="space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card-clean space-y-5">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#0066FF]" />
                <span>Add / Publish New Course Batch</span>
              </h3>

              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-700 font-bold mb-1">Course Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Class 10 Board Toppers Batch"
                      value={newCourse.title}
                      onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-700 font-bold mb-1">Category</label>
                    <select
                      value={newCourse.category}
                      onChange={e => setNewCourse({ ...newCourse, category: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                    >
                      <option value="primary">Class 1-5</option>
                      <option value="middle">Class 6-8</option>
                      <option value="secondary">Class 9-10</option>
                      <option value="senior">Class 11-12</option>
                      <option value="computer">Computer & Tally</option>
                      <option value="spoken">Spoken English</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-700 font-bold mb-1">Target Class</label>
                    <input
                      type="text"
                      placeholder="e.g. Class 10"
                      value={newCourse.targetClass}
                      onChange={e => setNewCourse({ ...newCourse, targetClass: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-700 font-bold mb-1">Original Fee (₹)</label>
                    <input
                      type="number"
                      value={newCourse.fee}
                      onChange={e => setNewCourse({ ...newCourse, fee: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-700 font-bold mb-1">Discounted Fee (₹)</label>
                    <input
                      type="number"
                      value={newCourse.discountFee}
                      onChange={e => setNewCourse({ ...newCourse, discountFee: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-700 font-bold mb-1">Lead Instructor</label>
                    <input
                      type="text"
                      value={newCourse.instructor}
                      onChange={e => setNewCourse({ ...newCourse, instructor: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-[#0066FF] text-white text-xs font-black uppercase tracking-wider shadow-md shadow-blue-500/20"
                >
                  Publish Course
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-black text-slate-900">Active Courses Catalog</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map(c => (
                  <div key={c.id} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start justify-between gap-4">
                    <div>
                      <span className="text-[10px] text-[#0066FF] font-black uppercase">{c.targetClass}</span>
                      <h4 className="text-sm font-extrabold text-slate-900 mt-1">{c.title}</h4>
                      <span className="text-xs text-emerald-600 font-black block mt-1">₹{c.discountFee} (Regular: ₹{c.fee})</span>
                    </div>
                    <button
                      onClick={() => deleteCourse(c.id)}
                      className="p-2 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MANAGE STUDY MATERIALS */}
        {activeTab === 'materials' && (
          <div className="space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card-clean space-y-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#0066FF]" />
                <span>Upload New Study Note PDF</span>
              </h3>

              <form onSubmit={handleCreateMaterial} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-700 font-bold mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Class 10 Science: Full Chemistry Chapter 1 Notes"
                      value={newMaterial.title}
                      onChange={e => setNewMaterial({ ...newMaterial, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-700 font-bold mb-1">Category</label>
                    <select
                      value={newMaterial.category}
                      onChange={e => setNewMaterial({ ...newMaterial, category: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                    >
                      <option value="pdf_notes">PDF Notes</option>
                      <option value="practice_sets">Practice Sets</option>
                      <option value="worksheets">Worksheets</option>
                      <option value="important_questions">Important Questions</option>
                      <option value="pyq">Past Year Papers</option>
                      <option value="homework">Homework Sheets</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-[#0066FF] text-white text-xs font-black uppercase tracking-wider shadow-md shadow-blue-500/20"
                >
                  Upload Study Material PDF
                </button>
              </form>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-black text-slate-900">Active Study Vault Files</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {studyMaterials.map(m => (
                  <div key={m.id} className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[#0066FF] font-bold">{m.targetClass} • {m.subject}</span>
                      <h4 className="font-extrabold text-slate-900 mt-0.5 line-clamp-1">{m.title}</h4>
                      <span className="text-slate-400 font-medium">{m.downloadsCount} Downloads</span>
                    </div>
                    <button
                      onClick={() => deleteStudyMaterial(m.id)}
                      className="p-2 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MANAGE NOTICES */}
        {activeTab === 'notices' && (
          <div className="space-y-8">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card-clean space-y-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#0066FF]" />
                <span>Publish New Alert / Notice</span>
              </h3>

              <form onSubmit={handleCreateNotice} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-700 font-bold mb-1">Headline *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Admission Open for Batch 2026-27"
                    value={newNotice.title}
                    onChange={e => setNewNotice({ ...newNotice, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-700 font-bold mb-1">Details</label>
                  <textarea
                    rows={3}
                    placeholder="Full announcement description for students and parents..."
                    value={newNotice.description}
                    onChange={e => setNewNotice({ ...newNotice, description: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-full bg-[#0066FF] text-white text-xs font-black uppercase tracking-wider shadow-md shadow-blue-500/20"
                >
                  Publish Notice
                </button>
              </form>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-black text-slate-900">Live Notices</h3>
              {notices.map(n => (
                <div key={n.id} className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-400 font-medium">{n.date}</span>
                    <h4 className="text-sm font-extrabold text-slate-900">{n.title}</h4>
                    <p className="text-xs text-slate-600 mt-1">{n.description}</p>
                  </div>
                  <button
                    onClick={() => deleteNotice(n.id)}
                    className="p-2 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: PAYMENTS LOG */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900">Student Transactions & E-Receipts Log</h3>
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-card-clean">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Txn ID / Date</th>
                      <th className="p-4">Student</th>
                      <th className="p-4">Course Enrolled</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Method & UTR</th>
                      <th className="p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {transactions.map(txn => (
                      <tr key={txn.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-4 font-mono">
                          <span className="text-slate-900 font-black block">{txn.id}</span>
                          <span className="text-slate-400 text-[10px]">{txn.date}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-slate-900 font-bold block">{txn.studentName}</span>
                          <span className="text-slate-400 text-[11px]">{txn.studentPhone}</span>
                        </td>
                        <td className="p-4 text-slate-900 font-semibold">{txn.courseName}</td>
                        <td className="p-4 font-black text-emerald-600 text-sm">₹{txn.amount}</td>
                        <td className="p-4 font-mono text-[11px]">
                          <span className="text-[#0066FF] font-bold block">{txn.paymentMethod}</span>
                          <span className="text-slate-400 text-[10px] truncate max-w-[120px] block">{txn.utrNumber}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 font-black text-[10px] uppercase">
                            {txn.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: STUDENTS LIST */}
        {activeTab === 'students' && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900">Registered Scholars</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {students.map(s => (
                <div key={s.id} className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card-clean flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-base font-black text-slate-900">{s.name}</h4>
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0066FF] text-[10px] font-black">
                        {s.classEnrolled}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{s.email} • {s.phone}</p>
                    <span className="text-[11px] text-emerald-600 font-bold mt-2 block">
                      Enrolled Courses: {s.enrolledCourses.length}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: INQUIRIES */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <h3 className="text-xl font-black text-slate-900">Admission Inquiries</h3>
            <div className="space-y-3">
              {inquiries.length === 0 ? (
                <p className="text-xs text-slate-400 py-8 text-center bg-white rounded-3xl border border-slate-200">No inquiries submitted yet.</p>
              ) : (
                inquiries.map(inq => (
                  <div key={inq.id} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-black text-slate-900">{inq.studentName}</h4>
                        <span className="text-xs text-slate-400 font-mono">({inq.phone})</span>
                      </div>
                      <p className="text-xs text-[#0066FF] font-bold">Target: {inq.targetCourse} • Class: {inq.currentClass}</p>
                      <p className="text-xs text-slate-600 mt-1.5 font-medium">{inq.message}</p>
                    </div>
                    <a
                      href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-black"
                    >
                      WhatsApp Lead
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
