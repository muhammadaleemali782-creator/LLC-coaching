import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Save, Bell, Phone, Mail, MapPin, Sparkles, Image as ImageIcon, CheckCircle2, Shield, CreditCard, MessageSquare, ExternalLink, Loader2 } from 'lucide-react';
import { Youtube } from '../SocialIcons';
import { ImageUploaderInput } from '../common/ImageUploaderInput';
import { getGoogleMapEmbedUrl, getGoogleMapAppUrl } from '../../utils/mapUtils';

export const WebsiteSettings: React.FC = () => {
  const { websiteSettings, updateWebsiteSettings, showToast } = useApp();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [form, setForm] = useState({
    instituteName: websiteSettings.instituteName || 'Learning Coaching Center (L.C.C.)',
    shortName: websiteSettings.shortName || 'L.C.C.',
    instituteTagline: websiteSettings.instituteTagline || 'Learning Coaching Center',
    logoUrl: websiteSettings.logoUrl || '/logo.jpg',
    faviconUrl: websiteSettings.faviconUrl || '/logo.jpg',
    directorName: websiteSettings.directorName || 'Aman Singh Gautam',
    contactPhone: websiteSettings.contactPhone || '+91 9250703092',
    contactEmail: websiteSettings.contactEmail || 'admissions@lcc.edu',
    contactAddress: websiteSettings.contactAddress || 'Palahipatti, Varanasi, Sindhora Road — Near Union Bank',
    googleMapsEmbedUrl: websiteSettings.googleMapsEmbedUrl || '',
    emergencyAlertText: websiteSettings.emergencyAlertText || 'Admissions Open for Session 2026-2027 (Scholarship Test on Sunday)',
    noticeTickerSpeed: websiteSettings.noticeTickerSpeed || 'normal',
    heroBadgeText: websiteSettings.heroBadgeText || "INDIA'S TOP RATED COACHING & EDTECH",
    allowStudentReviews: websiteSettings.allowStudentReviews !== false,
    maintenanceMode: !!websiteSettings.maintenanceMode,
    razorpayKeyId: websiteSettings.razorpayKeyId || '',
    defaultWhatsappRedirectUrl: websiteSettings.defaultWhatsappRedirectUrl || '',
    defaultPlaylistRedirectUrl: websiteSettings.defaultPlaylistRedirectUrl || '',
    heroPosterUrl: websiteSettings.heroPosterUrl || '',
    directorPhotoUrl: websiteSettings.directorPhotoUrl || '/assets/founder.png',
    enableScreenshotProtection: !!websiteSettings.enableScreenshotProtection
  });

  useEffect(() => {
    setForm({
      instituteName: websiteSettings.instituteName || 'Learning Coaching Center (L.C.C.)',
      shortName: websiteSettings.shortName || 'L.C.C.',
      instituteTagline: websiteSettings.instituteTagline || 'Learning Coaching Center',
      logoUrl: websiteSettings.logoUrl || '/logo.jpg',
      faviconUrl: websiteSettings.faviconUrl || '/logo.jpg',
      directorName: websiteSettings.directorName || 'Aman Singh Gautam',
      contactPhone: websiteSettings.contactPhone || '+91 9250703092',
      contactEmail: websiteSettings.contactEmail || 'admissions@lcc.edu',
      contactAddress: websiteSettings.contactAddress || 'Palahipatti, Varanasi, Sindhora Road — Near Union Bank',
      googleMapsEmbedUrl: websiteSettings.googleMapsEmbedUrl || '',
      emergencyAlertText: websiteSettings.emergencyAlertText || 'Admissions Open for Session 2026-2027 (Scholarship Test on Sunday)',
      noticeTickerSpeed: websiteSettings.noticeTickerSpeed || 'normal',
      heroBadgeText: websiteSettings.heroBadgeText || "INDIA'S TOP RATED COACHING & EDTECH",
      allowStudentReviews: websiteSettings.allowStudentReviews !== false,
      maintenanceMode: !!websiteSettings.maintenanceMode,
      razorpayKeyId: websiteSettings.razorpayKeyId || '',
      defaultWhatsappRedirectUrl: websiteSettings.defaultWhatsappRedirectUrl || '',
      defaultPlaylistRedirectUrl: websiteSettings.defaultPlaylistRedirectUrl || '',
      heroPosterUrl: websiteSettings.heroPosterUrl || '',
      directorPhotoUrl: websiteSettings.directorPhotoUrl || '',
      enableScreenshotProtection: !!websiteSettings.enableScreenshotProtection
    });
  }, [websiteSettings]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await updateWebsiteSettings(form);
      setSaveSuccess(true);
      showToast('Settings & Google Maps location permanently saved to MongoDB Atlas!', 'success');
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      showToast('Failed to save settings: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#0066FF]" />
          <span>Company Name, Logo & Website Settings</span>
        </h2>
        <p className="text-xs text-slate-400">
          Update the institute brand name, official emblem logo, tagline, Razorpay Payment Gateway, and live emergency alerts.
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

              <ImageUploaderInput
                label="Official Logo Image (File Upload or URL)"
                value={form.logoUrl}
                onChange={url => setForm({ ...form, logoUrl: url })}
                placeholder="Upload logo file or paste image URL..."
              />

              <ImageUploaderInput
                label="Master Hero Poster Banner (File Upload or URL)"
                value={form.heroPosterUrl}
                onChange={url => setForm({ ...form, heroPosterUrl: url })}
                placeholder="Upload master hero banner image file or paste URL..."
              />

              <ImageUploaderInput
                label="Director / Founder Official Photo (File Upload or URL)"
                value={form.directorPhotoUrl}
                onChange={url => setForm({ ...form, directorPhotoUrl: url })}
                placeholder="Upload Director Aman Arora photo or paste URL..."
              />
            </div>

          </div>
        </div>

        {/* Razorpay Integration & Auto-Redirect Section */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <CreditCard className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Razorpay Gateway & Auto WhatsApp / Playlist Redirect</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center gap-1">
                <span>Razorpay Key ID</span>
                <span className="text-[10px] text-amber-400 font-normal">(e.g. rzp_live_...)</span>
              </label>
              <input
                type="text"
                placeholder="rzp_test_... or rzp_live_..."
                value={form.razorpayKeyId}
                onChange={e => setForm({ ...form, razorpayKeyId: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF] font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Default WhatsApp Group Link</span>
              </label>
              <input
                type="url"
                placeholder="https://chat.whatsapp.com/..."
                value={form.defaultWhatsappRedirectUrl}
                onChange={e => setForm({ ...form, defaultWhatsappRedirectUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center gap-1">
                <Youtube className="w-3.5 h-3.5 text-red-400" />
                <span>Default Private Playlist Link</span>
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/playlist?list=..."
                value={form.defaultPlaylistRedirectUrl}
                onChange={e => setForm({ ...form, defaultPlaylistRedirectUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 italic">
            💡 Jab student course pay karega, tab Razorpay verify hone ke baad system automatically student ko WhatsApp Group ya YouTube Private Playlist link par redirect kar dega!
          </p>
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

        {/* Google Maps Campus Location & Live Pin Preview */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-400" />
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Google Maps Campus Location & Directions</h3>
                <p className="text-[11px] text-slate-400">Set the exact coaching pin shown on website contact section & Google Maps navigation.</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              {form.googleMapsEmbedUrl && (
                <button
                  type="button"
                  onClick={() => setForm({ ...form, googleMapsEmbedUrl: '' })}
                  className="text-[11px] text-slate-400 hover:text-red-400 underline cursor-pointer mr-2"
                >
                  Reset Default
                </button>
              )}
              <button
                type="button"
                disabled={isSaving}
                onClick={() => handleSave()}
                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer ${
                  saveSuccess
                    ? 'bg-emerald-600 text-white ring-2 ring-emerald-400'
                    : isSaving
                    ? 'bg-blue-700 text-white opacity-85 cursor-wait'
                    : 'bg-[#0066FF] hover:bg-blue-600 text-white shadow-blue-500/25'
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving Map...</span>
                  </>
                ) : saveSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white animate-in zoom-in-50" />
                    <span>Map Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Map Location</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Google Maps Embed Code, Location Link, ya Landmark / Address
              </label>
              <input
                type="text"
                placeholder="Paste <iframe src=...> code, https://maps.google.com/... link, or exact address (e.g. Palahipatti, Varanasi)"
                value={form.googleMapsEmbedUrl}
                onChange={e => setForm({ ...form, googleMapsEmbedUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF] font-mono"
              />
            </div>

            {/* Quick Helper Tips */}
            <div className="p-3 bg-blue-950/40 border border-blue-800/60 rounded-2xl text-[11px] text-blue-200 space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-blue-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Map Location Kaise Badlein (How to set exact pin):</span>
              </div>
              <ol className="list-decimal list-inside space-y-0.5 text-slate-300 ml-1">
                <li>Google Maps par apne coaching ka naam ya address search karein.</li>
                <li><strong>Share</strong> button dabayein ➔ <strong>Embed a map</strong> chunein ➔ <strong>Copy HTML</strong> par click karein.</li>
                <li>Upar diye gaye box me paste kar dein (system khud-b-khud exact pin link nikaal lega) aur <strong>Save Map Location</strong> dabayein!</li>
                <li><i>Ya fir sidhe coaching ka pura pata ya coordinates (e.g. Palahipatti, Varanasi, UP) likhein.</i></li>
              </ol>
            </div>

            {/* Live Interactive Map Preview */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-slate-300 flex items-center gap-1.5">
                  <span>Live Map Pin Preview:</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md font-bold">Live Pin</span>
                </span>
                <a
                  href={getGoogleMapAppUrl(form.googleMapsEmbedUrl, form.contactAddress)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-[#0066FF] hover:underline flex items-center gap-1"
                >
                  <span>Test in Google Maps App</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="h-56 sm:h-64 rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 shadow-inner">
                <iframe
                  title="Google Maps Admin Preview"
                  src={getGoogleMapEmbedUrl(form.googleMapsEmbedUrl, form.contactAddress)}
                  className="w-full h-full border-0"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Anti-Screenshot & Screen Recording Protection Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Shield className={`w-5 h-5 ${form.enableScreenshotProtection ? 'text-red-400' : 'text-slate-400'}`} />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Screenshot & Screen Recording Protection (स्क्रीनशॉट / वीडियो रिकॉर्डिंग कंट्रोल)
              </h3>
            </div>
            <span className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-full ${
              form.enableScreenshotProtection
                ? 'bg-red-950/80 border border-red-800 text-red-400'
                : 'bg-emerald-950/80 border border-emerald-800 text-emerald-400'
            }`}>
              {form.enableScreenshotProtection ? '🔒 Active (Black Screen On)' : '🔓 Off (Screenshots Allowed)'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4">
            <div className="space-y-1 max-w-xl">
              <h4 className="text-xs font-bold text-white">
                {form.enableScreenshotProtection
                  ? 'Protection is ON: Website ka screenshot ya screen recording lene par black screen dikhegi.'
                  : 'Protection is OFF: Koi bhi website ka screenshot ya screen recording aasaani se le sakta hai.'}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
                Ise OFF karne par aap aur visitor bina kisi rukawat ke screenshot ya video le sakte hain. Jab chaho tab ON karke media ko protect kar sakte ho. (Note: Admin par yeh kabhi rok nahi lagata).
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const newVal = !form.enableScreenshotProtection;
                setForm(prev => ({ ...prev, enableScreenshotProtection: newVal }));
              }}
              className={`px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-lg ${
                form.enableScreenshotProtection
                  ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
              }`}
            >
              {form.enableScreenshotProtection ? 'Turn OFF Protection' : 'Turn ON Protection'}
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className={`px-9 py-4 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2.5 shadow-xl transition-all active:scale-95 cursor-pointer ${
              saveSuccess
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-4 ring-emerald-500/30 scale-102 shadow-emerald-500/30'
                : isSaving
                ? 'bg-blue-700 text-white cursor-wait opacity-85 ring-4 ring-blue-500/30'
                : 'bg-[#0066FF] hover:bg-blue-600 text-white shadow-blue-500/30 hover:shadow-blue-500/50'
            }`}
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span className="animate-pulse">Saving to MongoDB Atlas...</span>
              </>
            ) : saveSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white animate-in zoom-in-50 duration-200" />
                <span>Saved Live to MongoDB Atlas!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Changes Live</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
