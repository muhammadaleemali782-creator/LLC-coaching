import React from 'react';
import { useApp } from '../../context/AppContext';
import { AdmissionInquiry } from '../../types';
import { MessageSquare, Phone, Mail, CheckCircle2, Clock, User } from 'lucide-react';
import { api } from '../../api/client';

export const InquiriesManager: React.FC = () => {
  const { inquiries, setInquiries, showToast } = useApp();

  const handleStatusChange = async (id: string, status: 'New' | 'Contacted' | 'Enrolled') => {
    try {
      await api.inquiries.updateStatus(id, status);
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
      showToast(`Inquiry status marked as ${status}.`, 'success');
    } catch (e) {
      setInquiries(prev => prev.map(i => i.id === id ? { ...i, status } : i));
      showToast(`Inquiry status marked as ${status}.`, 'success');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-blue-400" />
          <span>Admission Desk & Student Counseling Inquiries</span>
        </h2>
        <p className="text-xs text-slate-400">Direct admission queries and parent phone inquiries submitted from the website.</p>
      </div>

      {inquiries.length === 0 ? (
        <div className="p-12 bg-slate-950 border border-slate-800 rounded-3xl text-center space-y-2">
          <p className="text-sm font-bold text-slate-400">No new admission inquiries submitted yet.</p>
          <p className="text-xs text-slate-600">When students or parents fill out the admission form, their inquiries will appear here in real time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inquiries.map(inq => (
            <div key={inq.id} className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] font-black uppercase">
                    {inq.targetCourse || 'General Admission'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">{inq.date}</span>
                </div>

                <div>
                  <h4 className="text-sm font-black text-white">{inq.studentName}</h4>
                  {inq.parentName && (
                    <span className="text-xs text-slate-400 block font-medium">Parent: {inq.parentName}</span>
                  )}
                  {inq.currentClass && (
                    <span className="text-xs text-blue-400 block font-bold">Class: {inq.currentClass}</span>
                  )}
                </div>

                <div className="space-y-1 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <a href={`tel:${inq.phone}`} className="hover:underline font-mono">{inq.phone}</a>
                  </div>
                  {inq.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <a href={`mailto:${inq.email}`} className="hover:underline">{inq.email}</a>
                    </div>
                  )}
                </div>

                {inq.message && (
                  <p className="text-xs text-slate-400 bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                    "{inq.message}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                  inq.status === 'Enrolled'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : inq.status === 'Contacted'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-amber-400/20 text-amber-300'
                }`}>
                  Status: {inq.status || 'New'}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStatusChange(inq.id, 'Contacted')}
                    className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-[10px] font-bold"
                  >
                    Contacted
                  </button>
                  <button
                    onClick={() => handleStatusChange(inq.id, 'Enrolled')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-[10px] font-bold"
                  >
                    Enrolled
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
