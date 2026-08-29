import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Save, Bell, Phone, Mail, MapPin, Sparkles, Image as ImageIcon, CheckCircle2, Shield } from 'lucide-react';

export const WebsiteSettings: React.FC = () => {
  const { websiteSettings, updateWebsiteSettings, showToast } = useApp();
  const [form, setForm] = useState({
    instituteName: websiteSettings.instituteName || 'Learning Coaching Center (L.C.C.)',
    shortName: websiteSettings.shortName || 'L.C.C.',
    instituteTagline: websiteSettings.instituteTagline || 'Learning Coaching Center',
    logoUrl: websiteSettings.logoUrl || '/logo.jpg',
    faviconUrl: websiteSettings.faviconUrl || '/logo.jpg',
    directorName: websiteSettings.directorName || 'Aman Arora',
    contactPhone: websiteSettings.contactPhone || '+91 98765 43210',
    contactEmail: websiteSettings.contactEmail || 'admissions@lcc.edu',
    contactAddress: websiteSettings.contactAddress || 'Near City Central, Main Road, Coaching Hub',
    emergencyAlertText: websiteSettings.emergencyAlertText || 'Admissions Open for Session 2026-2027 (Scholarship Test on Sunday)',
    noticeTickerSpeed: websiteSettings.noticeTickerSpeed || 'normal',
    heroBadgeText: websiteSettings.heroBadgeText || "INDIA'S TOP RATED COACHING & EDTECH",
    allowStudentReviews: websiteSettings.allowStudentReviews !== false,
    maintenanceMode: !!websiteSettings.maintenanceMode
  });

  useEffect(() => {
    setForm({
      instituteName: websiteSettings.instituteName || 'Learning Coaching Center (L.C.C.)',
      shortName: websiteSettings.shortName || 'L.C.C.',
      instituteTagline: websiteSettings.instituteTagline || 'Learning Coaching Center',
      logoUrl: websiteSettings.logoUrl || '/logo.jpg',
      faviconUrl: websiteSettings.faviconUrl || '/logo.jpg',
      directorName: websiteSettings.directorName || 'Aman Arora',
      contactPhone: websiteSettings.contactPhone || '+91 98765 43210',
      contactEmail: websiteSettings.contactEmail || 'admissions@lcc.edu',
      contactAddress: websiteSettings.contactAddress || 'Near City Central, Main Road, Coaching Hub',
      emergencyAlertText: websiteSettings.emergencyAlertText || 'Admissions Open for Session 2026-2027 (Scholarship Test on Sunday)',
      noticeTickerSpeed: websiteSettings.noticeTickerSpeed || 'normal',
      heroBadgeText: websiteSettings.heroBadgeText || "INDIA'S TOP RATED COACHING & EDTECH",
      allowStudentReviews: websiteSettings.allowStudentReviews !== false,
      maintenanceMode: !!websiteSettings.maintenanceMode
    });
  }, [websiteSettings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateWebsiteSettings(form);
    showToast('Institute branding, company name, logo & settings saved successfully!', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#0066FF]" />
          <span>Company Name, Logo & Website Settings</span>
        </h2>
        <p className="text-xs text-slate-400">
          Update the institute brand name, official emblem logo, tagline, contact numbers, and live emergency alerts.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Brand & Logo Identity Section */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Institute Name & Official Logo Controls</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Logo Preview Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white border-2 border-slate-700 shadow-md p-1 flex items-center justify-center">
                <img
                  src={form.logoUrl || '/logo.jpg'}
                  alt="Institute Logo Preview"
                  className="w-full h-full object-contain"
                  onError={(e: any) => {
                    e.target.src = '/logo.jpg';
                  }}
                />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">{form.shortName || 'L.C.C.'}</span>
                <span className="text-[10px] text-blue-400 font-medium block">{form.instituteTagline || 'Learning Coaching Center'}</span>
                <span className="text-[9px] text-slate-500 font-mono mt-1 block">Live Header & Footer Emblem</span>
              </div>
            </div>

            {/* Brand Inputs */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Company / Institute Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Learning Coaching Center (L.C.C.)"
                    value={form.instituteName}
                    onChange={e => setForm({ ...form, instituteName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Short Brand Name (Abbreviation) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. L.C.C."
                    value={form.shortName}
                    onChange={e => setForm({ ...form, shortName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Institute Tagline / Subtitle *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Learning Coaching Center"
                  value={form.instituteTagline}
                  onChange={e => setForm({ ...form, instituteTagline: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Official Logo Image URL / Path *</label>
                <input
                  type="text"
                  required
                  placeholder="/logo.jpg or https://images.unsplash.com/..."
                  value={form.logoUrl}
                  onChange={e => setForm({ ...form, logoUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">
                  You can use local <code className="text-amber-400">/logo.jpg</code> or any external hosted image URL.
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Administration & Contact Details */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Shield className="w-5 h-5 text-blue-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Leadership & Contact Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Director / Founder Name</label>
              <input
                type="text"
                value={form.directorName}
                onChange={e => setForm({ ...form, directorName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Official Contact Phone (WhatsApp)</label>
              <input
                type="text"
                value={form.contactPhone}
                onChange={e => setForm({ ...form, contactPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Official Email Address</label>
              <input
                type="email"
                value={form.contactEmail}
                onChange={e => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Campus Physical Address</label>
              <input
                type="text"
                value={form.contactAddress}
                onChange={e => setForm({ ...form, contactAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-300 block mb-1">Live Alert Ticker Announcement Text</label>
              <input
                type="text"
                value={form.emergencyAlertText}
                onChange={e => setForm({ ...form, emergencyAlertText: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-xl shadow-blue-500/25 cursor-pointer transition-all active:scale-98"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes Live</span>
          </button>
        </div>

      </form>
    </div>
  );
};
