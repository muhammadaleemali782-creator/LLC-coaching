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
  FileSpreadsheet
} from 'lucide-react';

const COACHING_BRANCHES = [
  'All Branches',
  'Palahipatti Main Campus (Sindhora Rd)',
  'Sindhora Market Branch',
  'Babatpur City Center'
];

export const StaffBranchCommandCenter: React.FC = () => {
  const {
    staffStats,
    staffList,
    staffAttendance,
    branchAdmissions,
    refreshStaffData,
    showToast
  } = useApp();

  const [selectedBranch, setSelectedBranch] = useState('All Branches');
  const [selectedTeacher, setSelectedTeacher] = useState('All Teachers');
  const [searchStudent, setSearchStudent] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'teachers' | 'students' | 'leave-reasons'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Today's date string
  const todayStr = new Date().toISOString().split('T')[0];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshStaffData();
    setIsRefreshing(false);
    showToast('शाखा व स्टाफ डेटा रिफ्रेश हो गया!', 'success');
  };

  // Filter admissions based on selected branch and teacher
  const filteredAdmissions = branchAdmissions.filter(adm => {
    const matchesBranch = selectedBranch === 'All Branches' || adm.branch === selectedBranch;
    const matchesTeacher = selectedTeacher === 'All Teachers' || adm.assignedTeacherId === selectedTeacher || adm.assignedTeacherName === selectedTeacher;
    const matchesSearch =
      adm.studentName.toLowerCase().includes(searchStudent.toLowerCase()) ||
      (adm.phone && adm.phone.includes(searchStudent)) ||
      (adm.parentName && adm.parentName.toLowerCase().includes(searchStudent.toLowerCase()));
    return matchesBranch && matchesTeacher && matchesSearch;
  });

  const enrolledCount = filteredAdmissions.filter(a => a.admissionType === 'Enrolled').length;
  const visitedCount = filteredAdmissions.filter(a => a.admissionType === 'Visited').length;
  const conversionRate = filteredAdmissions.length > 0 ? Math.round((enrolledCount / filteredAdmissions.length) * 100) : 0;

  // Filter staff based on branch
  const filteredStaff = staffList.filter(s => {
    return selectedBranch === 'All Branches' || s.branch === selectedBranch;
  });

  // Today's attendance for filtered staff
  const staffWithTodayAttendance = filteredStaff.map(staff => {
    const att = staffAttendance.find(a => a.staffId === staff.id && a.date === todayStr);
    const teacherAdmissions = branchAdmissions.filter(a => a.assignedTeacherId === staff.id || a.assignedTeacherName === staff.name);
    const enrolled = teacherAdmissions.filter(a => a.admissionType === 'Enrolled').length;
    const visited = teacherAdmissions.filter(a => a.admissionType === 'Visited').length;

    return {
      ...staff,
      todayStatus: att ? att.status : 'Not Marked',
      todayReason: att ? att.reason : '',
      todayCheckIn: att ? att.checkInTime : 'N/A',
      enrolledStudents: enrolled,
      visitedStudents: visited,
      totalStudents: teacherAdmissions.length
    };
  });

  const presentStaffCount = staffWithTodayAttendance.filter(s => s.todayStatus === 'Present').length;
  const leaveStaffCount = staffWithTodayAttendance.filter(s => s.todayStatus === 'On Leave').length;
  const absentStaffCount = staffWithTodayAttendance.filter(s => s.todayStatus === 'Absent').length;

  // List of staff with absence or leave reasons
  const leaveReasonsLog = staffWithTodayAttendance.filter(
    s => s.todayStatus === 'On Leave' || s.todayStatus === 'Absent'
  );

  return (
    <div className="space-y-8">
      {/* Top Banner & Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/40">
                शाखा व स्टाफ कमांड सेंटर • Director Command Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              शाखा अनुसार शिक्षक, छात्र व उपस्थिति मॉनिटर
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              जानिए किस ब्रांच पर किस टीचर से कितने बच्चे पढ़ते हैं, कितने उपस्थित हैं और छुट्टी का क्या कारण है।
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="self-start md:self-auto bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>डेटा रिफ्रेश करें</span>
          </button>
        </div>

        {/* Global Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-primary-400" />
              शाखा चुनें (Filter by Branch)
            </label>
            <select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
            >
              {COACHING_BRANCHES.map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              शिक्षक चुनें (Filter by Teacher)
            </label>
            <select
              value={selectedTeacher}
              onChange={e => setSelectedTeacher(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-primary-500"
            >
              <option value="All Teachers">All Teachers (सभी शिक्षक)</option>
              {staffList.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.branch?.split(' ')[0]})</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 md:col-span-1">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-amber-400" />
              छात्र खोजें (Search Student)
            </label>
            <input
              type="text"
              value={searchStudent}
              onChange={e => setSearchStudent(e.target.value)}
              placeholder="नाम या मोबाइल नंबर से खोजें..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Card 1: Total Enrolled */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">दाखिला हो गया (Enrolled)</p>
          <p className="text-3xl font-black text-emerald-400 mt-1">{enrolledCount}</p>
          <span className="text-[10px] text-emerald-300 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded-full font-semibold mt-2 inline-block">
            Confirmed Students
          </span>
        </div>

        {/* Card 2: Total Visited */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">विज़िट के लिए आए (Visited)</p>
          <p className="text-3xl font-black text-amber-400 mt-1">{visitedCount}</p>
          <span className="text-[10px] text-amber-300 bg-amber-950/70 border border-amber-800/60 px-2 py-0.5 rounded-full font-semibold mt-2 inline-block">
            Inquiry Leads
          </span>
        </div>

        {/* Card 3: Total Staff */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">कुल शिक्षक/स्टाफ</p>
          <p className="text-3xl font-black text-primary-400 mt-1">{filteredStaff.length}</p>
          <span className="text-[10px] text-primary-300 bg-primary-950/70 border border-primary-800/60 px-2 py-0.5 rounded-full font-semibold mt-2 inline-block">
            {selectedBranch === 'All Branches' ? 'All Campuses' : 'Branch Staff'}
          </span>
        </div>

        {/* Card 4: Staff Present Today */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">आज उपस्थित (Present)</p>
          <p className="text-3xl font-black text-emerald-400 mt-1">{presentStaffCount}</p>
          <span className="text-[10px] text-emerald-300 bg-emerald-950/70 border border-emerald-800/60 px-2 py-0.5 rounded-full font-semibold mt-2 inline-block">
            Active in Class
          </span>
        </div>

        {/* Card 5: Staff On Leave */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">छुट्टी पर (On Leave)</p>
          <p className="text-3xl font-black text-amber-400 mt-1">{leaveStaffCount}</p>
          <span className="text-[10px] text-amber-300 bg-amber-950/70 border border-amber-800/60 px-2 py-0.5 rounded-full font-semibold mt-2 inline-block">
            Reason Documented
          </span>
        </div>

        {/* Card 6: Staff Absent */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">अनुपस्थित (Absent)</p>
          <p className="text-3xl font-black text-rose-400 mt-1">{absentStaffCount}</p>
          <span className="text-[10px] text-rose-300 bg-rose-950/70 border border-rose-800/60 px-2 py-0.5 rounded-full font-semibold mt-2 inline-block">
            {absentStaffCount > 0 ? 'Action Needed' : 'Zero Unapproved'}
          </span>
        </div>
      </div>

      {/* SPECIAL HIGHLIGHT SECTION: "Unake na aane ka reason kya hai" */}
      {leaveReasonsLog.length > 0 && (
        <div className="bg-gradient-to-r from-amber-950/30 to-rose-950/30 border border-amber-500/40 rounded-3xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <BadgeAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                आज के अनुपस्थित या छुट्टी पर मौजूद स्टाफ का कारण (Reasons for Absence / Leave)
              </h2>
              <p className="text-xs text-amber-200/80">
                डायरेक्टर अमन अरोड़ा सर के अवलोकन हेतु वास्तविक छुट्टी विवरण
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
                  <p className="text-xs text-slate-400 mt-0.5">📞 {staff.phone || 'Phone on file'}</p>

                  <div className="mt-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <p className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      ना आने / छुट्टी का कारण (Reason):
                    </p>
                    <p className="text-xs text-slate-200 mt-1 italic font-medium leading-relaxed">
                      &ldquo;{staff.todayReason || 'कारण उपलब्ध नहीं कराया गया (Not specified)'}&rdquo;
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
          1. शिक्षक अनुसार छात्र व हाजिरी (Teacher & Branch Breakdown)
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
          2. दाखिला व विज़िटर्स रजिस्टर (Students Register - {filteredAdmissions.length})
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
          3. छुट्टी व गैरहाजिरी रिपोर्ट (Leave Log - {leaveReasonsLog.length})
        </button>
      </div>

      {/* VIEW 1: TEACHER & BRANCH BREAKDOWN TABLE */}
      {activeSubTab === 'overview' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-black text-white">
              शाखा अनुसार शिक्षक, विद्यार्थी संख्या व उपस्थिति तालिका
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Kis branch per kis teacher se kitane bachhe padhte hain, aur kitane present / absent / leave per hain
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-3">शिक्षक का नाम (Teacher / Staff)</th>
                  <th className="py-3 px-3">शाखा (Branch)</th>
                  <th className="py-3 px-3 text-center">पढ़ते हैं (Enrolled)</th>
                  <th className="py-3 px-3 text-center">विज़िट पूछताछ (Visited)</th>
                  <th className="py-3 px-3 text-center">कुल छात्र (Total)</th>
                  <th className="py-3 px-3">आज की हाजिरी (Status)</th>
                  <th className="py-3 px-3">चेक-इन समय</th>
                  <th className="py-3 px-3">ना आने का कारण (Reason)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {staffWithTodayAttendance.map(staff => (
                  <tr key={staff.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-3">
                      <p className="font-bold text-white text-sm">{staff.name}</p>
                      <p className="text-slate-400 text-[11px]">{staff.designation}</p>
                      <p className="text-slate-500 text-[11px]">📞 {staff.phone || 'Phone on file'}</p>
                    </td>

                    <td className="py-4 px-3">
                      <span className="font-medium text-slate-300">{staff.branch}</span>
                    </td>

                    <td className="py-4 px-3 text-center">
                      <span className="inline-block bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold px-3 py-1 rounded-full text-xs">
                        {staff.enrolledStudents} छात्र
                      </span>
                    </td>

                    <td className="py-4 px-3 text-center">
                      <span className="inline-block bg-amber-950 text-amber-300 border border-amber-800 font-bold px-3 py-1 rounded-full text-xs">
                        {staff.visitedStudents} विज़िट
                      </span>
                    </td>

                    <td className="py-4 px-3 text-center">
                      <span className="font-black text-white text-sm">
                        {staff.totalStudents}
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

                    <td className="py-4 px-3 max-w-[200px]">
                      {staff.todayReason ? (
                        <span className="text-amber-300 text-xs italic bg-amber-950/40 px-2 py-1 rounded border border-amber-800/40 block truncate">
                          {staff.todayReason}
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
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
              <h2 className="text-xl font-black text-white">छात्र दाखिला व विज़िट लेजर</h2>
              <p className="text-xs text-slate-400 mt-1">
                कुल {filteredAdmissions.length} छात्र रिकॉर्ड (एडमिशन: {enrolledCount} • विज़िटर्स: {visitedCount})
              </p>
            </div>
          </div>

          {filteredAdmissions.length === 0 ? (
            <div className="text-center py-16 bg-slate-950/40 rounded-2xl border border-slate-800/80">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-300">कोई छात्र या विज़िट रिकॉर्ड नहीं मिला</p>
              <p className="text-xs text-slate-500 mt-1">फिल्टर बदलकर पुनः प्रयास करें।</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-3">छात्र का नाम व संपर्क</th>
                    <th className="py-3 px-3">कक्षा व कोर्स</th>
                    <th className="py-3 px-3">शाखा (Branch)</th>
                    <th className="py-3 px-3">मार्गदर्शक शिक्षक</th>
                    <th className="py-3 px-3">स्टेटस (Status)</th>
                    <th className="py-3 px-3">फीस / तारीख</th>
                    <th className="py-3 px-3">विज़िट नोट्स</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredAdmissions.map(adm => (
                    <tr key={adm.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-3">
                        <p className="font-bold text-white text-sm">{adm.studentName}</p>
                        <p className="text-slate-400 flex items-center gap-1 mt-0.5">
                          <span>📞 {adm.phone}</span>
                          {adm.parentName && <span>• P: {adm.parentName}</span>}
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

      {/* VIEW 3: LEAVE & ABSENCE AUDIT */}
      {activeSubTab === 'leave-reasons' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-xl font-black text-white">छुट्टी व गैरहाजिरी का ऑडिट लॉग</h2>
            <p className="text-xs text-slate-400 mt-1">
              डायरेक्टर सर द्वारा शिक्षकों की अनुपस्थिति के कारणों की त्वरित समीक्षा
            </p>
          </div>

          {leaveReasonsLog.length === 0 ? (
            <div className="text-center py-16 bg-slate-950/40 rounded-2xl border border-slate-800/80">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-sm font-bold text-white">सभी शिक्षक उपस्थित हैं!</p>
              <p className="text-xs text-slate-400 mt-1">आज किसी भी शिक्षक ने छुट्टी या अनुपस्थिति दर्ज नहीं की है।</p>
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
                      ना आने का स्पष्ट कारण:
                    </p>
                    <p className="text-sm text-slate-200 mt-1 italic font-medium leading-relaxed">
                      &ldquo;{staff.todayReason || 'कारण दर्ज नहीं किया गया'}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <span>📞 {staff.phone || 'Phone on file'}</span>
                    <span>तारीख: {todayStr}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
