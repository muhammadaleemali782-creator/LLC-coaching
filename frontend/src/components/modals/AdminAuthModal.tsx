import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Shield, Lock, X, Sparkles, KeyRound } from 'lucide-react';

export const AdminAuthModal: React.FC = () => {
  const { isAdminAuthModalOpen, setIsAdminAuthModalOpen, loginAdmin } = useApp();
  const [password, setPassword] = useState('');

  if (!isAdminAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginAdmin(password)) {
      setIsAdminAuthModalOpen(false);
      setPassword('');
    }
  };

  const handleDemoAdmin = () => {
    loginAdmin('admin123');
    setIsAdminAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#0066FF] text-white">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black">Admin Control Panel</h3>
              <span className="text-xs text-slate-400 font-medium">L.C.C. Director Portal</span>
            </div>
          </div>
          <button
            onClick={() => setIsAdminAuthModalOpen(false)}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Enter Master Admin Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="admin123"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#0066FF] font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-full bg-[#0066FF] hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-blue-500/25 transition-all"
            >
              Authorize & Open Admin Panel
            </button>
          </form>

          {/* 1-Click Demo */}
          <div className="pt-3 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200 transition-colors flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4 text-[#0066FF]" />
              <span>1-Click Demo Director Login (admin123)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
