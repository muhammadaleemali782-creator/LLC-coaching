import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Save, Bell, Phone, Mail, MapPin, Sparkles } from 'lucide-react';

export const WebsiteSettings: React.FC = () => {
  const { websiteSettings, updateWebsiteSettings, showToast } = useApp();
  const [form, setForm] = useState(websiteSettings);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateWebsiteSettings(form);
    showToast('Global website settings saved successfully!', 'success');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white">Global Website Settings</h2>
        <p className="text-xs text-slate-400">Manage institute name, contact phone, live alert text, and emergency announcements.</p>
      </div>

      <form onSubmit={handleSave} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Institute Full Name</label>
            <input
              type="text"
              value={form.instituteName}
              onChange={e => setForm({ ...form, instituteName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Director Name</label>
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
            <label className="text-xs font-bold text-slate-300 block mb-1">Official Email</label>
            <input
              type="email"
              value={form.contactEmail}
              onChange={e => setForm({ ...form, contactEmail: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-300 block mb-1">Live Alert Ticker Announcement Text</label>
          <input
            type="text"
            value={form.emergencyAlertText}
            onChange={e => setForm({ ...form, emergencyAlertText: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
          />
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            type="submit"
            className="px-6 py-3 rounded-full bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-blue-500/25 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
