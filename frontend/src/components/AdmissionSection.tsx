import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Award, CheckCircle2, MessageSquare, Send, Sparkles, User, Phone, Mail, MapPin } from 'lucide-react';

export const AdmissionSection: React.FC = () => {
  const { submitAdmissionInquiry, showToast } = useApp();
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    phone: '',
    email: '',
    currentClass: 'Class 10',
    targetCourse: 'Board Toppers Batch',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName || !formData.phone) {
      showToast('Please fill student name and contact number.', 'warning');
      return;
    }
    submitAdmissionInquiry(formData);
    setIsSubmitted(true);
  };

  const handleWhatsApp = () => {
    const text = `Hello L.C.C. Admissions, I want to inquire about admission for student ${formData.studentName || 'Student'} in ${formData.currentClass}. Phone: ${formData.phone || ''}`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section id="admission-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 text-[#0066FF] text-xs font-black uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Admission Open 2026-27</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Reserve Your <span className="text-[#0066FF]">Admission Seat</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
            Limited batch intake (maximum 20–25 students per class). Fill out the quick reservation form or talk to our counseling desk directly on WhatsApp.
          </p>
        </div>

        {/* 2-Column Application Card */}
        <div className="max-w-5xl mx-auto bg-[#F8FAFC] border border-slate-200/90 rounded-3xl p-6 sm:p-12 shadow-card-clean grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Benefits */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-black text-[#0066FF] uppercase tracking-wider">
              L.C.C. Admission Benefits
            </span>
            <h3 className="text-2xl font-black text-slate-900 leading-tight">
              Begin your child's journey with trusted mentors
            </h3>

            <div className="space-y-4">
              {[
                { title: 'Free Diagnostic Assessment', desc: 'Complimentary foundation assessment test to pinpoint learning gaps.' },
                { title: '3-Day Trial Lectures', desc: 'Experience classroom teaching, notes, and lab before fee confirmation.' },
                { title: 'Merit Scholarship Up to 50%', desc: 'Special fee concessions for top ranking school scholars.' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-white border border-blue-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Need Instant Help?</span>
                <span className="text-xs font-black text-slate-900">Direct Admission Desk</span>
              </div>
              <button
                onClick={handleWhatsApp}
                className="px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Right Column: Admission Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
            {isSubmitted ? (
              <div className="text-center py-10 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-black text-slate-900">Application Received!</h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{formData.studentName}</strong>. Director Aman Arora & our admission team will contact you on <strong>{formData.phone}</strong> shortly.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-2.5 rounded-full bg-[#0066FF] text-white text-xs font-bold shadow-sm"
                >
                  Submit Another Form
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Student Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aarav Patel"
                      value={formData.studentName}
                      onChange={e => setFormData({ ...formData, studentName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0066FF] font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Parent / Guardian Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Rajesh Patel"
                      value={formData.parentName}
                      onChange={e => setFormData({ ...formData, parentName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0066FF] font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Mobile / WhatsApp No. *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0066FF] font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Current Class</label>
                    <select
                      value={formData.currentClass}
                      onChange={e => setFormData({ ...formData, currentClass: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0066FF] font-medium"
                    >
                      <option>Class 1–5 (Primary)</option>
                      <option>Class 6–8 (Middle)</option>
                      <option>Class 9–10 (Board Target)</option>
                      <option>Class 11–12 (Science/PCM)</option>
                      <option>Computer (DCA/ADCA)</option>
                      <option>Spoken English</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Any Specific Requirement or Doubt</label>
                  <textarea
                    rows={2}
                    placeholder="Tell us what you want to achieve or any questions..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0066FF] font-medium resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-blue-500/25 transition-all"
                >
                  Submit Admission Inquiry
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
