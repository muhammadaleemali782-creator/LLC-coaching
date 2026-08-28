import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Advertisement, AdPlacement } from '../../types';
import { Megaphone, Plus, Trash2, Edit2, Eye, EyeOff, ExternalLink, Flame, CheckCircle2, Sparkles } from 'lucide-react';

export const AdsManager: React.FC = () => {
  const { ads, addAd, updateAd, toggleAd, deleteAd, showToast } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [newAd, setNewAd] = useState<Partial<Advertisement>>({
    title: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
    destinationUrl: '#admission-section',
    placement: 'hero_top',
    badge: 'PROMOTED',
    priority: 1,
    isActive: true
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAd.title || !newAd.destinationUrl) {
      showToast('Please provide ad title and destination URL.', 'warning');
      return;
    }

    await addAd(newAd as Advertisement);
    setIsCreating(false);
    setNewAd({
      title: '',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&auto=format&fit=crop&q=80',
      destinationUrl: '#admission-section',
      placement: 'hero_top',
      badge: 'PROMOTED',
      priority: 1,
      isActive: true
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header with Create Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white">Advertisement Campaigns</h2>
          <p className="text-xs text-slate-400">
            Publish and manage sponsor banners for Hero Top, In-Feed, Study Vault, and Mobile slots.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-5 py-2.5 rounded-xl bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isCreating ? 'Cancel' : 'Create New Ad Banner'}</span>
        </button>
      </div>

      {/* Create Ad Form */}
      {isCreating && (
        <form onSubmit={handleCreate} className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4 animate-in fade-in duration-150">
          <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider">Configure New Advertisement</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Ad Title / Headline *</label>
              <input
                type="text"
                required
                placeholder="e.g. 75% Early Bird Scholarship Test Registration"
                value={newAd.title}
                onChange={e => setNewAd({ ...newAd, title: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Destination URL / Anchor *</label>
              <input
                type="text"
                required
                placeholder="e.g. #admission-section or https://example.com/offer"
                value={newAd.destinationUrl}
                onChange={e => setNewAd({ ...newAd, destinationUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Ad Placement Slot *</label>
              <select
                value={newAd.placement}
                onChange={e => setNewAd({ ...newAd, placement: e.target.value as AdPlacement })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              >
                <option value="hero_top">Hero Top (Main Red Square Slot)</option>
                <option value="between_sections">Between Sections (Wide Banner)</option>
                <option value="study_vault">Study Vault / PDF Section</option>
                <option value="mobile_in_feed">Mobile In-Feed</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">Badge Tag</label>
              <input
                type="text"
                placeholder="e.g. PROMOTED • ADMISSION 2026"
                value={newAd.badge}
                onChange={e => setNewAd({ ...newAd, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">Short Description / Pitch</label>
            <textarea
              rows={2}
              placeholder="e.g. Register for Sunday All-India Assessment & win up to 100% scholarship fee waiver."
              value={newAd.description}
              onChange={e => setNewAd({ ...newAd, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-[#0066FF]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider shadow-lg"
            >
              Save & Publish Ad
            </button>
          </div>
        </form>
      )}

      {/* Ads List Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-black text-slate-300 uppercase">Configured Ads ({ads.length})</span>
        </div>

        <div className="divide-y divide-slate-800">
          {ads.map((ad) => (
            <div key={ad.id} className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-900/60 transition-colors">
              
              <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                    {ad.badge || 'AD'}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-blue-400 text-[10px] font-mono font-bold">
                    Slot: {ad.placement}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    ad.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {ad.isActive ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <h4 className="text-sm font-black text-white">{ad.title}</h4>
                {ad.description && <p className="text-xs text-slate-400 line-clamp-1">{ad.description}</p>}
                
                <span className="text-[10px] text-slate-500 font-mono block">
                  Target: {ad.destinationUrl} • Total Clicks: {ad.clicks || 0}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => toggleAd(ad.id)}
                  className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                    ad.isActive
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
                      : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  }`}
                  title={ad.isActive ? 'Disable Ad' : 'Enable Ad'}
                >
                  {ad.isActive ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{ad.isActive ? 'Disable' : 'Enable'}</span>
                </button>

                <button
                  onClick={() => deleteAd(ad.id)}
                  className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 cursor-pointer"
                  title="Delete Ad"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
