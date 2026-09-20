import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Share2, Video, MessageCircle, Globe, Save, CheckCircle2, Cloud } from 'lucide-react';

export const SocialMediaManager: React.FC = () => {
  const { socialLinks, updateSocialLink, showToast } = useApp();
  const [links, setLinks] = useState(socialLinks);

  useEffect(() => {
    if (socialLinks && socialLinks.length > 0) {
      setLinks(socialLinks);
    }
  }, [socialLinks]);

  const handleSave = async (id: string) => {
    const target = links.find(l => l.id === id);
    if (target) {
      await updateSocialLink(id, target);
      showToast(`${target.label} permanently saved to Cloud MongoDB!`, 'success');
    }
  };

  const getIcon = (platform: string) => {
    switch (platform) {
      case 'youtube': return <Video className="w-5 h-5 text-red-400" />;
      case 'instagram': return <Share2 className="w-5 h-5 text-pink-400" />;
      case 'whatsapp': return <MessageCircle className="w-5 h-5 text-emerald-400" />;
      default: return <Globe className="w-5 h-5 text-blue-400" />;
    }
  };

  const handleSaveAll = async () => {
    for (const l of links) {
      await updateSocialLink(l.id, l);
    }
    showToast('All social links permanently saved to Cloud MongoDB!', 'success');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-white">Social Media & Communication Links</h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 text-[10px] font-bold">
              <Cloud className="w-3 h-3" />
              <span>MongoDB Cloud Sync</span>
            </span>
          </div>
          <p className="text-xs text-slate-400">Configure official Instagram, YouTube channel, and WhatsApp helpdesk URLs dynamically.</p>
        </div>
        <button
          onClick={handleSaveAll}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md self-start sm:self-auto cursor-pointer"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save All Links Live</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {links.map((link, idx) => (
          <div key={link.id} className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  {getIcon(link.platform)}
                </div>
                <h4 className="text-xs font-black text-white uppercase">{link.label}</h4>
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={link.isEnabled}
                  onChange={e => {
                    const updated = [...links];
                    updated[idx].isEnabled = e.target.checked;
                    setLinks(updated);
                  }}
                  className="rounded"
                />
                <span>Active</span>
              </label>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 uppercase font-black block mb-1">Target URL</label>
              <input
                type="text"
                value={link.url}
                onChange={e => {
                  const updated = [...links];
                  updated[idx].url = e.target.value;
                  setLinks(updated);
                }}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            <button
              onClick={() => handleSave(link.id)}
              className="w-full py-2 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Update Link</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
