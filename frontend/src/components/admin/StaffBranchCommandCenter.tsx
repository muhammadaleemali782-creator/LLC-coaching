import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Building,
  UserCheck,
  UserX,
  Clock,
  AlertCircle,
  TrendingUp,
  Search,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  CheckCircle2,
  Eye,
  BadgeAlert,
  ArrowRight,
  Plus,
  KeyRound,
  FileText,
  ClipboardList,
  Calendar,
  X,
  Send,
  BookOpen
} from 'lucide-react';
import { StaffMember } from '../../types';

const COACHING_BRANCHES = [
  'All Branches',
  'Palahipatti Main Campus (Sindhora Rd)',
  'Sindhora Market Branch',
  'Babatpur City Center'
];

export const StaffBranchCommandCenter: React.FC = () => {
  const {
    staffList,
    staffAttendance,
    branchAdmissions,
    teacherTasks,
    studentAttendanceRecords,
    adminCreateTeacher,
    adminResetTeacherPassword,
    assignTaskToTeacher,
    refreshStaffData,
    showToast
  } = useApp();

  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'students' | 'leave-reasons'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Selected Teacher for Dossier Modal
  const [selectedTeacherForDossier, setSelectedTeacherForDossier] = useState<StaffMember | null>(null);
  const [dossierTab, setDossierTab] = useState<'tasks' | 'attendance' | 'admissions' | 'students'>('tasks');

  // Modal State: Create Teacher
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherPhone, setNewTeacherPhone] = useState('');
  const [newTeacherBranch, setNewTeacherBranch] = useState(COACHING_BRANCHES[1]);
  const [newTeacherDesignation, setNewTeacherDesignation] = useState('Senior Mathematics Faculty');
  const [newTeacherPassword, setNewTeacherPassword] = useState('Staff@123');
  const [isCreatingTeacher, setIsCreatingTeacher] = useState(false);

  // Modal State: Reset Password
  const [resetModalTeacher, setResetModalTeacher] = useState<StaffMember | null>(null);
  const [newResetPassword, setNewResetPassword] = useState('');
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  // Modal State: Assign Task
  const [isAssignTaskModalOpen, setIsAssignTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [taskPriority, setTaskPriority] = useState<'High' | 'Normal' | 'Low'>('Normal');
  const [isAssigningTask, setIsAssigningTask] = useState(false);

  // Today's date string
  const todayStr = new Date().toISOString().split('T')[0];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshStaffData();
    setIsRefreshing(false);
    showToast('Branch and staff command data synced!', 'success');
  };

  // Filter staff based on selected branch and search query
  const filteredStaff = staffList.filter(s => {
    const matchesBranch = selectedBranch === 'All Branches' || s.branch === selectedBranch;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.phone && s.phone.includes(searchQuery)) ||
      (s.designation && s.designation.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesBranch && matchesSearch;
  });

  // Filter admissions based on selected branch
  const filteredAdmissions = branchAdmissions.filter(adm => {
    const matchesBranch = selectedBranch === 'All Branches' || adm.branch === selectedBranch;
    const matchesSearch =
      adm.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (adm.phone && adm.phone.includes(searchQuery)) ||
      (adm.parentName && adm.parentName.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesBranch && matchesSearch;
  });

  const enrolledCount = filteredAdmissions.filter(a => a.admissionType === 'Enrolled').length;
  const visitedCount = filteredAdmissions.filter(a => a.admissionType === 'Visited').length;

  // Staff enriched with today's attendance & stats
  const staffWithTodayAttendance = filteredStaff.map(staff => {
    const att = staffAttendance.find(a => a.staffId === staff.id && a.date === todayStr);
    const teacherAdmissions = branchAdmissions.filter(
      a => a.assignedTeacherId === staff.id || a.assignedTeacherName === staff.name
    );
    const enrolled = teacherAdmissions.filter(a => a.admissionType === 'Enrolled').length;
    const visited = teacherAdmissions.filter(a => a.admissionType === 'Visited').length;
    const tasks = teacherTasks.filter(
      t => t.assignedToStaffId === staff.id || t.assignedToStaffName === staff.name
    );
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;

    return {
      ...staff,
      todayStatus: att ? att.status : 'Not Marked',
      todayReason: att ? att.reason : '',
      todayCheckIn: att ? att.checkInTime : 'N/A',
      enrolledStudents: enrolled,
      visitedStudents: visited,
      totalStudents: teacherAdmissions.length,
      totalTasks: tasks.length,
      completedTasks
    };
  });

  const presentStaffCount = staffWithTodayAttendance.filter(s => s.todayStatus === 'Present').length;
  const leaveStaffCount = staffWithTodayAttendance.filter(s => s.todayStatus === 'On Leave').length;
  const absentStaffCount = staffWithTodayAttendance.filter(s => s.todayStatus === 'Absent').length;

  // List of staff with absence or leave reasons
  const leaveReasonsLog = staffWithTodayAttendance.filter(
    s => s.todayStatus === 'On Leave' || s.todayStatus === 'Absent'
  );

  // Teacher dossier calculations
  const dossierAttendance = selectedTeacherForDossier
    ? staffAttendance.filter(a => a.staffId === selectedTeacherForDossier.id)
    : [];

  const dossierTasks = selectedTeacherForDossier
    ? teacherTasks.filter(
        t => t.assignedToStaffId === selectedTeacherForDossier.id || t.assignedToStaffName === selectedTeacherForDossier.name
      )
    : [];

  const dossierAdmissions = selectedTeacherForDossier
    ? branchAdmissions.filter(
        a => a.assignedTeacherId === selectedTeacherForDossier.id || a.assignedTeacherName === selectedTeacherForDossier.name
      )
    : [];

  const dossierStudentsAttendance = selectedTeacherForDossier
    ? studentAttendanceRecords.filter(
        r => r.teacherId === selectedTeacherForDossier.id || r.branch === selectedTeacherForDossier.branch
      )
    : [];

  // Handle Create Teacher Submit
  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim() || !newTeacherEmail.trim() || !newTeacherPassword.trim()) {
      showToast('Name, Email, and Password are required.', 'warning');
      return;
    }
    setIsCreatingTeacher(true);
    const success = await adminCreateTeacher({
      name: newTeacherName.trim(),
      email: newTeacherEmail.trim().toLowerCase(),
      phone: newTeacherPhone.trim(),
      branch: newTeacherBranch,
      designation: newTeacherDesignation.trim(),
      password: newTeacherPassword.trim()
    });
    if (success) {
      setIsCreateModalOpen(false);
      setNewTeacherName('');
      setNewTeacherEmail('');
      setNewTeacherPhone('');
      setNewTeacherPassword('Staff@123');
    }
    setIsCreatingTeacher(false);
  };

  // Handle Reset Password Submit
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetModalTeacher || !newResetPassword.trim()) {
      showToast('Please enter a new password.', 'warning');
      return;
    }
    setIsResettingPassword(true);
    const success = await adminResetTeacherPassword(resetModalTeacher.id, newResetPassword.trim());
    if (success) {
      setResetModalTeacher(null);
      setNewResetPassword('');
    }
    setIsResettingPassword(false);
  };

  // Handle Assign Task Submit
  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacherForDossier || !taskTitle.trim()) {
      showToast('Task title is required.', 'warning');
      return;
    }
    setIsAssigningTask(true);
    const success = await assignTaskToTeacher({
      title: taskTitle.trim(),
      description: taskDescription.trim(),
      assignedToStaffId: selectedTeacherForDossier.id,
      assignedToStaffName: selectedTeacherForDossier.name,
      dueDate: taskDueDate,
      priority: taskPriority
    });
    if (success) {
      setIsAssignTaskModalOpen(false);
      setTaskTitle('');
      setTaskDescription('');
    }
    setIsAssigningTask(false);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner & Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
                Director Command Center • Faculty & Branch Oversight
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Branch Faculty & Student Intelligence Desk
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Monitor faculty attendance, assigned tasks, student enrollments, and leaves across all branches.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-primary-600 hover:bg-primary-500 text-white font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-primary-500/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Teacher</span>
            </button>

            <button
              type="button"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Sync Live Data</span>
            </button>
          </div>
        </div>

        {/* ONE-TAP BRANCH SELECTOR TABS */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Building className="w-4 h-4 text-primary-400" />
            One-Tap Branch Selector:
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {COACHING_BRANCHES.map(branchName => {
              const count = branchName === 'All Branches'
                ? staffList.length
                : staffList.filter(s => s.branch === branchName).length;
              return (
                <button
                  key={branchName}
                  type="button"
                  onClick={() => setSelectedBranch(branchName)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                    selectedBranch === branchName
                      ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25 ring-2 ring-primary-400/30'
                      : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60'
                  }`}
                >
                  <span>{branchName}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    selectedBranch === branchName
                      ? 'bg-primary-950 text-white'
                      : 'bg-slate-700 text-slate-300'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-4 pt-4 border-t border-slate-800/60">
          <div className="relative max-w-md">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search faculty by name, email, phone, or designation..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Faculty Count</p>
          <p className="text-3xl font-black text-primary-400 mt-1">{filteredStaff.length}</p>
          <span className="text-[10px] text-primary-300 bg-primary-950/70 border border-primary-800/60 px-2 py-0.5 rounded-full font-semibold mt-2 inline-block">
            {selectedBranch === 'All Branches' ? 'All Campuses' : 'Branch Staff'}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Present Today</p>
          <p className="text-3xl font-black text-emerald-400 mt-1">{presentStaffCount}</p>
          <span className="text-[10px] text-emerald-300 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded-full font-semibold mt-2 inline-block">
            On Campus
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">On Leave</p>
          <p className="text-3xl font-black text-amber-400 mt-1">{leaveStaffCount}</p>
          <span className="text-[10px] text-amber-300 bg-amber-950/70 border border-amber-800/60 px-2 py-0.5 rounded-full font-semibold mt-2 inline-block">
            Documented
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Absent</p>
          <p className="text-3xl font-black text-rose-400 mt-1">{absentStaffCount}</p>
          <span className="text-[10px] text-rose-300 bg-rose-950/70 border border-rose-800/60 px-2 py-0.5 rounded-full font-semibold mt-2 inline-block">
            {absentStaffCount > 0 ? 'Action Needed' : 'Zero Unapproved'}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Enrolled Students</p>
          <p className="text-3xl font-black text-emerald-400 mt-1">{enrolledCount}</p>
          <span className="text-[10px] text-emerald-300 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded-full font-semibold mt-2 inline-block">
            Active Roster
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Visit Inquiries</p>
          <p className="text-3xl font-black text-amber-400 mt-1">{visitedCount}</p>
          <span className="text-[10px] text-amber-300 bg-amber-950/70 border border-amber-800/60 px-2 py-0.5 rounded-full font-semibold mt-2 inline-block">
            Inquiry Leads
          </span>
        </div>
      </div>

      {/* LEAVE REASONS AUDIT CARD (Director Review) */}
      {leaveReasonsLog.length > 0 && (
        <div className="bg-gradient-to-r from-amber-950/30 to-rose-950/30 border border-amber-500/40 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <BadgeAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                Today&apos;s Absence & Leave Reasons Log
              </h2>
              <p className="text-xs text-amber-200/80">
                Documented reasons provided by faculty for Director Aman Arora&apos;s review
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leaveReasonsLog.map(staff => (
              <div
                key={staff.id}
                className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-white text-sm">{staff.name}</p>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        staff.todayStatus === 'On Leave'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {staff.todayStatus}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Building className="w-3 h-3 text-primary-400" />
                    {staff.branch}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">📞 {staff.phone || 'On file'}</p>

                  <div className="mt-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      Stated Reason:
                    </p>
                    <p className="text-xs text-slate-200 mt-1 italic font-medium leading-relaxed">
                      &ldquo;{staff.todayReason || 'No reason specified'}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-800 pb-4">
        <button
          type="button"
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeSubTab === 'overview'
              ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          1. Faculty Roster & Dossiers ({filteredStaff.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('students')}
          className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeSubTab === 'students'
              ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          2. Student Admissions & Inquiries ({filteredAdmissions.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('leave-reasons')}
          className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            activeSubTab === 'leave-reasons'
              ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          3. Absence & Leave Log ({leaveReasonsLog.length})
        </button>
      </div>

      {/* VIEW 1: FACULTY ROSTER & DOSSIER TRIGGER TABLE */}
      {activeSubTab === 'overview' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white">
                Faculty Roster & Performance Overview
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Click any teacher to inspect their complete dossier: attendance history, assigned tasks, reports, student admissions & cohort leaves.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3">Faculty Member</th>
                  <th className="py-3 px-3">Branch</th>
                  <th className="py-3 px-3 text-center">Enrolled</th>
                  <th className="py-3 px-3 text-center">Visited Leads</th>
                  <th className="py-3 px-3 text-center">Tasks Done</th>
                  <th className="py-3 px-3">Today Status</th>
                  <th className="py-3 px-3">Check-In</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {staffWithTodayAttendance.map(staff => (
                  <tr
                    key={staff.id}
                    onClick={() => {
                      setSelectedTeacherForDossier(staff);
                      setDossierTab('tasks');
                    }}
                    className="hover:bg-slate-800/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary-600/20 text-primary-400 flex items-center justify-center font-bold text-sm border border-primary-500/30">
                          {staff.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm group-hover:text-primary-300 transition-colors">
                            {staff.name}
                          </p>
                          <p className="text-slate-400 text-[11px]">{staff.designation}</p>
                          <p className="text-slate-500 text-[10px]">{staff.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-3">
                      <span className="font-medium text-slate-300">{staff.branch}</span>
                    </td>

                    <td className="py-4 px-3 text-center">
                      <span className="inline-block bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold px-3 py-1 rounded-full text-xs">
                        {staff.enrolledStudents}
                      </span>
                    </td>

                    <td className="py-4 px-3 text-center">
                      <span className="inline-block bg-amber-950 text-amber-300 border border-amber-800 font-bold px-3 py-1 rounded-full text-xs">
                        {staff.visitedStudents}
                      </span>
                    </td>

                    <td className="py-4 px-3 text-center">
                      <span className="font-mono text-xs text-white">
                        {staff.completedTasks} / {staff.totalTasks}
                      </span>
                    </td>

                    <td className="py-4 px-3">
                      {staff.todayStatus === 'Present' ? (
                        <span className="bg-emerald-950 text-emerald-400 border border-emerald-800/80 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3 h-3" /> Present
                        </span>
                      ) : staff.todayStatus === 'On Leave' ? (
                        <span className="bg-amber-950 text-amber-400 border border-amber-800/80 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 w-max">
                          <AlertCircle className="w-3 h-3" /> On Leave
                        </span>
                      ) : staff.todayStatus === 'Absent' ? (
                        <span className="bg-rose-950 text-rose-400 border border-rose-800/80 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 w-max">
                          <UserX className="w-3 h-3" /> Absent
                        </span>
                      ) : (
                        <span className="bg-slate-800 text-slate-400 border border-slate-700 px-2.5 py-1 rounded-full font-semibold w-max">
                          Not Marked
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-3">
                      <span className="font-mono text-slate-300">{staff.todayCheckIn || 'N/A'}</span>
                    </td>

                    <td className="py-4 px-3 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setResetModalTeacher(staff);
                            setNewResetPassword('');
                          }}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 p-2 rounded-xl text-xs flex items-center gap-1 transition-all cursor-pointer"
                          title="Reset Password"
                        >
                          <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                          <span className="hidden sm:inline">Reset Pass</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTeacherForDossier(staff);
                            setDossierTab('tasks');
                          }}
                          className="bg-primary-600/20 hover:bg-primary-600/30 text-primary-300 border border-primary-500/30 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Dossier</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: FULL STUDENT INTAKE & VISIT REGISTER */}
      {activeSubTab === 'students' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-white">Student Admissions & Inquiries Ledger</h2>
              <p className="text-xs text-slate-400 mt-1">
                Total {filteredAdmissions.length} records (Enrolled: {enrolledCount} • Visited Leads: {visitedCount})
              </p>
            </div>
          </div>

          {filteredAdmissions.length === 0 ? (
            <div className="text-center py-16 bg-slate-950/40 rounded-2xl border border-slate-800/80">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-300">No Student Records Found</p>
              <p className="text-xs text-slate-500 mt-1">Try switching branch or clear search filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-3">Student Name & Contact</th>
                    <th className="py-3 px-3">Class & Course</th>
                    <th className="py-3 px-3">Branch</th>
                    <th className="py-3 px-3">Mentor Teacher</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Fees / Date</th>
                    <th className="py-3 px-3">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredAdmissions.map(adm => (
                    <tr key={adm.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <p className="font-bold text-white text-sm">{adm.studentName}</p>
                        <p className="text-slate-400 flex items-center gap-1 mt-0.5">
                          <span>📞 {adm.phone}</span>
                          {adm.parentName && <span>• Parent: {adm.parentName}</span>}
                        </p>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-slate-200">{adm.targetClass}</span>
                        <p className="text-[11px] text-slate-400 truncate max-w-[160px]">{adm.courseName}</p>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="text-slate-300">{adm.branch}</span>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="font-semibold text-primary-300">{adm.assignedTeacherName}</span>
                      </td>

                      <td className="py-3.5 px-3">
                        {adm.admissionType === 'Enrolled' ? (
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
                        {adm.admissionType === 'Enrolled' ? (
                          <p className="font-bold text-emerald-400">₹{adm.feesPaid?.toLocaleString() || 0}</p>
                        ) : (
                          <p className="text-slate-500 font-mono">Inquiry Only</p>
                        )}
                        <p className="text-[11px] text-slate-500">{adm.date}</p>
                      </td>

                      <td className="py-3.5 px-3 max-w-[200px]">
                        <p className="text-slate-300 italic truncate">{adm.notes || '—'}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: LEAVE & ABSENCE AUDIT LOG */}
      {activeSubTab === 'leave-reasons' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-black text-white">Faculty Absence & Leave Log</h2>
            <p className="text-xs text-slate-400 mt-1">
              Direct oversight of reasons for absence submitted by teachers.
            </p>
          </div>

          {leaveReasonsLog.length === 0 ? (
            <div className="text-center py-16 bg-slate-950/40 rounded-2xl border border-slate-800/80">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-sm font-bold text-white">All Faculty Members Present!</p>
              <p className="text-xs text-slate-400 mt-1">No teacher has reported absence or leave today.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {leaveReasonsLog.map(staff => (
                <div key={staff.id} className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white text-base">{staff.name}</p>
                      <p className="text-xs text-slate-400">{staff.designation} • {staff.branch}</p>
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                        staff.todayStatus === 'On Leave'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {staff.todayStatus}
                    </span>
                  </div>

                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                    <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      Documented Reason:
                    </p>
                    <p className="text-sm text-slate-200 mt-1 italic font-medium leading-relaxed">
                      &ldquo;{staff.todayReason || 'No reason provided'}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <span>📞 {staff.phone || 'Phone on file'}</span>
                    <span>Date: {todayStr}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: TEACHER DOSSIER MODAL */}
      {selectedTeacherForDossier && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-black shadow-lg">
                  {selectedTeacherForDossier.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-white">{selectedTeacherForDossier.name}</h2>
                    <span className="text-xs bg-primary-950 text-primary-300 border border-primary-800 px-2.5 py-0.5 rounded-full font-bold">
                      {selectedTeacherForDossier.designation}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {selectedTeacherForDossier.branch} • {selectedTeacherForDossier.email} • 📞 {selectedTeacherForDossier.phone || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignTaskModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Assign New Task</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setResetModalTeacher(selectedTeacherForDossier);
                    setNewResetPassword('');
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Reset Password</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedTeacherForDossier(null)}
                  className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Dossier Tabs */}
            <div className="flex flex-wrap items-center gap-2 my-5 border-b border-slate-800 pb-3">
              <button
                type="button"
                onClick={() => setDossierTab('tasks')}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  dossierTab === 'tasks'
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                1. Tasks & Work Reports ({dossierTasks.length})
              </button>
              <button
                type="button"
                onClick={() => setDossierTab('attendance')}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  dossierTab === 'attendance'
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                2. Teacher Attendance History ({dossierAttendance.length})
              </button>
              <button
                type="button"
                onClick={() => setDossierTab('admissions')}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  dossierTab === 'admissions'
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                3. Student Admissions & Inquiries ({dossierAdmissions.length})
              </button>
              <button
                type="button"
                onClick={() => setDossierTab('students')}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  dossierTab === 'students'
                    ? 'bg-primary-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                4. Student Cohort Attendance & Leaves ({dossierStudentsAttendance.length})
              </button>
            </div>

            {/* Dossier Content 1: Tasks & Work Reports */}
            {dossierTab === 'tasks' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">Assigned Tasks & Submitted Work Reports</h3>
                  <button
                    type="button"
                    onClick={() => setIsAssignTaskModalOpen(true)}
                    className="text-xs text-primary-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" /> Assign Another Task
                  </button>
                </div>

                {dossierTasks.length === 0 ? (
                  <div className="text-center py-10 bg-slate-950/50 rounded-2xl border border-slate-800 text-xs text-slate-400">
                    No tasks assigned to {selectedTeacherForDossier.name} yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dossierTasks.map(t => (
                      <div
                        key={t.id}
                        className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2.5"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary-950 text-primary-300 border border-primary-800">
                                {t.priority || 'Normal'} Priority
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                                  t.status === 'Completed'
                                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                                }`}
                              >
                                {t.status}
                              </span>
                            </div>
                            <h4 className="font-bold text-white text-sm">{t.title}</h4>
                          </div>
                          <span className="text-xs text-slate-400 font-mono">Due: {t.dueDate}</span>
                        </div>

                        {t.description && (
                          <p className="text-xs text-slate-300 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                            {t.description}
                          </p>
                        )}

                        {t.status === 'Completed' ? (
                          <div className="bg-emerald-950/40 border border-emerald-800/40 p-3 rounded-xl space-y-1">
                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Teacher Work Report Submitted:
                            </p>
                            <p className="text-xs text-slate-200 italic font-medium leading-relaxed">
                              &ldquo;{t.reportNote}&rdquo;
                            </p>
                            {t.submittedAt && (
                              <p className="text-[10px] text-slate-400">
                                Submitted at: {new Date(t.submittedAt).toLocaleString()}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-xs text-amber-400 font-semibold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Pending report submission by teacher
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Dossier Content 2: Teacher Attendance History */}
            {dossierTab === 'attendance' && (
              <div className="space-y-4">
                <h3 className="font-bold text-white text-sm">Historical Attendance Records</h3>
                {dossierAttendance.length === 0 ? (
                  <div className="text-center py-10 bg-slate-950/50 rounded-2xl border border-slate-800 text-xs text-slate-400">
                    No attendance logs recorded yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Check-In Time</th>
                          <th className="py-2.5 px-3">Leave / Absence Reason</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {dossierAttendance.map(att => (
                          <tr key={att.id} className="hover:bg-slate-800/40">
                            <td className="py-3 px-3 font-mono text-white">{att.date}</td>
                            <td className="py-3 px-3">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  att.status === 'Present'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : att.status === 'On Leave'
                                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                                }`}
                              >
                                {att.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-mono text-slate-300">{att.checkInTime || 'N/A'}</td>
                            <td className="py-3 px-3 text-slate-300 italic">{att.reason || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Dossier Content 3: Student Admissions & Inquiries */}
            {dossierTab === 'admissions' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">Admissions & Visit Inquiries Logged by {selectedTeacherForDossier.name}</h3>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">
                      Enrolled: {dossierAdmissions.filter(a => a.admissionType === 'Enrolled').length}
                    </span>
                    <span>•</span>
                    <span className="text-amber-400 font-bold">
                      Visited: {dossierAdmissions.filter(a => a.admissionType === 'Visited').length}
                    </span>
                  </div>
                </div>

                {dossierAdmissions.length === 0 ? (
                  <div className="text-center py-10 bg-slate-950/50 rounded-2xl border border-slate-800 text-xs text-slate-400">
                    No student registrations logged by this teacher yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                          <th className="py-2.5 px-3">Student Name</th>
                          <th className="py-2.5 px-3">Class</th>
                          <th className="py-2.5 px-3">Contact</th>
                          <th className="py-2.5 px-3">Status</th>
                          <th className="py-2.5 px-3">Fees Paid</th>
                          <th className="py-2.5 px-3">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {dossierAdmissions.map(adm => (
                          <tr key={adm.id} className="hover:bg-slate-800/40">
                            <td className="py-3 px-3 font-bold text-white">{adm.studentName}</td>
                            <td className="py-3 px-3 text-slate-300">{adm.targetClass}</td>
                            <td className="py-3 px-3 text-slate-300 font-mono">📞 {adm.phone}</td>
                            <td className="py-3 px-3">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  adm.admissionType === 'Enrolled'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : 'bg-amber-950 text-amber-300 border border-amber-800'
                                }`}
                              >
                                {adm.admissionType}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-bold text-emerald-400">
                              {adm.admissionType === 'Enrolled' ? `₹${adm.feesPaid?.toLocaleString() || 0}` : 'Inquiry'}
                            </td>
                            <td className="py-3 px-3 text-slate-300 italic truncate max-w-[200px]">{adm.notes || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Dossier Content 4: Student Cohort Attendance & Leaves */}
            {dossierTab === 'students' && (
              <div className="space-y-4">
                <h3 className="font-bold text-white text-sm">Student Cohort Attendance & Absence Log</h3>
                {dossierStudentsAttendance.length === 0 ? (
                  <div className="text-center py-10 bg-slate-950/50 rounded-2xl border border-slate-800 text-xs text-slate-400">
                    No student attendance logs submitted by this teacher yet.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase">
                          <th className="py-2.5 px-3">Date</th>
                          <th className="py-2.5 px-3">Student Name</th>
                          <th className="py-2.5 px-3">Attendance</th>
                          <th className="py-2.5 px-3">Reason for Leave / Absence</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {dossierStudentsAttendance.map(sa => (
                          <tr key={sa.id} className="hover:bg-slate-800/40">
                            <td className="py-3 px-3 font-mono text-slate-300">{sa.date}</td>
                            <td className="py-3 px-3 font-bold text-white">{sa.studentName}</td>
                            <td className="py-3 px-3">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  sa.status === 'Present'
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                    : sa.status === 'On Leave'
                                    ? 'bg-amber-950 text-amber-300 border border-amber-800'
                                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                                }`}
                              >
                                {sa.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-300 italic">{sa.reason || '—'}</td>
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
      )}

      {/* MODAL 2: CREATE TEACHER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-black text-white">Create New Teacher Account</h3>
                <p className="text-xs text-slate-400 mt-0.5">Faculty credentials for the L.C.C. Staff Portal</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeacher} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newTeacherName}
                  onChange={e => setNewTeacherName(e.target.value)}
                  placeholder="e.g. Dr. Ramesh Gupta"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newTeacherEmail}
                  onChange={e => setNewTeacherEmail(e.target.value)}
                  placeholder="e.g. ramesh@lcc.edu"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={newTeacherPhone}
                  onChange={e => setNewTeacherPhone(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Branch Campus
                  </label>
                  <select
                    value={newTeacherBranch}
                    onChange={e => setNewTeacherBranch(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
                  >
                    {COACHING_BRANCHES.filter(b => b !== 'All Branches').map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={newTeacherDesignation}
                    onChange={e => setNewTeacherDesignation(e.target.value)}
                    placeholder="e.g. Senior Faculty - Physics"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Initial Password *
                </label>
                <input
                  type="text"
                  value={newTeacherPassword}
                  onChange={e => setNewTeacherPassword(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500 font-mono"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingTeacher}
                  className="bg-primary-600 hover:bg-primary-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-primary-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isCreatingTeacher ? 'Creating...' : 'Create Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: RESET PASSWORD MODAL */}
      {resetModalTeacher && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-black text-white">Reset Teacher Password</h3>
                <p className="text-xs text-slate-400 mt-0.5">Faculty: {resetModalTeacher.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setResetModalTeacher(null)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Enter New Password *
                </label>
                <input
                  type="text"
                  value={newResetPassword}
                  onChange={e => setNewResetPassword(e.target.value)}
                  placeholder="e.g. Teacher@2026"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-mono"
                  required
                />
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setResetModalTeacher(null)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResettingPassword}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>{isResettingPassword ? 'Updating...' : 'Set New Password'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: ASSIGN TASK MODAL */}
      {isAssignTaskModalOpen && selectedTeacherForDossier && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <div>
                <h3 className="text-xl font-black text-white">Assign Task to Teacher</h3>
                <p className="text-xs text-slate-400 mt-0.5">Faculty: {selectedTeacherForDossier.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAssignTaskModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={e => setTaskTitle(e.target.value)}
                  placeholder="e.g. Complete Chapter 5 Quadratic Equations Revision"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Description & Instructions
                </label>
                <textarea
                  rows={3}
                  value={taskDescription}
                  onChange={e => setTaskDescription(e.target.value)}
                  placeholder="Provide syllabus targets, student test notes, or specific follow-up goals..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={taskDueDate}
                    onChange={e => setTaskDueDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={e => setTaskPriority(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-500"
                  >
                    <option value="High">High</option>
                    <option value="Normal">Normal</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAssignTaskModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAssigningTask}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <Send className="w-4 h-4" />
                  <span>{isAssigningTask ? 'Assigning...' : 'Assign Task'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
