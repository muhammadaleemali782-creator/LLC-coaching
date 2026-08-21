import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {toasts.map(toast => {
        let Icon = Info;
        let bgClass = 'bg-brand-card border-brand-border text-brand-textLight shadow-xl';
        let iconColor = 'text-brand-cyan';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          bgClass = 'bg-[#0b2416] border-emerald-500/50 text-emerald-100 shadow-2xl shadow-emerald-950/60';
          iconColor = 'text-emerald-400';
        } else if (toast.type === 'error') {
          Icon = AlertCircle;
          bgClass = 'bg-[#290d12] border-rose-500/50 text-rose-100 shadow-2xl shadow-rose-950/60';
          iconColor = 'text-rose-400';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          bgClass = 'bg-[#2a1a09] border-amber-500/50 text-amber-100 shadow-2xl shadow-amber-950/60';
          iconColor = 'text-amber-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-xl transition-all duration-300 transform translate-y-0 ${bgClass}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-sm font-medium leading-snug">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white transition-colors p-1 -mr-1 -mt-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
