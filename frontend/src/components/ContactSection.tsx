import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapPin, Phone, Mail, Clock, MessageSquare, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { Youtube, Instagram } from './SocialIcons';

export const ContactSection: React.FC = () => {
  const { showToast } = useApp();
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      showToast('Please enter your Name and Mobile Number.', 'warning');
      return;
    }
    setSent(true);
    showToast('Your message has been sent to Aman Arora & L.C.C. counseling desk.', 'success');
  };

  return (
    <section id="contact-section" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F8FAFC] border-t border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-100/80 text-[#0066FF] text-xs font-black uppercase tracking-wider mb-3">
            <Phone className="w-3.5 h-3.5" />
            <span>Campus & Help Desk</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Get in Touch with <span className="text-[#0066FF]">L.C.C. Mentors</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-medium">
            Have questions about course fees, class timings, study material, or computer diplomas? Visit our campus or reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card-clean flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-blue-50 text-[#0066FF] shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 mb-1">Campus Location</h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  L.C.C. Education Campus, Civil Lines, Main Market Road, Near Central Bank, Education Zone.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card-clean flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-blue-50 text-[#0066FF] shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 mb-1">Helpline Phone</h4>
                <p className="text-xs text-slate-600 font-medium">
                  +91 98765 43210 / 0562-284901
                </p>
                <span className="text-[11px] text-emerald-600 font-bold block mt-1">
                  Director: Aman Arora
                </span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card-clean flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-blue-50 text-[#0066FF] shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900 mb-1">Class & Office Hours</h4>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  Monday to Saturday: 7:00 AM – 7:30 PM<br />
                  Sunday: 9:00 AM – 1:00 PM (Mock Tests & Doubt Clinics)
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-black text-emerald-700 uppercase block">WhatsApp Support</span>
                <span className="text-sm font-black text-slate-900">Instant Chat Available</span>
              </div>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Now</span>
              </a>
            </div>

          </div>

          {/* Right Column: Google Maps Embed + Quick Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Interactive Google Map Embed */}
            <div className="h-64 sm:h-72 rounded-3xl overflow-hidden border border-slate-200 shadow-card-clean bg-slate-100">
              <iframe
                title="LCC Coaching Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3549.400552721867!2d78.0068!3d27.1767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDEwJzM2LjEiTiA3OMKwMDAnMjQuNSJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>

            {/* Quick Contact Form */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-card-clean">
              <h4 className="text-sm font-black text-slate-900 mb-4">Send a Direct Message</h4>

              {sent ? (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-700 text-xs font-bold text-center">
                  Thank you! Your message has been delivered to Aman Arora & counseling team.
                </div>
              ) : (
                <form onSubmit={handleSend} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Your Name *"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0066FF] font-medium"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Phone / WhatsApp Number *"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0066FF] font-medium"
                    />
                  </div>
                  <textarea
                    rows={2}
                    placeholder="Your Query or Message..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0066FF] font-medium resize-none"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-sm transition-all flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
